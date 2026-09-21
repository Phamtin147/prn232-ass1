import { Department, DepartmentDetail, Project, ProjectDetail, Task, Tag, Stats } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options?.headers || {}),
  };

  const response = await fetch(url, {
    ...options,
    headers,
    cache: 'no-store',
  });

  if (!response.ok) {
    let errorMessage = `API Error: ${response.status} ${response.statusText}`;
    try {
      const errorData = await response.json();
      if (errorData.message) {
        errorMessage = errorData.message;
      } else if (errorData.errors) {
        errorMessage = Object.values(errorData.errors).flat().join(', ');
      } else if (typeof errorData === 'string') {
        errorMessage = errorData;
      }
    } catch {
      // ignore
    }
    throw new Error(errorMessage);
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

// Department API
export const api = {
  // Stats
  async getStats(): Promise<Stats> {
    try {
      return await request<Stats>('/api/stats');
    } catch {
      const [departments, projects, tasks] = await Promise.all([
        api.getDepartments().catch(() => []),
        api.getProjects().catch(() => []),
        api.getTasks().catch(() => []),
      ]);
      return {
        departmentsCount: departments.length,
        projectsCount: projects.length,
        tasksCount: tasks.length,
      };
    }
  },

  // Departments
  async getDepartments(): Promise<Department[]> {
    return request<Department[]>('/api/departments');
  },
  async getDepartmentById(id: number): Promise<DepartmentDetail> {
    return request<DepartmentDetail>(`/api/departments/${id}`);
  },
  async createDepartment(data: { departmentName: string; departmentDescription: string; isActive?: boolean }): Promise<Department> {
    return request<Department>('/api/departments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  async updateDepartment(id: number, data: { departmentName: string; departmentDescription: string; isActive: boolean }): Promise<Department> {
    return request<Department>(`/api/departments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  async deleteDepartment(id: number): Promise<void> {
    return request<void>(`/api/departments/${id}`, {
      method: 'DELETE',
    });
  },
  async searchDepartments(name: string): Promise<Department[]> {
    return request<Department[]>(`/api/departments/search?name=${encodeURIComponent(name)}`);
  },

  // Projects
  async getProjects(): Promise<Project[]> {
    return request<Project[]>('/api/projects');
  },
  async getProjectById(id: number): Promise<ProjectDetail> {
    return request<ProjectDetail>(`/api/projects/${id}`);
  },
  async getProjectsByDepartment(deptId: number): Promise<Project[]> {
    return request<Project[]>(`/api/projects/department/${deptId}`);
  },
  async createProject(data: {
    projectName: string;
    description?: string;
    startDate: string;
    endDate?: string;
    status: number;
    departmentId: number;
    isActive?: boolean;
  }): Promise<Project> {
    return request<Project>('/api/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  async updateProject(
    id: number,
    data: {
      projectName: string;
      description?: string;
      startDate: string;
      endDate?: string;
      status: number;
      departmentId: number;
      isActive: boolean;
    }
  ): Promise<Project> {
    return request<Project>(`/api/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  async deleteProject(id: number): Promise<void> {
    return request<void>(`/api/projects/${id}`, {
      method: 'DELETE',
    });
  },
  async filterProjects(name?: string, status?: number, departmentId?: number): Promise<Project[]> {
    const params = new URLSearchParams();
    if (name) params.append('name', name);
    if (status !== undefined && status !== null) params.append('status', status.toString());
    if (departmentId) params.append('departmentId', departmentId.toString());
    return request<Project[]>(`/api/projects/search?${params.toString()}`);
  },

  // Tasks
  async getTasks(): Promise<Task[]> {
    return request<Task[]>('/api/tasks');
  },
  async getTaskById(id: number): Promise<Task> {
    return request<Task>(`/api/tasks/${id}`);
  },
  async getTasksByProject(projectId: number): Promise<Task[]> {
    return request<Task[]>(`/api/tasks/project/${projectId}`);
  },
  async createTask(data: {
    title: string;
    description?: string;
    status: number;
    priority: number;
    dueDate?: string;
    projectId: number;
    tagIds?: number[];
  }): Promise<Task> {
    return request<Task>('/api/tasks', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  async updateTask(
    id: number,
    data: {
      title: string;
      description?: string;
      status: number;
      priority: number;
      dueDate?: string;
      projectId: number;
      tagIds?: number[];
    }
  ): Promise<Task> {
    return request<Task>(`/api/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  async deleteTask(id: number): Promise<void> {
    return request<void>(`/api/tasks/${id}`, {
      method: 'DELETE',
    });
  },
  async filterTasks(params: {
    title?: string;
    status?: number;
    priority?: number;
    projectId?: number;
    tagId?: number;
  }): Promise<Task[]> {
    const query = new URLSearchParams();
    if (params.title) query.append('title', params.title);
    if (params.status !== undefined && params.status !== null) query.append('status', params.status.toString());
    if (params.priority !== undefined && params.priority !== null) query.append('priority', params.priority.toString());
    if (params.projectId) query.append('projectId', params.projectId.toString());
    if (params.tagId) query.append('tagId', params.tagId.toString());
    return request<Task[]>(`/api/tasks/search?${query.toString()}`);
  },

  // Tags
  async getTags(): Promise<Tag[]> {
    return request<Tag[]>('/api/tags');
  },
  async createTag(data: { tagName: string; color?: string }): Promise<Tag> {
    return request<Tag>('/api/tags', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  async updateTag(id: number, data: { tagName: string; color?: string }): Promise<Tag> {
    return request<Tag>(`/api/tags/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  async deleteTag(id: number): Promise<void> {
    return request<void>(`/api/tags/${id}`, {
      method: 'DELETE',
    });
  },
};
