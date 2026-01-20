import { useTranslation } from 'react-i18next';
import { Mail, Phone, Pencil } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import type { Contact, Category, ContactRole } from '@/types';

interface ContactCardProps {
  contact: Contact;
  categories: Category[];
  onEdit?: (contact: Contact) => void;
  onClick?: (contact: Contact) => void;
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

export function ContactCard({ contact, categories, onEdit, onClick }: ContactCardProps) {
  const { t } = useTranslation();

  const assignedCategories = categories.filter((cat) =>
    contact.categoryIds.includes(cat.id)
  );

  const handleEmailClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.location.href = `mailto:${contact.email}`;
  };

  const handlePhoneClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.location.href = `tel:${contact.phone}`;
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.(contact);
  };

  return (
    <div
      className={cn(
        'group relative rounded-lg border border-border bg-card p-4 shadow-sm transition-all hover:shadow-md',
        onClick && 'cursor-pointer hover:border-primary/50'
      )}
      onClick={() => onClick?.(contact)}
    >
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div
          className={cn(
            'flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-lg font-semibold text-white',
            getAvatarColor(contact.name)
          )}
        >
          {getInitials(contact.name)}
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-medium text-foreground truncate">{contact.name}</h3>
              <span
                className={cn(
                  'mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium',
                  roleColors[contact.role]
                )}
              >
                {t(`contacts.roles.${contact.role}`)}
              </span>
            </div>
            {contact.isRentalContact && (
              <span className="shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-900 dark:text-amber-200">
                {t('contacts.rental')}
              </span>
            )}
          </div>

          {/* Contact info */}
          <div className="mt-3 space-y-1">
            {contact.email && (
              <button
                onClick={handleEmailClick}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <Mail className="h-4 w-4" />
                <span className="truncate">{contact.email}</span>
              </button>
            )}
            {contact.phone && (
              <button
                onClick={handlePhoneClick}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <Phone className="h-4 w-4" />
                <span>{contact.phone}</span>
              </button>
            )}
          </div>

          {/* Categories */}
          {assignedCategories.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1">
              {assignedCategories.map((category) => (
                <span
                  key={category.id}
                  className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium"
                  style={{
                    backgroundColor: `${category.color}20`,
                    color: category.color,
                  }}
                >
                  {category.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div className="absolute right-2 top-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        {contact.email && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleEmailClick}
            title={t('contacts.actions.email')}
          >
            <Mail className="h-4 w-4" />
          </Button>
        )}
        {contact.phone && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handlePhoneClick}
            title={t('contacts.actions.call')}
          >
            <Phone className="h-4 w-4" />
          </Button>
        )}
        {onEdit && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleEditClick}
            title={t('common.edit')}
          >
            <Pencil className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
