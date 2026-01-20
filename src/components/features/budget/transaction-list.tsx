import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ArrowUpCircle,
  ArrowDownCircle,
  MoreHorizontal,
  Pencil,
  Trash2,
  Clock,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useBudgetStore } from '@/stores/budget-store';
import { useSettingsStore } from '@/stores/settings-store';
import type { Transaction, PaymentStatus, TransactionType } from '@/types';

interface TransactionListProps {
  onEdit?: (transaction: Transaction) => void;
}

const statusIcons: Record<PaymentStatus, React.ReactNode> = {
  pending: <Clock className="h-4 w-4 text-[#F59E0B]" />,
  paid: <CheckCircle className="h-4 w-4 text-[#078930]" />,
  partial: <Clock className="h-4 w-4 text-[#0F47AF]" />,
  overdue: <AlertCircle className="h-4 w-4 text-[#DA121A]" />,
};

export function TransactionList({ onEdit }: TransactionListProps) {
  const { t, i18n } = useTranslation();
  const { transactions, deleteTransaction, budgetCategories } = useBudgetStore();
  const { language } = useSettingsStore();
  const isAmharic = i18n.language === 'am' || language === 'am';

  const [filterType, setFilterType] = useState<TransactionType | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<PaymentStatus | 'all'>('all');

  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((t) => filterType === 'all' || t.type === filterType)
      .filter((t) => filterStatus === 'all' || t.paymentStatus === filterStatus)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, filterType, filterStatus]);

  const getCategoryName = (categoryId: string) => {
    const category = budgetCategories.find((c) => c.id === categoryId);
    if (!category) return categoryId;
    return isAmharic ? category.nameAmharic : category.name;
  };

  const getCategoryColor = (categoryId: string) => {
    const category = budgetCategories.find((c) => c.id === categoryId);
    return category?.color || '#78716C';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat(isAmharic ? 'am-ET' : 'en-CA', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(date));
  };

  const handleDelete = (id: string) => {
    if (window.confirm(t('budget.confirmDeleteTransaction', 'Are you sure you want to delete this transaction?'))) {
      deleteTransaction(id);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{t('budget.transactions', 'Transactions')}</CardTitle>
          <div className="flex gap-2">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as TransactionType | 'all')}
              className="text-sm border border-[#E7DFD3] rounded-lg px-3 py-1.5 bg-white"
            >
              <option value="all">{t('budget.allTypes', 'All Types')}</option>
              <option value="income">{t('budget.income', 'Income')}</option>
              <option value="expense">{t('budget.expense', 'Expense')}</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as PaymentStatus | 'all')}
              className="text-sm border border-[#E7DFD3] rounded-lg px-3 py-1.5 bg-white"
            >
              <option value="all">{t('budget.allStatuses', 'All Statuses')}</option>
              <option value="pending">{t('budget.pending', 'Pending')}</option>
              <option value="paid">{t('budget.paid', 'Paid')}</option>
              <option value="partial">{t('budget.partial', 'Partial')}</option>
              <option value="overdue">{t('budget.overdue', 'Overdue')}</option>
            </select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-8 text-[#78716C]">
            <p>{t('budget.noTransactions', 'No transactions yet')}</p>
            <p className="text-sm mt-1">{t('budget.addTransactionPrompt', 'Add your first transaction to start tracking')}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-3 rounded-lg border border-[#E7DFD3] hover:bg-[#F5F0E8]/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    transaction.type === 'income'
                      ? 'bg-[#078930]/10'
                      : 'bg-[#DA121A]/10'
                  }`}>
                    {transaction.type === 'income'
                      ? <ArrowUpCircle className="h-5 w-5 text-[#078930]" />
                      : <ArrowDownCircle className="h-5 w-5 text-[#DA121A]" />
                    }
                  </div>
                  <div>
                    <p className="font-medium text-[#1C1917]">{transaction.description}</p>
                    <div className="flex items-center gap-2 text-xs text-[#78716C]">
                      <span
                        className="px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: `${getCategoryColor(transaction.categoryId)}20` }}
                      >
                        {getCategoryName(transaction.categoryId)}
                      </span>
                      <span>•</span>
                      <span>{formatDate(transaction.date)}</span>
                      {transaction.vendor && (
                        <>
                          <span>•</span>
                          <span>{transaction.vendor}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    {statusIcons[transaction.paymentStatus]}
                    <span className="text-xs text-[#78716C] capitalize">
                      {t(`budget.${transaction.paymentStatus}`, transaction.paymentStatus)}
                    </span>
                  </div>
                  <span className={`font-semibold ${
                    transaction.type === 'income' ? 'text-[#078930]' : 'text-[#DA121A]'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                  </span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit?.(transaction)}>
                        <Pencil className="h-4 w-4 mr-2" />
                        {t('common.edit', 'Edit')}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDelete(transaction.id)}
                        className="text-[#DA121A]"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        {t('common.delete', 'Delete')}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
