import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Transaction, BudgetCategory, SponsorContribution, PaymentStatus, TransactionType } from '@/types';

// Initial budget categories based on tournament needs
const initialBudgetCategories: BudgetCategory[] = [
  { id: 'venue', name: 'Venue & Fields', nameAmharic: 'ቦታ እና ሜዳዎች', budgetedAmount: 15000, color: '#078930', icon: 'MapPin' },
  { id: 'equipment', name: 'Equipment & Rentals', nameAmharic: 'መሳሪያዎች', budgetedAmount: 8000, color: '#0F47AF', icon: 'Package' },
  { id: 'food', name: 'Food & Beverages', nameAmharic: 'ምግብ እና መጠጦች', budgetedAmount: 12000, color: '#FCDD09', icon: 'UtensilsCrossed' },
  { id: 'entertainment', name: 'Entertainment & Music', nameAmharic: 'ሙዚቃ', budgetedAmount: 5000, color: '#DA121A', icon: 'Music' },
  { id: 'marketing', name: 'Marketing & Promotion', nameAmharic: 'ማስታወቂያ', budgetedAmount: 3000, color: '#8B5CF6', icon: 'Megaphone' },
  { id: 'prizes', name: 'Prizes & Awards', nameAmharic: 'ሽልማቶች', budgetedAmount: 4000, color: '#F59E0B', icon: 'Trophy' },
  { id: 'travel', name: 'Travel & Accommodation', nameAmharic: 'ጉዞ እና ማረፊያ', budgetedAmount: 6000, color: '#10B981', icon: 'Plane' },
  { id: 'admin', name: 'Administrative', nameAmharic: 'አስተዳደራዊ', budgetedAmount: 2000, color: '#6B7280', icon: 'FileText' },
  { id: 'misc', name: 'Miscellaneous', nameAmharic: 'ልዩ ልዩ', budgetedAmount: 5000, color: '#78716C', icon: 'MoreHorizontal' },
];

interface BudgetState {
  // Data
  targetBudget: number; // Overall budget target (editable independently)
  budgetCategories: BudgetCategory[];
  transactions: Transaction[];
  sponsorContributions: SponsorContribution[];

  // Target budget action
  setTargetBudget: (amount: number) => void;

  // Budget category actions
  addBudgetCategory: (category: Omit<BudgetCategory, 'id'>) => void;
  updateBudgetCategory: (id: string, updates: Partial<BudgetCategory>) => void;
  deleteBudgetCategory: (id: string) => void;

  // Transaction actions
  addTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTransaction: (id: string, updates: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;

  // Sponsor contribution actions
  addSponsorContribution: (contribution: Omit<SponsorContribution, 'id' | 'createdAt'>) => void;
  updateSponsorContribution: (id: string, updates: Partial<SponsorContribution>) => void;
  deleteSponsorContribution: (id: string) => void;

  // Computed getters
  getTotalBudget: () => number;
  getTotalIncome: () => number;
  getTotalExpenses: () => number;
  getBalance: () => number;
  getCategorySpending: (categoryId: string) => number;
  getCategoryRemaining: (categoryId: string) => number;
  getTransactionsByCategory: (categoryId: string) => Transaction[];
  getTransactionsByType: (type: TransactionType) => Transaction[];
  getTransactionsByStatus: (status: PaymentStatus) => Transaction[];
}

// Calculate initial total from categories
const initialTargetBudget = initialBudgetCategories.reduce((sum, cat) => sum + cat.budgetedAmount, 0);

export const useBudgetStore = create<BudgetState>()(
  persist(
    (set, get) => ({
      targetBudget: initialTargetBudget,
      budgetCategories: initialBudgetCategories,
      transactions: [],
      sponsorContributions: [],

      // Target budget action
      setTargetBudget: (amount) => {
        set({ targetBudget: amount });
      },

      // Budget category actions
      addBudgetCategory: (category) => {
        const newCategory: BudgetCategory = {
          ...category,
          id: crypto.randomUUID(),
        };
        set((state) => ({
          budgetCategories: [...state.budgetCategories, newCategory],
        }));
      },

      updateBudgetCategory: (id, updates) => {
        set((state) => ({
          budgetCategories: state.budgetCategories.map((cat) =>
            cat.id === id ? { ...cat, ...updates } : cat
          ),
        }));
      },

      deleteBudgetCategory: (id) => {
        set((state) => ({
          budgetCategories: state.budgetCategories.filter((cat) => cat.id !== id),
        }));
      },

      // Transaction actions
      addTransaction: (transaction) => {
        const now = new Date();
        const newTransaction: Transaction = {
          ...transaction,
          id: crypto.randomUUID(),
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({
          transactions: [...state.transactions, newTransaction],
        }));
      },

      updateTransaction: (id, updates) => {
        set((state) => ({
          transactions: state.transactions.map((t) =>
            t.id === id ? { ...t, ...updates, updatedAt: new Date() } : t
          ),
        }));
      },

      deleteTransaction: (id) => {
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id),
        }));
      },

      // Sponsor contribution actions
      addSponsorContribution: (contribution) => {
        const newContribution: SponsorContribution = {
          ...contribution,
          id: crypto.randomUUID(),
          createdAt: new Date(),
        };
        set((state) => ({
          sponsorContributions: [...state.sponsorContributions, newContribution],
        }));
      },

      updateSponsorContribution: (id, updates) => {
        set((state) => ({
          sponsorContributions: state.sponsorContributions.map((c) =>
            c.id === id ? { ...c, ...updates } : c
          ),
        }));
      },

      deleteSponsorContribution: (id) => {
        set((state) => ({
          sponsorContributions: state.sponsorContributions.filter((c) => c.id !== id),
        }));
      },

      // Computed getters
      getTotalBudget: () => {
        return get().targetBudget;
      },

      getTotalIncome: () => {
        const transactionIncome = get().transactions
          .filter((t) => t.type === 'income' && t.paymentStatus === 'paid')
          .reduce((sum, t) => sum + t.amount, 0);
        const sponsorIncome = get().sponsorContributions
          .filter((c) => c.paymentStatus === 'paid')
          .reduce((sum, c) => sum + c.amount, 0);
        return transactionIncome + sponsorIncome;
      },

      getTotalExpenses: () => {
        return get().transactions
          .filter((t) => t.type === 'expense' && t.paymentStatus === 'paid')
          .reduce((sum, t) => sum + t.amount, 0);
      },

      getBalance: () => {
        return get().getTotalIncome() - get().getTotalExpenses();
      },

      getCategorySpending: (categoryId) => {
        return get().transactions
          .filter((t) => t.categoryId === categoryId && t.type === 'expense' && t.paymentStatus === 'paid')
          .reduce((sum, t) => sum + t.amount, 0);
      },

      getCategoryRemaining: (categoryId) => {
        const category = get().budgetCategories.find((c) => c.id === categoryId);
        if (!category) return 0;
        return category.budgetedAmount - get().getCategorySpending(categoryId);
      },

      getTransactionsByCategory: (categoryId) => {
        return get().transactions.filter((t) => t.categoryId === categoryId);
      },

      getTransactionsByType: (type) => {
        return get().transactions.filter((t) => t.type === type);
      },

      getTransactionsByStatus: (status) => {
        return get().transactions.filter((t) => t.paymentStatus === status);
      },
    }),
    {
      name: 'ecscs-budget',
    }
  )
);
