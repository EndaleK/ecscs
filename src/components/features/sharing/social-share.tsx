import { useTranslation } from 'react-i18next';
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  LinkedinShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
  LinkedinIcon,
} from 'react-share';
import type { Event } from '@/types';
import { formatDate } from '@/lib/utils';

interface SocialShareProps {
  event: Event;
  customMessage?: string;
  iconSize?: number;
  round?: boolean;
  className?: string;
}

export function SocialShare({
  event,
  customMessage,
  iconSize = 32,
  round = true,
  className = '',
}: SocialShareProps) {
  const { t } = useTranslation();

  // Generate share URL (in production, this would be the actual event URL)
  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/events/${event.id}`
    : '';

  // Generate default share message
  const defaultMessage = t('sharing.defaultMessage', {
    title: event.title,
    date: formatDate(event.startDate, 'PPP'),
    location: event.location || t('sharing.locationTBA'),
  });

  const shareMessage = customMessage || defaultMessage;

  // Generate hashtags for Twitter
  const hashtags = ['ECSCS', 'ECSCS30Years', 'SoccerTournament'];

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <FacebookShareButton
        url={shareUrl}
        hashtag="#ECSCS30Years"
        title={shareMessage}
        aria-label={t('sharing.shareOnFacebook')}
      >
        <FacebookIcon size={iconSize} round={round} />
      </FacebookShareButton>

      <TwitterShareButton
        url={shareUrl}
        title={shareMessage}
        hashtags={hashtags}
        aria-label={t('sharing.shareOnTwitter')}
      >
        <TwitterIcon size={iconSize} round={round} />
      </TwitterShareButton>

      <WhatsappShareButton
        url={shareUrl}
        title={shareMessage}
        separator=" - "
        aria-label={t('sharing.shareOnWhatsApp')}
      >
        <WhatsappIcon size={iconSize} round={round} />
      </WhatsappShareButton>

      <LinkedinShareButton
        url={shareUrl}
        title={event.title}
        summary={shareMessage}
        source="ECSCS Tournament"
        aria-label={t('sharing.shareOnLinkedIn')}
      >
        <LinkedinIcon size={iconSize} round={round} />
      </LinkedinShareButton>
    </div>
  );
}

// Export a simpler version for general sharing (not event-specific)
interface SimpleShareProps {
  url: string;
  title: string;
  description?: string;
  iconSize?: number;
  round?: boolean;
  className?: string;
}

export function SimpleShare({
  url,
  title,
  description = '',
  iconSize = 32,
  round = true,
  className = '',
}: SimpleShareProps) {
  const { t } = useTranslation();
  const shareMessage = description || title;
  const hashtags = ['ECSCS', 'ECSCS30Years'];

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <FacebookShareButton
        url={url}
        hashtag="#ECSCS30Years"
        title={shareMessage}
        aria-label={t('sharing.shareOnFacebook')}
      >
        <FacebookIcon size={iconSize} round={round} />
      </FacebookShareButton>

      <TwitterShareButton
        url={url}
        title={shareMessage}
        hashtags={hashtags}
        aria-label={t('sharing.shareOnTwitter')}
      >
        <TwitterIcon size={iconSize} round={round} />
      </TwitterShareButton>

      <WhatsappShareButton
        url={url}
        title={shareMessage}
        separator=" - "
        aria-label={t('sharing.shareOnWhatsApp')}
      >
        <WhatsappIcon size={iconSize} round={round} />
      </WhatsappShareButton>

      <LinkedinShareButton
        url={url}
        title={title}
        summary={shareMessage}
        source="ECSCS Tournament"
        aria-label={t('sharing.shareOnLinkedIn')}
      >
        <LinkedinIcon size={iconSize} round={round} />
      </LinkedinShareButton>
    </div>
  );
}
