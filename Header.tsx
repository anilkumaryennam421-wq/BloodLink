import React from 'react'
import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'

export default function Header() {
  return (
    <header className="bg-white border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-primary font-semibold text-lg">
          <Heart className="text-primary" />
          BloodLink
        </Link>
        <nav className="hidden md:flex gap-4 items-center">
          <Link to="/request" className="text-sm font-medium text-gray-700">Need Blood</Link>
          <Link to="/donors" className="text-sm font-medium text-gray-700">Find Donors</Link>
          <Link to="/map" className="text-sm font-medium text-gray-700">Blood Banks</Link>
          <Link to="/register" className="bg-primary text-white px-3 py-2 rounded-md text-sm">Become a Donor</Link>
        </nav>
        <div className="md:hidden">{/* mobile menu placeholder */}</div>
      </div>
    </header>
  )
}
