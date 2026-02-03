import './Button.css'

function Button({ 
  children, 
  variant = 'primary', 
  size = 'medium', 
  disabled = false, 
  loading = false,
  onClick,
  type = 'button',
  className = ''
}) {
  const buttonClass = `btn btn-${variant} btn-${size} ${className} ${disabled ? 'disabled' : ''} ${loading ? 'loading' : ''}`

  return (
    <button 
      type={type}
      className={buttonClass}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading ? (
        <span className="btn-loading">
          <span className="spinner"></span>
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  )
}

export default Button