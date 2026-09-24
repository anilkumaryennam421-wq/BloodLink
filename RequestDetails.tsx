import React from 'react'
import { useParams } from 'react-router-dom'
import { mockRequests } from '../data/mock'

export default function RequestDetails(){
  const { id } = useParams()
  const r = mockRequests.find(x=>x.id === id)
  if(!r) return <div className="card">Request not found</div>
  return (
    <div className="card">
      <h2 className="text-xl font-semibold">Request details</h2>
      <div className="mt-2 text-sm"><strong>Patient:</strong> {r.patientName}</div>
      <div className="text-sm"><strong>Blood group:</strong> {r.bloodGroup}</div>
      <div className="text-sm"><strong>Units:</strong> {r.units}</div>
      <div className="text-sm"><strong>Hospital:</strong> {r.hospital}</div>
      <div className="mt-3 text-sm text-gray-600">Matching suggestions are shown in the matching tab (mock).</div>
    </div>
  )
}
