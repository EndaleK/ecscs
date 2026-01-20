import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useBudgetStore } from '@/stores/budget-store';
import { useSettingsStore } from '@/stores/settings-store';
import type { Transaction, TransactionType, PaymentStatus } from '@/types';

interface TransactionFormProps {
  transaction?: Transaction;
  onSubmit: () => void;
  onCancel: () => void;
}

export function TransactionForm({ transaction, onSubmit, onCancel }: TransactionFormProps) {
  const { t, i18n } = useTranslation();
  const { addTransaction, updateTransaction, budgetCategories } = useBudgetStore();
  const { language } = useSettingsStore();
  const isAmharic = i18n.language === 'am' || language === 'am';

  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    type: 'expense' as TransactionType,
    categoryId: budgetCategories[0]?.id || '',
    date: new Date().toISOString().split('T')[0],
    paymentStatus: 'pending' as PaymentStatus,
    vendor: '',
    notes: '',
  });

  useEffect(() => {
    if (transaction) {
      setFormData({
        description: transaction.description,
        amount: transaction.amount.toString(),
        type: transaction.type,
        categoryId: transaction.categoryId,
        date: new Date(transaction.date).toISOString().split('T')[0],
        paymentStatus: transaction.paymentStatus,
        vendor: transaction.vendor || '',
        notes: transaction.notes || '',
      });
    }
  }, [transaction]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const transactionData = {
      description: formData.description,
      amount: parseFloat(formData.amount),
      type: formData.type,
      categoryId: formData.categoryId,
      date: new Date(formData.date),
      paymentStatus: formData.paymentStatus,
      vendor: formData.vendor || undefined,
      notes: formData.notes || undefined,
    };

    if (transaction) {
      updateTransaction(transaction.id, transactionData);
    } else {
      addTransaction(transactionData);
    }

    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="description">{t('budget.description', 'Description')} *</Label>
        <Input
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder={t('budget.descriptionPlaceholder', 'Enter transaction description')}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="amount">{t('budget.amount', 'Amount')} *</Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            min="0"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            placeholder="0.00"
            required
          />
        </div>
        <div>
          <Label htmlFor="type">{t('budget.type', 'Type')} *</Label>
          <select
            id="type"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value as TransactionType })}
            className="w-full h-9 border border-[#E7DFD3] rounded-md px-3 bg-white"
            required
          >
            <option value="expense">{t('budget.expense', 'Expense')}</option>
            <option value="income">{t('budget.income', 'Income')}</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="category">{t('budget.category', 'Category')} *</Label>
          <select
            id="category"
            value={formData.categoryId}
            onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
            className="w-full h-9 border border-[#E7DFD3] rounded-md px-3 bg-white"
            required
          >
            {budgetCategories.map((category) => (
              <option key={category.id} value={category.id}>
                {isAmharic ? category.nameAmharic : category.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="date">{t('budget.date', 'Date')} *</Label>
          <Input
            id="date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="status">{t('budget.paymentStatus', 'Payment Status')} *</Label>
          <select
            id="status"
            value={formData.paymentStatus}
            onChange={(e) => setFormData({ ...formData, paymentStatus: e.target.value as PaymentStatus })}
            className="w-full h-9 border border-[#E7DFD3] rounded-md px-3 bg-white"
            required
          >
            <option value="pending">{t('budget.pending', 'Pending')}</option>
            <option value="paid">{t('budget.paid', 'Paid')}</option>
            <option value="partial">{t('budget.partial', 'Partial')}</option>
            <option value="overdue">{t('budget.overdue', 'Overdue')}</option>
          </select>
        </div>
        <div>
          <Label htmlFor="vendor">{t('budget.vendor', 'Vendor/Payee')}</Label>
          <Input
            id="vendor"
            value={formData.vendor}
            onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
            placeholder={t('budget.vendorPlaceholder', 'Enter vendor name')}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="notes">{t('budget.notes', 'Notes')}</Label>
        <textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder={t('budget.notesPlaceholder', 'Add any additional notes')}
          className="w-full min-h-[80px] border border-[#E7DFD3] rounded-md px-3 py-2 bg-white resize-none"
        />
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          {t('common.cancel', 'Cancel')}
        </Button>
        <Button type="submit" className="bg-[#078930] hover:bg-[#067028]">
          {transaction ? t('common.update', 'Update') : t('common.add', 'Add')}
        </Button>
      </div>
    </form>
  );
}
