// ECSCS Tournament Initial Categories Data
// Pre-defined tournament categories for the Ethiopian Community Sports and Cultural Society

import type { Category } from '../types';

/**
 * Category template interface (without id for initial data)
 */
interface CategoryTemplate {
  name: string;
  nameAmharic: string;
  color: string;
  icon: string;
  description: string;
}

/**
 * Initial category templates for the ECSCS Tournament
 * These templates are used to generate categories with unique IDs
 */
export const initialCategories: CategoryTemplate[] = [
  {
    name: 'Soccer Field',
    nameAmharic: 'የእግር ኳስ ሜዳ',
    color: '#22c55e',
    icon: 'trophy',
    description: 'Includes: Referee, Men\'s Tournament, Ladies Tournament, Kids Tournament, Over 40 Tournament, Security',
  },
  {
    name: 'Tent',
    nameAmharic: 'ድንኳን',
    color: '#8b5cf6',
    icon: 'tent',
    description: 'Includes: Food/Coffee, Vendors, Community booths',
  },
  {
    name: 'Kids Playground',
    nameAmharic: 'የልጆች መጫወቻ',
    color: '#f97316',
    icon: 'baby',
    description: 'Activities for children',
  },
  {
    name: 'Hotel/Airbnb',
    nameAmharic: 'ሆቴል/አየር ቢ ኤን ቢ',
    color: '#0ea5e9',
    icon: 'hotel',
    description: 'Accommodation arrangements',
  },
  {
    name: 'Magazine',
    nameAmharic: 'መጽሔት',
    color: '#ec4899',
    icon: 'book-open',
    description: 'Event publication',
  },
  {
    name: 'Sponsor',
    nameAmharic: 'ስፖንሰር',
    color: '#eab308',
    icon: 'handshake',
    description: 'Sponsorship management',
  },
  {
    name: 'Voluntary Workers',
    nameAmharic: 'በጎ ፈቃደኛ ሰራተኞች',
    color: '#06b6d4',
    icon: 'users',
    description: 'Volunteer coordination',
  },
  {
    name: 'Music Concert',
    nameAmharic: 'የሙዚቃ ኮንሰርት',
    color: '#a855f7',
    icon: 'music',
    description: 'Includes: Sound System, Musicians, Tickets, Stage setup',
  },
  {
    name: 'Advertisement',
    nameAmharic: 'ማስታወቂያ',
    color: '#ef4444',
    icon: 'megaphone',
    description: 'Marketing and promotion',
  },
];

/**
 * Generates a UUID v4 string
 * @returns A randomly generated UUID string
 */
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Returns the initial categories with generated UUIDs
 * Each call generates new UUIDs to ensure uniqueness
 * @returns Array of Category objects with unique IDs
 */
export function getInitialCategories(): Category[] {
  return initialCategories.map((template) => ({
    id: generateUUID(),
    ...template,
  }));
}
