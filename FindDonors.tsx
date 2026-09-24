import React, { useMemo, useState } from 'react'
import { mockDonors, BLOOD_GROUPS } from '../data/mock'
import DonorCard from '../components/DonorCard'

export default function FindDonors(){
  const [group, setGroup] = useState<string>('')
  const [availability, setAvailability] = useState<string>('')
  const [verifiedOnly, setVerifiedOnly] = useState(false)
  const [maxDistance, setMaxDistance] = useState<number | undefined>(undefined)

  const results = useMemo(()=>{
    return mockDonors.filter(d=>{
      if(group && d.bloodGroup !== group) return false
      if(availability && d.availability !== availability) return false
      if(verifiedOnly && !d.verified) return false
      if(maxDistance !== undefined && (d.approxDistanceKm ?? 9999) > maxDistance) return false
      return true
    }).sort((a,b)=> (a.approxDistanceKm ?? 9999) - (b.approxDistanceKm ?? 9999))
  },[group, availability, verifiedOnly, maxDistance])

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <aside className="md:col-span-1 card">
        <h3 className="font-semibold">Filters</h3>
        <div className="mt-3 space-y-3">
          <div>
            <label className="text-sm">Blood group</label>
            <select className="w-full mt-1 border rounded px-2 py-1" value={group} onChange={e=>setGroup(e.target.value)}>
              <option value="">Any</option>
              {BLOOD_GROUPS.map(g=> <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm">Availability</label>
            <select className="w-full mt-1 border rounded px-2 py-1" value={availability} onChange={e=>setAvailability(e.target.value)}>
              <option value="">Any</option>
              <option value="available">Available</option>
              <option value="unavailable">Unavailable</option>
            </select>
          </div>
          <div>
            <label className="text-sm">Max distance (km)</label>
            <input type="number" min={1} className="w-full mt-1 border rounded px-2 py-1" onChange={e=>setMaxDistance(e.target.value ? Number(e.target.value) : undefined)} />
          </div>
          <div className="flex items-center gap-2">
            <input id="v" type="checkbox" checked={verifiedOnly} onChange={e=>setVerifiedOnly(e.target.checked)} />
            <label htmlFor="v" className="text-sm">Verified donors only</label>
          </div>
        </div>
      </aside>

      <section className="md:col-span-2 space-y-4">
        <h2 className="text-xl font-semibold">Donors</h2>
        {results.length === 0 ? (
          <div className="card text-center text-gray-600">No donors found. Try widening your filters.</div>
        ) : (
          <div className="grid gap-3">
            {results.map(d=> <DonorCard key={d.id} donor={d} />)}
          </div>
        )}
      </section>
    </div>
  )
}
