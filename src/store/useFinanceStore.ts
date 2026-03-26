import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Transaction {
    id: string;
    type: 'income' | 'expense';
    amount: number;
    category: string;
    title: string;
    date: string;
}

interface FinanceState {
    transactions: Transaction[];
    addTransaction: (doc: Omit<Transaction, 'id'>) => void;
    removeTransaction: (id: string) => void;
}

export const useFinanceStore = create<FinanceState>()(
    persist(
        (set) => ({
            transactions: [],
            addTransaction: (doc) =>
                set((state) => ({
                    transactions: [
                        ...state.transactions,
                        { ...doc, id: Date.now().toString() },
                    ],
                })),
            removeTransaction: (id) =>
                set((state) => ({
                    transactions: state.transactions.filter((t) => t.id !== id),
                })),
        }),
        {
            name: 'daystack-finance-store',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
