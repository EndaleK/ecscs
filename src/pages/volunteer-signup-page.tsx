import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Heart, UserPlus, Calendar, ClipboardList, Mail, Search, ArrowRight, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EthiopianPattern, EthiopianBorder, ethiopianColors } from '@/components/ui/ethiopian-pattern';
import { VolunteerRegistration } from '@/components/features/volunteers/volunteer-registration';
import { ShiftSignup } from '@/components/features/volunteers/shift-signup';
import { MyShifts } from '@/components/features/volunteers/my-shifts';
import { useVolunteerStore } from '@/stores/volunteer-store';
import { cn } from '@/lib/utils';

type Tab = 'register' | 'shifts' | 'my-shifts';

export function VolunteerSignupPage() {
  const { t } = useTranslation();
  const { volunteers } = useVolunteerStore();

  const [activeTab, setActiveTab] = useState<Tab>('register');
  const [lookupEmail, setLookupEmail] = useState('');
  const [verifiedEmail, setVerifiedEmail] = useState<string | null>(null);
  const [showEmailLookup, setShowEmailLookup] = useState(false);

  // Check if email exists in volunteers
  const isEmailRegistered = useMemo(() => {
    if (!lookupEmail) return false;
    return volunteers.some(
      (v) => v.email.toLowerCase() === lookupEmail.toLowerCase()
    );
  }, [volunteers, lookupEmail]);

  const handleEmailLookup = () => {
    if (isEmailRegistered) {
      setVerifiedEmail(lookupEmail.toLowerCase());
      setActiveTab('shifts');
      setShowEmailLookup(false);
    }
  };

  const handleRegistrationSuccess = (volunteerId: string) => {
    const volunteer = volunteers.find((v) => v.id === volunteerId);
    if (volunteer) {
      setVerifiedEmail(volunteer.email);
      setActiveTab('shifts');
    }
  };

  const tabs = [
    { id: 'register' as Tab, label: t('volunteers.tabs.register'), icon: UserPlus },
    { id: 'shifts' as Tab, label: t('volunteers.tabs.availableShifts'), icon: Calendar },
    { id: 'my-shifts' as Tab, label: t('volunteers.tabs.myShifts'), icon: ClipboardList },
  ];

  return (
    <div className="relative min-h-screen bg-background">
      {/* Background pattern */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <EthiopianPattern className="absolute inset-0" opacity={0.02} />
      </div>
      <div className="fixed inset-0 bg-gradient-to-b from-background/80 via-background/90 to-background/80 pointer-events-none z-0" />

      {/* Hero Header */}
      <div className="relative z-10 text-white overflow-hidden" style={{ background: `linear-gradient(135deg, ${ethiopianColors.forestGreen} 0%, ${ethiopianColors.forestGreen}dd 50%, ${ethiopianColors.forestGreen}bb 100%)` }}>
        {/* Pattern overlay on hero */}
        <div className="absolute inset-0 pointer-events-none">
          <EthiopianPattern className="absolute inset-0" opacity={0.08} />
        </div>

        {/* Home link */}
        <div className="absolute top-4 left-4 z-20">
          <Link to="/" className="flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm">
            <Home className="w-4 h-4" />
            <span>{t('header.title')}</span>
          </Link>
        </div>

        <div className="relative max-w-4xl mx-auto px-4 py-12 pt-16 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full" style={{ backgroundColor: `${ethiopianColors.warmGold}33` }}>
              <Heart className="w-10 h-10" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {t('volunteers.publicPage.title')}
          </h1>
          <p className="text-lg text-white/90 max-w-2xl mx-auto">
            {t('volunteers.publicPage.subtitle')}
          </p>

          {/* Email Lookup for Returning Volunteers */}
          {!verifiedEmail && (
            <div className="mt-8">
              {showEmailLookup ? (
                <div className="max-w-md mx-auto bg-white/10 rounded-lg p-4">
                  <p className="text-sm text-white/80 mb-3">
                    {t('volunteers.publicPage.enterEmail')}
                  </p>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
                      <input
                        type="email"
                        value={lookupEmail}
                        onChange={(e) => setLookupEmail(e.target.value)}
                        placeholder={t('volunteers.emailPlaceholder')}
                        className="w-full pl-10 pr-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                        onKeyDown={(e) => e.key === 'Enter' && handleEmailLookup()}
                      />
                    </div>
                    <Button
                      onClick={handleEmailLookup}
                      disabled={!lookupEmail}
                      className="bg-white hover:bg-white/90"
                      style={{ color: ethiopianColors.forestGreen }}
                    >
                      <Search className="w-4 h-4 mr-1" />
                      {t('volunteers.publicPage.lookup')}
                    </Button>
                  </div>
                  {lookupEmail && !isEmailRegistered && (
                    <p className="text-sm text-yellow-200 mt-2">
                      {t('volunteers.publicPage.emailNotFound')}
                    </p>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setShowEmailLookup(true)}
                  className="text-white/80 hover:text-white underline text-sm"
                >
                  {t('volunteers.publicPage.alreadyRegistered')}
                </button>
              )}
            </div>
          )}

          {/* Verified Email Badge */}
          {verifiedEmail && (
            <div className="mt-6 inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
              <Mail className="w-4 h-4" />
              <span className="text-sm">{verifiedEmail}</span>
              <button
                onClick={() => {
                  setVerifiedEmail(null);
                  setLookupEmail('');
                }}
                className="text-white/60 hover:text-white ml-2"
              >
                {t('volunteers.publicPage.changeEmail')}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Ethiopian Border */}
      <EthiopianBorder className="relative z-10" />

      {/* Tab Navigation */}
      <div className="relative z-10 bg-card border-b border-border sticky top-0">
        <div className="max-w-4xl mx-auto px-4">
          <nav className="flex gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center gap-2 px-4 py-4 text-sm font-medium border-b-2 transition-colors',
                  activeTab === tab.id
                    ? 'text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                )}
                style={activeTab === tab.id ? { borderColor: ethiopianColors.forestGreen } : undefined}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">
        {activeTab === 'register' && (
          <div className="bg-card rounded-lg border border-border p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-foreground mb-2">
                {t('volunteers.publicPage.registerTitle')}
              </h2>
              <p className="text-muted-foreground">
                {t('volunteers.publicPage.registerDescription')}
              </p>
            </div>
            <VolunteerRegistration onSuccess={handleRegistrationSuccess} />
          </div>
        )}

        {activeTab === 'shifts' && (
          <div className="bg-card rounded-lg border border-border p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-foreground mb-2">
                {t('volunteers.publicPage.shiftsTitle')}
              </h2>
              <p className="text-muted-foreground">
                {t('volunteers.publicPage.shiftsDescription')}
              </p>
            </div>

            {/* Prompt to register if not verified */}
            {!verifiedEmail && (
              <div className="mb-6 p-4 rounded-lg border" style={{ backgroundColor: `${ethiopianColors.forestGreen}10`, borderColor: `${ethiopianColors.forestGreen}30` }}>
                <div className="flex items-start gap-3">
                  <UserPlus className="w-5 h-5 mt-0.5" style={{ color: ethiopianColors.forestGreen }} />
                  <div>
                    <p className="font-medium" style={{ color: ethiopianColors.forestGreen }}>
                      {t('volunteers.publicPage.registerFirst')}
                    </p>
                    <p className="text-sm mt-1" style={{ color: `${ethiopianColors.forestGreen}cc` }}>
                      {t('volunteers.publicPage.registerFirstDescription')}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-3"
                      style={{ borderColor: `${ethiopianColors.forestGreen}50`, color: ethiopianColors.forestGreen }}
                      onClick={() => setActiveTab('register')}
                    >
                      {t('volunteers.publicPage.goToRegistration')}
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </div>
            )}

            <ShiftSignup volunteerEmail={verifiedEmail || undefined} />
          </div>
        )}

        {activeTab === 'my-shifts' && (
          <div className="bg-card rounded-lg border border-border p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-foreground mb-2">
                {t('volunteers.publicPage.myShiftsTitle')}
              </h2>
              <p className="text-muted-foreground">
                {t('volunteers.publicPage.myShiftsDescription')}
              </p>
            </div>

            {verifiedEmail ? (
              <MyShifts volunteerEmail={verifiedEmail} />
            ) : (
              <div className="text-center py-12">
                <Mail className="w-12 h-12 mx-auto mb-4 text-muted-foreground/30" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  {t('volunteers.publicPage.verifyEmail')}
                </h3>
                <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                  {t('volunteers.publicPage.verifyEmailDescription')}
                </p>
                <div className="max-w-sm mx-auto">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        type="email"
                        value={lookupEmail}
                        onChange={(e) => setLookupEmail(e.target.value)}
                        placeholder={t('volunteers.emailPlaceholder')}
                        className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        onKeyDown={(e) => e.key === 'Enter' && handleEmailLookup()}
                      />
                    </div>
                    <Button onClick={handleEmailLookup} disabled={!lookupEmail}>
                      {t('volunteers.publicPage.lookup')}
                    </Button>
                  </div>
                  {lookupEmail && !isEmailRegistered && (
                    <p className="text-sm mt-2" style={{ color: ethiopianColors.terracotta }}>
                      {t('volunteers.publicPage.emailNotFound')}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Ethiopian Border before Footer */}
      <EthiopianBorder className="relative z-10" />

      {/* Footer */}
      <div className="relative z-10 bg-card border-t border-border mt-auto">
        <div className="max-w-4xl mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <p>{t('volunteers.publicPage.footer')}</p>
          <Link to="/" className="inline-flex items-center gap-1 mt-2 text-primary hover:underline">
            <Home className="w-3 h-3" />
            {t('header.title')}
          </Link>
        </div>
      </div>
    </div>
  );
}
