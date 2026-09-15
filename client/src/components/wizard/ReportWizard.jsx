import React, { useState } from 'react'
import ProgressBar from './ProgressBar'
import StepStart from './StepStart'
import StepDescription from './StepDescription'
import StepCategory, { CATEGORIES } from './StepCategory'
import StepPhoto from './StepPhoto'
import StepLocation from './StepLocation'
import StepReview from './StepReview'
import StepSubmit from './StepSubmit'

const INITIAL_FORM_DATA = {
  description: '',
  category: '',
  subcategory: '',
  latitude: '',
  longitude: '',
  media_urls: [],
}

const ALLOWED_CATEGORY_IDS = CATEGORIES.map((c) => c.id)

export default function ReportWizard() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState(INITIAL_FORM_DATA)
  const [errors, setErrors] = useState({})

  const validateStep = (step) => {
    const newErrors = {}

    if (step === 2) {
      const trimmed = (formData.description || '').trim()
      if (!trimmed || trimmed.length < 10) {
        newErrors.description = 'Description is required and must be at least 10 characters long (excluding whitespace).'
      }
    }

    if (step === 3) {
      if (!formData.category || !ALLOWED_CATEGORY_IDS.includes(formData.category)) {
        newErrors.category = 'Primary category is required. Please select one of the allowed categories.'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    const isValid = validateStep(currentStep)
    if (isValid && currentStep < 7) {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const handleBack = () => {
    setErrors({})
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  const handleStepClick = (stepId) => {
    if (stepId < currentStep) {
      // Always allow navigating backward
      setErrors({})
      setCurrentStep(stepId)
    } else if (stepId > currentStep) {
      // Only allow navigating forward if current step validates
      if (validateStep(currentStep)) {
        setCurrentStep(stepId)
      }
    }
  }

  const updateFormData = (field, value) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value }

      // If category changes, ensure subcategory is cleared if incompatible
      if (field === 'category') {
        const catObj = CATEGORIES.find((c) => c.id === value)
        if (!catObj || !catObj.subcategories.includes(prev.subcategory)) {
          updated.subcategory = ''
        }
      }

      return updated
    })

    // Clear error for the field being modified
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-8 bg-slate-950/80 border border-slate-800/80 rounded-2xl shadow-2xl backdrop-blur-sm">
      {/* Progress Bar Header */}
      <ProgressBar currentStep={currentStep} onStepClick={handleStepClick} />

      {/* Step Render Area */}
      <div className="min-h-[380px] flex flex-col justify-between">
        <div className="w-full">
          {currentStep === 1 && (
            <StepStart onStart={handleNext} />
          )}

          {currentStep === 2 && (
            <StepDescription
              description={formData.description}
              onChange={(val) => updateFormData('description', val)}
              error={errors.description}
            />
          )}

          {currentStep === 3 && (
            <StepCategory
              category={formData.category}
              subcategory={formData.subcategory}
              onCategoryChange={(val) => updateFormData('category', val)}
              onSubcategoryChange={(val) => updateFormData('subcategory', val)}
              error={errors.category}
            />
          )}

          {currentStep === 4 && (
            <StepPhoto
              mediaUrls={formData.media_urls}
              onMediaUrlsChange={(val) => updateFormData('media_urls', val)}
            />
          )}

          {currentStep === 5 && (
            <StepLocation
              latitude={formData.latitude}
              longitude={formData.longitude}
              onLatChange={(val) => updateFormData('latitude', val)}
              onLngChange={(val) => updateFormData('longitude', val)}
            />
          )}

          {currentStep === 6 && (
            <StepReview
              formData={formData}
              onEditStep={(stepId) => {
                setErrors({})
                setCurrentStep(stepId)
              }}
            />
          )}

          {currentStep === 7 && (
            <StepSubmit />
          )}
        </div>

        {/* Navigation Footer Controls (Visible for steps 2 to 7) */}
        {currentStep > 1 && (
          <div className="mt-8 pt-4 border-t border-slate-800/80 flex justify-between items-center">
            <button
              type="button"
              onClick={handleBack}
              className="px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 font-semibold text-sm transition-colors flex items-center gap-2"
            >
              ← Back
            </button>

            {currentStep < 7 && (
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-400 text-slate-950 font-bold text-sm shadow-md shadow-teal-500/20 hover:from-teal-400 hover:to-emerald-300 transition-all flex items-center gap-2"
              >
                Next →
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
