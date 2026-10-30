import { useEffect, useRef, useState } from 'react'
import { getTranslation } from '../i18n/getTranslation.js'

// Point this at the deployed mahjong project.
// For local dev testing, change to your local server URL (e.g. http://localhost:3000/).
// The mahjong game lives in its own repo and its own Vercel project.
const MAHJONG_GAME_URL = 'http://localhost:3000/' // ← change this

export function MahjongModal({ language, onClose }) {
  const [loaded, setLoaded] = useState(false)
  const iframeRef = useRef(null)

  // Fade out the transition screen when the iframe reports load,
  // but not before a minimum display time so it feels intentional
  // rather than a flash.
  useEffect(() => {
    const startedAt = Date.now()
    const MIN_VISIBLE = 700

    function finishTransition() {
      const elapsed = Date.now() - startedAt
      const delay = Math.max(0, MIN_VISIBLE - elapsed)
      setTimeout(() => setLoaded(true), delay)
    }

    const iframe = iframeRef.current
    if (!iframe) return

    // If already loaded by the time the effect runs, finish immediately
    if (iframe.contentWindow && iframe.dataset.loadedOnce) {
      finishTransition()
      return
    }

    function onLoad() {
      if (iframe) iframe.dataset.loadedOnce = 'true'
      finishTransition()
    }
    iframe.addEventListener('load', onLoad)

    // Safety net: no matter what, dismiss the transition after 6 seconds.
    // If the game never loads, the user still sees something instead of
    // being stuck on a loading screen forever.
    const safetyTimer = setTimeout(finishTransition, 6000)

    return () => {
      iframe.removeEventListener('load', onLoad)
      clearTimeout(safetyTimer)
    }
  }, [])

  // Close on Escape
  useEffect(() => {
    function onKey(evt) {
      if (evt.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <section className="mahjong-screen" aria-label={getTranslation(language, 'mahjong.title')}>
      <button
        type="button"
        className="mahjong-close"
        onClick={onClose}
        aria-label={getTranslation(language, 'mahjong.close')}
        title={getTranslation(language, 'mahjong.close')}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
        </svg>
      </button>

      <iframe
        ref={iframeRef}
        className={'mahjong-iframe' + (loaded ? ' mahjong-iframe-loaded' : '')}
        src={MAHJONG_GAME_URL}
        title={getTranslation(language, 'mahjong.title')}
        allow="fullscreen"
      />

      {!loaded && (
        <div className="mahjong-transition" aria-live="polite">
          <div className="mahjong-transition-inner">
            <div className="mahjong-transition-spinner" aria-hidden="true" />
            <p className="mahjong-transition-text">
              {getTranslation(language, 'mahjong.loading')}
            </p>
          </div>
        </div>
      )}
    </section>
  )
}
