import { useEffect, useState } from 'react'
import './App.css'
import {
  applyDocumentLanguage,
  getInitialLanguage,
  persistLanguage,
} from './i18n/language.js'
import { AppShell } from './components/AppShell.jsx'
import { WelcomeScreen } from './screens/WelcomeScreen.jsx'
import { ScannerScreen } from './screens/ScannerScreen.jsx'

function App() {
  const [language, setLanguage] = useState(getInitialLanguage)
  const [screen, setScreen] = useState('welcome')

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
    setScreen('welcome')
  }

  return (
    <AppShell
      language={language}
      onLanguageChange={handleLanguageChange}
      screen={screen}
      onBack={screen === 'scanner' ? handleBackToWelcome : undefined}
    >
      {screen === 'welcome' ? (
        <WelcomeScreen language={language} onStart={handleStartExploring} />
      ) : (
        <ScannerScreen language={language} onReturnHome={handleBackToWelcome} />
      )}
    </AppShell>
  )
}

export default App
