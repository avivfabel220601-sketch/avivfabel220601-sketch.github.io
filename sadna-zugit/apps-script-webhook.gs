const SHEET_NAME = 'לידים';

function doPost(e) {
  let lead;
  try {
    lead = JSON.parse(e.postData.contents);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: 'invalid JSON' }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  const sheet = getOrCreateSheet();
  sheet.appendRow([
    new Date(),
    lead.firstName || '',
    lead.lastName || '',
    lead.phone || '',
    lead.email || '',
    lead.interest || '',
    lead.consent ? 'כן' : 'לא',
    lead.source || '',
    lead.page || ''
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function getOrCreateSheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const existing = spreadsheet.getSheetByName(SHEET_NAME);
  if (existing) return existing;

  const sheet = spreadsheet.insertSheet(SHEET_NAME);
  sheet.appendRow(['תאריך', 'שם פרטי', 'שם משפחה', 'טלפון', 'אימייל', 'נושא', 'אישור דיוור', 'מקור', 'עמוד']);
  return sheet;
}
