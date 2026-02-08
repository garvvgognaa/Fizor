import './ResultCard.css'

function ResultCard({ title, amount, description, type = 'default' }) {
  return (
    <div className={`result-card result-card-${type}`}>
      <div className="result-card-header">
        <h3 className="result-card-title">{title}</h3>
        <div className="result-card-amount">{amount}</div>
      </div>
      {description && (
        <p className="result-card-description">{description}</p>
      )}
    </div>
  )
}

export default ResultCard