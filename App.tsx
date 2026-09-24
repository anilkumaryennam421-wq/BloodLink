import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import EmergencyRequest from './pages/EmergencyRequest'
import FindDonors from './pages/FindDonors'
import BankMap from './pages/BankMap'
import DonorRegister from './pages/DonorRegister'
import Login from './pages/Login'
import DonorDashboard from './pages/DonorDashboard'
import AdminDashboard from './pages/AdminDashboard'
import RequestDetails from './pages/RequestDetails'
import Header from './components/Header'
import Footer from './components/Footer'

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/request" element={<EmergencyRequest />} />
          <Route path="/donors" element={<FindDonors />} />
          <Route path="/map" element={<BankMap />} />
          <Route path="/register" element={<DonorRegister />} />
          <Route path="/login" element={<Login />} />
          <Route path="/donor-dashboard" element={<DonorDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/requests/:id" element={<RequestDetails />} />
          <Route path="*" element={<div>Page not found — <Link to="/">Go home</Link></div>} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
