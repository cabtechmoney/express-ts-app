import { api } from "../lib/api";
import { Client } from "./client.services"; // Import Client interface

export interface CreateProjectDto {
  title: string;
  description?: string;
  budget: number;
  status: string;
  deadline?: string;
  clientId: string;
}

export interface Project extends CreateProjectDto {
  id: string;
  createdAt: string;
  updatedAt: string;
  client?: Client; // Use the imported Client interface
}

export const ProjectService = {
  // Get all projects
  getAll: async () => {
    return api<Project[]>("/projects");
  },

  // Get single project
  getById: async (id: string) => {
    return api<Project>(`/projects/${id}`);
  },

  // Create project
  create: async (
    data: CreateProjectDto
  ) => {
    return api<Project>("/projects", { // Added generic type
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  // Update project
  update: async (
    id: string,
    data: Partial<CreateProjectDto>
  ) => {
    return api<Project>(`/projects/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  // Delete project
  delete: async (id: string) => {
    return api<{ message: string }>(`/projects/${id}`, {
      method: "DELETE",
    });
  },

  // Search projects
  search: async (query: string) => {
    return api<Project[]>(
      `/search?q=${encodeURIComponent(
        query
      )}`
    );
  },
};
