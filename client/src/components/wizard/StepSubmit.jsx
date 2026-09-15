import React from 'react'

export default function StepSubmit() {
  return (
    <div className="max-w-xl mx-auto py-8 text-center space-y-6">
      <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto text-amber-400">
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>

      <div>
        <h3 className="text-2xl font-bold text-slate-100 mb-2">Ready for Submission</h3>
        <p className="text-slate-400 text-sm max-w-md mx-auto leading-relaxed">
          Your report details have been captured in the wizard state. 
        </p>
      </div>

      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 text-left space-y-3">
        <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs uppercase tracking-wider">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          Submission Step Placeholder (Day 6 Foundation)
        </div>
        <p className="text-slate-300 text-xs leading-relaxed">
          Actual backend submission to <code className="text-teal-400 bg-slate-950 px-1.5 py-0.5 rounded font-mono">POST /api/issues</code>, JWT authentication header integration, validation checks, and receipt generation will be wired in downstream implementation.
        </p>
      </div>
    </div>
  )
}
