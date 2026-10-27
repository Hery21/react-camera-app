// Configuration for the quiz submission endpoint.
//
// Mode 'json' posts the following payload to a Google Apps Script Web App:
//   {
//     sessionId, language, submittedAt,
//     identity: { namaAsli, unit, instagram },
//     answers: [{ questionId, optionId }],
//     score, correctCount, totalQuestions
//   }
//
// Setup:
//   1. Create a Google Sheet with two tabs: "Response From Web" and "Winners".
//   2. Extensions > Apps Script. Paste the contents of scripts/apps-script-quiz.gs
//      (in this repo) into the editor and save.
//   3. Deploy > New deployment > Web app:
//        - Execute as: Me
//        - Who has access: Anyone
//      Copy the /exec URL.
//   4. Paste the URL below into endpoint.
//   5. Add the response headers to "Response From Web" row 1 (see apps-script-quiz.gs).

export const quizConfig = {
  endpoint: '',
  mode: 'json',
  pointsPerQuestion: 20,
  formFields: {},
}
