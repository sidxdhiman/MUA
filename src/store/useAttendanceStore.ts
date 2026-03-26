import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface ClassSlot {
    id: string;
    title: string;
    timeStart: string; // e.g. "09:00"
    timeEnd: string;
    dayOfWeek: number; // 0=Sunday, 1=Monday...
    location: string;
    type: string;
}

export interface AttendanceRecord {
    id: string;
    classId: string;
    date: string; // YYYY-MM-DD
    status: 'present' | 'absent' | 'late' | 'excused';
}

interface AttendanceState {
    classes: ClassSlot[];
    records: AttendanceRecord[];
    campusCoords: { lat: number, lon: number } | null;
    addClass: (c: Omit<ClassSlot, 'id'>) => void;
    setClasses: (classes: ClassSlot[]) => void;
    removeClass: (id: string) => void;
    logAttendance: (record: Omit<AttendanceRecord, 'id'>) => void;
    setCampusCoords: (coords: { lat: number, lon: number } | null) => void;
}

export const useAttendanceStore = create<AttendanceState>()(
    persist(
        (set) => ({
            classes: [],
            records: [],
            campusCoords: null,
            addClass: (c) => set((state) => ({
                classes: [...state.classes, { ...c, id: Date.now().toString() + Math.random().toString(36).substr(2, 9) }]
            })),
            setClasses: (classes) => set(() => ({ classes })),
            removeClass: (id) => set((state) => ({
                classes: state.classes.filter(c => c.id !== id)
            })),
            logAttendance: (r) => set((state) => ({
                records: [
                    ...state.records.filter(log => !(log.classId === r.classId && log.date === r.date)),
                    { ...r, id: Date.now().toString() }
                ]
            })),
            setCampusCoords: (campusCoords) => set(() => ({ campusCoords })),
        }),
        {
            name: 'daystack-attendance-store',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
