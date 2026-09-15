import React from 'react'

export default function StepReview({ formData, onEditStep }) {
  const { description, category, subcategory, latitude, longitude, media_urls } = formData

  return (
    <div className="max-w-xl mx-auto py-4 space-y-6">
      <div>
        <h3 className="text-xl font-bold text-slate-100 mb-1">Review Your Report</h3>
        <p className="text-slate-400 text-sm">
          Check your entered information before proceeding to the final step.
        </p>
      </div>

      <div className="space-y-4">
        {/* Description Summary */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-start gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-1">Description</span>
            <p className="text-slate-200 text-sm whitespace-pre-wrap">
              {description || <span className="text-slate-500 italic">No description provided yet</span>}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onEditStep(2)}
            className="text-xs text-teal-400 hover:text-teal-300 font-medium"
          >
            Edit
          </button>
        </div>

        {/* Category Summary */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-start gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-1">Category & Subcategory</span>
            <div className="text-slate-200 text-sm font-semibold">
              {category || <span className="text-slate-500 font-normal italic">Not selected</span>}
            </div>
            {subcategory && (
              <div className="text-xs text-teal-400 font-mono mt-0.5">
                Subcategory: {subcategory}
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={() => onEditStep(3)}
            className="text-xs text-teal-400 hover:text-teal-300 font-medium"
          >
            Edit
          </button>
        </div>

        {/* Media Summary */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-start gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-1">Attached Photos / Media ({media_urls.length})</span>
            {media_urls.length === 0 ? (
              <span className="text-slate-500 text-xs italic">No media URLs attached</span>
            ) : (
              <div className="space-y-1 mt-1">
                {media_urls.map((url, idx) => (
                  <div key={idx} className="text-xs font-mono text-slate-300 truncate max-w-xs sm:max-w-md">
                    • {url}
                  </div>
                ))}
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={() => onEditStep(4)}
            className="text-xs text-teal-400 hover:text-teal-300 font-medium"
          >
            Edit
          </button>
        </div>

        {/* Location Summary */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-start gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-1">Location Coordinates</span>
            <div className="text-slate-200 text-sm font-mono">
              Lat: {latitude !== '' && latitude !== null && latitude !== undefined ? latitude : 'Not set'}, Lng: {longitude !== '' && longitude !== null && longitude !== undefined ? longitude : 'Not set'}
            </div>
          </div>
          <button
            type="button"
            onClick={() => onEditStep(5)}
            className="text-xs text-teal-400 hover:text-teal-300 font-medium"
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  )
}
