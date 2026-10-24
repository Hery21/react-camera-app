import { useState } from 'react'
import { exhibits } from '../data/exhibits.js'

export function AdminScreen({ editingExhibitId, onEdit, onDone, onBack }) {
  const [formData, setFormData] = useState(null)
  const [saveStatus, setSaveStatus] = useState(null)

  const editingExhibit = editingExhibitId ? exhibits.find((ex) => ex.id === editingExhibitId) : null

  if (editingExhibit && !formData) {
    setFormData(JSON.parse(JSON.stringify(editingExhibit)))
  }

  function handleChange(e) {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  function handleLangChange(lang, field, value) {
    setFormData((prev) => ({
      ...prev,
      content: {
        ...prev.content,
        [lang]: { ...prev.content[lang], [field]: value },
      },
    }))
  }

  function handleImagesChange(e) {
    try {
      const parsed = JSON.parse(e.target.value)
      setFormData((prev) => ({
        ...prev,
        content: {
          ...prev.content,
          en: { ...prev.content.en, inlineImages: parsed },
        },
      }))
    } catch {
      // Ignore invalid JSON while typing
    }
  }

  async function handleSave() {
    setSaveStatus('saving')
    try {
      const res = await fetch('/api/admin/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ exhibit: formData }),
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

  function handleDone() {
    setFormData(null)
    setSaveStatus(null)
    onDone()
  }

  if (editingExhibitId && formData) {
    return (
      <section className="admin-screen">
        <header className="admin-header">
          <h1>Editing {editingExhibitId}</h1>
          <div className="admin-header-actions">
            <button type="button" onClick={handleSave} className="admin-btn-primary" disabled={saveStatus === 'saving'}>
              {saveStatus === 'saving' ? 'Saving...' : 'Save'}
            </button>
            <button type="button" onClick={handleDone} className="admin-btn-secondary">Done</button>
          </div>
        </header>

        {saveStatus === 'saved' && <p className="admin-save-status admin-save-status-ok">Saved. Reloading to reflect source change...</p>}
        {saveStatus && saveStatus.startsWith('error') && <p className="admin-save-status admin-save-status-err">{saveStatus}</p>}

        <div className="admin-form">
          <label>
            Cover Image Path
            <input type="text" name="coverImage" value={formData.coverImage || ''} onChange={handleChange} />
          </label>

          {['en', 'id', 'zh'].map((lang) => (
            <fieldset key={lang} className="admin-fieldset">
              <legend>{lang.toUpperCase()}</legend>
              <label>
                Title
                <input type="text" value={formData.content[lang]?.title || ''} onChange={(e) => handleLangChange(lang, 'title', e.target.value)} />
              </label>
              <label>
                Summary
                <textarea rows={2} value={formData.content[lang]?.summary || ''} onChange={(e) => handleLangChange(lang, 'summary', e.target.value)} />
              </label>
              <label>
                Story (Plain Text)
                <textarea rows={8} value={formData.content[lang]?.story || ''} onChange={(e) => handleLangChange(lang, 'story', e.target.value)} />
              </label>
            </fieldset>
          ))}

          <fieldset className="admin-fieldset">
            <legend>Inline Images JSON (Applies to all languages)</legend>
            <p className="admin-fieldset-help">
              Format: array of objects with paragraphIndex (number, 0-based), src (string), alt (string). The image renders at the top of the page that starts with that paragraph.
            </p>
            <textarea
              rows={5}
              defaultValue={JSON.stringify(formData.content.en?.inlineImages || [], null, 2)}
              onChange={handleImagesChange}
            />
          </fieldset>
        </div>
      </section>
    )
  }

  return (
    <section className="admin-screen">
      <header className="admin-header">
        <h1>Admin Dashboard</h1>
        <button type="button" onClick={onBack} className="admin-btn-secondary">Exit Admin</button>
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
