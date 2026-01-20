import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Heart,
  Plus,
  CheckCircle,
  Clock,
  AlertCircle,
  MoreHorizontal,
  Pencil,
  Trash2,
  X,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useBudgetStore } from '@/stores/budget-store';
import type { SponsorContribution, PaymentStatus } from '@/types';

const statusIcons: Record<PaymentStatus, React.ReactNode> = {
  pending: <Clock className="h-4 w-4 text-[#F59E0B]" />,
  paid: <CheckCircle className="h-4 w-4 text-[#078930]" />,
  partial: <Clock className="h-4 w-4 text-[#0F47AF]" />,
  overdue: <AlertCircle className="h-4 w-4 text-[#DA121A]" />,
};

export function SponsorContributions() {
  const { t } = useTranslation();
  const {
    sponsorContributions,
    addSponsorContribution,
    updateSponsorContribution,
    deleteSponsorContribution
  } = useBudgetStore();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingContribution, setEditingContribution] = useState<SponsorContribution | null>(null);
  const [formData, setFormData] = useState({
    sponsorName: '',
    pledgedAmount: '',
    amount: '',
    paymentStatus: 'pending' as PaymentStatus,
    contributionType: 'monetary' as 'monetary' | 'in-kind',
    description: '',
  });

  const resetForm = () => {
    setFormData({
      sponsorName: '',
      pledgedAmount: '',
      amount: '',
      paymentStatus: 'pending',
      contributionType: 'monetary',
      description: '',
    });
    setEditingContribution(null);
    setIsFormOpen(false);
  };

  const handleEdit = (contribution: SponsorContribution) => {
    setEditingContribution(contribution);
    setFormData({
      sponsorName: contribution.sponsorName,
      pledgedAmount: contribution.pledgedAmount.toString(),
      amount: contribution.amount.toString(),
      paymentStatus: contribution.paymentStatus,
      contributionType: contribution.contributionType,
      description: contribution.description || '',
    });
    setIsFormOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const contributionData = {
      sponsorName: formData.sponsorName,
      pledgedAmount: parseFloat(formData.pledgedAmount),
      amount: parseFloat(formData.amount) || 0,
      paymentStatus: formData.paymentStatus,
      contributionType: formData.contributionType,
      description: formData.description || undefined,
    };

    if (editingContribution) {
      updateSponsorContribution(editingContribution.id, contributionData);
    } else {
      addSponsorContribution(contributionData);
    }
    resetForm();
  };

  const handleDelete = (id: string) => {
    if (window.confirm(t('budget.confirmDeleteSponsor', 'Are you sure you want to delete this sponsor contribution?'))) {
      deleteSponsorContribution(id);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const totalPledged = sponsorContributions.reduce((sum, c) => sum + c.pledgedAmount, 0);
  const totalReceived = sponsorContributions
    .filter((c) => c.paymentStatus === 'paid')
    .reduce((sum, c) => sum + c.amount, 0);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-[#DA121A]/10 rounded-lg">
              <Heart className="h-5 w-5 text-[#DA121A]" />
            </div>
            <div>
              <CardTitle className="text-lg">{t('budget.sponsorContributions', 'Sponsor Contributions')}</CardTitle>
              <p className="text-sm text-[#78716C]">
                {formatCurrency(totalReceived)} / {formatCurrency(totalPledged)} {t('budget.received', 'received')}
              </p>
            </div>
          </div>
          <Button
            size="sm"
            onClick={() => setIsFormOpen(true)}
            className="bg-[#078930] hover:bg-[#067028]"
          >
            <Plus className="h-4 w-4 mr-1" />
            {t('budget.addSponsor', 'Add Sponsor')}
          </Button>
        </div>
        {totalPledged > 0 && (
          <Progress value={(totalReceived / totalPledged) * 100} className="h-2 mt-3" />
        )}
      </CardHeader>
      <CardContent>
        {/* Form Modal */}
        {isFormOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50" onClick={resetForm} />
            <div className="relative z-10 w-full max-w-md bg-white rounded-xl border border-[#E7DFD3] shadow-xl">
              <div className="h-1 w-full flex">
                <div className="flex-1 bg-[#078930]"></div>
                <div className="flex-1 bg-[#FCDD09]"></div>
                <div className="flex-1 bg-[#DA121A]"></div>
              </div>
              <div className="flex items-center justify-between border-b border-[#E7DFD3] px-6 py-4">
                <h3 className="text-lg font-semibold">
                  {editingContribution
                    ? t('budget.editSponsor', 'Edit Sponsor')
                    : t('budget.addSponsor', 'Add Sponsor')}
                </h3>
                <Button variant="ghost" size="icon" onClick={resetForm}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <Label htmlFor="sponsorName">{t('budget.sponsorName', 'Sponsor Name')} *</Label>
                  <Input
                    id="sponsorName"
                    value={formData.sponsorName}
                    onChange={(e) => setFormData({ ...formData, sponsorName: e.target.value })}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="pledgedAmount">{t('budget.pledgedAmount', 'Pledged Amount')} *</Label>
                    <Input
                      id="pledgedAmount"
                      type="number"
                      min="0"
                      value={formData.pledgedAmount}
                      onChange={(e) => setFormData({ ...formData, pledgedAmount: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="receivedAmount">{t('budget.receivedAmount', 'Received Amount')}</Label>
                    <Input
                      id="receivedAmount"
                      type="number"
                      min="0"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="contributionType">{t('budget.contributionType', 'Type')}</Label>
                    <select
                      id="contributionType"
                      value={formData.contributionType}
                      onChange={(e) => setFormData({ ...formData, contributionType: e.target.value as 'monetary' | 'in-kind' })}
                      className="w-full h-9 border border-[#E7DFD3] rounded-md px-3 bg-white"
                    >
                      <option value="monetary">{t('budget.monetary', 'Monetary')}</option>
                      <option value="in-kind">{t('budget.inKind', 'In-Kind')}</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="paymentStatus">{t('budget.status', 'Status')}</Label>
                    <select
                      id="paymentStatus"
                      value={formData.paymentStatus}
                      onChange={(e) => setFormData({ ...formData, paymentStatus: e.target.value as PaymentStatus })}
                      className="w-full h-9 border border-[#E7DFD3] rounded-md px-3 bg-white"
                    >
                      <option value="pending">{t('budget.pending', 'Pending')}</option>
                      <option value="paid">{t('budget.paid', 'Received')}</option>
                      <option value="partial">{t('budget.partial', 'Partial')}</option>
                    </select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="description">{t('budget.description', 'Description')}</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <Button type="button" variant="outline" onClick={resetForm}>
                    {t('common.cancel', 'Cancel')}
                  </Button>
                  <Button type="submit" className="bg-[#078930] hover:bg-[#067028]">
                    {editingContribution ? t('common.update', 'Update') : t('common.add', 'Add')}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Contributions List */}
        {sponsorContributions.length === 0 ? (
          <div className="text-center py-8 text-[#78716C]">
            <Heart className="h-12 w-12 mx-auto mb-3 text-[#E7DFD3]" />
            <p>{t('budget.noSponsors', 'No sponsors yet')}</p>
            <p className="text-sm mt-1">{t('budget.addSponsorPrompt', 'Add sponsors to track contributions')}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sponsorContributions.map((contribution) => {
              const percentage = contribution.pledgedAmount > 0
                ? (contribution.amount / contribution.pledgedAmount) * 100
                : 0;

              return (
                <div
                  key={contribution.id}
                  className="p-3 rounded-lg border border-[#E7DFD3] hover:bg-[#F5F0E8]/50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-[#1C1917]">{contribution.sponsorName}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        contribution.contributionType === 'monetary'
                          ? 'bg-[#078930]/10 text-[#078930]'
                          : 'bg-[#0F47AF]/10 text-[#0F47AF]'
                      }`}>
                        {contribution.contributionType === 'monetary'
                          ? t('budget.monetary', 'Monetary')
                          : t('budget.inKind', 'In-Kind')}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {statusIcons[contribution.paymentStatus]}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(contribution)}>
                            <Pencil className="h-4 w-4 mr-2" />
                            {t('common.edit', 'Edit')}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(contribution.id)}
                            className="text-[#DA121A]"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            {t('common.delete', 'Delete')}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#78716C]">
                      {formatCurrency(contribution.amount)} / {formatCurrency(contribution.pledgedAmount)}
                    </span>
                    <span className="text-[#078930] font-medium">{Math.round(percentage)}%</span>
                  </div>
                  <Progress value={percentage} className="h-1.5 mt-2" />
                  {contribution.description && (
                    <p className="text-xs text-[#78716C] mt-2">{contribution.description}</p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
