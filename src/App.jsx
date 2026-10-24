import { useEffect, useState } from 'react'
import './App.css'
import { getTranslation } from './i18n/getTranslation.js'
import { applyDocumentLanguage, getInitialLanguage, persistLanguage } from './i18n/language.js'
import { AppShell } from './components/AppShell.jsx'
import { WelcomeScreen } from './screens/WelcomeScreen.jsx'
import { ScannerScreen } from './screens/ScannerScreen.jsx'
import { ScanResultScreen } from './screens/ScanResultScreen.jsx'
import { ExhibitScreen } from './screens/ExhibitScreen.jsx'
import { AdminScreen } from './screens/AdminScreen.jsx'
import { ScanProgress } from './components/ScanProgress.jsx'
import { exhibits } from './data/exhibits.js'
import { addScannedExhibitId, loadScannedExhibitIds, saveScannedExhibitIds } from './lib/scanProgress.js'

function App() {
  const [language, setLanguage] = useState(getInitialLanguage)
  const [screen, setScreen] = useState('welcome')
  const [selectedExhibit, setSelectedExhibit] = useState(null)
  const [scannedExhibitIds, setScannedExhibitIds] = useState(() => loadScannedExhibitIds(exhibits.map((exhibit) => exhibit.id)))

  useEffect(() => {
    applyDocumentLanguage(language)
  }, [language])

  function handleLanguageChange(next) {
    if (next === language) return
    setLanguage(next)
    persistLanguage(next)
  }

  function handleStartExploring() {
    setScreen('scanner')
  }

  function handleStartAdmin() {
    setScreen('admin')
  }

  function handleBackToWelcome() {
    setSelectedExhibit(null)
    setScreen('welcome')
  }

  function handleExhibitDetected(exhibit) {
    setScannedExhibitIds((current) => {
      const next = addScannedExhibitId(current, exhibit.id)
      saveScannedExhibitIds(next)
      return next
    })
    setSelectedExhibit(exhibit)
    setScreen('scan-result')
  }

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
            : screen === 'scanner' || screen === 'admin'
              ? handleBackToWelcome
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
      {screen === 'scanner' && (
        <ScannerScreen language={language} onReturnHome={handleBackToWelcome} onExhibitDetected={handleExhibitDetected} />
      )}
      {screen === 'scan-result' && selectedExhibit && (
        <ScanResultScreen language={language} exhibit={selectedExhibit} onViewDetails={handleViewDetails} onScanAgain={handleScanAgain} />
      )}
      {screen === 'exhibit' && selectedExhibit && (
        <ExhibitScreen
          key={selectedExhibit.id + '-' + language}
          language={language}
          exhibit={selectedExhibit}
          onBackToResult={handleBackToResult}
          onScanNext={handleScanAgain}
        />
      )}
      {screen === 'admin' && <AdminScreen onBack={handleBackToWelcome} />}
      
      <ScanProgress language={language} scanned={scannedExhibitIds.length} total={exhibits.length} />
    </AppShell>
  )
}

export default App
