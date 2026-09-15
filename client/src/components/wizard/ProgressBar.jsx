import React from 'react'

const STEPS = [
  { id: 1, name: 'Start' },
  { id: 2, name: 'Description' },
  { id: 3, name: 'Category' },
  { id: 4, name: 'Photo' },
  { id: 5, name: 'Location' },
  { id: 6, name: 'Review' },
  { id: 7, name: 'Submit' },
]

export default function ProgressBar({ currentStep, onStepClick }) {
  return (
    <div className="w-full mb-8">
      {/* Mobile view step counter */}
      <div className="flex items-center justify-between md:hidden mb-4 px-2">
        <span className="text-xs font-bold uppercase tracking-wider text-teal-400">
          Step {currentStep} of {STEPS.length}
        </span>
        <span className="text-sm font-semibold text-slate-200">
          {STEPS[currentStep - 1]?.name}
        </span>
      </div>

      {/* Progress Bar Line */}
      <div className="w-full bg-slate-800 rounded-full h-2 mb-6 overflow-hidden">
        <div
          className="bg-gradient-to-r from-teal-400 to-emerald-400 h-2 transition-all duration-300 ease-in-out"
          style={{ width: `${(currentStep / STEPS.length) * 100}%` }}
        />
      </div>

      {/* Desktop step indicators */}
      <div className="hidden md:flex justify-between items-center relative">
        {STEPS.map((step) => {
          const isCompleted = step.id < currentStep
          const isCurrent = step.id === currentStep

          return (
            <button
              key={step.id}
              onClick={() => isCompleted && onStepClick && onStepClick(step.id)}
              disabled={!isCompleted}
              className={`flex flex-col items-center gap-1.5 group focus:outline-none ${
                isCompleted ? 'cursor-pointer' : 'cursor-default'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-200 ${
                  isCurrent
                    ? 'bg-gradient-to-tr from-teal-400 to-emerald-400 text-slate-950 shadow-md shadow-teal-500/20 ring-4 ring-teal-500/10'
                    : isCompleted
                    ? 'bg-teal-500/20 text-teal-400 border border-teal-500/40 group-hover:bg-teal-500/30'
                    : 'bg-slate-900 text-slate-500 border border-slate-800'
                }`}
              >
                {isCompleted ? '✓' : step.id}
              </div>
              <span
                className={`text-xs font-medium transition-colors ${
                  isCurrent
                    ? 'text-teal-400 font-semibold'
                    : isCompleted
                    ? 'text-slate-300 group-hover:text-teal-300'
                    : 'text-slate-500'
                }`}
              >
                {step.name}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
