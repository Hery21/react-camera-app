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

check('quizQuestions is a non-empty array', Array.isArray(quizQuestions) && quizQuestions.length > 0)

const questionIds = new Set()
for (const q of quizQuestions) {
  check('question ' + q.id + ' has id', typeof q.id === 'string' && q.id.length > 0)
  check('question ' + q.id + ' id is unique', !questionIds.has(q.id))
  questionIds.add(q.id)

  for (const lang of ['en', 'id', 'zh']) {
    check('question ' + q.id + ' has ' + lang + ' text', typeof q.question?.[lang] === 'string' && q.question[lang].length > 0)
  }

  check('question ' + q.id + ' has options', Array.isArray(q.options) && q.options.length >= 2)

  const optionIds = new Set()
  for (const opt of q.options || []) {
    check('question ' + q.id + ' option ' + opt.id + ' has id', typeof opt.id === 'string' && opt.id.length > 0)
    check('question ' + q.id + ' option ' + opt.id + ' id is unique within question', !optionIds.has(opt.id))
    optionIds.add(opt.id)

    for (const lang of ['en', 'id', 'zh']) {
      check('question ' + q.id + ' option ' + opt.id + ' has ' + lang + ' text', typeof opt.text?.[lang] === 'string' && opt.text[lang].length > 0)
    }
  }
}

check('quizConfig.endpoint is a string', typeof quizConfig.endpoint === 'string')
check('quizConfig.mode is json or form', quizConfig.mode === 'json' || quizConfig.mode === 'form')

if (failed > 0) {
  console.error('\n' + failed + ' check(s) failed')
  process.exit(1)
}
console.log('\nAll quiz self-checks passed')
