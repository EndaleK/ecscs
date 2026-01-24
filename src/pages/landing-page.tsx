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
import { EthiopianBorder } from '@/components/ui/ethiopian-pattern';
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
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/50 backdrop-blur-sm border-b border-gray-200/50">
        <div className="max-w-6xl mx-auto px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src="/images/ecscs-logo.png"
              alt="ECSCS"
              className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
            />
            <span className="text-base sm:text-lg font-semibold text-foreground hidden sm:inline">{t('header.title')}</span>
          </div>

          {/* Navigation Links - Hidden on mobile */}
          <div className="hidden md:flex items-center gap-6">
            <a
              href="#about"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {t('landing.nav.about')}
            </a>
            <a
              href="#highlights"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {t('landing.nav.highlights')}
            </a>
            <a
              href="#info"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {t('landing.nav.info')}
            </a>
            <Link
              to="/volunteer-signup"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {t('landing.nav.volunteer')}
            </Link>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <LanguageSwitcher />
            <Link
              to="/dashboard"
              className="text-xs sm:text-sm font-medium text-foreground hover:text-foreground/80 transition-colors px-3 py-1.5 rounded-md bg-primary/10 hover:bg-primary/20 border border-primary/20"
            >
              {t('landing.nav.organizerLogin')}
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section - Logo and CTA */}
      <section className="relative pt-14 pb-4 sm:pt-16 md:pt-4 md:pb-6 overflow-hidden">
        {/* Ethiopian traditional pattern background */}
        <div
          className="absolute inset-0 pointer-events-none opacity-40"
          style={{
            backgroundImage: 'url(/images/ethiopian-traditional-pattern.png)',
            backgroundRepeat: 'repeat',
            backgroundSize: '200px',
          }}
        />
        {/* Gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/90 to-background pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-4 text-center">
          {/* Tournament Logo - responsive sizing for mobile */}
          <img
            src="/images/ecscs-logo.png"
            alt="ECSCS Soccer Tournament 2026 - 30 Years of Unity, Sports & Culture"
            className="mx-auto w-[16rem] h-[16rem] sm:w-[20rem] sm:h-[20rem] md:w-[28rem] md:h-[28rem] lg:w-[34rem] lg:h-[34rem] object-contain mb-2 mix-blend-multiply"
          />

          {/* Subtitle */}
          <p className="text-base sm:text-lg md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-4 px-2">
            {t('landing.hero.subtitle')}
          </p>

          {/* Event Info */}
          <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-6 mb-6 text-base sm:text-lg md:text-xl text-muted-foreground">
            <div className="flex items-center justify-center gap-2">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              <span className="font-medium">{t('landing.hero.date')}</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />
              <span className="font-medium">{t('landing.hero.location')}</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
            <Link to="/volunteer-signup" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto gap-2">
                <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
                {t('landing.hero.volunteerCta')}
              </Button>
            </Link>
            <a href="#about" className="w-full sm:w-auto">
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
      <section id="about" className="relative py-12 sm:py-16 md:py-24 overflow-hidden">
        <div className="relative max-w-4xl mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4">
              {t('landing.about.title')}
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
              {t('landing.about.description')}
            </p>
          </div>

          <div className="relative rounded-xl sm:rounded-2xl p-5 sm:p-8 overflow-hidden" style={{ background: 'linear-gradient(135deg, #1A2B48 0%, #2D4A6F 50%, #1A2B48 100%)' }}>
            {/* Ethiopian diamond pattern overlay */}
            <div
              className="absolute inset-0 pointer-events-none opacity-20"
              style={{
                backgroundImage: 'url(/images/ethiopian-traditional-pattern-color.png)',
                backgroundRepeat: 'repeat',
                backgroundSize: '120px',
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/20 pointer-events-none" />

            <div className="relative z-10">
              <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-white/15 border border-white/20 flex-shrink-0">
                  <Globe className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-white">
                    {t('landing.about.historyTitle')}
                  </h3>
                  <p className="text-xs sm:text-sm text-white/70">{t('landing.about.historySubtitle')}</p>
                </div>
              </div>
              <p className="text-sm sm:text-base text-white/85 leading-relaxed">
                {t('landing.about.historyText')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Event Highlights Section */}
      <section id="highlights" className="py-12 sm:py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4">
              {t('landing.highlights.title')}
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              {t('landing.highlights.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {eventHighlights.map((highlight, index) => (
              <div
                key={index}
                className="group relative rounded-lg sm:rounded-xl p-4 sm:p-6 overflow-hidden hover:shadow-lg transition-all duration-300"
                style={{ background: 'linear-gradient(135deg, #1A2B48 0%, #2D4A6F 50%, #1A2B48 100%)' }}
              >
                {/* Ethiopian diamond pattern overlay */}
                <div
                  className="absolute inset-0 pointer-events-none opacity-15 group-hover:opacity-25 transition-opacity"
                  style={{
                    backgroundImage: 'url(/images/ethiopian-traditional-pattern-color.png)',
                    backgroundRepeat: 'repeat',
                    backgroundSize: '80px',
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/5 to-black/15 pointer-events-none" />

                <div className="relative z-10">
                  <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg bg-white/15 border border-white/20 group-hover:bg-white/20 transition-colors mb-3 sm:mb-4">
                    <highlight.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <h3 className="text-sm sm:text-lg font-semibold text-white mb-1 sm:mb-2">
                    {t(highlight.titleKey)}
                  </h3>
                  <p className="text-xs sm:text-sm text-white/75">
                    {t(highlight.descKey)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ethiopian border divider */}
      <EthiopianBorder />

      {/* Key Information Section */}
      <section id="info" className="relative py-12 sm:py-16 md:py-24 overflow-hidden">
        <div className="relative max-w-4xl mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4">
              {t('landing.info.title')}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <div className="relative rounded-lg sm:rounded-xl p-5 sm:p-6 text-center overflow-hidden" style={{ background: 'linear-gradient(135deg, #1A2B48 0%, #2D4A6F 50%, #1A2B48 100%)' }}>
              <div
                className="absolute inset-0 pointer-events-none opacity-15"
                style={{
                  backgroundImage: 'url(/images/ethiopian-traditional-pattern-color.png)',
                  backgroundRepeat: 'repeat',
                  backgroundSize: '80px',
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/5 to-black/15 pointer-events-none" />
              <div className="relative z-10">
                <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-3 sm:mb-4 rounded-full bg-white/15 border border-white/20 flex items-center justify-center">
                  <Calendar className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <h3 className="font-semibold text-white mb-1 sm:mb-2">{t('landing.info.when.title')}</h3>
                <p className="text-white/75 text-xs sm:text-sm">{t('landing.info.when.details')}</p>
              </div>
            </div>
            <div className="relative rounded-lg sm:rounded-xl p-5 sm:p-6 text-center overflow-hidden" style={{ background: 'linear-gradient(135deg, #1A2B48 0%, #2D4A6F 50%, #1A2B48 100%)' }}>
              <div
                className="absolute inset-0 pointer-events-none opacity-15"
                style={{
                  backgroundImage: 'url(/images/ethiopian-traditional-pattern-color.png)',
                  backgroundRepeat: 'repeat',
                  backgroundSize: '80px',
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/5 to-black/15 pointer-events-none" />
              <div className="relative z-10">
                <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-3 sm:mb-4 rounded-full bg-white/15 border border-white/20 flex items-center justify-center">
                  <MapPin className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <h3 className="font-semibold text-white mb-1 sm:mb-2">{t('landing.info.where.title')}</h3>
                <p className="text-white/75 text-xs sm:text-sm">{t('landing.info.where.details')}</p>
              </div>
            </div>
            <div className="relative rounded-lg sm:rounded-xl p-5 sm:p-6 text-center overflow-hidden" style={{ background: 'linear-gradient(135deg, #1A2B48 0%, #2D4A6F 50%, #1A2B48 100%)' }}>
              <div
                className="absolute inset-0 pointer-events-none opacity-15"
                style={{
                  backgroundImage: 'url(/images/ethiopian-traditional-pattern-color.png)',
                  backgroundRepeat: 'repeat',
                  backgroundSize: '80px',
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/5 to-black/15 pointer-events-none" />
              <div className="relative z-10">
                <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-3 sm:mb-4 rounded-full bg-white/15 border border-white/20 flex items-center justify-center">
                  <Star className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <h3 className="font-semibold text-white mb-1 sm:mb-2">{t('landing.info.what.title')}</h3>
                <p className="text-white/75 text-xs sm:text-sm">{t('landing.info.what.details')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ethiopian border divider */}
      <EthiopianBorder />

      {/* Volunteer CTA Section */}
      <section className="py-12 sm:py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4">
          <div className="relative rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-12 text-center overflow-hidden" style={{ background: 'linear-gradient(135deg, #1A2B48 0%, #2D4A6F 50%, #1A2B48 100%)' }}>
            {/* Ethiopian diamond pattern overlay */}
            <div
              className="absolute inset-0 pointer-events-none opacity-20"
              style={{
                backgroundImage: 'url(/images/ethiopian-traditional-pattern-color.png)',
                backgroundRepeat: 'repeat',
                backgroundSize: '120px',
              }}
            />
            {/* Gradient overlay for depth */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/20 pointer-events-none" />

            <div className="relative z-10">
              <div className="flex justify-center mb-4 sm:mb-6">
                <div className="p-3 sm:p-4 bg-white/15 rounded-full border border-white/20">
                  <Heart className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </div>
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3 sm:mb-4">
                {t('landing.volunteer.title')}
              </h2>
              <p className="text-sm sm:text-base text-white/85 max-w-xl mx-auto mb-6 sm:mb-8">
                {t('landing.volunteer.description')}
              </p>
              <Link to="/volunteer-signup">
                <Button size="lg" className="gap-2 bg-secondary hover:bg-secondary-dark text-white">
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
      <footer className="bg-card border-t border-border py-8 sm:py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 mb-6 sm:mb-8">
            {/* Logo and Description */}
            <div className="sm:col-span-2 md:col-span-1">
              <div className="flex items-center gap-3 mb-3 sm:mb-4">
                <img
                  src="/images/ecscs-logo.png"
                  alt="ECSCS"
                  className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
                />
                <span className="text-base sm:text-lg font-semibold text-foreground">{t('header.title')}</span>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {t('landing.footer.description')}
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-foreground mb-3 sm:mb-4">{t('landing.footer.quickLinks')}</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#about" className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {t('landing.about.title')}
                  </a>
                </li>
                <li>
                  <Link to="/volunteer-signup" className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {t('landing.hero.volunteerCta')}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-semibold text-foreground mb-3 sm:mb-4">{t('landing.footer.contact')}</h4>
              <p className="text-xs sm:text-sm text-muted-foreground mb-2">{t('landing.footer.email')}</p>
              <Link
                to="/dashboard"
                className="text-xs sm:text-sm text-primary hover:underline"
              >
                {t('landing.nav.organizerLogin')}
              </Link>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-6 sm:pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs sm:text-sm text-muted-foreground text-center sm:text-left">
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
