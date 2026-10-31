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
import { TwibbonPhotoScreen } from './screens/TwibbonPhotoScreen.jsx'
import { MahjongModal } from './components/MahjongModal.jsx'
import { ScanProgress } from './components/ScanProgress.jsx'
import { exhibits } from './data/exhibits.js'
import { addScannedExhibitId, loadScannedExhibitIds, saveScannedExhibitIds } from './lib/scanProgress.js'
import { parseQrPayload } from './lib/qrPayload.js'
import { getExhibitById } from './lib/exhibitLookup.js'

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

  function handleSelectMahjong() {
    setScreen('mahjong')
  }

  function handleStartAdmin() {
    setScreen('admin')
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
                    : screen === 'mahjong'
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
      {screen === 'mahjong' && (
        <MahjongModal language={language} onClose={handleBackToMenu} />
      )}

      <ScanProgress language={language} scanned={scannedExhibitIds.length} total={exhibits.length} />
    </AppShell>
  )
}

export default App
