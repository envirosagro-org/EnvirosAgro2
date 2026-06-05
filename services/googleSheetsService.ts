import { getDriveAccessToken } from './googleDriveService';

async function sheetsFetch(endpoint: string, options: RequestInit = {}): Promise<any> {
  const token = await getDriveAccessToken();
  if (!token) {
    throw new Error('User not authorized for Google Sheets.');
  }

  const baseUrl = 'https://sheets.googleapis.com/v4/spreadsheets';
  const url = endpoint.startsWith('http') ? endpoint : `${baseUrl}${endpoint}`;

  const headers = {
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const response = await fetch(url, { ...options, headers });
  
  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.error?.message || `Sheets API Error: ${response.statusText}`);
  }

  return response.json();
}

export const getSpreadsheet = async (spreadsheetId: string): Promise<any> => {
  return sheetsFetch(`/${spreadsheetId}`);
};
