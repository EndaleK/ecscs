import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { DollarSign, TrendingUp, TrendingDown, Wallet, Pencil, Check, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useBudgetStore } from '@/stores/budget-store';

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  editable?: boolean;
  onEdit?: (value: number) => void;
}

function StatCard({ title, value, icon, color, bgColor, editable, onEdit }: StatCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value.toString());

  const formattedValue = new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);

  const handleSave = () => {
    const amount = parseFloat(editValue);
    if (!isNaN(amount) && amount >= 0 && onEdit) {
      onEdit(amount);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value.toString());
    setIsEditing(false);
  };

  const handleStartEdit = () => {
    setEditValue(value.toString());
    setIsEditing(true);
  };

  return (
    <Card className="group">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm text-[#78716C]">{title}</p>
            {isEditing ? (
              <div className="flex items-center gap-2 mt-1">
                <span className="text-lg font-bold text-[#78716C]">$</span>
                <Input
                  type="number"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="h-8 w-28 text-lg font-bold px-2"
                  autoFocus
                />
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7"
                  onClick={handleSave}
                >
                  <Check className="h-4 w-4 text-[#078930]" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7"
                  onClick={handleCancel}
                >
                  <X className="h-4 w-4 text-[#DA121A]" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <p className={`text-2xl font-bold ${color}`}>{formattedValue}</p>
                {editable && (
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#F5F0E8]"
                    onClick={handleStartEdit}
                  >
                    <Pencil className="h-3.5 w-3.5 text-[#78716C]" />
                  </Button>
                )}
              </div>
            )}
          </div>
          <div className={`p-3 rounded-xl ${bgColor}`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function BudgetOverview() {
  const { t } = useTranslation();
  const { getTotalBudget, getTotalIncome, getTotalExpenses, getBalance, setTargetBudget } = useBudgetStore();

  const stats = useMemo(() => ({
    totalBudget: getTotalBudget(),
    totalIncome: getTotalIncome(),
    totalExpenses: getTotalExpenses(),
    balance: getBalance(),
  }), [getTotalBudget, getTotalIncome, getTotalExpenses, getBalance]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title={t('budget.totalBudget', 'Total Budget')}
        value={stats.totalBudget}
        icon={<Wallet className="h-6 w-6 text-[#0F47AF]" />}
        color="text-[#0F47AF]"
        bgColor="bg-[#0F47AF]/10"
        editable
        onEdit={setTargetBudget}
      />
      <StatCard
        title={t('budget.totalIncome', 'Total Income')}
        value={stats.totalIncome}
        icon={<TrendingUp className="h-6 w-6 text-[#078930]" />}
        color="text-[#078930]"
        bgColor="bg-[#078930]/10"
      />
      <StatCard
        title={t('budget.totalExpenses', 'Total Expenses')}
        value={stats.totalExpenses}
        icon={<TrendingDown className="h-6 w-6 text-[#DA121A]" />}
        color="text-[#DA121A]"
        bgColor="bg-[#DA121A]/10"
      />
      <StatCard
        title={t('budget.balance', 'Balance')}
        value={stats.balance}
        icon={<DollarSign className="h-6 w-6 text-[#FCDD09]" />}
        color={stats.balance >= 0 ? 'text-[#078930]' : 'text-[#DA121A]'}
        bgColor="bg-[#FCDD09]/20"
      />
    </div>
  );
}
