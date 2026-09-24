-- 001_init.sql
-- Supabase / Postgres schema for BloodLink
-- Creates users, donors, blood_banks, blood_inventory, blood_requests, donation_requests
-- Adds helper functions and a matching function

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS postgis;

-- Users table (profiles) - linked to auth.users by id when used with Supabase Auth
CREATE TABLE IF NOT EXISTS public.users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text,
  full_name text,
  role text DEFAULT 'user'::text, -- user | donor | admin
  metadata jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Donors table
CREATE TABLE IF NOT EXISTS public.donors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.users(id) ON DELETE SET NULL,
  first_name text NOT NULL,
  last_name text,
  blood_group text NOT NULL,
  phone text, -- private field, access-controlled
  city text,
  area text,
  lat double precision, -- stored but do not expose exact coordinates publicly
  lng double precision,
  last_donation_date date,
  availability text DEFAULT 'available'::text, -- available | unavailable
  verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS donors_blood_group_idx ON public.donors (blood_group);
CREATE INDEX IF NOT EXISTS donors_availability_idx ON public.donors (availability);
CREATE INDEX IF NOT EXISTS donors_verified_idx ON public.donors (verified);

-- Blood banks
CREATE TABLE IF NOT EXISTS public.blood_banks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  address text,
  city text,
  area text,
  lat double precision,
  lng double precision,
  contact_phone text,
  verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Blood inventory per bank (one row per bank + blood group)
CREATE TABLE IF NOT EXISTS public.blood_inventory (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bank_id uuid REFERENCES public.blood_banks(id) ON DELETE CASCADE,
  blood_group text NOT NULL,
  units integer DEFAULT 0,
  last_updated timestamptz DEFAULT now(),
  UNIQUE (bank_id, blood_group)
);
CREATE INDEX IF NOT EXISTS blood_inventory_group_idx ON public.blood_inventory (blood_group);

-- Emergency blood requests
CREATE TABLE IF NOT EXISTS public.blood_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id uuid REFERENCES public.users(id) ON DELETE SET NULL,
  patient_name text NOT NULL,
  blood_group text NOT NULL,
  units integer DEFAULT 1,
  hospital text,
  city text,
  area text,
  lat double precision,
  lng double precision,
  contact_phone text,
  urgency text DEFAULT 'Normal'::text, -- Normal | Urgent | Critical
  additional_info text,
  status text DEFAULT 'open'::text, -- open | matched | fulfilled | cancelled
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS blood_requests_group_idx ON public.blood_requests (blood_group);
CREATE INDEX IF NOT EXISTS blood_requests_status_idx ON public.blood_requests (status);

-- Donation requests linking donors <-> blood_requests (when a donor is asked)
CREATE TABLE IF NOT EXISTS public.donation_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  donor_id uuid REFERENCES public.donors(id) ON DELETE CASCADE,
  request_id uuid REFERENCES public.blood_requests(id) ON DELETE CASCADE,
  status text DEFAULT 'pending'::text, -- pending | accepted | declined | completed
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Protect sensitive fields: create a public view that excludes phone & exact coordinates for donors
CREATE OR REPLACE VIEW public.v_donors_public AS
SELECT
  id,
  first_name,
  last_name,
  blood_group,
  city,
  area,
  availability,
  verified,
  last_donation_date,
  created_at
FROM public.donors;

GRANT SELECT ON public.v_donors_public TO public;

-- Helper: Haversine distance (returns distance in kilometers)
CREATE OR REPLACE FUNCTION public.haversine_distance_km(lat1 double precision, lng1 double precision, lat2 double precision, lng2 double precision)
RETURNS double precision LANGUAGE sql IMMUTABLE AS $$
  SELECT 6371.0 * 2 * asin(sqrt(
    pow(sin(radians(($1 - $3) / 2.0)), 2) + cos(radians($1)) * cos(radians($3)) * pow(sin(radians(($2 - $4) / 2.0)), 2)
  ));
$$;

-- Matching function: given a blood_request id, return nearby donors matching blood group, availability, and verification
CREATE OR REPLACE FUNCTION public.find_matching_donors(request_id uuid, max_km integer DEFAULT 50)
RETURNS TABLE (
  donor_id uuid,
  first_name text,
  blood_group text,
  availability text,
  verified boolean,
  distance_km double precision
) LANGUAGE sql STABLE AS $$
  SELECT d.id, d.first_name, d.blood_group, d.availability, d.verified,
    public.haversine_distance_km(br.lat, br.lng, d.lat, d.lng) AS distance_km
  FROM public.blood_requests br
  JOIN public.donors d ON d.blood_group = br.blood_group
  WHERE br.id = request_id
    AND d.availability = 'available'
    AND d.lat IS NOT NULL AND d.lng IS NOT NULL
    AND (d.verified = TRUE OR d.verified IS NULL OR TRUE) -- do not drop unverified here; caller can filter
    AND public.haversine_distance_km(br.lat, br.lng, d.lat, d.lng) <= max_km
  ORDER BY (d.verified DESC NULLS LAST), public.haversine_distance_km(br.lat, br.lng, d.lat, d.lng)
  LIMIT 100;
$$;

-- Security: Enable Row Level Security (RLS) and add example policies
-- These policies are examples and should be adapted to your supabase project's auth claims and needs.

-- USERS table policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_insert_authenticated" ON public.users FOR INSERT USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "users_is_owner_or_admin" ON public.users FOR UPDATE USING (
  (id = auth.uid()) OR EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin')
) WITH CHECK (
  (id = auth.uid()) OR EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin')
);
CREATE POLICY "users_select_public" ON public.users FOR SELECT USING (true);

-- DONORS table policies
ALTER TABLE public.donors ENABLE ROW LEVEL SECURITY;
-- Allow insert for authenticated users when user_id matches auth.uid() or when an admin
CREATE POLICY "donors_insert_owner_or_admin" ON public.donors FOR INSERT USING (
  auth.uid() IS NOT NULL
) WITH CHECK (
  (user_id IS NULL) OR (user_id = auth.uid()) OR EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin')
);
-- Allow update by owner (user_id matches) or admin
CREATE POLICY "donors_update_owner_or_admin" ON public.donors FOR UPDATE USING (
  (user_id = auth.uid()) OR EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin')
) WITH CHECK (
  (user_id = auth.uid()) OR EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin')
);
-- Deny delete except admin
CREATE POLICY "donors_delete_admin_only" ON public.donors FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin')
);
-- Public read access should go through view v_donors_public; revoke direct select from public on donors
REVOKE ALL ON public.donors FROM public;

-- BLOOD_BANKS table policies
ALTER TABLE public.blood_banks ENABLE ROW LEVEL SECURITY;
-- Only admin can insert/update/delete blood banks (example)
CREATE POLICY "blood_banks_admin_only" ON public.blood_banks FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin')
) WITH CHECK (
  EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin')
);
REVOKE ALL ON public.blood_banks FROM public;

-- BLOOD_INVENTORY policies (admin / bank managers)
ALTER TABLE public.blood_inventory ENABLE ROW LEVEL SECURITY;
CREATE POLICY "blood_inventory_admin_only" ON public.blood_inventory FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin')
) WITH CHECK (
  EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin')
);
REVOKE ALL ON public.blood_inventory FROM public;

-- BLOOD_REQUESTS policies
ALTER TABLE public.blood_requests ENABLE ROW LEVEL SECURITY;
-- Allow authenticated users to insert requests (requester_id should match their id or be null)
CREATE POLICY "blood_requests_insert_authenticated" ON public.blood_requests FOR INSERT USING (auth.uid() IS NOT NULL) WITH CHECK ( (requester_id IS NULL) OR (requester_id = auth.uid()) );
-- Allow requester or admin to update their request
CREATE POLICY "blood_requests_update_owner_or_admin" ON public.blood_requests FOR UPDATE USING (
  (requester_id = auth.uid()) OR EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin')
) WITH CHECK (
  (requester_id = auth.uid()) OR EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin')
);
-- Allow select for authenticated users; admins see everything. Public read can be restricted as needed.
CREATE POLICY "blood_requests_select_authenticated" ON public.blood_requests FOR SELECT USING (auth.uid() IS NOT NULL OR EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin'));

-- DONATION_REQUESTS policies
ALTER TABLE public.donation_requests ENABLE ROW LEVEL SECURITY;
-- Inserts allowed when auth.uid() matches donors.user_id (i.e., donor acting) or admin
CREATE POLICY "donation_requests_insert_allowed" ON public.donation_requests FOR INSERT USING (
  EXISTS (SELECT 1 FROM public.donors d WHERE d.id = donation_requests.donor_id AND d.user_id = auth.uid())
) WITH CHECK (
  EXISTS (SELECT 1 FROM public.donors d WHERE d.id = donation_requests.donor_id AND d.user_id = auth.uid())
);
-- Updates allowed for donor owner or admin
CREATE POLICY "donation_requests_update_owner_or_admin" ON public.donation_requests FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.donors d WHERE d.id = donation_requests.donor_id AND d.user_id = auth.uid())
) WITH CHECK (
  EXISTS (SELECT 1 FROM public.donors d WHERE d.id = donation_requests.donor_id AND d.user_id = auth.uid())
);

-- ADMIN convenience: grant select on helper functions and views to authenticated role
GRANT EXECUTE ON FUNCTION public.haversine_distance_km(double precision,double precision,double precision,double precision) TO public;
GRANT SELECT ON public.v_donors_public TO public;
GRANT EXECUTE ON FUNCTION public.find_matching_donors(uuid, integer) TO public;

-- Sample seed data insertion (commented) - uncomment to seed
-- INSERT INTO public.users (id, email, full_name, role) VALUES (gen_random_uuid(), 'admin@bloodlink.local', 'Admin', 'admin');

-- NOTES:
-- 1) This schema stores lat/lng for donors and requests. The view v_donors_public intentionally omits lat/lng and phone to avoid exposing exact locations or private numbers publicly.
-- 2) RLS policies above are examples; adjust them to your Supabase JWT claims and application logic. In particular, ensure that admin detection uses a reliable source (for example, users.role field maintained by an admin-only process).
-- 3) The matching function uses the haversine_distance_km helper. It requires donors and requests to include lat/lng coordinates. Consider privacy trade-offs and only expose coordinates to authorized users or use coarsened coordinates.

-- End of migration
