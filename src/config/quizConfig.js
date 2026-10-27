// Quiz submission configuration.
//
// Mode 'json' posts this payload to a Google Apps Script Web App:
//   {
//     sessionId, language, startedAt, submittedAt, durationMs,
//     identity: { namaAsli, unit, instagram },
//     answers: [{ questionId, optionId }],
//     score, correctCount, totalQuestions
//   }
//
// Setup:
//   1. Create a Google Sheet with two tabs: "Response From Web" and "Winners".
//   2. Extensions > Apps Script. Paste scripts/apps-script-quiz.gs from this repo.
//   3. Deploy > New deployment > Web app:
//        - Execute as: Me
//        - Who has access: Anyone
//      Copy the /exec URL.
//   4. Paste the URL below into endpoint.
//   5. After submissions arrive, run rebuildWinners() in Apps Script to refresh
//      the Winners sheet. Winners are the 10 earliest submissions with all
//      answers correct (sorted by Timestamp ascending). If fewer than 10 people
//      achieved a perfect score, only those people appear.

export const quizConfig = {
  endpoint: 'https://script.google.com/macros/s/AKfycbxY5dTOvqizR75YUzWEFjNShfGG6q-7zeQw2SHC7j8s8_c4m1lcbuHSUenDEcQK7j3Ghg/exec',
  mode: 'json',
  pointsPerQuestion: 20,
  formFields: {},
}
