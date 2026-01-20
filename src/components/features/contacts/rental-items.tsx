import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Pencil, Trash2, Package, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { generateId } from '@/lib/utils';
import type { RentalItem } from '@/types';

interface RentalItemsProps {
  items: RentalItem[];
  contactId: string;
  onChange: (items: RentalItem[]) => void;
  readOnly?: boolean;
}

interface RentalItemFormData {
  name: string;
  price: string;
  quantity: string;
}

const initialFormData: RentalItemFormData = {
  name: '',
  price: '',
  quantity: '1',
};

export function RentalItems({ items, contactId, onChange, readOnly = false }: RentalItemsProps) {
  const { t } = useTranslation();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<RentalItemFormData>(initialFormData);

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const resetForm = () => {
    setFormData(initialFormData);
    setIsAdding(false);
    setEditingId(null);
  };

  const handleAdd = () => {
    if (!formData.name || !formData.price) return;

    const newItem: RentalItem = {
      id: generateId(),
      name: formData.name,
      price: parseFloat(formData.price),
      quantity: parseInt(formData.quantity) || 1,
      contactId,
    };

    onChange([...items, newItem]);
    resetForm();
  };

  const handleEdit = (item: RentalItem) => {
    setEditingId(item.id);
    setFormData({
      name: item.name,
      price: item.price.toString(),
      quantity: item.quantity.toString(),
    });
    setIsAdding(false);
  };

  const handleUpdate = () => {
    if (!editingId || !formData.name || !formData.price) return;

    const updatedItems = items.map((item) =>
      item.id === editingId
        ? {
            ...item,
            name: formData.name,
            price: parseFloat(formData.price),
            quantity: parseInt(formData.quantity) || 1,
          }
        : item
    );

    onChange(updatedItems);
    resetForm();
  };

  const handleDelete = (id: string) => {
    onChange(items.filter((item) => item.id !== id));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="flex items-center gap-2 text-sm font-medium text-foreground">
          <Package className="h-4 w-4" />
          {t('contacts.rentalItems.title')}
        </h4>
        {!readOnly && !isAdding && !editingId && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setIsAdding(true);
              setFormData(initialFormData);
            }}
          >
            <Plus className="mr-1 h-4 w-4" />
            {t('contacts.rentalItems.add')}
          </Button>
        )}
      </div>

      {/* Items List */}
      {items.length > 0 ? (
        <div className="space-y-2">
          {items.map((item) => (
            <div
              key={item.id}
              className={cn(
                'flex items-center justify-between rounded-md border border-border bg-muted/30 p-3',
                editingId === item.id && 'ring-2 ring-primary'
              )}
            >
              {editingId === item.id ? (
                <div className="flex-1 space-y-2">
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="text"
                      placeholder={t('contacts.rentalItems.itemName')}
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="col-span-1 rounded-md border border-input bg-background px-3 py-1.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                    <input
                      type="number"
                      placeholder={t('contacts.rentalItems.price')}
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      min="0"
                      step="0.01"
                      className="rounded-md border border-input bg-background px-3 py-1.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                    <input
                      type="number"
                      placeholder={t('contacts.rentalItems.quantity')}
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                      min="1"
                      className="rounded-md border border-input bg-background px-3 py-1.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm" onClick={resetForm}>
                      {t('common.cancel')}
                    </Button>
                    <Button size="sm" onClick={handleUpdate}>
                      {t('common.save')}
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatCurrency(item.price)} x {item.quantity} ={' '}
                      <span className="font-medium text-foreground">
                        {formatCurrency(item.price * item.quantity)}
                      </span>
                    </p>
                  </div>
                  {!readOnly && (
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleEdit(item)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => handleDelete(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      ) : (
        !isAdding && (
          <p className="text-center text-sm text-muted-foreground py-4">
            {t('contacts.rentalItems.noItems')}
          </p>
        )
      )}

      {/* Add Form */}
      {isAdding && (
        <div className="rounded-md border border-border bg-muted/30 p-3 space-y-2">
          <div className="grid grid-cols-3 gap-2">
            <input
              type="text"
              placeholder={t('contacts.rentalItems.itemName')}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="col-span-1 rounded-md border border-input bg-background px-3 py-1.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              autoFocus
            />
            <input
              type="number"
              placeholder={t('contacts.rentalItems.price')}
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              min="0"
              step="0.01"
              className="rounded-md border border-input bg-background px-3 py-1.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            <input
              type="number"
              placeholder={t('contacts.rentalItems.quantity')}
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              min="1"
              className="rounded-md border border-input bg-background px-3 py-1.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={resetForm}>
              {t('common.cancel')}
            </Button>
            <Button size="sm" onClick={handleAdd} disabled={!formData.name || !formData.price}>
              {t('common.add')}
            </Button>
          </div>
        </div>
      )}

      {/* Total */}
      {items.length > 0 && (
        <div className="flex items-center justify-between rounded-md bg-primary/10 px-4 py-3">
          <span className="flex items-center gap-2 font-medium text-foreground">
            <DollarSign className="h-4 w-4" />
            {t('contacts.rentalItems.total')}
          </span>
          <span className="text-lg font-bold text-primary">{formatCurrency(total)}</span>
        </div>
      )}
    </div>
  );
}
