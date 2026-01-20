import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type { Contact, ContactRole } from '../types';

interface ContactState {
  contacts: Contact[];
  addContact: (contact: Omit<Contact, 'id'>) => string;
  updateContact: (id: string, updates: Partial<Omit<Contact, 'id'>>) => void;
  deleteContact: (id: string) => void;
  getContactsByRole: (role: ContactRole) => Contact[];
  getContactById: (id: string) => Contact | undefined;
  getContactsByIds: (ids: string[]) => Contact[];
}

export const useContactStore = create<ContactState>()(
  persist(
    (set, get) => ({
      contacts: [],

      addContact: (contactData) => {
        const id = uuidv4();
        const newContact: Contact = {
          ...contactData,
          id,
        };
        set((state) => ({
          contacts: [...state.contacts, newContact],
        }));
        return id;
      },

      updateContact: (id, updates) => {
        set((state) => ({
          contacts: state.contacts.map((contact) =>
            contact.id === id ? { ...contact, ...updates } : contact
          ),
        }));
      },

      deleteContact: (id) => {
        set((state) => ({
          contacts: state.contacts.filter((contact) => contact.id !== id),
        }));
      },

      getContactsByRole: (role) => {
        return get().contacts.filter((contact) => contact.role === role);
      },

      getContactById: (id) => {
        return get().contacts.find((contact) => contact.id === id);
      },

      getContactsByIds: (ids) => {
        return get().contacts.filter((contact) => ids.includes(contact.id));
      },
    }),
    {
      name: 'ecscs-contacts',
      partialize: (state) => ({ contacts: state.contacts }),
    }
  )
);
