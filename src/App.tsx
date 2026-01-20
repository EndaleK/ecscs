import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainLayout } from '@/components/layout';
import {
  LandingPage,
  DashboardPage,
  TasksPage,
  KanbanPage,
  CalendarPage,
  ContactsPage,
  VolunteersPage,
  VolunteerSignupPage,
  SettingsPage,
  BudgetPage,
} from '@/pages';
import { useReminderChecker } from '@/hooks/useReminderChecker';

// Initialize i18n (imported for side effects)
import '@/lib/i18n';

function AppContent() {
  // Initialize reminder checking
  useReminderChecker();

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/volunteer-signup" element={<VolunteerSignupPage />} />

      {/* Authenticated routes with MainLayout */}
      <Route element={<MainLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/tasks" element={<TasksPage />} />
        <Route path="/kanban" element={<KanbanPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/contacts" element={<ContactsPage />} />
        <Route path="/volunteers" element={<VolunteersPage />} />
        <Route path="/budget" element={<BudgetPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
