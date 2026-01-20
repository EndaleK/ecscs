import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { User, Mail, Phone, Calendar, CheckCircle, AlertCircle, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useVolunteerStore } from '@/stores/volunteer-store';
import { cn } from '@/lib/utils';
import { formatDate } from '@/lib/utils';
import type { Availability } from '@/types';

const SKILLS = [
  { id: 'Setup', label: 'Setup' },
  { id: 'Security', label: 'Security' },
  { id: 'Food Service', label: 'Food Service' },
  { id: 'Registration', label: 'Registration' },
  { id: 'First Aid', label: 'First Aid' },
  { id: 'Photography', label: 'Photography' },
  { id: 'Translation', label: 'Translation' },
];

interface VolunteerRegistrationProps {
  onSuccess?: (volunteerId: string) => void;
  className?: string;
}

export function VolunteerRegistration({ onSuccess, className }: VolunteerRegistrationProps) {
  const { t } = useTranslation();
  const { addVolunteer, volunteers } = useVolunteerStore();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [newAvailability, setNewAvailability] = useState({
    date: '',
    startTime: '09:00',
    endTime: '17:00',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [registeredEmail, setRegisteredEmail] = useState('');

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = t('volunteers.errors.nameRequired');
    }

    if (!formData.email.trim()) {
      newErrors.email = t('volunteers.errors.emailRequired');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('volunteers.errors.emailInvalid');
    } else if (volunteers.some((v) => v.email.toLowerCase() === formData.email.toLowerCase())) {
      newErrors.email = t('volunteers.errors.emailExists');
    }

    if (!formData.phone.trim()) {
      newErrors.phone = t('volunteers.errors.phoneRequired');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Simulate a small delay for better UX
      await new Promise((resolve) => setTimeout(resolve, 500));

      const volunteerId = addVolunteer({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        skills: selectedSkills,
        availability,
        assignedShifts: [],
      });

      setSubmitStatus('success');
      setRegisteredEmail(formData.email);

      // Reset form
      setFormData({ name: '', email: '', phone: '' });
      setSelectedSkills([]);
      setAvailability([]);

      onSuccess?.(volunteerId);
    } catch (error) {
      console.error('Registration error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleSkill = (skillId: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skillId) ? prev.filter((s) => s !== skillId) : [...prev, skillId]
    );
  };

  const addAvailability = () => {
    if (!newAvailability.date) return;

    const newEntry: Availability = {
      date: new Date(newAvailability.date),
      startTime: newAvailability.startTime,
      endTime: newAvailability.endTime,
    };

    setAvailability((prev) => [...prev, newEntry]);
    setNewAvailability({ date: '', startTime: '09:00', endTime: '17:00' });
  };

  const removeAvailability = (index: number) => {
    setAvailability((prev) => prev.filter((_, i) => i !== index));
  };

  if (submitStatus === 'success') {
    return (
      <div className={cn('bg-white rounded-lg p-6', className)}>
        <div className="flex flex-col items-center text-center py-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {t('volunteers.registrationSuccess')}
          </h3>
          <p className="text-gray-600 mb-6">
            {t('volunteers.registrationSuccessMessage')}
          </p>
          <p className="text-sm text-gray-500 mb-6">
            {t('volunteers.registeredAs', { email: registeredEmail })}
          </p>
          <Button onClick={() => setSubmitStatus('idle')}>
            {t('volunteers.registerAnother')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('bg-white rounded-lg', className)}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {t('volunteers.personalInfo')}
          </h3>

          {/* Name Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('volunteers.name')} <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={cn(
                  'w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
                  errors.name ? 'border-red-300' : 'border-gray-200'
                )}
                placeholder={t('volunteers.namePlaceholder')}
              />
            </div>
            {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('volunteers.email')} <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={cn(
                  'w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
                  errors.email ? 'border-red-300' : 'border-gray-200'
                )}
                placeholder={t('volunteers.emailPlaceholder')}
              />
            </div>
            {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
          </div>

          {/* Phone Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('volunteers.phone')} <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className={cn(
                  'w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
                  errors.phone ? 'border-red-300' : 'border-gray-200'
                )}
                placeholder={t('volunteers.phonePlaceholder')}
              />
            </div>
            {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
          </div>
        </div>

        {/* Skills Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {t('volunteers.skills')}
          </h3>
          <p className="text-sm text-gray-600">{t('volunteers.skillsDescription')}</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {SKILLS.map((skill) => (
              <label
                key={skill.id}
                className={cn(
                  'flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-colors',
                  selectedSkills.includes(skill.id)
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-gray-200 hover:bg-gray-50'
                )}
              >
                <input
                  type="checkbox"
                  checked={selectedSkills.includes(skill.id)}
                  onChange={() => toggleSkill(skill.id)}
                  className="sr-only"
                />
                <div
                  className={cn(
                    'w-4 h-4 rounded border flex items-center justify-center',
                    selectedSkills.includes(skill.id)
                      ? 'bg-primary border-primary'
                      : 'border-gray-300'
                  )}
                >
                  {selectedSkills.includes(skill.id) && (
                    <CheckCircle className="w-3 h-3 text-white" />
                  )}
                </div>
                <span className="text-sm font-medium">{skill.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Availability Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {t('volunteers.availability')}
          </h3>
          <p className="text-sm text-gray-600">{t('volunteers.availabilityDescription')}</p>

          {/* Add Availability */}
          <div className="flex flex-wrap items-end gap-3 p-4 bg-gray-50 rounded-lg">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('volunteers.date')}
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="date"
                  value={newAvailability.date}
                  onChange={(e) =>
                    setNewAvailability({ ...newAvailability, date: e.target.value })
                  }
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
            <div className="w-32">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('volunteers.startTime')}
              </label>
              <input
                type="time"
                value={newAvailability.startTime}
                onChange={(e) =>
                  setNewAvailability({ ...newAvailability, startTime: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div className="w-32">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('volunteers.endTime')}
              </label>
              <input
                type="time"
                value={newAvailability.endTime}
                onChange={(e) =>
                  setNewAvailability({ ...newAvailability, endTime: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={addAvailability}
              disabled={!newAvailability.date}
            >
              <Plus className="w-4 h-4 mr-1" />
              {t('volunteers.addDate')}
            </Button>
          </div>

          {/* Availability List */}
          {availability.length > 0 && (
            <div className="space-y-2">
              {availability.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="font-medium">{formatDate(item.date, 'EEEE, MMMM d, yyyy')}</span>
                    <span className="text-gray-500">
                      {item.startTime} - {item.endTime}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeAvailability(index)}
                    className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Error Message */}
        {submitStatus === 'error' && (
          <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            <AlertCircle className="w-5 h-5" />
            <span>{t('volunteers.registrationError')}</span>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end pt-4 border-t border-gray-200">
          <Button type="submit" disabled={isSubmitting} className="min-w-[150px]">
            {isSubmitting ? t('volunteers.registering') : t('volunteers.register')}
          </Button>
        </div>
      </form>
    </div>
  );
}
