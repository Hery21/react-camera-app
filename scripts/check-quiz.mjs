import { quizSets, getActiveQuizSet, getJakartaToday } from '../src/data/quizQuestions.js'
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

check('quizSets has exactly 3 sets', quizSets.length === 3, 'got ' + quizSets.length)

for (const set of quizSets) {
  check(set.id + ' has date in YYYY-MM-DD format', /^\d{4}-\d{2}-\d{2}$/.test(set.date), 'got ' + set.date)
  check(set.id + ' has title', typeof set.title === 'string' && set.title.length > 0)
  check(set.id + ' has exactly 5 questions', set.questions.length === 5, 'got ' + set.questions.length)

  const questionIds = new Set()
  for (const q of set.questions) {
    check(set.id + ' ' + q.id + ' id unique', !questionIds.has(q.id))
    questionIds.add(q.id)
    for (const lang of ['id', 'en', 'zh']) {
      check(set.id + ' ' + q.id + ' has ' + lang + ' text', typeof q.question?.[lang] === 'string' && q.question[lang].length > 0)
    }
    check(set.id + ' ' + q.id + ' has 4 options', Array.isArray(q.options) && q.options.length === 4)
    check(set.id + ' ' + q.id + ' has correctOptionId', typeof q.correctOptionId === 'string')
    const optionIds = new Set()
    for (const opt of q.options || []) {
      check(set.id + ' ' + q.id + ' option ' + opt.id + ' unique', !optionIds.has(opt.id))
      optionIds.add(opt.id)
      for (const lang of ['id', 'en', 'zh']) {
        check(set.id + ' ' + q.id + ' option ' + opt.id + ' has ' + lang, typeof opt.text?.[lang] === 'string' && opt.text[lang].length > 0)
      }
    }
    check(set.id + ' ' + q.id + ' correctOptionId exists', optionIds.has(q.correctOptionId), 'correctOptionId ' + q.correctOptionId)
  }
}

const day1 = quizSets.find((s) => s.id === 'day1')
const day1Q4 = day1 && day1.questions.find((q) => q.id === 'Q4')
check('Day 1 Q4 image is PSBIKT-009', day1Q4 && day1Q4.image === '/images/exhibits/PSBIKT-009/cover.webp')

const day3 = quizSets.find((s) => s.id === 'day3')
const day3Q4 = day3 && day3.questions.find((q) => q.id === 'Q4')
check('Day 3 Q4 image is PSBIKT-001', day3Q4 && day3Q4.image === '/images/exhibits/PSBIKT-001/cover.webp')

check('getJakartaToday returns YYYY-MM-DD', /^\d{4}-\d{2}-\d{2}$/.test(getJakartaToday()), 'got ' + getJakartaToday())

const onDay1 = getActiveQuizSet('2026-10-27')
check('2026-10-27 resolves to day1', onDay1 && onDay1.id === 'day1', 'got ' + (onDay1 && onDay1.id))
const onDay2 = getActiveQuizSet('2026-10-28')
check('2026-10-28 resolves to day2', onDay2 && onDay2.id === 'day2', 'got ' + (onDay2 && onDay2.id))
const onDay3 = getActiveQuizSet('2026-10-29')
check('2026-10-29 resolves to day3', onDay3 && onDay3.id === 'day3', 'got ' + (onDay3 && onDay3.id))
const beforeDay1 = getActiveQuizSet('2026-10-20')
check('Before Day 1 falls back to day1', beforeDay1 && beforeDay1.id === 'day1', 'got ' + (beforeDay1 && beforeDay1.id))
const afterDay3 = getActiveQuizSet('2026-11-05')
check('After Day 3 falls back to day3', afterDay3 && afterDay3.id === 'day3', 'got ' + (afterDay3 && afterDay3.id))

check('quizConfig.pointsPerQuestion is positive', typeof quizConfig.pointsPerQuestion === 'number' && quizConfig.pointsPerQuestion > 0)
check('quizConfig.forceDay is null or a valid id', quizConfig.forceDay === null || ['day1', 'day2', 'day3'].includes(quizConfig.forceDay))

if (failed > 0) {
  console.error('\n' + failed + ' check(s) failed')
  process.exit(1)
}
console.log('\nAll quiz self-checks passed')
