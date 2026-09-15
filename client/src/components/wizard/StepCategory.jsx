import React from 'react'

export const CATEGORIES = [
  { id: 'ROAD', label: 'Road & Potholes', subcategories: ['POTHOLE', 'MANHOLE', 'DIVIDER'] },
  { id: 'WASTE', label: 'Waste Management', subcategories: ['GARBAGE', 'DUMPING', 'PLASTIC'] },
  { id: 'WATER', label: 'Water Supply', subcategories: ['LEAKAGE', 'CONTAMINATION', 'LOW_PRESSURE'] },
  { id: 'DRAINAGE', label: 'Drainage & Sewage', subcategories: ['OVERFLOW', 'BLOCKAGE', 'STAGNANT'] },
  { id: 'STREETLIGHT', label: 'Street Lighting', subcategories: ['BROKEN', 'NON_FUNCTIONAL'] },
  { id: 'TRAFFIC', label: 'Traffic & Signage', subcategories: ['SIGNAL_BROKEN', 'SIGNAGE_MISSING'] },
  { id: 'PUBLIC_INFRASTRUCTURE', label: 'Public Infrastructure', subcategories: ['BENCH_BROKEN', 'PARK_DAMAGE'] },
  { id: 'OTHER', label: 'Other Civic Issue', subcategories: [] },
]

export default function StepCategory({ category, subcategory, onCategoryChange, onSubcategoryChange, error }) {
  const selectedCatObj = CATEGORIES.find(c => c.id === category)

  const handleSelectCategory = (catId) => {
    onCategoryChange(catId)
    // Clear subcategory when category changes to ensure compatibility
    const newCatObj = CATEGORIES.find(c => c.id === catId)
    if (!newCatObj || !newCatObj.subcategories.includes(subcategory)) {
      onSubcategoryChange('')
    }
  }

  return (
    <div className="max-w-xl mx-auto py-4">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-slate-100 mb-1">Select Category</h3>
        <p className="text-slate-400 text-sm">
          Select a primary category (required) and an optional subcategory.
        </p>
      </div>

      {/* Validation Error Message */}
      {error && (
        <div className="mb-6 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {/* Primary Category Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        {CATEGORIES.map((cat) => {
          const isSelected = category === cat.id
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => handleSelectCategory(cat.id)}
              className={`p-4 rounded-xl text-left border transition-all duration-200 ${
                isSelected
                  ? 'bg-teal-500/10 border-teal-500 text-teal-300 ring-1 ring-teal-500/30'
                  : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
              }`}
            >
              <div className="font-semibold text-sm mb-1">{cat.label}</div>
              <div className="text-xs text-slate-500 font-mono">{cat.id}</div>
            </button>
          )
        })}
      </div>

      {/* Optional Subcategory Selector */}
      {selectedCatObj && selectedCatObj.subcategories.length > 0 && (
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
          <label htmlFor="subcategory" className="block text-xs font-semibold uppercase tracking-wider text-teal-400">
            Subcategory (Optional)
          </label>
          <select
            id="subcategory"
            value={subcategory}
            onChange={(e) => onSubcategoryChange(e.target.value)}
            className="w-full px-3 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-sm focus:outline-none focus:border-teal-500"
          >
            <option value="">-- None / General --</option>
            {selectedCatObj.subcategories.map((sub) => (
              <option key={sub} value={sub}>
                {sub}
              </option>
            ))}
          </select>
          <p className="text-xs text-slate-500">
            Subcategory options are strictly filtered to match {selectedCatObj.id}.
          </p>
        </div>
      )}
    </div>
  )
}
