function Card({ title, subtitle, action, children }) {
  return (
    <section className="card">
      {(title || subtitle || action) && (
        <header className="card-header">
          <div>
            {title && <h3>{title}</h3>}
            {subtitle && <p>{subtitle}</p>}
          </div>
          {action}
        </header>
      )}
      <div className="card-body">{children}</div>
    </section>
  )
}

export default Card
