import React from 'react'

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t mt-8">
      <div className="container mx-auto px-4 py-6 text-sm text-gray-600">
        <div className="flex flex-col md:flex-row md:justify-between gap-4">
          <div>
            <div className="font-semibold">BloodLink</div>
            <div>Every Drop Connects a Life.</div>
          </div>
          <div>
            <div>© {new Date().getFullYear()} BloodLink — Built with care for emergency blood needs.</div>
          </div>
        </div>
      </div>
    </footer>
  )
}
