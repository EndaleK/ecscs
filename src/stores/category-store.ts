import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type { Category } from '../types';

// Initial categories for tournament workflow
const initialCategories: Category[] = [
  {
    id: uuidv4(),
    name: 'Venue & Logistics',
    nameAmharic: 'ቦታ እና ሎጂስቲክስ',
    color: '#3B82F6',
    icon: 'building',
    description: 'Venue booking, setup, and logistics coordination',
  },
  {
    id: uuidv4(),
    name: 'Teams & Registration',
    nameAmharic: 'ቡድኖች እና ምዝገባ',
    color: '#10B981',
    icon: 'users',
    description: 'Team registration, rosters, and player management',
  },
  {
    id: uuidv4(),
    name: 'Equipment & Supplies',
    nameAmharic: 'መሣሪያዎች እና አቅርቦቶች',
    color: '#F59E0B',
    icon: 'package',
    description: 'Sports equipment, supplies, and inventory',
  },
  {
    id: uuidv4(),
    name: 'Volunteers & Staff',
    nameAmharic: 'በጎ ፈቃደኞች እና ሠራተኞች',
    color: '#8B5CF6',
    icon: 'heart-handshake',
    description: 'Volunteer recruitment, scheduling, and coordination',
  },
  {
    id: uuidv4(),
    name: 'Marketing & Promotion',
    nameAmharic: 'ማርኬቲንግ እና ማስተዋወቅ',
    color: '#EC4899',
    icon: 'megaphone',
    description: 'Marketing campaigns, social media, and promotion',
  },
  {
    id: uuidv4(),
    name: 'Finance & Sponsors',
    nameAmharic: 'ፋይናንስ እና ስፖንሰሮች',
    color: '#14B8A6',
    icon: 'banknote',
    description: 'Budget management, sponsorships, and fundraising',
  },
  {
    id: uuidv4(),
    name: 'Food & Refreshments',
    nameAmharic: 'ምግብ እና መጠጦች',
    color: '#F97316',
    icon: 'utensils',
    description: 'Catering, food vendors, and refreshment planning',
  },
  {
    id: uuidv4(),
    name: 'Awards & Ceremonies',
    nameAmharic: 'ሽልማቶች እና ሥነ ሥርዓቶች',
    color: '#EAB308',
    icon: 'trophy',
    description: 'Trophies, medals, certificates, and ceremonies',
  },
];

interface CategoryState {
  categories: Category[];
  addCategory: (category: Omit<Category, 'id'>) => string;
  updateCategory: (id: string, updates: Partial<Omit<Category, 'id'>>) => void;
  deleteCategory: (id: string) => void;
}

export const useCategoryStore = create<CategoryState>()(
  persist(
    (set) => ({
      categories: initialCategories,

      addCategory: (categoryData) => {
        const id = uuidv4();
        const newCategory: Category = {
          ...categoryData,
          id,
        };
        set((state) => ({
          categories: [...state.categories, newCategory],
        }));
        return id;
      },

      updateCategory: (id, updates) => {
        set((state) => ({
          categories: state.categories.map((category) =>
            category.id === id ? { ...category, ...updates } : category
          ),
        }));
      },

      deleteCategory: (id) => {
        set((state) => ({
          categories: state.categories.filter((category) => category.id !== id),
        }));
      },
    }),
    {
      name: 'ecscs-categories',
      partialize: (state) => ({ categories: state.categories }),
    }
  )
);
