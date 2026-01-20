import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Filter, Users, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useVolunteerStore } from '@/stores/volunteer-store';
import { VolunteerCard } from './volunteer-card';
import { cn } from '@/lib/utils';
import type { Volunteer } from '@/types';

const SKILLS = [
  'Setup',
  'Security',
  'Food Service',
  'Registration',
  'First Aid',
  'Photography',
  'Translation',
];

interface VolunteerListProps {
  onVolunteerSelect?: (volunteer: Volunteer) => void;
  onAddVolunteer?: () => void;
  className?: string;
}

export function VolunteerList({ onVolunteerSelect, onAddVolunteer, className }: VolunteerListProps) {
  const { t } = useTranslation();
  const { volunteers } = useVolunteerStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [availabilityFilter, setAvailabilityFilter] = useState<'all' | 'available' | 'assigned'>('all');
  const [showFilters, setShowFilters] = useState(false);

  // Filter volunteers based on search and filters
  const filteredVolunteers = useMemo(() => {
    return volunteers.filter((volunteer) => {
      // Search filter
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        volunteer.name.toLowerCase().includes(searchLower) ||
        volunteer.email.toLowerCase().includes(searchLower) ||
        volunteer.phone?.toLowerCase().includes(searchLower);

      // Skills filter
      const matchesSkills =
        selectedSkills.length === 0 ||
        selectedSkills.some((skill) => volunteer.skills.includes(skill));

      // Availability filter
      let matchesAvailability = true;
      if (availabilityFilter === 'available') {
        matchesAvailability = volunteer.availability.length > 0;
      } else if (availabilityFilter === 'assigned') {
        matchesAvailability = volunteer.assignedShifts.length > 0;
      }

      return matchesSearch && matchesSkills && matchesAvailability;
    });
  }, [volunteers, searchQuery, selectedSkills, availabilityFilter]);

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const clearFilters = () => {
    setSelectedSkills([]);
    setAvailabilityFilter('all');
    setSearchQuery('');
  };

  const hasActiveFilters = selectedSkills.length > 0 || availabilityFilter !== 'all' || searchQuery;

  return (
    <div className={cn('flex flex-col h-full', className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">
            {t('volunteers.title')}
          </h2>
          <span className="text-sm text-gray-500">
            ({filteredVolunteers.length} {t('volunteers.count', { count: filteredVolunteers.length })})
          </span>
        </div>
        {onAddVolunteer && (
          <Button onClick={onAddVolunteer} size="sm">
            {t('volunteers.addVolunteer')}
          </Button>
        )}
      </div>

      {/* Search and Filter Bar */}
      <div className="flex items-center gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder={t('volunteers.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        <Button
          variant={showFilters ? 'default' : 'outline'}
          size="icon"
          onClick={() => setShowFilters(!showFilters)}
          className={cn(hasActiveFilters && !showFilters && 'border-primary text-primary')}
        >
          <Filter className="w-4 h-4" />
        </Button>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="bg-gray-50 rounded-lg p-4 mb-4 space-y-4">
          {/* Skills Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('volunteers.filterBySkills')}
            </label>
            <div className="flex flex-wrap gap-2">
              {SKILLS.map((skill) => (
                <button
                  key={skill}
                  onClick={() => toggleSkill(skill)}
                  className={cn(
                    'px-3 py-1 rounded-full text-sm font-medium transition-colors',
                    selectedSkills.includes(skill)
                      ? 'bg-primary text-white'
                      : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100'
                  )}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>

          {/* Availability Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('volunteers.filterByAvailability')}
            </label>
            <div className="flex gap-2">
              {(['all', 'available', 'assigned'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setAvailabilityFilter(filter)}
                  className={cn(
                    'px-3 py-1 rounded-full text-sm font-medium transition-colors',
                    availabilityFilter === filter
                      ? 'bg-primary text-white'
                      : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100'
                  )}
                >
                  {t(`volunteers.availability.${filter}`)}
                </button>
              ))}
            </div>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="w-4 h-4 mr-1" />
              {t('volunteers.clearFilters')}
            </Button>
          )}
        </div>
      )}

      {/* Volunteer Grid */}
      <div className="flex-1 overflow-y-auto">
        {filteredVolunteers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredVolunteers.map((volunteer) => (
              <VolunteerCard
                key={volunteer.id}
                volunteer={volunteer}
                onClick={() => onVolunteerSelect?.(volunteer)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            <Users className="w-12 h-12 mb-4 text-gray-300" />
            <p className="text-lg font-medium">{t('volunteers.noVolunteers')}</p>
            <p className="text-sm">
              {hasActiveFilters
                ? t('volunteers.noMatchingVolunteers')
                : t('volunteers.noVolunteersYet')}
            </p>
            {hasActiveFilters && (
              <Button variant="outline" size="sm" className="mt-4" onClick={clearFilters}>
                {t('volunteers.clearFilters')}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
