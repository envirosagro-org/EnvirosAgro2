import { google } from 'googleapis';

let searchConsoleClient: any = null;

export function getSearchConsoleClient() {
  if (!searchConsoleClient) {
    const credentials = process.env.GOOGLE_SEARCH_CONSOLE_CREDENTIALS;
    if (!credentials) {
      throw new Error('GOOGLE_SEARCH_CONSOLE_CREDENTIALS environment variable is required');
    }
    const auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(credentials),
      scopes: ['https://www.googleapis.com/auth/indexing'],
    });
    searchConsoleClient = google.indexing({ version: 'v3', auth });
  }
  return searchConsoleClient;
}
