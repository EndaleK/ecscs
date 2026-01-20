import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Users, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ContactList } from '@/components/features/contacts/contact-list';
import { ContactForm } from '@/components/features/contacts/contact-form';
import { ContactDialog } from '@/components/features/contacts/contact-dialog';
import { useContactStore } from '@/stores/contact-store';
import { useCategoryStore } from '@/stores/category-store';
import { useTaskStore } from '@/stores/task-store';
import type { Contact } from '@/types';

export function ContactsPage() {
  const { t } = useTranslation();
  const { contacts, addContact, updateContact, deleteContact } = useContactStore();
  const { categories } = useCategoryStore();
  const { tasks } = useTaskStore();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  const handleAddContact = (data: Omit<Contact, 'id'>) => {
    addContact(data);
    setIsFormOpen(false);
  };

  const handleUpdateContact = (id: string, data: Partial<Omit<Contact, 'id'>>) => {
    updateContact(id, data);
    setEditingContact(null);
    // Update selected contact if it's the same one being updated
    if (selectedContact?.id === id) {
      setSelectedContact({ ...selectedContact, ...data } as Contact);
    }
  };

  const handleDeleteContact = (id: string) => {
    deleteContact(id);
    setSelectedContact(null);
  };

  const handleContactClick = (contact: Contact) => {
    setSelectedContact(contact);
  };

  const handleContactEdit = (contact: Contact) => {
    setEditingContact(contact);
    setIsFormOpen(true);
  };

  const handleFormCancel = () => {
    setIsFormOpen(false);
    setEditingContact(null);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-border bg-card/80 backdrop-blur-sm px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-foreground">
            <Users className="h-7 w-7" />
            {t('sidebar.contacts')}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {t('contacts.description')}
          </p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          {t('contacts.addContact')}
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6">
        <ContactList
          contacts={contacts}
          categories={categories}
          onContactClick={handleContactClick}
          onContactEdit={handleContactEdit}
        />
      </div>

      {/* Add/Edit Contact Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={handleFormCancel}
          />

          {/* Dialog */}
          <div className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-lg border border-border bg-background shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <h2 className="text-lg font-semibold text-foreground">
                {editingContact ? t('contacts.editContact') : t('contacts.addContact')}
              </h2>
              <Button variant="ghost" size="icon" onClick={handleFormCancel}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Content */}
            <div className="overflow-y-auto p-6 max-h-[calc(90vh-5rem)]">
              <ContactForm
                contact={editingContact || undefined}
                categories={categories}
                onSubmit={
                  editingContact
                    ? (data) => handleUpdateContact(editingContact.id, data)
                    : handleAddContact
                }
                onCancel={handleFormCancel}
              />
            </div>
          </div>
        </div>
      )}

      {/* Contact Details Dialog */}
      {selectedContact && (
        <ContactDialog
          contact={selectedContact}
          categories={categories}
          tasks={tasks}
          isOpen={!!selectedContact}
          onClose={() => setSelectedContact(null)}
          onUpdate={handleUpdateContact}
          onDelete={handleDeleteContact}
        />
      )}
    </div>
  );
}
