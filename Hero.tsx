import React from 'react'
import { Link } from 'react-router-dom'

export default function Hero(){
  return (
    <section className="bg-white rounded-lg p-6 shadow-md grid md:grid-cols-2 gap-6 items-center">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold leading-tight">Every Drop Connects a Life.</h1>
        <p className="mt-3 text-gray-700 text-lg">Find blood. Find donors. Save lives.</p>
        <div className="mt-6 flex gap-3">
          <Link to="/request" className="bg-primary text-white px-4 py-2 rounded-md font-semibold">Need Blood</Link>
          <Link to="/register" className="border border-primary text-primary px-4 py-2 rounded-md font-semibold">Become a Donor</Link>
        </div>
        <div className="mt-6 p-4 bg-red-50 border border-red-100 rounded">
          <strong className="text-red-700">Emergency SOS:</strong> If a patient needs blood now, click "Need Blood" and follow the quick request flow. The platform helps match nearby donors — call emergency contacts for fastest response.
        </div>
      </div>
      <div className="bg-gradient-to-br from-red-50 to-white rounded-lg p-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="card">
            <div className="text-sm font-semibold">Search by blood group</div>
            <div className="mt-3 flex flex-wrap gap-2">
              {['A+','B+','O+','AB+'].map(g=> (
                <span key={g} className="px-3 py-1 rounded-full bg-white border text-sm">{g}</span>
              ))}
            </div>
          </div>
          <div className="card">
            <div className="text-sm font-semibold">Nearby blood banks</div>
            <div className="mt-3 text-sm text-gray-600">See nearby bank locations and inventories on the map.</div>
          </div>
          <div className="card col-span-2">
            <div className="text-sm font-semibold">How BloodLink works</div>
            <ol className="mt-2 text-sm list-decimal list-inside text-gray-700">
              <li>Create a request or register as a donor</li>
              <li>Get matched with nearby verified donors & banks</li>
              <li>Coordinate safely — private contact via confirmed channels</li>
            </ol>
          </div>
        </div>
      </div>
    </section>
  )
}
