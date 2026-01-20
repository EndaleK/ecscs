import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Share2, Calendar, MapPin, Clock, Link, Check } from 'lucide-react';
import { SocialShare } from './social-share';
import { AddToCalendar } from './add-to-calendar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate } from '@/lib/utils';
import type { Event } from '@/types';

interface ShareEventDialogProps {
  event: Event;
  isOpen: boolean;
  onClose: () => void;
}

export function ShareEventDialog({ event, isOpen, onClose }: ShareEventDialogProps) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  // Generate share URL
  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/events/${event.id}`
    : '';

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Dialog */}
      <Card className="relative z-10 w-full max-w-md mx-4 shadow-xl">
        <CardHeader className="relative">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 p-1 rounded-full hover:bg-muted transition-colors"
            aria-label={t('common.close')}
          >
            <X className="h-5 w-5" />
          </button>
          <CardTitle className="flex items-center gap-2 pr-8">
            <Share2 className="h-5 w-5" />
            {t('sharing.shareEvent')}
          </CardTitle>
          <CardDescription>
            {t('sharing.shareEventDescription')}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Event Summary */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <h3 className="font-semibold text-lg">{event.title}</h3>

            {event.description && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {event.description}
              </p>
            )}

            <div className="flex flex-col gap-1 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>
                  {formatDate(event.startDate, 'PPP')}
                  {event.startDate !== event.endDate && (
                    <> - {formatDate(event.endDate, 'PPP')}</>
                  )}
                </span>
              </div>

              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>
                  {formatDate(event.startDate, 'p')} - {formatDate(event.endDate, 'p')}
                </span>
              </div>

              {event.location && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{event.location}</span>
                </div>
              )}
            </div>
          </div>

          {/* Social Share Buttons */}
          <div>
            <h4 className="text-sm font-medium mb-3">{t('sharing.shareOn')}</h4>
            <SocialShare
              event={event}
              iconSize={40}
              className="justify-center"
            />
          </div>

          {/* Add to Calendar */}
          <div>
            <h4 className="text-sm font-medium mb-3">{t('sharing.addToYourCalendar')}</h4>
            <div className="flex justify-center">
              <AddToCalendar
                event={event}
                buttonStyle="default"
                size="4"
              />
            </div>
          </div>

          {/* Copy Link */}
          <div>
            <h4 className="text-sm font-medium mb-3">{t('sharing.copyLink')}</h4>
            <div className="flex gap-2">
              <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-muted rounded-md text-sm truncate">
                <Link className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                <span className="truncate text-muted-foreground">{shareUrl}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyLink}
                className="flex-shrink-0"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 mr-1" />
                    {t('sharing.copied')}
                  </>
                ) : (
                  t('sharing.copy')
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Hook for managing dialog state
export function useShareEventDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const openDialog = (event: Event) => {
    setSelectedEvent(event);
    setIsOpen(true);
  };

  const closeDialog = () => {
    setIsOpen(false);
    setSelectedEvent(null);
  };

  return {
    isOpen,
    selectedEvent,
    openDialog,
    closeDialog,
  };
}
