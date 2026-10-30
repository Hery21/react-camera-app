import { useCallback, useEffect, useState } from 'react'
import './App.css'
import { getTranslation } from './i18n/getTranslation.js'
import { applyDocumentLanguage, getInitialLanguage, persistLanguage } from './i18n/language.js'
import { AppShell } from './components/AppShell.jsx'
import { WelcomeScreen } from './screens/WelcomeScreen.jsx'
import { MenuScreen } from './screens/MenuScreen.jsx'
import { ScannerScreen } from './screens/ScannerScreen.jsx'
import { ScanResultScreen } from './screens/ScanResultScreen.jsx'
import { ExhibitScreen } from './screens/ExhibitScreen.jsx'
import { AdminScreen } from './screens/AdminScreen.jsx'
import { QuizScreen } from './screens/QuizScreen.jsx'
import { TwibbonPhotoScreen } from './screens/TwibbonPhotoScreen.jsx'
import { MahjongModal } from './components/MahjongModal.jsx'
import { ScanProgress } from './components/ScanProgress.jsx'
import { exhibits } from './data/exhibits.js'
import { addScannedExhibitId, loadScannedExhibitIds, saveScannedExhibitIds } from './lib/scanProgress.js'
import { parseQrPayload } from './lib/qrPayload.js'
import { getExhibitById } from './lib/exhibitLookup.js'

// Reads ?exhibit=PSBIKT-NNN from the current URL and returns the exhibit
// record if the value parses to a known exhibit ID. Used to deep-link from
// reprint QR codes that encode full URLs — the visitor scans with their
// phone camera, the browser opens the app at this URL, and App lands on the
// Scan Result screen directly for that exhibit.
function getDeepLinkExhibit() {
  if (typeof window === 'undefined') return null
  const params = new URLSearchParams(window.location.search)
  const param = params.get('exhibit')
  if (!param) return null
  const parsed = parseQrPayload(param)
  if (!parsed.ok) return null
  const lookup = getExhibitById(parsed.exhibitId)
  return lookup.ok ? lookup.exhibit : null
}

function App() {
  // Computed once on mount. All deep-link-derived state is initialized from
  // this value below, so no effect needs to call setState on mount.
  const [deepLinkExhibit] = useState(() => getDeepLinkExhibit())
  const [language, setLanguage] = useState(getInitialLanguage)
  const [selectedExhibit, setSelectedExhibit] = useState(deepLinkExhibit)
  const [screen, setScreen] = useState(deepLinkExhibit ? 'scan-result' : 'welcome')
  const [adminEditingExhibitId, setAdminEditingExhibitId] = useState(null)
  const [scannedExhibitIds, setScannedExhibitIds] = useState(() => {
    const loaded = loadScannedExhibitIds(exhibits.map((exhibit) => exhibit.id))
    if (!deepLinkExhibit) return loaded
    const next = addScannedExhibitId(loaded, deepLinkExhibit.id)
    saveScannedExhibitIds(next)
    return next
  })

  useEffect(() => {
    applyDocumentLanguage(language)
  }, [language])

  // Strip the ?exhibit query param on mount so a reload lands on Welcome
  // instead of re-triggering the deep link. No setState here — the deep-link
  // state was already initialized above, and sessionStorage was updated
  // inside the scannedExhibitIds initializer. This effect only touches the
  // browser's history entry, which is the correct use of an effect.
  useEffect(() => {
    if (typeof window === 'undefined') return
    const params = new URLSearchParams(window.location.search)
    if (params.has('exhibit')) {
      window.history.replaceState({}, '', window.location.pathname)
    }
  }, [])

  function handleLanguageChange(next) {
    if (next === language) return
    setLanguage(next)
    persistLanguage(next)
  }

  function handleStartExploring() {
    setScreen('menu')
  }

  function handleSelectTour() {
    setScreen('scanner')
  }

  function handleSelectPhoto() {
    setScreen('twibbon')
  }

  function handleStartAdmin() {
    setScreen('admin')
  }

  function handleSelectQuiz() {
    setScreen('quiz')
  }

  function handleSelectMahjong() {
    setScreen('mahjong')
  }

  function handleBackToWelcome() {
    setSelectedExhibit(null)
    setAdminEditingExhibitId(null)
    setScreen('welcome')
  }

  function handleBackToMenu() {
    setSelectedExhibit(null)
    setScreen('menu')
  }

  function handleMenuBack() {
    setScreen('welcome')
  }

  function handleAdminBack() {
    if (adminEditingExhibitId) {
      setAdminEditingExhibitId(null)
    } else {
      handleBackToWelcome()
    }
  }

  const handleExhibitDetected = useCallback((exhibit) => {
    setScannedExhibitIds((current) => {
      const next = addScannedExhibitId(current, exhibit.id)
      saveScannedExhibitIds(next)
      return next
    })
    setSelectedExhibit(exhibit)
    setScreen('scan-result')
  }, [])

  function handleScanAgain() {
    setSelectedExhibit(null)
    setScreen('scanner')
  }

  function handleViewDetails() {
    setScreen('exhibit')
  }

  function handleBackToResult() {
    setScreen('scan-result')
  }

  return (
    <AppShell
      language={language}
      onLanguageChange={handleLanguageChange}
      screen={screen}
      onBack={
        screen === 'exhibit'
          ? handleBackToResult
          : screen === 'scan-result'
            ? handleScanAgain
            : screen === 'scanner'
              ? handleBackToMenu
              : screen === 'menu'
                ? handleMenuBack
                : screen === 'admin'
                  ? handleAdminBack
                  : screen === 'twibbon'
                    ? handleBackToMenu
                    : screen === 'quiz'
                      ? handleBackToMenu
                      : undefined
      }
      backLabel={screen === 'exhibit' ? getTranslation(language, 'exhibit.backToInfo') : undefined}
    >
      {screen === 'welcome' && (
        <WelcomeScreen
          language={language}
          onStart={handleStartExploring}
          onStartAdmin={handleStartAdmin}
        />
      )}
      {screen === 'menu' && (
        <MenuScreen
          language={language}
          onSelectQuiz={handleSelectQuiz}
          onSelectTour={handleSelectTour}
          onSelectPhoto={handleSelectPhoto}
          onSelectMahjong={handleSelectMahjong}
        />
      )}
      {screen === 'scanner' && (
        <ScannerScreen language={language} onReturnHome={handleBackToWelcome} onExhibitDetected={handleExhibitDetected} />
      )}
      {screen === 'scan-result' && selectedExhibit && (
        <ScanResultScreen language={language} exhibit={selectedExhibit} onViewDetails={handleViewDetails} onScanAgain={handleScanAgain} />
      )}
      {screen === 'exhibit' && selectedExhibit && (
        <ExhibitScreen
          key={selectedExhibit.id}
          language={language}
          exhibit={selectedExhibit}
          onBackToResult={handleBackToResult}
        />
      )}
      {screen === 'admin' && (
        <AdminScreen
          editingExhibitId={adminEditingExhibitId}
          onEdit={setAdminEditingExhibitId}
          onDone={() => setAdminEditingExhibitId(null)}
          onBack={handleBackToWelcome}
        />
      )}
      {screen === 'twibbon' && <TwibbonPhotoScreen language={language} />}
      {screen === 'quiz' && <QuizScreen language={language} onDone={handleBackToMenu} />}
      {screen === 'mahjong' && (
        <MahjongModal language={language} onClose={handleBackToMenu} />
      )}

      <ScanProgress language={language} scanned={scannedExhibitIds.length} total={exhibits.length} />
    </AppShell>
  )
}

export default App
