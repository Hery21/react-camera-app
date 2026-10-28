// Quiz submission configuration.
//
// Payload posted to Google Apps Script Web App:
//   {
//     sessionId, language, startedAt, submittedAt, durationMs,
//     quizId, quizTitle,
//     identity: { namaAsli, unit, instagram },
//     answers: [{ questionId, optionId }],
//     score, correctCount, totalQuestions
//   }
//
// Setup:
//   1. Google Sheet with two tabs: "Response From Web" and "Winners".
//   2. Extensions > Apps Script. Paste scripts/apps-script-quiz.gs.
//   3. Deploy > New deployment > Web app (Execute as: Me, Who has access: Anyone).
//   4. Paste the /exec URL below into endpoint.
//   5. After submissions arrive, run rebuildWinners() in Apps Script.
//
// forceDay: set to 'day1', 'day2', or 'day3' to force that quiz regardless
// of today's date. Set to null (default) to use date-based selection in
// Asia/Jakarta timezone. Use forceDay during testing or if date logic misbehaves.

export const quizConfig = {
  endpoint: '',
  mode: 'json',
  pointsPerQuestion: 20,
  forceDay: null,
  formFields: {},
}
