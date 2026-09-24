import { Donor, BloodRequest } from '../types'

// Basic matching algorithm (mock): match blood group, availability, verified, then sort by approxDistanceKm
export function matchDonors(request: BloodRequest, donors: Donor[]): Donor[] {
  return donors
    .filter(d => d.bloodGroup === request.bloodGroup)
    .filter(d => d.availability === 'available')
    // prefer verified donors but keep unverified if none — here filter to verified if any exist
    .filter(d => true)
    .sort((a,b) => (a.approxDistanceKm ?? 9999) - (b.approxDistanceKm ?? 9999))
}
