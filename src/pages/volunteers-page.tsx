import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Users, Plus, X, Calendar, Mail, Phone, Briefcase, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { VolunteerList } from '@/components/features/volunteers/volunteer-list';
import { useVolunteerStore } from '@/stores/volunteer-store';
import { useTaskStore } from '@/stores/task-store';
import { useCategoryStore } from '@/stores/category-store';
import { cn } from '@/lib/utils';
import { formatDate } from '@/lib/utils';
import type { Volunteer, Availability } from '@/types';

const SKILLS = [
  'Setup',
  'Security',
  'Food Service',
  'Registration',
  'First Aid',
  'Photography',
  'Translation',
];

export function VolunteersPage() {
  const { t } = useTranslation();
  const { volunteers, addVolunteer, updateVolunteer, deleteVolunteer, assignShift, unassignShift } = useVolunteerStore();
  const { tasks } = useTaskStore();
  const { categories } = useCategoryStore();

  const [selectedVolunteer, setSelectedVolunteer] = useState<Volunteer | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Form state for adding/editing volunteer
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    skills: [] as string[],
    availability: [] as Availability[],
  });

  const handleVolunteerSelect = (volunteer: Volunteer) => {
    setSelectedVolunteer(volunteer);
    setIsEditing(false);
  };

  const handleAddVolunteer = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      skills: [],
      availability: [],
    });
    setShowAddForm(true);
    setSelectedVolunteer(null);
    setIsEditing(false);
  };

  const handleEditVolunteer = () => {
    if (!selectedVolunteer) return;
    setFormData({
      name: selectedVolunteer.name,
      email: selectedVolunteer.email,
      phone: selectedVolunteer.phone,
      skills: selectedVolunteer.skills,
      availability: selectedVolunteer.availability,
    });
    setIsEditing(true);
  };

  const handleSaveVolunteer = () => {
    if (isEditing && selectedVolunteer) {
      updateVolunteer(selectedVolunteer.id, {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        skills: formData.skills,
        availability: formData.availability,
      });
      setSelectedVolunteer({
        ...selectedVolunteer,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        skills: formData.skills,
        availability: formData.availability,
      });
      setIsEditing(false);
    } else {
      const id = addVolunteer({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        skills: formData.skills,
        availability: formData.availability,
        assignedShifts: [],
      });
      setShowAddForm(false);
      // Select the newly created volunteer
      const newVolunteer = volunteers.find((v) => v.id === id);
      if (newVolunteer) {
        setSelectedVolunteer(newVolunteer);
      }
    }
  };

  const handleDeleteVolunteer = () => {
    if (!selectedVolunteer) return;
    const confirmDelete = window.confirm(t('volunteers.confirmDelete', { name: selectedVolunteer.name }));
    if (!confirmDelete) return;

    deleteVolunteer(selectedVolunteer.id);
    setSelectedVolunteer(null);
  };

  const handleAssignShift = (taskId: string) => {
    if (!selectedVolunteer) return;
    assignShift(selectedVolunteer.id, taskId);
    // Update selected volunteer to reflect changes
    const updated = volunteers.find((v) => v.id === selectedVolunteer.id);
    if (updated) {
      setSelectedVolunteer({ ...updated, assignedShifts: [...updated.assignedShifts, taskId] });
    }
  };

  const handleUnassignShift = (taskId: string) => {
    if (!selectedVolunteer) return;
    unassignShift(selectedVolunteer.id, taskId);
    // Update selected volunteer to reflect changes
    setSelectedVolunteer({
      ...selectedVolunteer,
      assignedShifts: selectedVolunteer.assignedShifts.filter((id) => id !== taskId),
    });
  };

  const toggleSkill = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter((s) => s !== skill)
        : [...prev.skills, skill],
    }));
  };

  const getTask = (taskId: string) => tasks.find((t) => t.id === taskId);
  const getCategory = (categoryId: string) => categories.find((c) => c.id === categoryId);

  const availableTasksForAssignment = tasks.filter(
    (task) =>
      task.status !== 'done' &&
      !selectedVolunteer?.assignedShifts.includes(task.id)
  );

  return (
    <div className="h-full flex flex-col">
      {/* Page Header */}
      <div className="flex flex-col gap-4 border-b border-border bg-card/80 backdrop-blur-sm px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-accent/10 rounded-lg">
            <Users className="w-6 h-6 text-accent" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{t('volunteers.pageTitle')}</h1>
            <p className="text-sm text-muted-foreground">{t('volunteers.pageDescription')}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Volunteer List */}
        <div className="w-1/2 border-r border-border p-6 overflow-y-auto">
          <VolunteerList
            onVolunteerSelect={handleVolunteerSelect}
            onAddVolunteer={handleAddVolunteer}
          />
        </div>

        {/* Volunteer Detail / Add Form */}
        <div className="w-1/2 p-6 overflow-y-auto bg-muted/30">
          {showAddForm || isEditing ? (
            // Add/Edit Volunteer Form
            <div className="bg-card rounded-lg border border-border p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-foreground">
                  {isEditing ? t('volunteers.editVolunteer') : t('volunteers.addVolunteer')}
                </h2>
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setIsEditing(false);
                  }}
                  className="p-1 text-muted-foreground/70 hover:text-muted-foreground"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    {t('volunteers.name')}
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    {t('volunteers.email')}
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    {t('volunteers.phone')}
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                {/* Skills */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {t('volunteers.skills')}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {SKILLS.map((skill) => (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => toggleSkill(skill)}
                        className={cn(
                          'px-3 py-1 rounded-full text-sm font-medium transition-colors',
                          formData.skills.includes(skill)
                            ? 'bg-primary text-white'
                            : 'bg-muted text-foreground hover:bg-muted'
                        )}
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-2 pt-4 border-t border-border">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowAddForm(false);
                      setIsEditing(false);
                    }}
                  >
                    {t('common.cancel')}
                  </Button>
                  <Button
                    onClick={handleSaveVolunteer}
                    disabled={!formData.name || !formData.email}
                  >
                    {t('common.save')}
                  </Button>
                </div>
              </div>
            </div>
          ) : selectedVolunteer ? (
            // Volunteer Detail View
            <div className="space-y-6">
              {/* Volunteer Info Card */}
              <div className="bg-card rounded-lg border border-border p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl"
                      style={{
                        backgroundColor: `hsl(${selectedVolunteer.name.length * 37 % 360}, 70%, 50%)`,
                      }}
                    >
                      {selectedVolunteer.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .toUpperCase()
                        .slice(0, 2)}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-foreground">{selectedVolunteer.name}</h2>
                      <div className="flex items-center gap-1 text-muted-foreground mt-1">
                        <Mail className="w-4 h-4" />
                        <span>{selectedVolunteer.email}</span>
                      </div>
                      {selectedVolunteer.phone && (
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Phone className="w-4 h-4" />
                          <span>{selectedVolunteer.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleEditVolunteer}>
                      <Edit className="w-4 h-4 mr-1" />
                      {t('common.edit')}
                    </Button>
                    <Button variant="destructive" size="sm" onClick={handleDeleteVolunteer}>
                      <Trash2 className="w-4 h-4 mr-1" />
                      {t('common.delete')}
                    </Button>
                  </div>
                </div>

                {/* Skills */}
                {selectedVolunteer.skills.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-sm font-medium text-foreground mb-2">{t('volunteers.skills')}</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedVolunteer.skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-2 py-1 bg-muted text-foreground rounded text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Availability */}
                {selectedVolunteer.availability.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-sm font-medium text-foreground mb-2">
                      {t('volunteers.availability')}
                    </h3>
                    <div className="space-y-1">
                      {selectedVolunteer.availability.map((item, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(item.date, 'MMM d, yyyy')}</span>
                          <span className="text-muted-foreground/70">
                            {item.startTime} - {item.endTime}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Registration Date */}
                <div className="mt-4 pt-4 border-t border-border/50 text-sm text-muted-foreground">
                  {t('volunteers.registeredOn', {
                    date: formatDate(selectedVolunteer.registeredAt, 'MMMM d, yyyy'),
                  })}
                </div>
              </div>

              {/* Assigned Shifts */}
              <div className="bg-card rounded-lg border border-border p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-foreground">
                    {t('volunteers.assignedShifts', { count: selectedVolunteer.assignedShifts.length })}
                  </h3>
                  <Button size="sm" onClick={() => setShowAssignModal(true)}>
                    <Plus className="w-4 h-4 mr-1" />
                    {t('volunteers.assignToShift')}
                  </Button>
                </div>

                {selectedVolunteer.assignedShifts.length > 0 ? (
                  <div className="space-y-3">
                    {selectedVolunteer.assignedShifts.map((taskId) => {
                      const task = getTask(taskId);
                      if (!task) return null;
                      const category = getCategory(task.categoryId);

                      return (
                        <div
                          key={taskId}
                          className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                        >
                          <div>
                            <h4 className="font-medium text-foreground">{task.title}</h4>
                            <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                              {category && (
                                <span
                                  className="px-2 py-0.5 rounded text-xs font-medium"
                                  style={{
                                    backgroundColor: `${category.color}20`,
                                    color: category.color,
                                  }}
                                >
                                  {category.name}
                                </span>
                              )}
                              <span>{formatDate(task.dueDate, 'MMM d, yyyy')}</span>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleUnassignShift(taskId)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Briefcase className="w-10 h-10 mx-auto mb-2 text-muted-foreground/50" />
                    <p>{t('volunteers.noShiftsAssigned')}</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            // No Selection
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <Users className="w-16 h-16 mb-4 text-muted-foreground/50" />
              <p className="text-lg font-medium">{t('volunteers.selectVolunteer')}</p>
              <p className="text-sm">{t('volunteers.selectVolunteerDescription')}</p>
            </div>
          )}
        </div>
      </div>

      {/* Assign Shift Modal */}
      {showAssignModal && selectedVolunteer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card rounded-lg shadow-xl w-full max-w-lg max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="text-lg font-semibold text-foreground">
                {t('volunteers.assignToShift')}
              </h3>
              <button
                onClick={() => setShowAssignModal(false)}
                className="p-1 text-muted-foreground/70 hover:text-muted-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto max-h-[60vh]">
              {availableTasksForAssignment.length > 0 ? (
                <div className="space-y-2">
                  {availableTasksForAssignment.map((task) => {
                    const category = getCategory(task.categoryId);
                    return (
                      <button
                        key={task.id}
                        onClick={() => {
                          handleAssignShift(task.id);
                          setShowAssignModal(false);
                        }}
                        className="w-full flex items-center justify-between p-3 bg-muted/50 hover:bg-muted rounded-lg text-left transition-colors"
                      >
                        <div>
                          <h4 className="font-medium text-foreground">{task.title}</h4>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                            {category && (
                              <span
                                className="px-2 py-0.5 rounded text-xs font-medium"
                                style={{
                                  backgroundColor: `${category.color}20`,
                                  color: category.color,
                                }}
                              >
                                {category.name}
                              </span>
                            )}
                            <span>{formatDate(task.dueDate, 'MMM d, yyyy')}</span>
                          </div>
                        </div>
                        <Plus className="w-5 h-5 text-muted-foreground/70" />
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="w-10 h-10 mx-auto mb-2 text-muted-foreground/50" />
                  <p>{t('volunteers.noAvailableTasks')}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
