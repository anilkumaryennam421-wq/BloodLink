import React from 'react'

export default function DonorDashboard(){
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Donor Dashboard</h2>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="card">
          <h3 className="font-semibold">Profile</h3>
          <div className="text-sm text-gray-600">Name: Priya K.</div>
          <div className="text-sm text-gray-600">Blood group: A+</div>
          <div className="mt-2">
            <button className="bg-primary text-white px-3 py-1 rounded">Change availability</button>
          </div>
        </div>
        <div className="card">
          <h3 className="font-semibold">Donation history</h3>
          <div className="text-sm text-gray-600">No donations logged in mock data.</div>
        </div>
      </div>
    </div>
  )
}
