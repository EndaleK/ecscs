import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Grid, List, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ContactCard } from './contact-card';
import type { Contact, Category, ContactRole } from '@/types';

interface ContactListProps {
  contacts: Contact[];
  categories: Category[];
  onContactClick?: (contact: Contact) => void;
  onContactEdit?: (contact: Contact) => void;
}

type ViewMode = 'grid' | 'list';

export function ContactList({
  contacts,
  categories,
  onContactClick,
  onContactEdit,
}: ContactListProps) {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<ContactRole | 'all'>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  const roles: Array<ContactRole | 'all'> = [
    'all',
    'volunteer',
    'vendor',
    'sponsor',
    'committee',
    'external',
  ];

  const filteredContacts = useMemo(() => {
    return contacts.filter((contact) => {
      // Filter by search query
      const matchesSearch =
        searchQuery === '' ||
        contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchQuery.toLowerCase());

      // Filter by role
      const matchesRole = selectedRole === 'all' || contact.role === selectedRole;

      return matchesSearch && matchesRole;
    });
  }, [contacts, searchQuery, selectedRole]);

  const roleCounts = useMemo(() => {
    const counts: Record<string, number> = { all: contacts.length };
    roles.slice(1).forEach((role) => {
      counts[role] = contacts.filter((c) => c.role === role).length;
    });
    return counts;
  }, [contacts]);

  return (
    <div className="space-y-4">
      {/* Search and View Toggle */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder={t('contacts.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-md border border-input bg-background px-10 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1 rounded-md border border-input p-1">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'ghost'}
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Role Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {roles.map((role) => (
          <button
            key={role}
            onClick={() => setSelectedRole(role)}
            className={cn(
              'inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium transition-colors',
              selectedRole === role
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
            )}
          >
            {role === 'all' ? t('contacts.filters.all') : t(`contacts.roles.${role}`)}
            <span
              className={cn(
                'rounded-full px-1.5 py-0.5 text-xs',
                selectedRole === role
                  ? 'bg-primary-foreground/20 text-primary-foreground'
                  : 'bg-background text-foreground'
              )}
            >
              {roleCounts[role]}
            </span>
          </button>
        ))}
      </div>

      {/* Contact List/Grid */}
      {filteredContacts.length > 0 ? (
        <div
          className={cn(
            viewMode === 'grid'
              ? 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3'
              : 'flex flex-col gap-3'
          )}
        >
          {filteredContacts.map((contact) => (
            <ContactCard
              key={contact.id}
              contact={contact}
              categories={categories}
              onClick={onContactClick}
              onEdit={onContactEdit}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-12">
          <Users className="h-12 w-12 text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-medium text-foreground">
            {t('contacts.noContacts')}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {searchQuery || selectedRole !== 'all'
              ? t('contacts.noMatchingContacts')
              : t('contacts.addFirstContact')}
          </p>
        </div>
      )}
    </div>
  );
}
