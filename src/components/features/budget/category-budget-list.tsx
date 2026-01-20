import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useBudgetStore } from '@/stores/budget-store';
import { useSettingsStore } from '@/stores/settings-store';
import {
  MapPin,
  Package,
  UtensilsCrossed,
  Music,
  Megaphone,
  Trophy,
  Plane,
  FileText,
  MoreHorizontal,
  Pencil,
  Check,
  X,
  Plus,
} from 'lucide-react';
import type { BudgetCategory } from '@/types';

const iconMap: Record<string, React.ReactNode> = {
  MapPin: <MapPin className="h-5 w-5" />,
  Package: <Package className="h-5 w-5" />,
  UtensilsCrossed: <UtensilsCrossed className="h-5 w-5" />,
  Music: <Music className="h-5 w-5" />,
  Megaphone: <Megaphone className="h-5 w-5" />,
  Trophy: <Trophy className="h-5 w-5" />,
  Plane: <Plane className="h-5 w-5" />,
  FileText: <FileText className="h-5 w-5" />,
  MoreHorizontal: <MoreHorizontal className="h-5 w-5" />,
};

function getIcon(iconName: string) {
  return iconMap[iconName] || <MoreHorizontal className="h-5 w-5" />;
}

export function CategoryBudgetList() {
  const { t, i18n } = useTranslation();
  const { budgetCategories, getCategorySpending, updateBudgetCategory, addBudgetCategory } = useBudgetStore();
  const { language } = useSettingsStore();
  const isAmharic = i18n.language === 'am' || language === 'am';

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editAmount, setEditAmount] = useState<string>('');
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: '',
    nameAmharic: '',
    budgetedAmount: '',
  });

  const categoriesWithSpending = useMemo(() => {
    return budgetCategories.map((category) => {
      const spent = getCategorySpending(category.id);
      const remaining = category.budgetedAmount - spent;
      const percentage = category.budgetedAmount > 0
        ? Math.min(100, (spent / category.budgetedAmount) * 100)
        : 0;

      return {
        ...category,
        spent,
        remaining,
        percentage,
      };
    });
  }, [budgetCategories, getCategorySpending]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleStartEdit = (category: BudgetCategory) => {
    setEditingId(category.id);
    setEditAmount(category.budgetedAmount.toString());
  };

  const handleSaveEdit = (categoryId: string) => {
    const amount = parseFloat(editAmount);
    if (!isNaN(amount) && amount >= 0) {
      updateBudgetCategory(categoryId, { budgetedAmount: amount });
    }
    setEditingId(null);
    setEditAmount('');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditAmount('');
  };

  const handleAddCategory = () => {
    if (newCategory.name && newCategory.budgetedAmount) {
      addBudgetCategory({
        name: newCategory.name,
        nameAmharic: newCategory.nameAmharic || newCategory.name,
        budgetedAmount: parseFloat(newCategory.budgetedAmount) || 0,
        color: '#078930',
        icon: 'MoreHorizontal',
      });
      setNewCategory({ name: '', nameAmharic: '', budgetedAmount: '' });
      setIsAddingNew(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{t('budget.categoryBudgets', 'Category Budgets')}</CardTitle>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsAddingNew(true)}
            className="text-[#078930] hover:text-[#067028] hover:bg-[#078930]/10"
          >
            <Plus className="h-4 w-4 mr-1" />
            {t('budget.addCategory', 'Add')}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add New Category Form */}
        {isAddingNew && (
          <div className="p-3 border border-[#E7DFD3] rounded-lg bg-[#F5F0E8]/50 space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <Input
                placeholder={t('budget.categoryName', 'Category name')}
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
              />
              <Input
                type="number"
                placeholder={t('budget.amount', 'Amount')}
                value={newCategory.budgetedAmount}
                onChange={(e) => setNewCategory({ ...newCategory, budgetedAmount: e.target.value })}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setIsAddingNew(false);
                  setNewCategory({ name: '', nameAmharic: '', budgetedAmount: '' });
                }}
              >
                <X className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                onClick={handleAddCategory}
                className="bg-[#078930] hover:bg-[#067028]"
              >
                <Check className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {categoriesWithSpending.map((category) => {
          const isOverBudget = category.spent > category.budgetedAmount;
          const isNearLimit = category.percentage >= 80 && !isOverBudget;
          const isEditing = editingId === category.id;

          return (
            <div key={category.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="p-2 rounded-lg"
                    style={{ backgroundColor: `${category.color}20` }}
                  >
                    <span style={{ color: category.color }}>
                      {getIcon(category.icon)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#1C1917]">
                      {isAmharic ? category.nameAmharic : category.name}
                    </p>
                    {isEditing ? (
                      <div className="flex items-center gap-1 mt-1">
                        <span className="text-xs text-[#78716C]">{formatCurrency(category.spent)} /</span>
                        <Input
                          type="number"
                          value={editAmount}
                          onChange={(e) => setEditAmount(e.target.value)}
                          className="h-6 w-24 text-xs px-2"
                          autoFocus
                        />
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6"
                          onClick={() => handleSaveEdit(category.id)}
                        >
                          <Check className="h-3 w-3 text-[#078930]" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6"
                          onClick={handleCancelEdit}
                        >
                          <X className="h-3 w-3 text-[#DA121A]" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1">
                        <p className="text-xs text-[#78716C]">
                          {formatCurrency(category.spent)} / {formatCurrency(category.budgetedAmount)}
                        </p>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-5 w-5 opacity-0 group-hover:opacity-100 hover:bg-[#F5F0E8]"
                          onClick={() => handleStartEdit(category)}
                        >
                          <Pencil className="h-3 w-3 text-[#78716C]" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-right flex items-center gap-2">
                  {!isEditing && (
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7 hover:bg-[#F5F0E8]"
                      onClick={() => handleStartEdit(category)}
                    >
                      <Pencil className="h-3.5 w-3.5 text-[#78716C]" />
                    </Button>
                  )}
                  <div>
                    <span
                      className={`text-sm font-medium ${
                        isOverBudget
                          ? 'text-[#DA121A]'
                          : isNearLimit
                            ? 'text-[#F59E0B]'
                            : 'text-[#078930]'
                      }`}
                    >
                      {isOverBudget ? '-' : ''}{formatCurrency(Math.abs(category.remaining))}
                    </span>
                    <p className="text-xs text-[#78716C]">
                      {isOverBudget
                        ? t('budget.overBudget', 'Over budget')
                        : t('budget.remaining', 'remaining')}
                    </p>
                  </div>
                </div>
              </div>
              <Progress
                value={category.percentage}
                className="h-2"
                style={{
                  backgroundColor: `${category.color}20`,
                }}
              />
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
