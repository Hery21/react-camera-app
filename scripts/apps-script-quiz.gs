// Paste this entire file into Google Apps Script (Extensions > Apps Script).
//
// Sheet tabs:
//   "Response From Web" - master, all submissions across all 3 days (19 cols)
//   "Day 1" / "Day 2" / "Day 3" - QUERY views (read-only, auto-filtered)
//   "Winners Day 1" / "Winners Day 2" / "Winners Day 3" - written by rebuildWinnersForDay
//
// Setup QUERY views (paste into cell A1 of each tab):
//   Day 1: =IFERROR(QUERY('Response From Web'!A1:S, "SELECT * WHERE R = 'day1'", 1), "No Day 1 responses yet")
//   Day 2: =IFERROR(QUERY('Response From Web'!A1:S, "SELECT * WHERE R = 'day2'", 1), "No Day 2 responses yet")
//   Day 3: =IFERROR(QUERY('Response From Web'!A1:S, "SELECT * WHERE R = 'day3'", 1), "No Day 3 responses yet")
//
// Deploy:
//   Deploy > New deployment > Web app
//     Execute as: Me, Who has access: Anyone
//   Copy /exec URL into src/config/quizConfig.js
//
// Run rebuildWinners:
//   Refresh the spreadsheet > "Quiz Tools" menu appears > click desired rebuild option.
//   Or from Apps Script editor > select rebuildAllWinners > Run.

const RESPONSES_SHEET = 'Response From Web'

const RESPONSE_HEADERS = [
  'Timestamp',
  'SessionId',
  'Language',
  'Nama Asli',
  'WD/SAP/Magang/Sekolah',
  'Username IG',
  'Q1',
  'Q2',
  'Q3',
  'Q4',
  'Q5',
  'Score',
  'Correct',
  'Total',
  'Started At',
  'Submitted At',
  'Duration (ms)',
  'QuizId',
  'QuizTitle',
]

const DAYS = [
  { id: 'day1', label: 'Day 1' },
  { id: 'day2', label: 'Day 2' },
  { id: 'day3', label: 'Day 3' },
]

function doPost(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet()
    let sheet = ss.getSheetByName(RESPONSES_SHEET)
    if (!sheet) {
      sheet = ss.insertSheet(RESPONSES_SHEET)
      sheet.appendRow(RESPONSE_HEADERS)
    }

    const payload = JSON.parse(e.postData.contents)
    const answers = payload.answers || []
    const answerMap = {}
    answers.forEach(function (a) { answerMap[a.questionId] = a.optionId })

    sheet.appendRow([
      new Date(),
      payload.sessionId || '',
      payload.language || '',
      (payload.identity && payload.identity.namaAsli) || '',
      (payload.identity && payload.identity.unit) || '',
      (payload.identity && payload.identity.instagram) || '',
      answerMap.Q1 || '',
      answerMap.Q2 || '',
      answerMap.Q3 || '',
      answerMap.Q4 || '',
      answerMap.Q5 || '',
      payload.score || 0,
      payload.correctCount || 0,
      payload.totalQuestions || 0,
      payload.startedAt || '',
      payload.submittedAt || '',
      payload.durationMs || 0,
      payload.quizId || 'day1',
      payload.quizTitle || 'Kuis Day 1',
    ])

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON)
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON)
  }
}

// Rebuilds the Winners sheet for a single day.
// Rule: only submissions where QuizId matches and Correct === Total,
// sorted by submission Timestamp ascending, top 10 (fewer if fewer).
function rebuildWinnersForDay(dayId, dayLabel) {
  const ss = SpreadsheetApp.getActiveSpreadsheet()
  const resp = ss.getSheetByName(RESPONSES_SHEET)
  if (!resp) throw new Error('Sheet "' + RESPONSES_SHEET + '" does not exist')

  const winnersSheetName = 'Winners ' + dayLabel
  let winners = ss.getSheetByName(winnersSheetName)
  if (!winners) {
    winners = ss.insertSheet(winnersSheetName)
  } else {
    winners.clear()
  }

  const values = resp.getDataRange().getValues()
  if (values.length < 2) {
    winners.appendRow(['No responses yet'])
    return
  }

  const headers = values[0]
  const quizIdIdx = headers.indexOf('QuizId')
  const correctIdx = headers.indexOf('Correct')
  const totalIdx = headers.indexOf('Total')
  const timestampIdx = headers.indexOf('Timestamp')

  const eligible = values.slice(1).filter(function (row) {
    const rowQuizId = String(row[quizIdIdx] || '')
    const correct = Number(row[correctIdx])
    const total = Number(row[totalIdx])
    return rowQuizId === dayId && correct > 0 && correct === total
  })

  eligible.sort(function (a, b) {
    const aTs = a[timestampIdx] ? new Date(a[timestampIdx]).getTime() : Infinity
    const bTs = b[timestampIdx] ? new Date(b[timestampIdx]).getTime() : Infinity
    return aTs - bTs
  })

  const top10 = eligible.slice(0, 10)

  winners.appendRow(headers)
  if (top10.length === 0) {
    winners.appendRow(['No perfect scores yet'])
  } else {
    top10.forEach(function (r) { winners.appendRow(r) })
  }
}

function rebuildAllWinners() {
  DAYS.forEach(function (day) {
    rebuildWinnersForDay(day.id, day.label)
  })
  SpreadsheetApp.getActiveSpreadsheet().toast('Winners rebuilt for all 3 days')
}

function rebuildDay1Winners() {
  rebuildWinnersForDay('day1', 'Day 1')
  SpreadsheetApp.getActiveSpreadsheet().toast('Day 1 winners rebuilt')
}

function rebuildDay2Winners() {
  rebuildWinnersForDay('day2', 'Day 2')
  SpreadsheetApp.getActiveSpreadsheet().toast('Day 2 winners rebuilt')
}

function rebuildDay3Winners() {
  rebuildWinnersForDay('day3', 'Day 3')
  SpreadsheetApp.getActiveSpreadsheet().toast('Day 3 winners rebuilt')
}

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Quiz Tools')
    .addItem('Rebuild All Winners', 'rebuildAllWinners')
    .addSeparator()
    .addItem('Rebuild Day 1 Winners', 'rebuildDay1Winners')
    .addItem('Rebuild Day 2 Winners', 'rebuildDay2Winners')
    .addItem('Rebuild Day 3 Winners', 'rebuildDay3Winners')
    .addToUi()
}
