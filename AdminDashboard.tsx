import React from 'react'

export default function AdminDashboard(){
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Admin Dashboard</h2>
      <div className="grid md:grid-cols-4 gap-4">
        <div className="card">
          <div className="text-sm text-gray-600">Total users</div>
          <div className="text-2xl font-bold">1,234</div>
        </div>
        <div className="card">
          <div className="text-sm text-gray-600">Verified donors</div>
          <div className="text-2xl font-bold">412</div>
        </div>
        <div className="card">
          <div className="text-sm text-gray-600">Blood banks</div>
          <div className="text-2xl font-bold">28</div>
        </div>
        <div className="card">
          <div className="text-sm text-gray-600">Active emergency requests</div>
          <div className="text-2xl font-bold">6</div>
        </div>
      </div>

      <div className="card">
        <h3 className="font-semibold">Pending verification</h3>
        <div className="text-sm text-gray-600">Review donors and blood banks. (Mock UI)</div>
      </div>
    </div>
  )
}
