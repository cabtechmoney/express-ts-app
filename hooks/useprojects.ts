import { useEffect, useState, useCallback } from "react";
import { ProjectService, Project } from "../services/project.services";

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);

  const loadProjects = useCallback(async () => {
    try {
      const data = await ProjectService.getAll();     
        setProjects(data);
    } catch (error) {
      console.error("Failed to load projects", error);
    }
  }, []);

  useEffect(() => {
    const fetchProjects = async () => {
      await loadProjects();
    };
    fetchProjects();
  }, [loadProjects]);

  return { projects, loadProjects };
}
