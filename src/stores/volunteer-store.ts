import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type { Volunteer } from '../types';

interface VolunteerState {
  volunteers: Volunteer[];
  addVolunteer: (volunteer: Omit<Volunteer, 'id' | 'registeredAt'>) => string;
  updateVolunteer: (id: string, updates: Partial<Omit<Volunteer, 'id' | 'registeredAt'>>) => void;
  deleteVolunteer: (id: string) => void;
  assignShift: (volunteerId: string, shiftId: string) => void;
  unassignShift: (volunteerId: string, shiftId: string) => void;
}

export const useVolunteerStore = create<VolunteerState>()(
  persist(
    (set) => ({
      volunteers: [],

      addVolunteer: (volunteerData) => {
        const id = uuidv4();
        const newVolunteer: Volunteer = {
          ...volunteerData,
          id,
          registeredAt: new Date(),
        };
        set((state) => ({
          volunteers: [...state.volunteers, newVolunteer],
        }));
        return id;
      },

      updateVolunteer: (id, updates) => {
        set((state) => ({
          volunteers: state.volunteers.map((volunteer) =>
            volunteer.id === id ? { ...volunteer, ...updates } : volunteer
          ),
        }));
      },

      deleteVolunteer: (id) => {
        set((state) => ({
          volunteers: state.volunteers.filter((volunteer) => volunteer.id !== id),
        }));
      },

      assignShift: (volunteerId, shiftId) => {
        set((state) => ({
          volunteers: state.volunteers.map((volunteer) =>
            volunteer.id === volunteerId
              ? {
                  ...volunteer,
                  assignedShifts: [...volunteer.assignedShifts, shiftId],
                }
              : volunteer
          ),
        }));
      },

      unassignShift: (volunteerId, shiftId) => {
        set((state) => ({
          volunteers: state.volunteers.map((volunteer) =>
            volunteer.id === volunteerId
              ? {
                  ...volunteer,
                  assignedShifts: volunteer.assignedShifts.filter(
                    (id) => id !== shiftId
                  ),
                }
              : volunteer
          ),
        }));
      },
    }),
    {
      name: 'ecscs-volunteers',
      partialize: (state) => ({ volunteers: state.volunteers }),
    }
  )
);
