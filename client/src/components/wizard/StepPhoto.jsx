import React, { useState } from 'react'

const SAMPLE_MEDIA = [
  'https://storage.civicpulse.org/evidence/pothole1.jpg',
  'https://storage.civicpulse.org/evidence/garbage1.jpg',
  'https://storage.civicpulse.org/evidence/waterleak1.jpg',
]

export default function StepPhoto({ mediaUrls, onMediaUrlsChange }) {
  const [urlInput, setUrlInput] = useState('')

  const handleAddUrl = (urlToAdd) => {
    const targetUrl = (urlToAdd || urlInput).trim()
    if (!targetUrl) return
    if (!mediaUrls.includes(targetUrl)) {
      onMediaUrlsChange([...mediaUrls, targetUrl])
    }
    setUrlInput('')
  }

  const handleRemoveUrl = (indexToRemove) => {
    onMediaUrlsChange(mediaUrls.filter((_, idx) => idx !== indexToRemove))
  }

  return (
    <div className="max-w-xl mx-auto py-4 space-y-6">
      <div>
        <h3 className="text-xl font-bold text-slate-100 mb-1">Photo / Media References</h3>
        <p className="text-slate-400 text-sm">
          Add image URL evidence for your report (array of media URLs).
        </p>
      </div>

      {/* Manual URL Input */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
        <label htmlFor="media-url" className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
          Add Media URL
        </label>
        <div className="flex gap-2">
          <input
            id="media-url"
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://example.com/photo.jpg"
            className="flex-1 px-4 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500 text-sm"
          />
          <button
            type="button"
            onClick={() => handleAddUrl()}
            className="px-4 py-2.5 rounded-lg bg-teal-500/20 text-teal-300 border border-teal-500/30 hover:bg-teal-500/30 font-semibold text-sm transition-colors"
          >
            Add
          </button>
        </div>
      </div>

      {/* Sample Media Shortcuts */}
      <div className="space-y-2">
        <span className="text-xs text-slate-500 font-medium">Quick sample URLs:</span>
        <div className="flex flex-wrap gap-2">
          {SAMPLE_MEDIA.map((url, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleAddUrl(url)}
              className="text-xs px-3 py-1.5 rounded-md bg-slate-900 border border-slate-800 text-slate-300 hover:border-teal-500/40 hover:text-teal-400 transition-colors"
            >
              + Sample Photo #{idx + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Current Media URLs List */}
      <div className="space-y-2">
        <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Attached Media ({mediaUrls.length})
        </div>
        {mediaUrls.length === 0 ? (
          <div className="p-4 rounded-xl bg-slate-900/40 border border-dashed border-slate-800 text-center text-slate-500 text-xs">
            No media URLs attached yet.
          </div>
        ) : (
          <div className="space-y-2">
            {mediaUrls.map((url, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs">
                <span className="truncate max-w-[80%] text-slate-300 font-mono">{url}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveUrl(index)}
                  className="text-rose-400 hover:text-rose-300 font-semibold px-2 py-1 rounded hover:bg-rose-500/10"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
