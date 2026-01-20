// ECSCS Tournament Workflow Website Type Definitions

// Task status and priority types
export type TaskStatus = 'todo' | 'in_progress' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

// Contact role type
export type ContactRole = 'volunteer' | 'vendor' | 'sponsor' | 'committee' | 'external';

// Reminder type
export type ReminderType = 'browser' | 'email';

// Language type
export type Language = 'en' | 'am';

// Theme type
export type Theme = 'light' | 'dark';

// ChecklistItem interface
export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

// Task interface
export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  categoryId: string;
  assigneeIds: string[];
  dueDate: Date;
  createdAt: Date;
  updatedAt: Date;
  checklist: ChecklistItem[];
  reminderDate: Date | null;
}

// Category interface
export interface Category {
  id: string;
  name: string;
  nameAmharic: string;
  color: string;
  icon: string;
  description: string;
}

// RentalItem interface
export interface RentalItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  contactId: string;
}

// Contact interface
export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: ContactRole;
  categoryIds: string[];
  notes: string;
  isRentalContact: boolean;
  rentalItems: RentalItem[];
}

// Availability interface
export interface Availability {
  date: Date;
  startTime: string;
  endTime: string;
}

// Volunteer interface
export interface Volunteer {
  id: string;
  name: string;
  email: string;
  phone: string;
  skills: string[];
  availability: Availability[];
  assignedShifts: string[];
  registeredAt: Date;
}

// Event interface
export interface Event {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  taskId?: string;
  categoryId?: string;
  location: string;
}

// Reminder interface
export interface Reminder {
  id: string;
  taskId: string;
  date: Date;
  sent: boolean;
  type: ReminderType;
}

// Settings interface
export interface Settings {
  language: Language;
  notificationsEnabled: boolean;
  theme: Theme;
}

// ===== BUDGET & FINANCIAL TYPES =====

// Transaction type
export type TransactionType = 'income' | 'expense';

// Payment status
export type PaymentStatus = 'pending' | 'paid' | 'partial' | 'overdue';

// Budget category interface
export interface BudgetCategory {
  id: string;
  name: string;
  nameAmharic: string;
  budgetedAmount: number;
  color: string;
  icon: string;
}

// Transaction/Line Item interface
export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  categoryId: string;
  date: Date;
  paymentStatus: PaymentStatus;
  vendor?: string;
  contactId?: string;
  notes?: string;
  receiptUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Sponsor Contribution interface
export interface SponsorContribution {
  id: string;
  sponsorName: string;
  contactId?: string;
  amount: number;
  pledgedAmount: number;
  paymentStatus: PaymentStatus;
  contributionType: 'monetary' | 'in-kind';
  description?: string;
  receivedDate?: Date;
  createdAt: Date;
}

// Budget Summary interface
export interface BudgetSummary {
  totalBudget: number;
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  categoryBreakdown: {
    categoryId: string;
    budgeted: number;
    spent: number;
    remaining: number;
  }[];
}
