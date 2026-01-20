import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
  Heart,
  Music,
  Users,
  Utensils,
  MapPin,
  Calendar,
  Star,
  ArrowRight,
  Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EthiopianPattern, EthiopianBorder } from '@/components/ui/ethiopian-pattern';
import { LanguageSwitcher } from '@/components/layout/language-switcher';

// Soccer ball icon for highlight cards
function SoccerIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2 L12 6 M12 18 L12 22" />
      <path d="M2 12 L6 12 M18 12 L22 12" />
      <path d="M12 6 L8 10 L8 14 L12 18 L16 14 L16 10 Z" />
    </svg>
  );
}

export function LandingPage() {
  const { t } = useTranslation();

  const eventHighlights = [
    {
      icon: SoccerIcon,
      titleKey: 'landing.highlights.soccer.title',
      descKey: 'landing.highlights.soccer.description',
    },
    {
      icon: Music,
      titleKey: 'landing.highlights.music.title',
      descKey: 'landing.highlights.music.description',
    },
    {
      icon: Users,
      titleKey: 'landing.highlights.kids.title',
      descKey: 'landing.highlights.kids.description',
    },
    {
      icon: Utensils,
      titleKey: 'landing.highlights.food.title',
      descKey: 'landing.highlights.food.description',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src="/images/ecscs-logo.png"
              alt="ECSCS"
              className="w-10 h-10 object-contain"
            />
            <span className="text-lg font-semibold text-foreground">{t('header.title')}</span>
          </div>
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <Link
              to="/dashboard"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {t('landing.nav.organizerLogin')}
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
        {/* Ethiopian pattern background */}
        <div className="absolute inset-0 pointer-events-none">
          <EthiopianPattern className="absolute inset-0" opacity={0.04} />
        </div>
        {/* Gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background pointer-events-none" />
        {/* Decorative color blurs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-secondary/5 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 text-center">
          {/* Tournament Logo - Prominent Display */}
          <div className="mb-8">
            <img
              src="/images/ecscs-logo.png"
              alt="ECSCS Soccer Tournament 2026 - 30 Years of Unity, Sports & Culture"
              className="mx-auto w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 object-contain"
            />
          </div>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            {t('landing.hero.subtitle')}
          </p>

          {/* Event Info */}
          <div className="flex flex-wrap justify-center gap-6 mb-10 text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              <span className="font-medium">{t('landing.hero.date')}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-accent" />
              <span className="font-medium">{t('landing.hero.location')}</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/volunteer-signup">
              <Button size="lg" className="w-full sm:w-auto gap-2">
                <Heart className="w-5 h-5" />
                {t('landing.hero.volunteerCta')}
              </Button>
            </Link>
            <a href="#about">
              <Button variant="outline" size="lg" className="w-full sm:w-auto gap-2">
                {t('landing.hero.learnMore')}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Ethiopian border divider */}
      <EthiopianBorder />

      {/* About Section */}
      <section id="about" className="relative py-16 md:py-24 bg-muted/30 overflow-hidden">
        {/* Subtle pattern background */}
        <div className="absolute inset-0 pointer-events-none opacity-50">
          <EthiopianPattern className="absolute inset-0" opacity={0.02} />
        </div>
        <div className="relative max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t('landing.about.title')}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t('landing.about.description')}
            </p>
          </div>

          <div className="bg-card rounded-2xl p-8 border border-border shadow-sm">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Globe className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground">
                  {t('landing.about.historyTitle')}
                </h3>
                <p className="text-sm text-muted-foreground">{t('landing.about.historySubtitle')}</p>
              </div>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              {t('landing.about.historyText')}
            </p>
          </div>
        </div>
      </section>

      {/* Event Highlights Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t('landing.highlights.title')}
            </h2>
            <p className="text-muted-foreground">
              {t('landing.highlights.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {eventHighlights.map((highlight, index) => (
              <div
                key={index}
                className="group bg-card rounded-xl p-6 border border-border hover:border-primary/30 hover:shadow-md transition-all duration-300"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors mb-4">
                  <highlight.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {t(highlight.titleKey)}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t(highlight.descKey)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ethiopian border divider */}
      <EthiopianBorder />

      {/* Key Information Section */}
      <section className="relative py-16 md:py-24 bg-primary/5 overflow-hidden">
        {/* Subtle pattern background */}
        <div className="absolute inset-0 pointer-events-none">
          <EthiopianPattern className="absolute inset-0" opacity={0.03} />
        </div>
        <div className="relative max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t('landing.info.title')}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-card rounded-xl p-6 border border-border text-center">
              <Calendar className="w-8 h-8 text-primary mx-auto mb-4" />
              <h3 className="font-semibold text-foreground mb-2">{t('landing.info.when.title')}</h3>
              <p className="text-muted-foreground text-sm">{t('landing.info.when.details')}</p>
            </div>
            <div className="bg-card rounded-xl p-6 border border-border text-center">
              <MapPin className="w-8 h-8 text-accent mx-auto mb-4" />
              <h3 className="font-semibold text-foreground mb-2">{t('landing.info.where.title')}</h3>
              <p className="text-muted-foreground text-sm">{t('landing.info.where.details')}</p>
            </div>
            <div className="bg-card rounded-xl p-6 border border-border text-center">
              <Star className="w-8 h-8 text-secondary mx-auto mb-4" />
              <h3 className="font-semibold text-foreground mb-2">{t('landing.info.what.title')}</h3>
              <p className="text-muted-foreground text-sm">{t('landing.info.what.details')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Ethiopian border divider */}
      <EthiopianBorder />

      {/* Volunteer CTA Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4">
          <div className="relative bg-gradient-to-br from-primary to-primary/80 rounded-2xl p-8 md:p-12 text-center overflow-hidden">
            {/* Ethiopian pattern overlay on CTA */}
            <div className="absolute inset-0 pointer-events-none">
              <EthiopianPattern className="absolute inset-0" opacity={0.08} />
            </div>
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

            <div className="relative z-10">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-white/20 rounded-full">
                  <Heart className="w-10 h-10 text-white" />
                </div>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                {t('landing.volunteer.title')}
              </h2>
              <p className="text-white/90 max-w-xl mx-auto mb-8">
                {t('landing.volunteer.description')}
              </p>
              <Link to="/volunteer-signup">
                <Button size="lg" variant="secondary" className="gap-2">
                  {t('landing.volunteer.cta')}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Ethiopian border divider */}
      <EthiopianBorder />

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Logo and Description */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <img
                  src="/images/ecscs-logo.png"
                  alt="ECSCS"
                  className="w-12 h-12 object-contain"
                />
                <span className="text-lg font-semibold text-foreground">{t('header.title')}</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {t('landing.footer.description')}
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-foreground mb-4">{t('landing.footer.quickLinks')}</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {t('landing.about.title')}
                  </a>
                </li>
                <li>
                  <Link to="/volunteer-signup" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {t('landing.hero.volunteerCta')}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-semibold text-foreground mb-4">{t('landing.footer.contact')}</h4>
              <p className="text-sm text-muted-foreground mb-2">{t('landing.footer.email')}</p>
              <Link
                to="/dashboard"
                className="text-sm text-primary hover:underline"
              >
                {t('landing.nav.organizerLogin')}
              </Link>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              {t('landing.footer.copyright')}
            </p>
            <div className="flex items-center gap-4">
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
