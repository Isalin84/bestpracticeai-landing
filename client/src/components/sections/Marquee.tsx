const ITEMS = ['Экспертиза', 'Инновации', 'Результат', 'Технологии', 'Качество', 'Развитие']

export function Marquee() {
  return (
    <div className="marquee-track" aria-hidden="true">
      <div className="marquee-content" style={{ fontFamily: 'var(--bp-font-heading)', fontWeight: 700, fontSize: 15, color: 'var(--bp-dark-blue)', letterSpacing: '0.16em' }}>
        {[0, 1, 2].map(i => (
          <span key={i} style={{ paddingRight: 56 }}>
            {ITEMS.map(item => (
              <span key={item} style={{ marginRight: 40 }}>
                <span style={{ color: 'rgba(11,29,58,0.45)', marginRight: 40, fontSize: 12, verticalAlign: '1px' }}>✦</span>
                {item.toUpperCase()}
              </span>
            ))}
          </span>
        ))}
      </div>
    </div>
  )
}
