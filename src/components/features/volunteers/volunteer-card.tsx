import { useTranslation } from 'react-i18next';
import { Mail, Phone, Calendar, Briefcase } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Volunteer } from '@/types';

interface VolunteerCardProps {
  volunteer: Volunteer;
  onClick?: () => void;
  className?: string;
}

const skillColors: Record<string, string> = {
  Setup: 'bg-blue-100 text-blue-800',
  Security: 'bg-red-100 text-red-800',
  'Food Service': 'bg-orange-100 text-orange-800',
  Registration: 'bg-green-100 text-green-800',
  'First Aid': 'bg-pink-100 text-pink-800',
  Photography: 'bg-purple-100 text-purple-800',
  Translation: 'bg-cyan-100 text-cyan-800',
};

export function VolunteerCard({ volunteer, onClick, className }: VolunteerCardProps) {
  const { t } = useTranslation();

  // Generate initials from name
  const initials = volunteer.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  // Generate avatar background color based on name
  const avatarColor = `hsl(${volunteer.name.length * 37 % 360}, 70%, 50%)`;

  // Calculate availability summary
  const availabilityCount = volunteer.availability.length;
  const shiftsCount = volunteer.assignedShifts.length;

  return (
    <div
      className={cn(
        'bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {/* Header with Avatar and Name */}
      <div className="flex items-start gap-3">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-lg shrink-0"
          style={{ backgroundColor: avatarColor }}
        >
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">{volunteer.name}</h3>
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <Mail className="w-3 h-3" />
            <span className="truncate">{volunteer.email}</span>
          </div>
          {volunteer.phone && (
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <Phone className="w-3 h-3" />
              <span>{volunteer.phone}</span>
            </div>
          )}
        </div>
      </div>

      {/* Skills Badges */}
      {volunteer.skills.length > 0 && (
        <div className="mt-3">
          <div className="flex flex-wrap gap-1">
            {volunteer.skills.map((skill) => (
              <span
                key={skill}
                className={cn(
                  'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium',
                  skillColors[skill] || 'bg-gray-100 text-gray-800'
                )}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Stats Row */}
      <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-sm">
        <div className="flex items-center gap-1 text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>
            {availabilityCount} {t('volunteers.availableDays', { count: availabilityCount })}
          </span>
        </div>
        <div className="flex items-center gap-1 text-gray-600">
          <Briefcase className="w-4 h-4" />
          <span>
            {shiftsCount} {t('volunteers.assignedShifts', { count: shiftsCount })}
          </span>
        </div>
      </div>
    </div>
  );
}
