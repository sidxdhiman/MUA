import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface WardrobeItem {
    id: string;
    name: string;
    category: 'Tops' | 'Bottoms' | 'Shoes' | 'Outerwear' | 'Accessories';
    color: string;
    occasions: string[];
}

interface OutfitState {
    wardrobe: WardrobeItem[];
    savedOutfits: { id: string, name: string, items: string[] }[];
    addItem: (item: Omit<WardrobeItem, 'id'>) => void;
    removeItem: (id: string) => void;
}

export const useOutfitStore = create<OutfitState>()(
    persist(
        (set) => ({
            wardrobe: [],
            savedOutfits: [],
            addItem: (item) => set((state) => ({
                wardrobe: [...state.wardrobe, { ...item, id: Date.now().toString() }]
            })),
            removeItem: (id) => set((state) => ({
                wardrobe: state.wardrobe.filter(w => w.id !== id)
            })),
        }),
        {
            name: 'daystack-outfit-store',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
