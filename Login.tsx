import React from 'react'

export default function Login(){
  return (
    <div className="max-w-md mx-auto card">
      <h2 className="text-xl font-semibold">Login / Register</h2>
      <p className="text-sm text-gray-600">Authentication will be connected to Supabase in later steps. This mock page shows the UI only.</p>
      <div className="mt-4">
        <button className="bg-primary text-white px-4 py-2 rounded">Continue with email</button>
      </div>
    </div>
  )
}
