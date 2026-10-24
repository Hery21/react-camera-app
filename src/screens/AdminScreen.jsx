import { useState } from 'react'
import { exhibits } from '../data/exhibits.js'

function buildInitialFormData(exhibitId) {
  const existing = exhibits.find((ex) => ex.id === exhibitId)
  if (existing) {
    const copy = JSON.parse(JSON.stringify(existing))
    ;['en', 'id', 'zh'].forEach((lang) => {
      if (copy.content[lang] && !copy.content[lang].pages) {
        copy.content[lang].pages = [{ text: copy.content[lang].story || '' }]
      }
    })
    return copy
  }
  const blank = () => ({ title: '', summary: '', story: '', period: '', coverAlt: '', pages: [{ text: '' }] })
  return {
    id: exhibitId,
    coverImage: '',
    content: { en: blank(), id: blank(), zh: blank() }
  }
}

function AdminEditForm({ exhibitId, onDone }) {
  const [formData, setFormData] = useState(() => buildInitialFormData(exhibitId))
  const [saveStatus, setSaveStatus] = useState(null)
  const [activeLang, setActiveLang] = useState('en')
  const isNew = !exhibits.some((ex) => ex.id === exhibitId)

  function handleChange(e) {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  function handleLangChange(lang, field, value) {
    setFormData((prev) => ({
      ...prev,
      content: {
        ...prev.content,
        [lang]: { ...prev.content[lang], [field]: value }
      }
    }))
  }

  function handlePageChange(lang, pageIndex, field, value) {
    setFormData((prev) => {
      const newPages = [...prev.content[lang].pages]
      if (field === 'image.src' || field === 'image.alt') {
        const imgField = field.split('.')[1]
        newPages[pageIndex].image = { ...(newPages[pageIndex].image || {}), [imgField]: value }
      } else {
        newPages[pageIndex][field] = value
      }
      return {
        ...prev,
        content: {
          ...prev.content,
          [lang]: { ...prev.content[lang], pages: newPages }
        }
      }
    })
  }

  function addPage(lang) {
    setFormData((prev) => ({
      ...prev,
      content: {
        ...prev.content,
        [lang]: { ...prev.content[lang], pages: [...(prev.content[lang].pages || []), { text: '' }] }
      }
    }))
  }

  function removePage(lang, index) {
    setFormData((prev) => {
      const newPages = [...prev.content[lang].pages]
      newPages.splice(index, 1)
      return {
        ...prev,
        content: {
          ...prev.content,
          [lang]: { ...prev.content[lang], pages: newPages }
        }
      }
    })
  }

  async function handleSave() {
    setSaveStatus('saving')
    try {
      const res = await fetch('/api/admin/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ exhibit: formData })
      })
      if (!res.ok) {
        throw new Error('Save failed with status ' + res.status)
      }
      setSaveStatus('saved')
      setTimeout(() => {
        window.location.reload()
      }, 600)
    } catch (err) {
      setSaveStatus('error: ' + String(err))
    }
  }

  return (
    <section className="admin-screen">
      <header className="admin-header">
        <h1>{isNew ? 'New ' + exhibitId : 'Editing ' + exhibitId}</h1>
        <div className="admin-header-actions">
          <button type="button" onClick={handleSave} className="admin-btn-primary" disabled={saveStatus === 'saving'}>
            {saveStatus === 'saving' ? 'Saving...' : 'Save'}
          </button>
          <button type="button" onClick={onDone} className="admin-btn-secondary">Done</button>
        </div>
      </header>

      {saveStatus === 'saved' && <p className="admin-save-status admin-save-status-ok">Saved. Reloading to reflect source change...</p>}
      {saveStatus && saveStatus.startsWith('error') && <p className="admin-save-status admin-save-status-err">{saveStatus}</p>}

      <div className="admin-form">
        <label>
          Cover Image Path
          <input type="text" name="coverImage" value={formData.coverImage || ''} onChange={handleChange} />
        </label>

        <div className="admin-lang-tabs">
          {['en', 'id', 'zh'].map((lang) => (
            <button
              key={lang}
              type="button"
              className={'admin-lang-tab ' + (activeLang === lang ? 'active' : '')}
              onClick={() => setActiveLang(lang)}
            >
              {lang.toUpperCase()}
            </button>
          ))}
        </div>

        <fieldset className="admin-fieldset">
          <legend>{activeLang.toUpperCase()} Content</legend>

          <label>
            Title
            <input type="text" value={formData.content[activeLang]?.title || ''} onChange={(e) => handleLangChange(activeLang, 'title', e.target.value)} />
          </label>
          <label>
            Period (optional)
            <input type="text" value={formData.content[activeLang]?.period || ''} onChange={(e) => handleLangChange(activeLang, 'period', e.target.value)} />
          </label>
          <label>
            Summary
            <textarea rows={2} value={formData.content[activeLang]?.summary || ''} onChange={(e) => handleLangChange(activeLang, 'summary', e.target.value)} />
          </label>

          <div className="admin-pages-header">
            <h3>Pages</h3>
            <button type="button" className="admin-btn-secondary" onClick={() => addPage(activeLang)}>+ Add Page</button>
          </div>

          {formData.content[activeLang]?.pages?.map((page, i) => (
            <div key={i} className="admin-page-block">
              <div className="admin-page-block-header">
                <strong>Page {i + 1}</strong>
                <button type="button" className="admin-btn-secondary admin-btn-small" onClick={() => removePage(activeLang, i)}>Remove</button>
              </div>

              <label>
                Image Path (optional)
                <input type="text" value={page.image?.src || ''} onChange={(e) => handlePageChange(activeLang, i, 'image.src', e.target.value)} />
              </label>
              <label>
                Image Alt
                <input type="text" value={page.image?.alt || ''} onChange={(e) => handlePageChange(activeLang, i, 'image.alt', e.target.value)} />
              </label>
              <label>
                Text Content (Leave empty if image only)
                <textarea rows={4} value={page.text || ''} onChange={(e) => handlePageChange(activeLang, i, 'text', e.target.value)} />
              </label>
            </div>
          ))}
        </fieldset>
      </div>
    </section>
  )
}

function AdminDashboard({ onEdit, onBack }) {
  function getNextExhibitId() {
    const maxNum = exhibits.reduce((max, ex) => {
      const match = /^PSBIKT-(\d+)$/.exec(ex.id)
      return match ? Math.max(max, parseInt(match[1], 10)) : max
    }, 0)
    return 'PSBIKT-' + String(maxNum + 1).padStart(3, '0')
  }

  return (
    <section className="admin-screen">
      <header className="admin-header">
        <h1>Admin Dashboard</h1>
        <div className="admin-header-actions">
          <button type="button" onClick={() => onEdit(getNextExhibitId())} className="admin-btn-primary">
            + Add New Exhibit
          </button>
          <button type="button" onClick={onBack} className="admin-btn-secondary">Exit Admin</button>
        </div>
      </header>

      <div className="admin-list">
        {exhibits.map((exhibit) => (
          <div key={exhibit.id} className="admin-card">
            <div className="admin-card-header">
              <h2>{exhibit.id}</h2>
            </div>
            <div className="admin-card-body">
              <p><strong>EN:</strong> {exhibit.content.en?.title || 'Missing'}</p>
              <p><strong>ID:</strong> {exhibit.content.id?.title || 'Missing'}</p>
              <p><strong>ZH:</strong> {exhibit.content.zh?.title || 'Missing'}</p>
            </div>
            <div className="admin-card-actions">
              <button type="button" className="admin-btn-primary" onClick={() => onEdit(exhibit.id)}>Edit</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export function AdminScreen({ editingExhibitId, onEdit, onDone, onBack }) {
  if (editingExhibitId) {
    return <AdminEditForm key={editingExhibitId} exhibitId={editingExhibitId} onDone={onDone} />
  }
  return <AdminDashboard onEdit={onEdit} onBack={onBack} />
}
