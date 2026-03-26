import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface HealthLog {
    date: string; // YYYY-MM-DD
    water: number;
    sleep: number;
    steps: number;
    mood: string | null;
}

interface HealthState {
    logs: Record<string, HealthLog>;
    updateLog: (date: string, updates: Partial<HealthLog>) => void;
    getLog: (date: string) => HealthLog;
}

const defaultLog: HealthLog = { date: '', water: 0, sleep: 0, steps: 0, mood: null };

export const useHealthStore = create<HealthState>()(
    persist(
        (set, get) => ({
            logs: {},
            updateLog: (date, updates) => set((state) => {
                const current = state.logs[date] || { ...defaultLog, date };
                return {
                    logs: {
                        ...state.logs,
                        [date]: { ...current, ...updates }
                    }
                };
            }),
            getLog: (date) => get().logs[date] || { ...defaultLog, date },
        }),
        {
            name: 'daystack-health-store',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
