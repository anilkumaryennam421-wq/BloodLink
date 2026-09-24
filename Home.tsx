import React from 'react'
import Hero from '../components/Hero'
import { mockDonors, mockBloodBanks } from '../data/mock'
import DonorCard from '../components/DonorCard'

export default function Home(){
  return (
    <div className="space-y-6">
      <Hero />

      <section>
        <h2 className="text-xl font-semibold mb-3">Nearby Donors</h2>
        <div className="grid gap-3">
          {mockDonors.map(d => <DonorCard key={d.id} donor={d} />)}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">Nearby Blood Banks</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {mockBloodBanks.map(b => (
            <div className="card" key={b.id}>
              <div className="font-semibold">{b.name}</div>
              <div className="text-sm text-gray-600">{b.address}</div>
              <div className="mt-2 text-sm">Available: {b.availableGroups.join(', ')}</div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">Safety & Privacy</h2>
        <div className="card">
          <p className="text-sm text-gray-700">BloodLink does not share donors' exact addresses or private phone numbers publicly. Contact between requesters and donors goes through verified channels only. BloodLink is a matching aid and does not determine medical eligibility for donation.</p>
        </div>
      </section>
    </div>
  )
}
