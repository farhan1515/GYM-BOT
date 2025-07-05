import { google } from 'googleapis';
import { JWT } from 'google-auth-library';

const scopes = ['https://www.googleapis.com/auth/spreadsheets'];

const auth = new JWT({
  email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  scopes,
});

const sheets = google.sheets({ version: 'v4', auth });

export async function appendLeadToSheet(lead: {
  name?: string;
  age?: number;
  weight?: number;
  height?: number;
  injuries?: string;
  fitness_level?: string;
  fitness_goal?: string;
  workout_days?: number;
  dietary_restrictions?: string;
  phone_number?: string;
  diet_plan?: string;
  created_at?: string;
}) {
  const values = [
    lead.name || '',
    lead.age || '',
    lead.weight || '',
    lead.height || '',
    lead.injuries || '',
    lead.fitness_level || '',
    lead.fitness_goal || '',
    lead.workout_days || '',
    lead.dietary_restrictions || '',
    lead.phone_number || '',
    lead.diet_plan || '',
    lead.created_at || new Date().toISOString(),
  ];

  await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: 'Sheet1!A1',
    valueInputOption: 'RAW',
    requestBody: { values: [values] },
  });
}
