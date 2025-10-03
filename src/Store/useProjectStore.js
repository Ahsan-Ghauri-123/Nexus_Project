import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useProjectStore = create(
  persist(
    (set, get) => ({
      // State
      selectedProjectId: null,
      projectData: null,
      
      // Actions
      setSelectedProjectId: (projectId) => {
        set({ selectedProjectId: projectId });
        console.log('Project ID saved to Zustand:', projectId);
      },
      
      setProjectData: (data) => set({ projectData: data }),
      
      clearProjectData: () => set({ selectedProjectId: null, projectData: null }),
    }),
    {
      name: 'project-storage', // localStorage key
    }
  )
);