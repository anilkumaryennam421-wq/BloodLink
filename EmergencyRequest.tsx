import React, { useState } from 'react'
import { BLOOD_GROUPS } from '../data/mock'

export default function EmergencyRequest(){
  const [step, setStep] = useState<'form' | 'confirm'>('form')
  const [form, setForm] = useState({
    patientName: '', bloodGroup: 'O+', units: 1, hospital: '', location: '', contactNumber: '', urgency: 'Normal', additionalInfo: ''
  })

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    // In the mock mode, just show confirm
    setStep('confirm')
  }

  if(step === 'confirm'){
    return (
      <div className="max-w-xl mx-auto card">
        <h2 className="text-xl font-semibold mb-2">Request Submitted</h2>
        <p className="text-sm text-gray-700">A matching process is started. Matches are suggestions only and not a medical eligibility check.</p>
        <div className="mt-4">
          <div className="text-sm"><strong>Patient:</strong> {form.patientName}</div>
          <div className="text-sm"><strong>Blood Group:</strong> {form.bloodGroup}</div>
          <div className="text-sm"><strong>Units:</strong> {form.units}</div>
          <div className="mt-4">
            <button onClick={()=>setStep('form')} className="text-sm text-primary">Submit another</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="max-w-xl mx-auto card space-y-4">
      <h2 className="text-xl font-semibold">Emergency Blood Request</h2>
      <div>
        <label className="block text-sm font-medium">Patient name</label>
        <input required value={form.patientName} onChange={e=>setForm({...form, patientName: e.target.value})} className="mt-1 w-full border rounded px-3 py-2" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium">Blood group</label>
          <select value={form.bloodGroup} onChange={e=>setForm({...form, bloodGroup: e.target.value})} className="mt-1 w-full border rounded px-3 py-2">
            {BLOOD_GROUPS.map(g=> <option key={g} value={g}>{g}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">Units required</label>
          <input type="number" min={1} value={form.units} onChange={e=>setForm({...form, units: Number(e.target.value)})} className="mt-1 w-full border rounded px-3 py-2" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium">Hospital name</label>
        <input value={form.hospital} onChange={e=>setForm({...form, hospital: e.target.value})} className="mt-1 w-full border rounded px-3 py-2" />
      </div>
      <div>
        <label className="block text-sm font-medium">Location (city / area)</label>
        <input value={form.location} onChange={e=>setForm({...form, location: e.target.value})} className="mt-1 w-full border rounded px-3 py-2" />
      </div>
      <div>
        <label className="block text-sm font-medium">Contact number</label>
        <input value={form.contactNumber} onChange={e=>setForm({...form, contactNumber: e.target.value})} className="mt-1 w-full border rounded px-3 py-2" />
      </div>
      <div>
        <label className="block text-sm font-medium">Urgency</label>
        <select value={form.urgency} onChange={e=>setForm({...form, urgency: e.target.value})} className="mt-1 w-full border rounded px-3 py-2">
          <option>Normal</option>
          <option>Urgent</option>
          <option>Critical</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium">Additional information</label>
        <textarea value={form.additionalInfo} onChange={e=>setForm({...form, additionalInfo: e.target.value})} className="mt-1 w-full border rounded px-3 py-2" />
      </div>
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">By submitting you consent to being contacted by matched donors and blood banks.</div>
        <button type="submit" className="bg-primary text-white px-4 py-2 rounded">Submit Request</button>
      </div>
    </form>
  )
}
