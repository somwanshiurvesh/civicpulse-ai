import React from 'react'

export default function StepStart({ onStart }) {
  return (
    <div className="flex flex-col items-center text-center py-6 px-4 max-w-xl mx-auto">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-teal-500/20 to-emerald-500/20 border border-teal-500/30 flex items-center justify-center mb-6 text-teal-400">
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>

      <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-100 mb-3">
        Report a Civic Issue
      </h2>

      <p className="text-slate-400 text-sm md:text-base leading-relaxed mb-8">
        Help improve your municipality by submitting a geolocated report. Your submission will be recorded, assigned a tracking ID, and routed for civic review.
      </p>

      <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8 text-left">
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="text-teal-400 font-semibold text-xs mb-1">Step 1-3</div>
          <div className="text-slate-200 text-sm font-medium">Describe & Categorize</div>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="text-teal-400 font-semibold text-xs mb-1">Step 4-5</div>
          <div className="text-slate-200 text-sm font-medium">Photo & Coordinates</div>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="text-teal-400 font-semibold text-xs mb-1">Step 6-7</div>
          <div className="text-slate-200 text-sm font-medium">Review & Submit</div>
        </div>
      </div>

      <button
        onClick={onStart}
        className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-400 text-slate-950 font-bold text-sm shadow-lg shadow-teal-500/20 hover:from-teal-400 hover:to-emerald-300 transition-all duration-200"
      >
        Start New Report
      </button>
    </div>
  )
}
