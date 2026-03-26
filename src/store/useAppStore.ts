import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface UserProfile {
    name: string;
    role: 'student' | 'professional' | 'freelancer' | 'other';
    routineType: 'early' | 'balanced' | 'night';
    wakeUpTime: string;
    sleepTime: string;
    quietHoursStart: string;
    quietHoursEnd: string;
}

export interface ModulePreferences {
    finance: boolean;
    health: boolean;
    reminders: boolean;
    outfit: boolean;
    voiceNotes: boolean;
    attendance: boolean;
    diet: boolean;
}

interface AppState {
    isFirstLaunch: boolean;
    profile: UserProfile | null;
    modules: ModulePreferences;
    completeOnboarding: (profile: UserProfile, modules: ModulePreferences) => void;
    updateProfile: (updates: Partial<UserProfile>) => void;
    toggleModule: (module: keyof ModulePreferences) => void;
    resetApp: () => void;
}

const defaultModules: ModulePreferences = {
    finance: true,
    health: true,
    reminders: true,
    outfit: true,
    voiceNotes: true,
    attendance: false,
    diet: true,
};

export const useAppStore = create<AppState>()(
    persist(
        (set) => ({
            isFirstLaunch: true,
            profile: null,
            modules: defaultModules,
            completeOnboarding: (profile, modules) => set({ isFirstLaunch: false, profile, modules }),
            updateProfile: (updates) => set((state) => ({
                profile: state.profile ? { ...state.profile, ...updates } : null
            })),
            toggleModule: (module) => set((state) => ({
                modules: { ...state.modules, [module]: !state.modules[module] }
            })),
            resetApp: () => set({ isFirstLaunch: true, profile: null, modules: defaultModules }),
        }),
        {
            name: 'daystack-app-store',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
