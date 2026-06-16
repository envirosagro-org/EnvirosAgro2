import { getDriveAccessToken } from './googleDriveService';

export interface ClassroomCourse {
  id: string;
  name: string;
  section?: string;
  descriptionHeading?: string;
  description?: string;
  room?: string;
  ownerId: string;
  creationTime?: string;
  updateTime?: string;
  enrollmentCode?: string;
  courseState: string;
  alternateLink?: string;
  teacherGroupEmail?: string;
  courseGroupEmail?: string;
  guardiansEnabled?: boolean;
  calendarId?: string;
}

export interface ClassroomCourseWork {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  materials?: any[];
  state: string;
  alternateLink?: string;
  creationTime?: string;
  updateTime?: string;
  maxPoints?: number;
  workType: string;
}

export interface ClassroomMaterial {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  materials?: any[];
  state: string;
  alternateLink?: string;
}

export interface ClassroomAnnouncement {
  id: string;
  courseId: string;
  text: string;
  state: string;
  alternateLink?: string;
  creationTime?: string;
  updateTime?: string;
  materials?: any[];
}

/**
 * Helper to fetch with Google Auth header containing the in-memory access token
 */
async function classroomFetch(endpoint: string, options: RequestInit = {}): Promise<any> {
  const token = await getDriveAccessToken();
  if (!token) {
    throw new Error('User is not authorized with Google Classroom. Please authenticate under Google Classroom panel.');
  }

  const baseUrl = 'https://classroom.googleapis.com/v1';
  const url = endpoint.startsWith('http') ? endpoint : `${baseUrl}${endpoint}`;

  const headers = {
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/json',
    ...options.headers,
  };

  const response = await fetch(url, { ...options, headers });

  if (response.status === 401) {
    throw new Error('Google Classroom authorization session expired or token is invalid. Please sign in again.');
  }

  if (!response.ok) {
    let errorMsg = `Classroom API Error: ${response.status} ${response.statusText}`;
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
 * Lists courses the user has access to (ACTIVE only by default)
 */
export const listClassroomCourses = async (): Promise<ClassroomCourse[]> => {
  const urlParams = new URLSearchParams({
    courseStates: 'ACTIVE',
    pageSize: '50',
  });
  const data = await classroomFetch(`/courses?${urlParams.toString()}`);
  return data.courses || [];
};

/**
 * Lists coursework items (assignments, questions) for a specific course
 */
export const listCourseWork = async (courseId: string): Promise<ClassroomCourseWork[]> => {
  const data = await classroomFetch(`/courses/${courseId}/courseWork`);
  return data.courseWork || [];
};

/**
 * Lists announcements for a specific course stream
 */
export const listAnnouncements = async (courseId: string): Promise<ClassroomAnnouncement[]> => {
  const data = await classroomFetch(`/courses/${courseId}/announcements`);
  return data.announcements || [];
};

/**
 * Lists coursework materials for a specific course
 */
export const listCourseWorkMaterials = async (courseId: string): Promise<ClassroomMaterial[]> => {
  const data = await classroomFetch(`/courses/${courseId}/courseWorkMaterials`);
  return data.courseWorkMaterial || [];
};

/**
 * Publishes educational resource as a Course Work Material to a course
 */
export const publishCourseMaterial = async (
  courseId: string,
  title: string,
  description: string,
  url: string
): Promise<ClassroomMaterial> => {
  const body = {
    title,
    description,
    state: 'PUBLISHED',
    materials: [
      {
        link: {
          url,
          title
        }
      }
    ]
  };

  return classroomFetch(`/courses/${courseId}/courseWorkMaterials`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
};

/**
 * Publishes a stream announcement on the Google Classroom course
 */
export const publishAnnouncement = async (
  courseId: string,
  text: string,
  linkUrl?: string,
  linkTitle?: string
): Promise<ClassroomAnnouncement> => {
  const body: any = {
    text,
    state: 'PUBLISHED',
  };

  if (linkUrl) {
    body.materials = [
      {
        link: {
          url: linkUrl,
          title: linkTitle || 'Educational Link'
        }
      }
    ];
  }

  return classroomFetch(`/courses/${courseId}/announcements`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
};

/**
 * Creates a new CourseWork (assignment) item in active courses
 */
export const createClassroomAssignment = async (
  courseId: string,
  title: string,
  description: string,
  points?: number
): Promise<ClassroomCourseWork> => {
  const body: any = {
    title,
    description,
    workType: 'ASSIGNMENT',
    state: 'PUBLISHED',
  };

  if (points && points > 0) {
    body.maxPoints = points;
  }

  return classroomFetch(`/courses/${courseId}/courseWork`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
};
