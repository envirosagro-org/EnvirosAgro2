import { getDriveAccessToken } from './googleDriveService';

async function docsFetch(endpoint: string, options: RequestInit = {}): Promise<any> {
  const token = await getDriveAccessToken();
  if (!token) {
    throw new Error('User not authorized for Google Docs.');
  }

  const baseUrl = 'https://docs.googleapis.com/v1/documents';
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
    throw new Error(errorBody.error?.message || `Docs API Error: ${response.statusText}`);
  }

  return response.json();
}

export const getDocument = async (documentId: string): Promise<any> => {
  return docsFetch(`/${documentId}`);
};
