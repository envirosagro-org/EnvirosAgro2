import { getDriveAccessToken } from './googleDriveService';

export interface MeetSpace {
  name: string;
  meetingUri: string;
  meetingCode: string;
  config?: {
    accessType?: 'ACCESS_TYPE_UNSPECIFIED' | 'OPEN' | 'TRUSTED' | 'RESTRICTED';
  };
}

/**
 * Helper to fetch with Google Auth header containing the in-memory access token
 */
async function meetFetch(endpoint: string, options: RequestInit = {}): Promise<any> {
  const token = await getDriveAccessToken();
  if (!token) {
    throw new Error('User is not authorized with Google Workspace. Please authenticate under Google Meet or Drive panels.');
  }

  const baseUrl = 'https://meet.googleapis.com/v1';
  const url = endpoint.startsWith('http') ? endpoint : `${baseUrl}${endpoint}`;

  const headers = {
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/json',
    ...options.headers,
  };

  const response = await fetch(url, { ...options, headers });

  if (response.status === 401) {
    throw new Error('OAuth token expired or is invalid. Please reconnect to Google Workspace.');
  }

  if (!response.ok) {
    let errorMsg = `Google Meet API Error: ${response.status} ${response.statusText}`;
    try {
      const errJson = await response.json();
      if (errJson.error?.message) {
        errorMsg = errJson.error.message;
      }
    } catch (_) {}
    throw new Error(errorMsg);
  }

  return response.json();
}

/**
 * Creates a brand new, instant Google Meet space.
 * Supports customizing access settings like OPEN, TRUSTED, or RESTRICTED.
 */
export const createMeetSpace = async (accessType: 'OPEN' | 'TRUSTED' | 'RESTRICTED' = 'OPEN'): Promise<MeetSpace> => {
  const body = {
    config: {
      accessType: accessType
    }
  };

  return meetFetch('/spaces', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
};
