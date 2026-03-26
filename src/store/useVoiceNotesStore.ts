import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface VoiceNote {
    id: string;
    title: string;
    transcript: string;
    date: string;
    tags: string[];
    uri?: string;
}

interface VoiceNotesState {
    notes: VoiceNote[];
    addNote: (n: Omit<VoiceNote, 'id'>) => void;
    removeNote: (id: string) => void;
}

export const useVoiceNotesStore = create<VoiceNotesState>()(
    persist(
        (set) => ({
            notes: [],
            addNote: (n) => set((state) => ({
                notes: [{ ...n, id: Date.now().toString() }, ...state.notes]
            })),
            removeNote: (id) => set((state) => ({
                notes: state.notes.filter(n => n.id !== id)
            })),
        }),
        {
            name: 'daystack-voicenotes-store',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
