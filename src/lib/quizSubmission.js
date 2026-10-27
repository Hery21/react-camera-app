import { quizConfig } from '../config/quizConfig.js'

export async function submitQuizResponse(payload) {
  if (!quizConfig.endpoint) {
    throw new Error('Quiz submission is not yet configured. Set quizConfig.endpoint in src/config/quizConfig.js.')
  }

  if (quizConfig.mode === 'form') {
    const params = new URLSearchParams()
    for (const answer of payload.answers) {
      const field = quizConfig.formFields[answer.questionId]
      if (field) params.append(field, answer.optionId)
    }
    if (quizConfig.formFields.session) {
      params.append(quizConfig.formFields.session, payload.sessionId)
    }
    if (quizConfig.formFields.timestamp) {
      params.append(quizConfig.formFields.timestamp, payload.submittedAt)
    }
    await fetch(quizConfig.endpoint, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    })
    return
  }

  const res = await fetch(quizConfig.endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    throw new Error('Submission failed with status ' + res.status)
  }
}
