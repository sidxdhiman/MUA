import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface DietMeal {
    id: string;
    title: string;
    meal: string;
    time: string;
    prepInfo: string;
    date: string; // YYYY-MM-DD
    completed: boolean;
}

interface DietState {
    meals: DietMeal[];
    addMeal: (m: Omit<DietMeal, 'id' | 'completed'>) => void;
    toggleCompletion: (id: string) => void;
    removeMeal: (id: string) => void;
}

export const useDietStore = create<DietState>()(
    persist(
        (set) => ({
            meals: [],
            addMeal: (m) => set((state) => ({
                meals: [...state.meals, { ...m, id: Date.now().toString(), completed: false }]
            })),
            toggleCompletion: (id) => set((state) => ({
                meals: state.meals.map(m => m.id === id ? { ...m, completed: !m.completed } : m)
            })),
            removeMeal: (id) => set((state) => ({
                meals: state.meals.filter(m => m.id !== id)
            })),
        }),
        {
            name: 'daystack-diet-store',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
