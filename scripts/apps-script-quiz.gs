// Paste this ENTIRE file into Google Apps Script (Extensions > Apps Script)
// attached to your Google Sheet.
//
// Deploy:
//   Deploy > New deployment > Web app
//     Execute as: Me
//     Who has access: Anyone
//   Copy the /exec URL into src/config/quizConfig.js endpoint.
//
// Sheet tabs required:
//   "Response From Web" - receives every submission (headers in row 1)
//   "Winners"           - rebuilt by rebuildWinners(), sorted by score then timestamp
//
// After some submissions arrive, run rebuildWinners() manually
// (or set a time-based trigger) to refresh the winners list.

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

// Rebuilds the Winners sheet from Response From Web.
// Sorts all responses by score descending, then by timestamp ascending.
// The user decides how many top rows are winners (e.g. take top 5 or filter to score = max).
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
  const rows = values.slice(1)
  const scoreIdx = headers.indexOf('Score')
  const timestampIdx = headers.indexOf('Timestamp')

  rows.sort(function (a, b) {
    const diff = (Number(b[scoreIdx]) || 0) - (Number(a[scoreIdx]) || 0)
    if (diff !== 0) return diff
    return new Date(a[timestampIdx]) - new Date(b[timestampIdx])
  })

  winners.appendRow(headers)
  rows.forEach(function (r) { winners.appendRow(r) })
}
