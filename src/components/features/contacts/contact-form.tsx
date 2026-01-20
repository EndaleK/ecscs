import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { User, Mail, Phone, FileText, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { RentalItems } from './rental-items';
import type { Contact, ContactRole, Category, RentalItem } from '@/types';

interface ContactFormProps {
  contact?: Contact;
  categories: Category[];
  onSubmit: (data: Omit<Contact, 'id'>) => void;
  onCancel: () => void;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  role: ContactRole;
  categoryIds: string[];
  notes: string;
  isRentalContact: boolean;
  rentalItems: RentalItem[];
}

const roles: ContactRole[] = ['volunteer', 'vendor', 'sponsor', 'committee', 'external'];

export function ContactForm({ contact, categories, onSubmit, onCancel }: ContactFormProps) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    role: 'volunteer',
    categoryIds: [],
    notes: '',
    isRentalContact: false,
    rentalItems: [],
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  useEffect(() => {
    if (contact) {
      setFormData({
        name: contact.name,
        email: contact.email,
        phone: contact.phone,
        role: contact.role,
        categoryIds: contact.categoryIds,
        notes: contact.notes,
        isRentalContact: contact.isRentalContact,
        rentalItems: contact.rentalItems,
      });
    }
  }, [contact]);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = t('contacts.form.errors.nameRequired');
    }

    if (!formData.email.trim()) {
      newErrors.email = t('contacts.form.errors.emailRequired');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('contacts.form.errors.emailInvalid');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  const toggleCategory = (categoryId: string) => {
    setFormData((prev) => ({
      ...prev,
      categoryIds: prev.categoryIds.includes(categoryId)
        ? prev.categoryIds.filter((id) => id !== categoryId)
        : [...prev.categoryIds, categoryId],
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-foreground">
          <User className="h-4 w-4" />
          {t('contacts.form.name')}
          <span className="text-destructive">*</span>
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder={t('contacts.form.namePlaceholder')}
          className={cn(
            'w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            errors.name ? 'border-destructive' : 'border-input'
          )}
        />
        {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
      </div>

      {/* Email */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-foreground">
          <Mail className="h-4 w-4" />
          {t('contacts.form.email')}
          <span className="text-destructive">*</span>
        </label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder={t('contacts.form.emailPlaceholder')}
          className={cn(
            'w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            errors.email ? 'border-destructive' : 'border-input'
          )}
        />
        {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
      </div>

      {/* Phone */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-foreground">
          <Phone className="h-4 w-4" />
          {t('contacts.form.phone')}
        </label>
        <input
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          placeholder={t('contacts.form.phonePlaceholder')}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        />
      </div>

      {/* Role */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">{t('contacts.form.role')}</label>
        <div className="flex flex-wrap gap-2">
          {roles.map((role) => (
            <button
              key={role}
              type="button"
              onClick={() => setFormData({ ...formData, role })}
              className={cn(
                'rounded-full px-3 py-1.5 text-sm font-medium transition-colors',
                formData.role === role
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
              )}
            >
              {t(`contacts.roles.${role}`)}
            </button>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          {t('contacts.form.categories')}
        </label>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => toggleCategory(category.id)}
              className={cn(
                'inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-medium transition-all',
                formData.categoryIds.includes(category.id)
                  ? 'ring-2 ring-primary ring-offset-2'
                  : 'hover:opacity-80'
              )}
              style={{
                backgroundColor: `${category.color}20`,
                color: category.color,
              }}
            >
              {formData.categoryIds.includes(category.id) && <Check className="h-3 w-3" />}
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-foreground">
          <FileText className="h-4 w-4" />
          {t('contacts.form.notes')}
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder={t('contacts.form.notesPlaceholder')}
          rows={3}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
        />
      </div>

      {/* Is Rental Contact */}
      <div className="space-y-4">
        <label className="flex items-center gap-3 cursor-pointer">
          <div className="relative">
            <input
              type="checkbox"
              checked={formData.isRentalContact}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  isRentalContact: e.target.checked,
                  rentalItems: e.target.checked ? formData.rentalItems : [],
                })
              }
              className="sr-only peer"
            />
            <div className="h-5 w-5 rounded border border-input bg-background peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2 peer-checked:bg-primary peer-checked:border-primary transition-colors">
              {formData.isRentalContact && (
                <Check className="h-4 w-4 text-primary-foreground m-0.5" />
              )}
            </div>
          </div>
          <span className="text-sm font-medium text-foreground">
            {t('contacts.form.isRentalContact')}
          </span>
        </label>

        {/* Rental Items */}
        {formData.isRentalContact && (
          <div className="rounded-lg border border-border p-4">
            <RentalItems
              items={formData.rentalItems}
              contactId={contact?.id || 'new'}
              onChange={(items) => setFormData({ ...formData, rentalItems: items })}
            />
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t border-border">
        <Button type="button" variant="outline" onClick={onCancel}>
          {t('common.cancel')}
        </Button>
        <Button type="submit">{contact ? t('common.save') : t('contacts.form.create')}</Button>
      </div>
    </form>
  );
}
