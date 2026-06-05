import { getDriveAccessToken } from './googleDriveService';

export interface Task {
  id: string;
  title: string;
  status: 'needsAction' | 'completed';
  due?: string;
  notes?: string;
  completed?: string;
}

async function tasksFetch(endpoint: string, options: RequestInit = {}): Promise<any> {
  const token = await getDriveAccessToken();
  if (!token) {
    throw new Error('User not authorized for Google Tasks.');
  }

  const baseUrl = 'https://tasks.googleapis.com/tasks/v1';
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
    throw new Error(errorBody.error?.message || `Tasks API Error: ${response.statusText}`);
  }

  return response.json();
}

// Lists tasks from the default list
export const listTasks = async (): Promise<Task[]> => {
  const response = await tasksFetch('/lists/@default/tasks');
  return response.items || [];
};

// Creates a task
export const createTask = async (title: string, notes?: string, due?: string): Promise<Task> => {
  return tasksFetch('/lists/@default/tasks', {
    method: 'POST',
    body: JSON.stringify({ title, notes, due }),
  });
};

// Updates task status
export const updateTaskStatus = async (taskId: string, status: 'needsAction' | 'completed'): Promise<Task> => {
  return tasksFetch(`/lists/@default/tasks/${taskId}`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
};

// Deletes a task
export const deleteTask = async (taskId: string): Promise<void> => {
  await tasksFetch(`/lists/@default/tasks/${taskId}`, {
    method: 'DELETE',
  });
};
