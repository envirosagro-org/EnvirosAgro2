import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './firebaseService';

// Flag to hold the cached OAuth access token in memory
let cachedAccessToken: string | null = null;
let currentGoogleUser: User | null = null;
let isSigningIn = false;

// Create and configure provider with Google Drive permissions
const getDriveProvider = () => {
  const provider = new GoogleAuthProvider();
  provider.addScope('https://www.googleapis.com/auth/drive');
  // Optional but helpful: request offline access if needed
  provider.setCustomParameters({
    prompt: 'consent'
  });
  return provider;
};

/**
 * Initializes the auth listener to monitor sign-in states.
 */
export const initDriveAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      currentGoogleUser = user;
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        // Clear tokens if we don't have a cached session or aren't in progress
        cachedAccessToken = null;
        if (onAuthFailure) onAuthFailure();
      }
    } else {
      currentGoogleUser = null;
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

/**
 * Executes a popup-based login requesting Google Drive permissions.
 */
export const googleDriveSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const provider = getDriveProvider();
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    
    if (!credential?.accessToken) {
      throw new Error('Failed to retrieve Google Drive OAuth access token from authenticating credential.');
    }
    
    cachedAccessToken = credential.accessToken;
    currentGoogleUser = result.user;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error) {
    console.error('Google Drive sign-in execution failed:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

/**
 * Returns the cached in-memory access token.
 */
export const getDriveAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

/**
 * Performs a sign-out.
 */
export const googleDriveSignOut = async () => {
  await auth.signOut();
  cachedAccessToken = null;
  currentGoogleUser = null;
};

/**
 * Drive File Definition based on Google Drive API v3
 */
export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  iconLink?: string;
  webViewLink?: string;
  webContentLink?: string;
  size?: string;
  createdTime?: string;
  thumbnailLink?: string;
  owners?: Array<{
    displayName: string;
    photoLink?: string;
    emailAddress?: string;
  }>;
}

/**
 * Helper to execute authorized fetches to Google Drive API
 */
async function driveFetch(endpoint: string, options: RequestInit = {}): Promise<any> {
  const token = await getDriveAccessToken();
  if (!token) {
    throw new Error('User is not authorized with Google Drive. Please authenticate.');
  }

  const baseUrl = 'https://www.googleapis.com/drive/v3';
  const url = endpoint.startsWith('http') ? endpoint : `${baseUrl}${endpoint}`;

  const headers = {
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/json',
    ...options.headers,
  };

  const response = await fetch(url, { ...options, headers });

  if (response.status === 401) {
    // Current token is invalid or expired
    cachedAccessToken = null;
    throw new Error('Google Drive authorization session expired or token is invalid. Please sign in again.');
  }

  if (!response.ok) {
    let errorMsg = `Drive API Error: ${response.status} ${response.statusText}`;
    try {
      const errJson = await response.json();
      if (errJson.error?.message) {
        errorMsg = errJson.error.message;
      }
    } catch (_) {}
    throw new Error(errorMsg);
  }

  // Some operations (like delete) return no content
  if (response.status === 204) {
    return null;
  }

  return response.json();
}

/**
 * Lists files and folders from Google Drive, optionally filtered by parent folder.
 */
export const listDriveFiles = async (
  folderId: string = 'root',
  searchQuery: string = ''
): Promise<DriveFile[]> => {
  let q = `'${folderId}' in parents and trashed = false`;
  
  if (searchQuery.trim()) {
    const escapedQuery = searchQuery.replace(/'/g, "\\'");
    q = `name contains '${escapedQuery}' and trashed = false`;
  }

  const fields = 'files(id, name, mimeType, iconLink, webViewLink, webContentLink, size, createdTime, thumbnailLink, owners(displayName, photoLink, emailAddress))';
  const orderBy = 'folder,name';
  const urlParams = new URLSearchParams({
    q,
    fields,
    orderBy,
    pageSize: '100',
  });

  const data = await driveFetch(`/files?${urlParams.toString()}`);
  return data.files || [];
};

/**
 * Creates a new folder in Google Drive.
 */
export const createDriveFolder = async (
  folderName: string,
  parentId: string = 'root'
): Promise<DriveFile> => {
  if (!folderName.trim()) {
    throw new Error('Folder name cannot be empty.');
  }

  const body = {
    name: folderName,
    mimeType: 'application/vnd.google-apps.folder',
    parents: parentId !== 'root' ? [parentId] : undefined,
  };

  return driveFetch('/files', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
};

/**
 * Permanently deletes or trashes a specific file or folder.
 */
export const deleteDriveFile = async (fileId: string): Promise<void> => {
  await driveFetch(`/files/${fileId}`, {
    method: 'DELETE',
  });
};

/**
 * Trashes a specific file or folder (safer than permanent delete).
 */
export const trashDriveFile = async (fileId: string): Promise<DriveFile> => {
  return driveFetch(`/files/${fileId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ trashed: true }),
  });
};

/**
 * Uploads a client file to Google Drive.
 */
export const uploadFileToDrive = async (
  file: File,
  parentId: string = 'root',
  onProgress?: (progress: number) => void
): Promise<DriveFile> => {
  const token = await getDriveAccessToken();
  if (!token) {
    throw new Error('User is not authorized with Google Drive. Please authenticate.');
  }

  // Metadata block
  const metadata = {
    name: file.name,
    mimeType: file.type || 'application/octet-stream',
    parents: parentId !== 'root' ? [parentId] : undefined,
  };

  // Create multipart body
  const boundary = '-------314159265358979323846';
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  const reader = new FileReader();
  
  return new Promise((resolve, reject) => {
    reader.onload = async () => {
      try {
        const base64Data = btoa(
          new Uint8Array(reader.result as ArrayBuffer).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            ''
          )
        );

        const multipartRequestBody =
          delimiter +
          'Content-Type: application/json\r\n\r\n' +
          JSON.stringify(metadata) +
          delimiter +
          'Content-Type: ' + (file.type || 'application/octet-stream') + '\r\n' +
          'Content-Transfer-Encoding: base64\r\n\r\n' +
          base64Data +
          closeDelimiter;

        const response = await fetch(
          'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,mimeType,iconLink,webViewLink',
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': `multipart/related; boundary=${boundary}`,
              'Content-Length': multipartRequestBody.length.toString(),
            },
            body: multipartRequestBody,
          }
        );

        if (!response.ok) {
          throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        if (onProgress) onProgress(100);
        resolve(data);
      } catch (err) {
        reject(err);
      }
    };

    reader.onerror = () => {
      reject(new Error('File reader failed to parse file block.'));
    };

    reader.readAsArrayBuffer(file);
  });
};
