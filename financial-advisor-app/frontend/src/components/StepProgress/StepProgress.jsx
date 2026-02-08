import './StepProgress.css'

function StepProgress({ currentStep, totalSteps, steps }) {
  return (
    <div className="step-progress">
      <div className="step-progress-bar">
        {steps.map((step, index) => (
          <div key={index} className="step-item">
            <div className={`step-circle ${index + 1 <= currentStep ? 'active' : ''}`}>
              {index + 1}
            </div>
            <span className={`step-label ${index + 1 <= currentStep ? 'active' : ''}`}>
              {step}
            </span>
            {index < steps.length - 1 && (
              <div className={`step-line ${index + 1 < currentStep ? 'completed' : ''}`}></div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default StepProgress