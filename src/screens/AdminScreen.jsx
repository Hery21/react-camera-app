import { useState } from 'react'
import { exhibits } from '../data/exhibits.js'

export function AdminScreen({ onBack }) {
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState(null)

  function handleEdit(exhibit) {
    setEditingId(exhibit.id)
    setFormData(JSON.parse(JSON.stringify(exhibit)))
  }

  function handleChange(e) {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  function handleLangChange(lang, field, value) {
    setFormData(prev => ({
      ...prev,
      content: {
        ...prev.content,
        [lang]: { ...prev.content[lang], [field]: value }
      }
    }))
  }

  function handleImagesChange(e) {
    try {
      const parsed = JSON.parse(e.target.value)
      setFormData(prev => ({
        ...prev,
        content: {
          ...prev.content,
          en: { ...prev.content.en, inlineImages: parsed }
        }
      }))
    } catch {
      // Ignore invalid JSON while typing
    }
  }

  function handleExport() {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(formData, null, 2))
    const downloadAnchorNode = document.createElement('a')
    downloadAnchorNode.setAttribute('href', dataStr)
    downloadAnchorNode.setAttribute('download', formData.id + '.json')
    document.body.appendChild(downloadAnchorNode)
    downloadAnchorNode.click()
    downloadAnchorNode.remove()
  }

  if (editingId && formData) {
    return (
      <section className="admin-screen">
        <header className="admin-header">
          <h1>Editing {editingId}</h1>
          <div className="admin-header-actions">
            <button type="button" onClick={handleExport} className="admin-btn-primary">Export JSON</button>
            <button type="button" onClick={() => setEditingId(null)} className="admin-btn-secondary">Done</button>
          </div>
        </header>

        <div className="admin-form">
          <label>
            Cover Image Path
            <input type="text" name="coverImage" value={formData.coverImage || ''} onChange={handleChange} />
          </label>

          {['en', 'id', 'zh'].map(lang => (
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
              Format: array of objects with afterParagraphIndex (number), src (string), alt (string).
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
            </div>
            <div className="admin-card-actions">
              <button type="button" className="admin-btn-primary" onClick={() => handleEdit(exhibit)}>Edit</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
