import './Loader.css'

function Loader({ size = 'medium', text = 'Loading...' }) {
  return (
    <div className="loader-container">
      <div className={`loader loader-${size}`}></div>
      {text && <p className="loader-text">{text}</p>}
    </div>
  )
}

export default Loader