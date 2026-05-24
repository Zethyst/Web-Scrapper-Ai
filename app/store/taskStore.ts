import { Task, CreateTaskInput } from '@/app/types/Tasks';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Query keys for TanStack Query
export const taskKeys = {
  all: ['tasks'] as const,
  lists: () => [...taskKeys.all, 'list'] as const,
  list: (filters: string) => [...taskKeys.lists(), { filters }] as const,
  details: () => [...taskKeys.all, 'detail'] as const,
  detail: (id: string) => [...taskKeys.details(), id] as const,
};

/**
 * Fetch all tasks from backend API
 */
export async function getAllTasks(): Promise<Task[]> {
  try {
    console.log(`[getAllTasks] Fetching from: ${API_BASE_URL}/tasks`);
    const response = await fetch(`${API_BASE_URL}/tasks`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    console.log(`[getAllTasks] Response status: ${response.status} ${response.statusText}`);
    
    if (!response.ok) {
      let errorMessage = `Failed to fetch tasks: ${response.status} ${response.statusText}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
        console.error(`[getAllTasks] Error data:`, errorData);
      } catch (e) {
        const text = await response.text();
        console.error(`[getAllTasks] Error response text:`, text);
        errorMessage = `${errorMessage}. Response: ${text.substring(0, 200)}`;
      }
      throw new Error(errorMessage);
    }
    
    const data = await response.json();
    console.log(`[getAllTasks] Successfully fetched ${data.length} tasks`);
    return data;
  } catch (error) {
    console.error(`[getAllTasks] Fetch error:`, error);
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error(`Cannot connect to backend API at ${API_BASE_URL}. Make sure the backend server is running.`);
    }
    throw error;
  }
}

/**
 * Create a new task via backend API
 * The backend will create the task in the database and queue it for processing
 */
export async function createTask(input: CreateTaskInput): Promise<Task> {
  const response = await fetch(`${API_BASE_URL}/tasks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || `Failed to create task: ${response.status} ${response.statusText}`
    );
  }

  return await response.json();
}

/**
 * Get a single task by ID from backend API
 */
export async function getTask(taskId: string): Promise<Task> {
  const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`);
  
  if (response.status === 404) {
    throw new Error('Task not found');
  }
  
  if (!response.ok) {
    throw new Error(`Failed to fetch task: ${response.status} ${response.statusText}`);
  }
  
  return await response.json();
}
