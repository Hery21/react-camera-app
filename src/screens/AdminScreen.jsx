import { exhibits } from '../data/exhibits.js'

export function AdminScreen({ onBack }) {
  return (
    <section className="admin-screen">
      <header className="admin-header">
        <h1>Admin Dashboard</h1>
        <button type="button" onClick={onBack} className="admin-btn-secondary">
          Exit Admin
        </button>
      </header>

      <div className="admin-list">
        {exhibits.map((exhibit) => {
          const enTitle = exhibit.content.en?.title || 'Missing EN'
          const idTitle = exhibit.content.id?.title || 'Missing ID'
          const zhTitle = exhibit.content.zh?.title || 'Missing ZH'
          
          const missing = []
          if (!exhibit.content.en?.title) missing.push('EN')
          if (!exhibit.content.id?.title) missing.push('ID')
          if (!exhibit.content.zh?.title) missing.push('ZH')
          if (!exhibit.coverImage) missing.push('Cover Image')

          return (
            <div key={exhibit.id} className="admin-card">
              <div className="admin-card-header">
                <h2>{exhibit.id}</h2>
                {missing.length > 0 ? (
                  <span className="admin-badge admin-badge-warning">Missing: {missing.join(', ')}</span>
                ) : (
                  <span className="admin-badge admin-badge-success">Complete</span>
                )}
              </div>
              
              <div className="admin-card-body">
                <p><strong>EN:</strong> {enTitle}</p>
                <p><strong>ID:</strong> {idTitle}</p>
                <p><strong>ZH:</strong> {zhTitle}</p>
              </div>

              <div className="admin-card-actions">
                <button type="button" className="admin-btn-primary" disabled>
                  Edit (Coming Soon)
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
