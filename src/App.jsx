import { useEffect, useState } from 'react'
import './App.css'
import { applyDocumentLanguage, getInitialLanguage, persistLanguage } from './i18n/language.js'
import { AppShell } from './components/AppShell.jsx'
import { WelcomeScreen } from './screens/WelcomeScreen.jsx'
import { ScannerScreen } from './screens/ScannerScreen.jsx'
import { ScanResultScreen } from './screens/ScanResultScreen.jsx'
import { ExhibitScreen } from './screens/ExhibitScreen.jsx'

function App() {
  const [language, setLanguage] = useState(getInitialLanguage)
  const [screen, setScreen] = useState('welcome')
  const [selectedExhibit, setSelectedExhibit] = useState(null)

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

  function handleBackToWelcome() {
    setSelectedExhibit(null)
    setScreen('welcome')
  }

  function handleExhibitDetected(exhibit) {
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

  function handleScanNext() {
    setSelectedExhibit(null)
    setScreen('scanner')
  }

  return (
    <AppShell
      language={language}
      onLanguageChange={handleLanguageChange}
      screen={screen}
      onBack={
        screen === 'exhibit' ? handleBackToResult : screen === 'scanner' || screen === 'scan-result' ? handleBackToWelcome : undefined
      }
    >
      {screen === 'welcome' && <WelcomeScreen language={language} onStart={handleStartExploring} />}
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

          onScanNext={handleScanNext}
        />
      )}
    </AppShell>
  )
}

export default App
