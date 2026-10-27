import { quizQuestions } from '../src/data/quizQuestions.js'
import { quizConfig } from '../src/config/quizConfig.js'

let failed = 0

function check(label, condition, detail) {
  if (condition) {
    console.log('OK  ' + label)
    return
  }
  failed += 1
  console.error('FAIL ' + label + (detail ? ' — ' + detail : ''))
}

check('quizQuestions has exactly 5 questions', quizQuestions.length === 5, 'got ' + quizQuestions.length)

const questionIds = new Set()
for (const q of quizQuestions) {
  check('question ' + q.id + ' id is unique', !questionIds.has(q.id))
  questionIds.add(q.id)
  for (const lang of ['id', 'en', 'zh']) {
    check('question ' + q.id + ' has ' + lang + ' text', typeof q.question?.[lang] === 'string' && q.question[lang].length > 0)
  }
  check('question ' + q.id + ' has 4 options', Array.isArray(q.options) && q.options.length === 4)
  check('question ' + q.id + ' has correctOptionId', typeof q.correctOptionId === 'string')
  const optionIds = new Set()
  for (const opt of q.options || []) {
    check('question ' + q.id + ' option ' + opt.id + ' is unique', !optionIds.has(opt.id))
    optionIds.add(opt.id)
    for (const lang of ['id', 'en', 'zh']) {
      check('question ' + q.id + ' option ' + opt.id + ' has ' + lang + ' text', typeof opt.text?.[lang] === 'string' && opt.text[lang].length > 0)
    }
  }
  check(
    'question ' + q.id + ' correctOptionId exists among options',
    optionIds.has(q.correctOptionId),
    'correctOptionId ' + q.correctOptionId + ' not in [' + Array.from(optionIds).join(',') + ']',
  )
}

const q4 = quizQuestions.find((q) => q.id === 'Q4')
check('Q4 has image reference', q4 && typeof q4.image === 'string' && q4.image.length > 0)
check('Q4 image is PSBIKT-009 cover', q4 && q4.image === '/images/exhibits/PSBIKT-009/cover.webp')

check('quizConfig.pointsPerQuestion is positive', typeof quizConfig.pointsPerQuestion === 'number' && quizConfig.pointsPerQuestion > 0)

if (failed > 0) {
  console.error('\n' + failed + ' check(s) failed')
  process.exit(1)
}
console.log('\nAll quiz self-checks passed')
