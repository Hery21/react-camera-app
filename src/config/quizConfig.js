// Configuration for the quiz submission endpoint.
// Leave endpoint empty until you have a working Google Sheets hookup.
//
// Two modes are supported:
//
// 1. mode: 'json' — Google Apps Script Web App or custom endpoint
//    - Create a Google Sheet.
//    - Extensions > Apps Script. Paste this into Code.gs:
//        function doPost(e) {
//          var sheet = SpreadsheetApp.getActiveSheet();
//          var data = JSON.parse(e.postData.contents);
//          sheet.appendRow([new Date(), data.sessionId, data.language, JSON.stringify(data.answers)]);
//          return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(ContentService.MimeType.JSON);
//        }
//    - Deploy > New deployment > Web app > Execute as: Me > Who has access: Anyone.
//    - Copy the deployment URL into quizConfig.endpoint.
//    - The app POSTs JSON: { sessionId, language, submittedAt, answers: [{ questionId, optionId }] }
//
// 2. mode: 'form' — Google Form /formResponse endpoint
//    - Create a Google Form with one Multiple Choice question per quiz question.
//    - Right-click the form's live view > "Get pre-filled link" > fill sample answers > copy link.
//    - The copied URL contains entry.XXXXX field IDs. Map them in formFields below.
//    - Set endpoint to the form's /formResponse URL (NOT the /viewform URL).
//    - Responses automatically appear in the linked Google Sheet.
//    - Note: mode "form" uses no-cors so the fetch cannot read the response, but the submission still lands in the sheet.

export const quizConfig = {
  endpoint: '',
  mode: 'json',
  formFields: {
    // Q1: 'entry.1234567890',
    // Q2: 'entry.2345678901',
    // Q3: 'entry.3456789012',
    // session: 'entry.4567890123',
    // timestamp: 'entry.5678901234',
  },
}
