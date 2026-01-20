import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Mail, Phone, FileText, ListTodo, Pencil, Package } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ContactForm } from './contact-form';
import { RentalItems } from './rental-items';
import type { Contact, Category, Task, ContactRole } from '@/types';

interface ContactDialogProps {
  contact: Contact;
  categories: Category[];
  tasks?: Task[];
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (id: string, data: Partial<Omit<Contact, 'id'>>) => void;
  onDelete?: (id: string) => void;
}

const roleColors: Record<ContactRole, string> = {
  volunteer: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  vendor: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  sponsor: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  committee: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  external: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
};

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part.charAt(0))
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

function getAvatarColor(name: string): string {
  const colors = [
    'bg-red-500',
    'bg-orange-500',
    'bg-amber-500',
    'bg-yellow-500',
    'bg-lime-500',
    'bg-green-500',
    'bg-emerald-500',
    'bg-teal-500',
    'bg-cyan-500',
    'bg-sky-500',
    'bg-blue-500',
    'bg-indigo-500',
    'bg-violet-500',
    'bg-purple-500',
    'bg-fuchsia-500',
    'bg-pink-500',
    'bg-rose-500',
  ];
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
}

export function ContactDialog({
  contact,
  categories,
  tasks = [],
  isOpen,
  onClose,
  onUpdate,
  onDelete,
}: ContactDialogProps) {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);

  if (!isOpen) return null;

  const assignedCategories = categories.filter((cat) =>
    contact.categoryIds.includes(cat.id)
  );

  const assignedTasks = tasks.filter((task) => task.assigneeIds.includes(contact.id));

  const handleUpdate = (data: Omit<Contact, 'id'>) => {
    onUpdate(contact.id, data);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm(t('contacts.confirmDelete'))) {
      onDelete?.(contact.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-lg border border-border bg-background shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="text-lg font-semibold text-foreground">
            {isEditing ? t('contacts.editContact') : t('contacts.contactDetails')}
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6 max-h-[calc(90vh-8rem)]">
          {isEditing ? (
            <ContactForm
              contact={contact}
              categories={categories}
              onSubmit={handleUpdate}
              onCancel={() => setIsEditing(false)}
            />
          ) : (
            <div className="space-y-6">
              {/* Contact Header */}
              <div className="flex items-start gap-4">
                <div
                  className={cn(
                    'flex h-16 w-16 shrink-0 items-center justify-center rounded-full text-2xl font-semibold text-white',
                    getAvatarColor(contact.name)
                  )}
                >
                  {getInitials(contact.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-semibold text-foreground">{contact.name}</h3>
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <span
                      className={cn(
                        'inline-block rounded-full px-2.5 py-0.5 text-sm font-medium',
                        roleColors[contact.role]
                      )}
                    >
                      {t(`contacts.roles.${contact.role}`)}
                    </span>
                    {contact.isRentalContact && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-sm font-medium text-amber-800 dark:bg-amber-900 dark:text-amber-200">
                        <Package className="h-3 w-3" />
                        {t('contacts.rental')}
                      </span>
                    )}
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                  <Pencil className="mr-1 h-4 w-4" />
                  {t('common.edit')}
                </Button>
              </div>

              {/* Contact Info */}
              <div className="space-y-3">
                {contact.email && (
                  <a
                    href={`mailto:${contact.email}`}
                    className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Mail className="h-5 w-5" />
                    <span>{contact.email}</span>
                  </a>
                )}
                {contact.phone && (
                  <a
                    href={`tel:${contact.phone}`}
                    className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Phone className="h-5 w-5" />
                    <span>{contact.phone}</span>
                  </a>
                )}
              </div>

              {/* Categories */}
              {assignedCategories.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-foreground">
                    {t('contacts.assignedCategories')}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {assignedCategories.map((category) => (
                      <span
                        key={category.id}
                        className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium"
                        style={{
                          backgroundColor: `${category.color}20`,
                          color: category.color,
                        }}
                      >
                        {category.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes */}
              {contact.notes && (
                <div className="space-y-2">
                  <h4 className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <FileText className="h-4 w-4" />
                    {t('contacts.form.notes')}
                  </h4>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap rounded-md bg-muted/50 p-3">
                    {contact.notes}
                  </p>
                </div>
              )}

              {/* Rental Items */}
              {contact.isRentalContact && (
                <div className="rounded-lg border border-border p-4">
                  <RentalItems
                    items={contact.rentalItems}
                    contactId={contact.id}
                    onChange={(items) => onUpdate(contact.id, { rentalItems: items })}
                    readOnly
                  />
                </div>
              )}

              {/* Assigned Tasks */}
              {assignedTasks.length > 0 && (
                <div className="space-y-2">
                  <h4 className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <ListTodo className="h-4 w-4" />
                    {t('contacts.assignedTasks')} ({assignedTasks.length})
                  </h4>
                  <div className="space-y-2">
                    {assignedTasks.map((task) => {
                      const category = categories.find((c) => c.id === task.categoryId);
                      return (
                        <div
                          key={task.id}
                          className="flex items-center justify-between rounded-md border border-border bg-muted/30 p-3"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-foreground truncate">{task.title}</p>
                            {category && (
                              <span
                                className="inline-flex items-center mt-1 rounded-full px-2 py-0.5 text-xs font-medium"
                                style={{
                                  backgroundColor: `${category.color}20`,
                                  color: category.color,
                                }}
                              >
                                {category.name}
                              </span>
                            )}
                          </div>
                          <span
                            className={cn(
                              'shrink-0 rounded-full px-2 py-0.5 text-xs font-medium',
                              task.status === 'done'
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                : task.status === 'in_progress'
                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                            )}
                          >
                            {t(`tasks.status.${task.status}`)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {!isEditing && onDelete && (
          <div className="flex justify-between border-t border-border px-6 py-4">
            <Button variant="destructive" onClick={handleDelete}>
              {t('common.delete')}
            </Button>
            <div className="flex gap-2">
              {contact.email && (
                <Button variant="outline" asChild>
                  <a href={`mailto:${contact.email}`}>
                    <Mail className="mr-2 h-4 w-4" />
                    {t('contacts.actions.email')}
                  </a>
                </Button>
              )}
              {contact.phone && (
                <Button variant="outline" asChild>
                  <a href={`tel:${contact.phone}`}>
                    <Phone className="mr-2 h-4 w-4" />
                    {t('contacts.actions.call')}
                  </a>
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
