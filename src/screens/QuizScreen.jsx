import { useState } from 'react'
import { getTranslation } from '../i18n/getTranslation.js'
import { decorativeAssets } from '../data/decorativeAssets.js'
import { quizQuestions } from '../data/quizQuestions.js'
import { submitQuizResponse } from '../lib/quizSubmission.js'

function generateSessionId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
  return 'session-' + Date.now() + '-' + Math.random().toString(36).slice(2, 10)
}

export function QuizScreen({ language, onDone }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [sessionId] = useState(generateSessionId)
  const [status, setStatus] = useState('question')
  const [errorMessage, setErrorMessage] = useState('')

  const question = quizQuestions[currentIndex]
  const isLast = currentIndex === quizQuestions.length - 1
  const currentAnswer = answers[question.id]
  const hasAnswer = Boolean(currentAnswer)
  const allAnswered = quizQuestions.every((q) => answers[q.id])

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
    try {
      await submitQuizResponse({
        sessionId,
        language,
        submittedAt: new Date().toISOString(),
        answers: quizQuestions.map((q) => ({ questionId: q.id, optionId: answers[q.id] })),
      })
      setStatus('success')
    } catch (err) {
      setErrorMessage(err && err.message ? err.message : String(err))
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <section className="quiz-screen quiz-screen-success" aria-labelledby="quiz-thanks-title">
        <div className="quiz-card">
          <img src={decorativeAssets.article.crown} alt="" className="quiz-crown" aria-hidden="true" />
          <h1 id="quiz-thanks-title" className="quiz-success-title">
            {getTranslation(language, 'quiz.thanksTitle')}
          </h1>
          <p className="quiz-success-body">{getTranslation(language, 'quiz.thanksBody')}</p>
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
          <h1 id="quiz-error-title" className="quiz-error-title">
            {getTranslation(language, 'quiz.errorTitle')}
          </h1>
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
        <p className="quiz-status" role="status">
          {getTranslation(language, 'quiz.submitting')}
        </p>
      </section>
    )
  }

  const questionText = question.question[language] || question.question.en
  const progressLabel = getTranslation(language, 'quiz.questionProgress')
    .replace('{current}', String(currentIndex + 1))
    .replace('{total}', String(quizQuestions.length))

  return (
    <section className="quiz-screen" aria-labelledby="quiz-question-heading">
      <img src={decorativeAssets.article.crown} alt="" className="quiz-crown" aria-hidden="true" />

      <div className="quiz-card">
        <p className="quiz-progress-label">{progressLabel}</p>

        <img src={decorativeAssets.article.divider} alt="" className="quiz-divider" aria-hidden="true" />

        <h2 id="quiz-question-heading" className="quiz-question-text">
          {questionText}
        </h2>

        <div className="quiz-options" role="group" aria-label={questionText}>
          {question.options.map((option) => {
            const optionText = option.text[language] || option.text.en
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
            <button
              type="button"
              className="quiz-button quiz-button-primary"
              onClick={handleNext}
              disabled={!hasAnswer}
            >
              {getTranslation(language, 'quiz.next')}
            </button>
          )}
          {isLast && (
            <button
              type="button"
              className="quiz-button quiz-button-primary"
              onClick={handleSubmit}
              disabled={!allAnswered}
            >
              {getTranslation(language, 'quiz.submit')}
            </button>
          )}
        </div>
      </div>

      <img src={decorativeAssets.article.floralBottom} alt="" className="quiz-floral-bottom" aria-hidden="true" />
    </section>
  )
}
