import React, { useState } from 'react'

export default function StepLocation({ latitude, longitude, onLatChange, onLngChange }) {
  const [geoStatus, setGeoStatus] = useState('')

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setGeoStatus('Browser geolocation is not supported by your device.')
      return
    }

    setGeoStatus('Acquiring location...')

    navigator.geolocation.getCurrentPosition(
      (position) => {
        onLatChange(Number(position.coords.latitude.toFixed(6)))
        onLngChange(Number(position.coords.longitude.toFixed(6)))
        setGeoStatus('Location successfully acquired!')
      },
      (error) => {
        setGeoStatus(`Unable to retrieve location: ${error.message}`)
      },
      { timeout: 10000 }
    )
  }

  return (
    <div className="max-w-xl mx-auto py-4 space-y-6">
      <div>
        <h3 className="text-xl font-bold text-slate-100 mb-1">Geospatial Location</h3>
        <p className="text-slate-400 text-sm">
          Specify the coordinates of the civic issue (Latitude & Longitude).
        </p>
      </div>

      {/* Geolocation Button */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <div className="font-semibold text-sm text-slate-200">Browser Geolocation</div>
            <div className="text-xs text-slate-500">Auto-detect your current GPS coordinates</div>
          </div>
          <button
            type="button"
            onClick={handleUseMyLocation}
            className="px-4 py-2 rounded-lg bg-teal-500/20 text-teal-300 border border-teal-500/30 hover:bg-teal-500/30 font-semibold text-xs transition-colors"
          >
            📍 Use My Location
          </button>
        </div>
        {geoStatus && (
          <div className="text-xs text-teal-400 font-medium pt-1">{geoStatus}</div>
        )}
      </div>

      {/* Manual Coordinates Form */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="latitude" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Latitude (-90 to 90)
          </label>
          <input
            id="latitude"
            type="number"
            step="any"
            value={latitude !== null && latitude !== undefined ? latitude : ''}
            onChange={(e) => onLatChange(e.target.value === '' ? '' : parseFloat(e.target.value))}
            placeholder="e.g. 18.5204"
            className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500 text-sm font-mono"
          />
        </div>

        <div>
          <label htmlFor="longitude" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Longitude (-180 to 180)
          </label>
          <input
            id="longitude"
            type="number"
            step="any"
            value={longitude !== null && longitude !== undefined ? longitude : ''}
            onChange={(e) => onLngChange(e.target.value === '' ? '' : parseFloat(e.target.value))}
            placeholder="e.g. 73.8567"
            className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500 text-sm font-mono"
          />
        </div>
      </div>
    </div>
  )
}
