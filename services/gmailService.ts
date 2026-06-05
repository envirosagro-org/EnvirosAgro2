import { getDriveAccessToken } from './googleDriveService';

export interface GmailMessage {
  id: string;
  threadId: string;
  subject: string;
  from: string;
  to: string;
  date: string;
  snippet: string;
  body?: string;
}

/**
 * Helper to fetch with Google Auth header containing the in-memory access token
 */
async function gmailFetch(endpoint: string, options: RequestInit = {}): Promise<any> {
  const token = await getDriveAccessToken();
  if (!token) {
    throw new Error('User is not authorized with Google Workspace. Please authenticate under Google Drive or Gmail panels.');
  }

  const baseUrl = 'https://gmail.googleapis.com/gmail/v1';
  const url = endpoint.startsWith('http') ? endpoint : `${baseUrl}${endpoint}`;

  const headers = {
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/json',
    ...options.headers,
  };

  const response = await fetch(url, { ...options, headers });

  if (response.status === 401) {
    throw new Error('OAuth token expired or is invalid. Please reconnect to Google Drive / Gmail.');
  }

  if (!response.ok) {
    let errorMsg = `Gmail API Error: ${response.status} ${response.statusText}`;
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
 * Decodes Gmail's custom base64url encoded strings
 */
function decodeBase64Url(str: string): string {
  try {
    const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    return decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
  } catch (e) {
    console.error('Failed to decode email snippet or body:', e);
    return 'Content decoding failed.';
  }
}

/**
 * Parses header fields from standard Google API email output structure
 */
function getHeaderValue(headers: Array<{ name: string; value: string }>, name: string): string {
  const found = headers.find((h) => h.name.toLowerCase() === name.toLowerCase());
  return found ? found.value : '';
}

/**
 * Recursively extracts plain text or HTML body from Gmail parts
 */
function extractBody(payload: any): string {
  if (!payload) return '';
  if (payload.body?.data) {
    return decodeBase64Url(payload.body.data);
  }
  if (payload.parts) {
    // Look for text/html first, then text/plain
    const htmlPart = payload.parts.find((p: any) => p.mimeType === 'text/html');
    if (htmlPart) return extractBody(htmlPart);

    const plainPart = payload.parts.find((p: any) => p.mimeType === 'text/plain');
    if (plainPart) return extractBody(plainPart);

    // If nested in deeper parts
    for (const part of payload.parts) {
      const deeper = extractBody(part);
      if (deeper) return deeper;
    }
  }
  return '';
}

/**
 * Lists the latest messages from Gmail
 */
export const listGmailMessages = async (
  query: string = '',
  maxResults: number = 20
): Promise<GmailMessage[]> => {
  const params = new URLSearchParams({
    maxResults: maxResults.toString(),
  });
  if (query.trim()) {
    params.append('q', query);
  }

  const listData = await gmailFetch(`/users/me/messages?${params.toString()}`);
  if (!listData.messages || listData.messages.length === 0) {
    return [];
  }

  // Fetch full details of each message in parallel
  const detailsProms = listData.messages.map(async (msgSummary: any) => {
    try {
      const fullMsg = await gmailFetch(`/users/me/messages/${msgSummary.id}?format=full`);
      const headers = fullMsg.payload?.headers || [];
      return {
        id: fullMsg.id,
        threadId: fullMsg.threadId,
        subject: getHeaderValue(headers, 'subject') || '(No Subject)',
        from: getHeaderValue(headers, 'from') || '(Unknown Sender)',
        to: getHeaderValue(headers, 'to') || '(Unknown Recipient)',
        date: getHeaderValue(headers, 'date') || 'No Date',
        snippet: fullMsg.snippet || '',
        body: extractBody(fullMsg.payload)
      };
    } catch (err) {
      console.error(`Failed to load details for message ${msgSummary.id}:`, err);
      return null;
    }
  });

  const resolved = await Promise.all(detailsProms);
  return resolved.filter((m): m is GmailMessage => m !== null);
};

/**
 * Fetches a single message with body details
 */
export const getGmailMessage = async (id: string): Promise<GmailMessage> => {
  const fullMsg = await gmailFetch(`/users/me/messages/${id}?format=full`);
  const headers = fullMsg.payload?.headers || [];
  return {
    id: fullMsg.id,
    threadId: fullMsg.threadId,
    subject: getHeaderValue(headers, 'subject') || '(No Subject)',
    from: getHeaderValue(headers, 'from') || '(Unknown Sender)',
    to: getHeaderValue(headers, 'to') || '(Unknown Recipient)',
    date: getHeaderValue(headers, 'date') || 'No Date',
    snippet: fullMsg.snippet || '',
    body: extractBody(fullMsg.payload)
  };
};

/**
 * Sends an email MIME payload via Gmail API and returns the receipt transaction
 */
export const sendGmailEmail = async (
  to: string,
  subject: string,
  bodyHtml: string
): Promise<{ id: string; threadId: string }> => {
  if (!to.trim() || !subject.trim() || !bodyHtml.trim()) {
    throw new Error('To address, subject, and body text are all strictly required to dispatch an email.');
  }

  const mimeParts = [
    `To: ${to}`,
    `Subject: =?utf-8?B?${btoa(encodeURIComponent(subject).replace(/%([0-9A-F]{2})/g, (_, p1) => String.fromCharCode(parseInt(p1, 16))))}?=`,
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=utf-8',
    'Content-Transfer-Encoding: 7bit',
    '',
    bodyHtml
  ];

  const rawContent = mimeParts.join('\r\n');
  const base64UrlRaw = btoa(encodeURIComponent(rawContent).replace(/%([0-9A-F]{2})/g, (_, p1) => String.fromCharCode(parseInt(p1, 16))))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  return gmailFetch('/users/me/messages/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ raw: base64UrlRaw }),
  });
};

/**
 * Trashes/deletes a message from Gmail. Has warning confirmation in view.
 */
export const trashGmailMessage = async (id: string): Promise<void> => {
  await gmailFetch(`/users/me/messages/${id}/trash`, {
    method: 'POST',
  });
};
