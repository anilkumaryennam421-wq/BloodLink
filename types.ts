export type Role = 'user' | 'donor' | 'admin'

export type User = {
  id: string
  email?: string
  name?: string
  role?: Role
  created_at?: string
}

export type Donor = {
  id: string
  firstName: string
  lastName?: string
  bloodGroup: string
  city: string
  area?: string
  lastDonation?: string
  availability: 'available' | 'unavailable'
  verified?: boolean
  approxDistanceKm?: number
}

export type BloodBank = {
  id: string
  name: string
  address: string
  lat: number
  lng: number
  availableGroups: string[]
  lastUpdated?: string
}

export type BloodRequest = {
  id: string
  patientName: string
  bloodGroup: string
  units: number
  hospital: string
  city?: string
  area?: string
  contactNumber?: string
  urgency: 'Normal' | 'Urgent' | 'Critical'
  additionalInfo?: string
  created_at?: string
}
