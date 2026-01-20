import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DollarSign, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  BudgetOverview,
  CategoryBudgetList,
  TransactionList,
  TransactionForm,
  SponsorContributions,
} from '@/components/features/budget';
import type { Transaction } from '@/types';

// Section divider with refined Ethiopian accent
function SectionDivider({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/30 to-primary/50"></div>
      <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">{title}</span>
      <div className="h-px flex-1 bg-gradient-to-l from-transparent via-accent/30 to-accent/50"></div>
    </div>
  );
}

export function BudgetPage() {
  const { t } = useTranslation();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | undefined>();

  const handleAddNew = () => {
    setEditingTransaction(undefined);
    setIsFormOpen(true);
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingTransaction(undefined);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-border bg-card/80 backdrop-blur-sm px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <DollarSign className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {t('budget.title', 'Budget & Finance')}
            </h1>
            <p className="text-sm text-muted-foreground">
              {t('budget.description', 'Track income, expenses, and sponsorships')}
            </p>
          </div>
        </div>
        <Button
          onClick={handleAddNew}
          className="bg-primary hover:bg-primary-dark text-primary-foreground"
        >
          <Plus className="mr-2 h-4 w-4" />
          {t('budget.addTransaction', 'Add Transaction')}
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6 space-y-6">
        {/* Overview Cards */}
        <section>
          <SectionDivider title={t('budget.overview', 'Overview')} />
          <BudgetOverview />
        </section>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column - Category Budgets & Sponsors */}
          <div className="lg:col-span-4 space-y-6">
            <section>
              <SectionDivider title={t('budget.categoryBudgets', 'Category Budgets')} />
              <CategoryBudgetList />
            </section>
            <section>
              <SectionDivider title={t('budget.sponsors', 'Sponsors')} />
              <SponsorContributions />
            </section>
          </div>

          {/* Right Column - Transactions */}
          <div className="lg:col-span-8">
            <section>
              <SectionDivider title={t('budget.transactions', 'Transactions')} />
              <TransactionList onEdit={handleEdit} />
            </section>
          </div>
        </div>
      </div>

      {/* Transaction Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={handleFormClose}
          />
          <div className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-xl border border-border bg-card shadow-xl">
            {/* Subtle Ethiopian accent line at top */}
            <div className="ethiopian-accent-line"></div>

            {/* Header */}
            <div className="flex items-center justify-between border-b border-border px-6 py-4 bg-muted/30">
              <h2 className="text-lg font-semibold text-foreground">
                {editingTransaction
                  ? t('budget.editTransaction', 'Edit Transaction')
                  : t('budget.addTransaction', 'Add Transaction')}
              </h2>
              <Button variant="ghost" size="icon" onClick={handleFormClose}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Content */}
            <div className="overflow-y-auto p-6 max-h-[calc(90vh-5rem)]">
              <TransactionForm
                transaction={editingTransaction}
                onSubmit={handleFormClose}
                onCancel={handleFormClose}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
