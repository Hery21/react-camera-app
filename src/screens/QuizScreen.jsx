import { useState } from 'react'
import { getTranslation } from '../i18n/getTranslation.js'
import { decorativeAssets } from '../data/decorativeAssets.js'
import { quizSets, getActiveQuizSet, getJakartaToday } from '../data/quizQuestions.js'
import { quizConfig } from '../config/quizConfig.js'
import { submitQuizResponse } from '../lib/quizSubmission.js'

function generateSessionId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
  return 'session-' + Date.now() + '-' + Math.random().toString(36).slice(2, 10)
}

function computeScore(questions, answers) {
  let correct = 0
  for (const q of questions) {
    if (answers[q.id] === q.correctOptionId) correct += 1
  }
  return { correct, score: correct * quizConfig.pointsPerQuestion }
}

function resolveActiveSet() {
  if (quizConfig.forceDay) {
    const forced = quizSets.find((s) => s.id === quizConfig.forceDay)
    if (forced) return forced
  }
  return getActiveQuizSet(getJakartaToday())
}

export function QuizScreen({ language, onDone }) {
  const [activeSet] = useState(resolveActiveSet)
  const quizQuestions = activeSet.questions
  const quizTitle = activeSet.title
  const quizId = activeSet.id

  const [phase, setPhase] = useState('identity')
  const [identity, setIdentity] = useState({ namaAsli: '', unit: '', instagram: '' })
  const [identityError, setIdentityError] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [sessionId] = useState(generateSessionId)
  const [quizStartedAt, setQuizStartedAt] = useState(null)
  const [status, setStatus] = useState('question')
  const [errorMessage, setErrorMessage] = useState('')
  const [finalResult, setFinalResult] = useState(null)

  const question = quizQuestions[currentIndex]
  const isLast = currentIndex === quizQuestions.length - 1
  const currentAnswer = answers[question?.id]
  const hasAnswer = Boolean(currentAnswer)
  const allAnswered = quizQuestions.every((q) => answers[q.id])

  function handleIdentitySubmit(e) {
    e.preventDefault()
    const namaAsli = identity.namaAsli.trim()
    const unit = identity.unit.trim()
    const instagram = identity.instagram.trim()
    if (!namaAsli || !unit || !instagram) {
      setIdentityError(getTranslation(language, 'quiz.identityRequired'))
      return
    }
    setIdentity({ namaAsli, unit, instagram })
    setIdentityError('')
    setQuizStartedAt(Date.now())
    setPhase('quiz')
  }

  function handleSelect(optionId) {
    setAnswers((prev) => ({ ...prev, [question.id]: optionId }))
  }

  function handlePrev() {
    if (currentIndex > 0) setCurrentIndex((i) => i - 1)
  }

  function handleNext() {
    if (!hasAnswer) return
    if (!isLast) setCurrentIndex((i) => i + 1)
  }

  async function handleSubmit() {
    if (!allAnswered) return
    setStatus('submitting')
    setErrorMessage('')
    const { correct, score } = computeScore(quizQuestions, answers)
    setFinalResult({ correct, score, total: quizQuestions.length * quizConfig.pointsPerQuestion })

    const now = Date.now()
    const submittedAt = new Date(now).toISOString()
    const startedAt = quizStartedAt ? new Date(quizStartedAt).toISOString() : submittedAt
    const durationMs = quizStartedAt ? now - quizStartedAt : 0

    try {
      await submitQuizResponse({
        sessionId,
        language,
        startedAt,
        submittedAt,
        durationMs,
        quizId,
        quizTitle,
        identity,
        answers: quizQuestions.map((q) => ({ questionId: q.id, optionId: answers[q.id] })),
        score,
        correctCount: correct,
        totalQuestions: quizQuestions.length,
      })
      setStatus('success')
    } catch (err) {
      setErrorMessage(err && err.message ? err.message : String(err))
      setStatus('error')
    }
  }

  if (phase === 'identity') {
    return (
      <section className="quiz-screen quiz-screen-identity" aria-labelledby="quiz-identity-title">
        <img src={decorativeAssets.article.crown} alt="" className="quiz-crown" aria-hidden="true" />

        <form className="quiz-card" onSubmit={handleIdentitySubmit}>
          <h1 id="quiz-identity-title" className="quiz-main-title">{quizTitle}</h1>
          <p className="quiz-identity-subtitle">{getTranslation(language, 'quiz.identityTitle')}</p>

          <img src={decorativeAssets.article.divider} alt="" className="quiz-divider" aria-hidden="true" />

          <label className="quiz-identity-field">
            <span className="quiz-identity-label">{getTranslation(language, 'quiz.identityName')}</span>
            <input type="text" value={identity.namaAsli} onChange={(e) => setIdentity({ ...identity, namaAsli: e.target.value })} autoComplete="name" required />
          </label>

          <label className="quiz-identity-field">
            <span className="quiz-identity-label">{getTranslation(language, 'quiz.identityUnit')}</span>
            <input type="text" value={identity.unit} onChange={(e) => setIdentity({ ...identity, unit: e.target.value })} required />
          </label>

          <label className="quiz-identity-field">
            <span className="quiz-identity-label">{getTranslation(language, 'quiz.identityInstagram')}</span>
            <input type="text" value={identity.instagram} onChange={(e) => setIdentity({ ...identity, instagram: e.target.value })} autoComplete="off" required />
          </label>

          {identityError && <p className="quiz-identity-error" role="status">{identityError}</p>}

          <button type="submit" className="quiz-button quiz-button-primary">
            {getTranslation(language, 'quiz.identityStart')}
          </button>
        </form>

        <img src={decorativeAssets.article.floralBottom} alt="" className="quiz-floral-bottom" aria-hidden="true" />
      </section>
    )
  }

  if (status === 'success') {
    return (
      <section className="quiz-screen quiz-screen-success" aria-labelledby="quiz-thanks-title">
        <div className="quiz-card">
          <img src={decorativeAssets.article.crown} alt="" className="quiz-crown" aria-hidden="true" />
          <p className="quiz-thanks-eyebrow">{quizTitle}</p>
          <h1 id="quiz-thanks-title" className="quiz-success-title">{getTranslation(language, 'quiz.thanksTitle')}</h1>
          <p className="quiz-success-body">{getTranslation(language, 'quiz.thanksBody')}</p>
          {finalResult && (
            <p className="quiz-success-score">
              {getTranslation(language, 'quiz.scoreLabel')}: {finalResult.score} / {finalResult.total}
            </p>
          )}

          <div className="quiz-winners">
            <h2 className="quiz-winners-title">{getTranslation(language, 'quiz.winnersTitle')}</h2>
            <p className="quiz-winners-intro">{getTranslation(language, 'quiz.winnersIntro')}</p>
            <p className="quiz-winners-announcement">{getTranslation(language, 'quiz.winnersAnnouncement')}</p>
            <h3 className="quiz-winners-req-title">{getTranslation(language, 'quiz.winnersRequirementsTitle')}</h3>
            <ol className="quiz-winners-req-list">
              <li>{getTranslation(language, 'quiz.winnersRequirement1')}</li>
              <li>{getTranslation(language, 'quiz.winnersRequirement2')}</li>
              <li>{getTranslation(language, 'quiz.winnersRequirement3')}</li>
            </ol>
            <p className="quiz-winners-prize">{getTranslation(language, 'quiz.winnersPrizeNote')}</p>
          </div>

          <button type="button" className="quiz-button quiz-button-primary" onClick={onDone}>
            {getTranslation(language, 'quiz.backToMenu')}
          </button>
        </div>
      </section>
    )
  }

  if (status === 'error') {
    return (
      <section className="quiz-screen quiz-screen-error" aria-labelledby="quiz-error-title">
        <div className="quiz-card">
          <h1 id="quiz-error-title" className="quiz-error-title">{getTranslation(language, 'quiz.errorTitle')}</h1>
          <p className="quiz-error-body">{getTranslation(language, 'quiz.errorBody')}</p>
          <p className="quiz-error-detail">{errorMessage}</p>
          <div className="quiz-error-actions">
            <button type="button" className="quiz-button quiz-button-primary" onClick={handleSubmit}>
              {getTranslation(language, 'quiz.retry')}
            </button>
            <button type="button" className="quiz-button quiz-button-secondary" onClick={onDone}>
              {getTranslation(language, 'quiz.backToMenu')}
            </button>
          </div>
        </div>
      </section>
    )
  }

  if (status === 'submitting') {
    return (
      <section className="quiz-screen quiz-screen-submitting">
        <p className="quiz-status" role="status">{getTranslation(language, 'quiz.submitting')}</p>
      </section>
    )
  }

  const questionText = question.question[language] || question.question.id || question.question.en
  const progressLabel = getTranslation(language, 'quiz.questionProgress')
    .replace('{current}', String(currentIndex + 1))
    .replace('{total}', String(quizQuestions.length))

  return (
    <section className="quiz-screen" aria-labelledby="quiz-question-heading">
      <img src={decorativeAssets.article.crown} alt="" className="quiz-crown" aria-hidden="true" />

      <div className="quiz-card">
        <p className="quiz-progress-label">{quizTitle} · {progressLabel}</p>

        <img src={decorativeAssets.article.divider} alt="" className="quiz-divider" aria-hidden="true" />

        {question.image && <img src={question.image} alt="" className="quiz-question-image" />}

        <h2 id="quiz-question-heading" className="quiz-question-text">{questionText}</h2>

        <div className="quiz-options" role="group" aria-label={questionText}>
          {question.options.map((option) => {
            const optionText = option.text[language] || option.text.id || option.text.en
            const selected = currentAnswer === option.id
            return (
              <button
                key={option.id}
                type="button"
                className={'quiz-option' + (selected ? ' quiz-option-selected' : '')}
                onClick={() => handleSelect(option.id)}
                aria-pressed={selected}
              >
                <span className="quiz-option-letter">{option.id}</span>
                <span className="quiz-option-text">{optionText}</span>
              </button>
            )
          })}
        </div>

        <div className="quiz-actions">
          {currentIndex > 0 && (
            <button type="button" className="quiz-button quiz-button-secondary" onClick={handlePrev}>
              {getTranslation(language, 'quiz.prev')}
            </button>
          )}
          {!isLast && (
            <button type="button" className="quiz-button quiz-button-primary" onClick={handleNext} disabled={!hasAnswer}>
              {getTranslation(language, 'quiz.next')}
            </button>
          )}
          {isLast && (
            <button type="button" className="quiz-button quiz-button-primary" onClick={handleSubmit} disabled={!allAnswered}>
              {getTranslation(language, 'quiz.submit')}
            </button>
          )}
        </div>
      </div>

      <img src={decorativeAssets.article.floralBottom} alt="" className="quiz-floral-bottom" aria-hidden="true" />
    </section>
  )
}
