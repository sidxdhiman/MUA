import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface AppTask {
    id: string;
    title: string;
    dueDate: string;
    priority: 'low' | 'medium' | 'high';
    completed: boolean;
    category: string;
}

interface TasksState {
    tasks: AppTask[];
    addTask: (doc: Omit<AppTask, 'id' | 'completed'>) => void;
    toggleTask: (id: string) => void;
    removeTask: (id: string) => void;
}

export const useTasksStore = create<TasksState>()(
    persist(
        (set) => ({
            tasks: [],
            addTask: (doc) =>
                set((state) => ({
                    tasks: [
                        ...state.tasks,
                        { ...doc, id: Date.now().toString(), completed: false },
                    ],
                })),
            toggleTask: (id) =>
                set((state) => ({
                    tasks: state.tasks.map((t) =>
                        t.id === id ? { ...t, completed: !t.completed } : t
                    ),
                })),
            removeTask: (id) =>
                set((state) => ({
                    tasks: state.tasks.filter((t) => t.id !== id),
                })),
        }),
        {
            name: 'daystack-tasks-store',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
