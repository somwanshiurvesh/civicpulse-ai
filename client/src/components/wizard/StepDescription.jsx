import React from 'react'

export default function StepDescription({ description, onChange, error }) {
  const trimmedLength = description.trim().length
  const isValidLength = trimmedLength >= 10

  return (
    <div className="max-w-xl mx-auto py-4">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-slate-100 mb-1">Issue Description</h3>
        <p className="text-slate-400 text-sm">
          Provide details about the civic issue. Minimum 10 characters required (excluding whitespace).
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="description" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Detailed Description <span className="text-rose-400">*</span>
          </label>
          <textarea
            id="description"
            rows={5}
            maxLength={1000}
            value={description}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Describe the issue in detail (e.g. location details, hazard level, observed impact)..."
            className={`w-full px-4 py-3 rounded-xl bg-slate-900 border text-slate-100 placeholder-slate-500 focus:outline-none transition-colors text-sm ${
              error
                ? 'border-rose-500/80 focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
                : 'border-slate-800 focus:border-teal-500 focus:ring-1 focus:ring-teal-500'
            }`}
          />
        </div>

        {/* Validation Error Message */}
        {error && (
          <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <div className="flex justify-between items-center text-xs text-slate-500">
          <span className={trimmedLength > 0 && !isValidLength ? 'text-amber-400' : isValidLength ? 'text-emerald-400' : ''}>
            Trimmed count: {trimmedLength} / 1000 chars (Min 10)
          </span>
          <span>Max 1,000 characters</span>
        </div>
      </div>
    </div>
  )
}
