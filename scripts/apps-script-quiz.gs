// Paste this entire file into Google Apps Script (Extensions > Apps Script).
//
// Sheet tabs required:
//   "Response From Web" - receives every submission (headers in row 1)
//   "Winners"           - rebuilt by rebuildWinners()
//
// Deploy:
//   Deploy > New deployment > Web app
//     Execute as: Me
//     Who has access: Anyone
//   Copy the /exec URL into src/config/quizConfig.js endpoint.

const RESPONSES_SHEET = 'Response From Web'
const WINNERS_SHEET = 'Winners'

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

// Rebuilds the Winners sheet.
// Rule: only submissions where Correct === Total (perfect score), sorted by
// submission Timestamp ascending (earliest first), top 10. If fewer than 10
// people achieved a perfect score, only those people appear.
function rebuildWinners() {
  const ss = SpreadsheetApp.getActiveSpreadsheet()
  const resp = ss.getSheetByName(RESPONSES_SHEET)
  if (!resp) throw new Error('Sheet "' + RESPONSES_SHEET + '" does not exist')

  let winners = ss.getSheetByName(WINNERS_SHEET)
  if (!winners) {
    winners = ss.insertSheet(WINNERS_SHEET)
  } else {
    winners.clear()
  }

  const values = resp.getDataRange().getValues()
  if (values.length < 2) {
    winners.appendRow(['No responses yet'])
    return
  }

  const headers = values[0]
  const correctIdx = headers.indexOf('Correct')
  const totalIdx = headers.indexOf('Total')
  const timestampIdx = headers.indexOf('Timestamp')

  const eligible = values.slice(1).filter(function (row) {
    const correct = Number(row[correctIdx])
    const total = Number(row[totalIdx])
    return correct > 0 && correct === total
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
