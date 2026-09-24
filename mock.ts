import { Donor, BloodBank, BloodRequest } from '../types'

export const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']

export const mockDonors: Donor[] = [
  {
    id: 'd1',
    firstName: 'Priya',
    lastName: 'K.',
    bloodGroup: 'A+',
    city: 'Chennai',
    area: 'T. Nagar',
    lastDonation: '2025-03-10',
    availability: 'available',
    verified: true,
    approxDistanceKm: 2.4,
  },
  {
    id: 'd2',
    firstName: 'Rahul',
    bloodGroup: 'O+',
    city: 'Chennai',
    area: 'Anna Nagar',
    lastDonation: '2024-11-01',
    availability: 'available',
    verified: false,
    approxDistanceKm: 6.1,
  },
  {
    id: 'd3',
    firstName: 'Anita',
    bloodGroup: 'B+',
    city: 'Chennai',
    area: 'Velachery',
    lastDonation: '2023-08-20',
    availability: 'unavailable',
    verified: true,
    approxDistanceKm: 12.2,
  },
]

export const mockBloodBanks: BloodBank[] = [
  {
    id: 'b1',
    name: 'City Blood Bank',
    address: '12 Main Rd, Chennai',
    lat: 13.0827,
    lng: 80.2707,
    availableGroups: ['A+', 'O+', 'B+'],
    lastUpdated: '2026-09-17T09:00:00Z',
  },
  {
    id: 'b2',
    name: 'RedCross Centre',
    address: '45 Lake Ave, Chennai',
    lat: 13.0850,
    lng: 80.2700,
    availableGroups: ['AB+', 'O-'],
    lastUpdated: '2026-09-16T16:30:00Z',
  },
]

export const mockRequests: BloodRequest[] = [
  {
    id: 'r1',
    patientName: 'Mr. Karthik',
    bloodGroup: 'O+',
    units: 2,
    hospital: 'Apollo Hospital',
    city: 'Chennai',
    contactNumber: 'XXXXXX1234',
    urgency: 'Urgent',
    additionalInfo: 'ICU, immediate assistance needed',
    created_at: '2026-09-18T10:00:00Z',
  },
]
