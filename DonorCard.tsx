import React from 'react'
import { Donor } from '../types'

export default function DonorCard({ donor, onRequest }: { donor: Donor, onRequest?: (id: string)=>void }){
  return (
    <div className="p-4 border rounded-lg flex items-center justify-between">
      <div>
        <div className="text-lg font-semibold">{donor.firstName} {donor.lastName ?? ''}</div>
        <div className="text-sm text-gray-600">Blood group: <span className="font-medium">{donor.bloodGroup}</span></div>
        <div className="text-sm text-gray-600">Approx. {donor.approxDistanceKm ?? '—'} km away</div>
        <div className="text-sm mt-1">
          {donor.verified ? <span className="text-green-600 font-medium">Verified</span> : <span className="text-gray-600">Not verified</span>}
          <span className={`ml-3 px-2 py-1 rounded-full text-sm ${donor.availability === 'available' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{donor.availability}</span>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <button onClick={()=>onRequest?.(donor.id)} className="bg-primary text-white px-3 py-1 rounded">Request Donation</button>
        <button className="text-sm text-gray-600 border px-3 py-1 rounded">Profile</button>
      </div>
    </div>
  )
}
