import React, { useState } from 'react'
import { BLOOD_GROUPS } from '../data/mock'

export default function DonorRegister(){
  const [submitted, setSubmitted] = useState(false)
  const [consent, setConsent] = useState(false)
  const [form, setForm] = useState({name:'', age: '', bloodGroup: 'O+', phone:'', city:'', area:'', lastDonation:'', availability:'available'})
  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <section className="max-w-xl mx-auto card space-y-4" aria-live="polite">
        <div className="rounded-md bg-green-50 border border-green-200 p-4 text-green-800">
          <h2 className="text-xl font-semibold">Registration received</h2>
          <p className="mt-1 text-sm">Thank you, {form.name}. Your donor profile is ready for verification.</p>
        </div>
        <p className="text-sm text-gray-600">BloodLink is a matching aid and does not determine medical eligibility for donation. A verified team member may contact you using the details you provided.</p>
        <button type="button" onClick={() => setSubmitted(false)} className="border border-primary text-primary px-4 py-2 rounded">
          Edit registration
        </button>
      </section>
    )
  }

  return (
    <form onSubmit={submit} className="max-w-xl mx-auto card space-y-4">
      <h2 className="text-xl font-semibold">Donor Registration</h2>
      <p className="text-sm text-gray-600">By registering you consent to being contacted for legitimate blood requests. This platform does not determine medical eligibility.</p>

      <div>
        <label htmlFor="donor-name" className="block text-sm font-medium">Full name</label>
        <input id="donor-name" required autoComplete="name" value={form.name} onChange={e=>setForm({...form, name: e.target.value})} className="mt-1 w-full border rounded px-3 py-2" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="donor-age" className="block text-sm font-medium">Age</label>
          <input id="donor-age" required type="number" min="18" max="120" value={form.age} onChange={e=>setForm({...form, age: e.target.value})} className="mt-1 w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label htmlFor="donor-blood-group" className="block text-sm font-medium">Blood group</label>
          <select id="donor-blood-group" value={form.bloodGroup} onChange={e=>setForm({...form, bloodGroup: e.target.value})} className="mt-1 w-full border rounded px-3 py-2">
            {BLOOD_GROUPS.map(g=> <option key={g} value={g}>{g}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label htmlFor="donor-phone" className="block text-sm font-medium">Phone</label>
        <input id="donor-phone" required type="tel" autoComplete="tel" value={form.phone} onChange={e=>setForm({...form, phone: e.target.value})} className="mt-1 w-full border rounded px-3 py-2" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="donor-city" className="block text-sm font-medium">City</label>
          <input id="donor-city" required autoComplete="address-level2" value={form.city} onChange={e=>setForm({...form, city: e.target.value})} className="mt-1 w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label htmlFor="donor-area" className="block text-sm font-medium">Area</label>
          <input id="donor-area" required autoComplete="address-line2" value={form.area} onChange={e=>setForm({...form, area: e.target.value})} className="mt-1 w-full border rounded px-3 py-2" />
        </div>
      </div>
      <div>
        <label htmlFor="donor-last-donation" className="block text-sm font-medium">Last donation date <span className="font-normal text-gray-500">(optional)</span></label>
        <input id="donor-last-donation" type="date" value={form.lastDonation} onChange={e=>setForm({...form, lastDonation: e.target.value})} className="mt-1 w-full border rounded px-3 py-2" />
      </div>
      <div className="flex items-center gap-3">
        <label htmlFor="donor-availability" className="text-sm">Availability</label>
        <select id="donor-availability" value={form.availability} onChange={e=>setForm({...form, availability: e.target.value})} className="mt-1 border rounded px-2 py-1">
          <option value="available">Available</option>
          <option value="unavailable">Unavailable</option>
        </select>
      </div>
      <label className="flex items-start gap-2 text-sm text-gray-600">
        <input required type="checkbox" checked={consent} onChange={e=>setConsent(e.target.checked)} className="mt-1" />
        <span>I consent to BloodLink storing these details and contacting me about legitimate blood requests. My phone and exact location will not be public.</span>
      </label>
      <div className="flex items-center justify-end">
        <button type="submit" className="bg-primary text-white px-4 py-2 rounded">Register</button>
      </div>
    </form>
  )
}
