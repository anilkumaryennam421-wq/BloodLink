import React from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { mockBloodBanks } from '../data/mock'

export default function BankMap(){
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Blood Bank Map</h2>
      <div className="h-96 rounded overflow-hidden">
        <MapContainer center={[13.0827, 80.2707]} zoom={13} style={{height: '100%', width: '100%'}}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {mockBloodBanks.map(b => (
            <Marker key={b.id} position={[b.lat, b.lng] as [number, number]}>
              <Popup>
                <div className="text-sm">
                  <div className="font-semibold">{b.name}</div>
                  <div className="text-gray-600">{b.address}</div>
                  <div className="mt-2">Available: {b.availableGroups.join(', ')}</div>
                  <div className="mt-1 text-xs text-gray-500">Last update: {new Date(b.lastUpdated??'').toLocaleString()}</div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  )
}
