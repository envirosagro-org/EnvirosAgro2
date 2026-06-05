import { getDriveAccessToken } from './googleDriveService';

export interface CalendarEvent {
  id: string;
  summary: string;
  description?: string;
  location?: string;
  start: {
    dateTime?: string;
    date?: string;
    timeZone?: string;
  };
  end: {
    dateTime?: string;
    date?: string;
    timeZone?: string;
  };
  htmlLink?: string;
  status?: string;
  conferenceData?: {
    entryPoints?: Array<{
      entryPointType: string;
      uri: string;
      label?: string;
    }>;
    conferenceId?: string;
  };
}

/**
 * Helper to fetch with Google Auth header containing the in-memory access token
 */
async function calendarFetch(endpoint: string, options: RequestInit = {}): Promise<any> {
  const token = await getDriveAccessToken();
  if (!token) {
    throw new Error('User is not authorized with Google Workspace. Please authenticate under Google Drive or Calendar panels.');
  }

  const baseUrl = 'https://www.googleapis.com/calendar/v3';
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
    let errorMsg = `Calendar API Error: ${response.status} ${response.statusText}`;
    try {
      const errJson = await response.json();
      if (errJson.error?.message) {
        errorMsg = errJson.error.message;
      }
    } catch (_) {}
    throw new Error(errorMsg);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

/**
 * Lists the upcoming calendar events
 */
export const listCalendarEvents = async (
  maxResults: number = 50,
  timeMin: string = new Date().toISOString()
): Promise<CalendarEvent[]> => {
  const params = new URLSearchParams({
    maxResults: maxResults.toString(),
    timeMin: timeMin,
    singleEvents: 'true',
    orderBy: 'startTime',
  });

  const data = await calendarFetch(`/calendars/primary/events?${params.toString()}`);
  return data.items || [];
};

/**
 * Creates a new calendar event
 */
export const createCalendarEvent = async (eventData: {
  summary: string;
  description?: string;
  location?: string;
  startTime: string; // ISO String
  endTime: string;   // ISO String
  createMeet?: boolean;
}): Promise<CalendarEvent> => {
  if (!eventData.summary.trim() || !eventData.startTime || !eventData.endTime) {
    throw new Error('Event summary, start time, and end time are all required.');
  }

  const conferenceData = eventData.createMeet ? {
    createRequest: {
      requestId: Math.random().toString(36).substring(2, 11),
      conferenceSolutionKey: {
        type: 'hangoutsMeet'
      }
    }
  } : undefined;

  const body = {
    summary: eventData.summary,
    description: eventData.description,
    location: eventData.location,
    start: {
      dateTime: eventData.startTime,
    },
    end: {
      dateTime: eventData.endTime,
    },
    conferenceData,
  };

  const url = eventData.createMeet 
    ? '/calendars/primary/events?conferenceDataVersion=1' 
    : '/calendars/primary/events';

  return calendarFetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
};

/**
 * Deletes a calendar event.
 */
export const deleteCalendarEvent = async (eventId: string): Promise<void> => {
  await calendarFetch(`/calendars/primary/events/${eventId}`, {
    method: 'DELETE',
  });
};
