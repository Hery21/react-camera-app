import { useEffect, useState } from 'react'

function getFullscreenElement() {
  if (typeof document === 'undefined') return null
  return (
    document.fullscreenElement ||
    document.webkitFullscreenElement ||
    document.mozFullScreenElement ||
    document.msFullscreenElement ||
    null
  )
}

function isFullscreenSupported() {
  if (typeof document === 'undefined') return false
  // iPhone Safari: document.fullscreenEnabled is false/undefined for all iOS
  // versions. Fullscreen API on arbitrary elements is genuinely unavailable.
  // Only <video>.webkitEnterFullscreen() works, which is not what we need.
  // The button therefore does not render on iPhone at all.
  return Boolean(
    document.fullscreenEnabled ||
      document.webkitFullscreenEnabled ||
      document.mozFullScreenEnabled ||
      document.msFullscreenEnabled,
  )
}

export function FullscreenToggle() {
  const [supported] = useState(isFullscreenSupported)
  const [isFullscreen, setIsFullscreen] = useState(() => Boolean(getFullscreenElement()))

  useEffect(() => {
    function handleChange() {
      setIsFullscreen(Boolean(getFullscreenElement()))
    }
    document.addEventListener('fullscreenchange', handleChange)
    document.addEventListener('webkitfullscreenchange', handleChange)
    document.addEventListener('mozfullscreenchange', handleChange)
    document.addEventListener('MSFullscreenChange', handleChange)
    return () => {
      document.removeEventListener('fullscreenchange', handleChange)
      document.removeEventListener('webkitfullscreenchange', handleChange)
      document.removeEventListener('mozfullscreenchange', handleChange)
      document.removeEventListener('MSFullscreenChange', handleChange)
    }
  }, [])

  if (!supported) return null

  async function toggle() {
    const root = document.documentElement
    try {
      if (getFullscreenElement()) {
        if (document.exitFullscreen) await document.exitFullscreen()
        else if (document.webkitExitFullscreen) document.webkitExitFullscreen()
        else if (document.mozCancelFullScreen) document.mozCancelFullScreen()
        else if (document.msExitFullscreen) document.msExitFullscreen()
      } else {
        if (root.requestFullscreen) await root.requestFullscreen()
        else if (root.webkitRequestFullscreen) root.webkitRequestFullscreen()
        else if (root.mozRequestFullScreen) root.mozRequestFullScreen()
        else if (root.msRequestFullscreen) root.msRequestFullscreen()
      }
    } catch {
      // Some browsers throw on user-gesture-token expiry; the fullscreenchange
      // listener corrects any drift between state and reality.
    }
  }

  const label = isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'

  return (
    <button
      type="button"
      className="utility-btn fullscreen-toggle"
      onClick={toggle}
      aria-label={label}
      title={label}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        {isFullscreen ? (
          <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z" />
        ) : (
          <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
        )}
      </svg>
    </button>
  )
}
