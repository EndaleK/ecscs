import { useTranslation } from 'react-i18next';
import { AddToCalendarButton } from 'add-to-calendar-button-react';
import { format } from 'date-fns';
import type { Event } from '@/types';

interface AddToCalendarProps {
  event: Event;
  buttonStyle?: 'default' | '3d' | 'flat' | 'round' | 'neumorphism' | 'text' | 'date';
  listStyle?: 'dropdown' | 'modal' | 'overlay';
  hideTextLabelButton?: boolean;
  hideCheckmark?: boolean;
  size?: '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10';
  lightMode?: 'system' | 'light' | 'dark' | 'bodyScheme';
}

export function AddToCalendar({
  event,
  buttonStyle = 'default',
  listStyle = 'dropdown',
  hideTextLabelButton = false,
  hideCheckmark = false,
  size = '3',
  lightMode = 'system',
}: AddToCalendarProps) {
  const { t } = useTranslation();

  // Format dates for the calendar button
  const startDate = format(new Date(event.startDate), 'yyyy-MM-dd');
  const endDate = format(new Date(event.endDate), 'yyyy-MM-dd');
  const startTime = format(new Date(event.startDate), 'HH:mm');
  const endTime = format(new Date(event.endDate), 'HH:mm');

  // Check if it's an all-day event (times are 00:00)
  const isAllDay = startTime === '00:00' && endTime === '00:00';

  return (
    <AddToCalendarButton
      name={event.title}
      description={event.description || ''}
      startDate={startDate}
      endDate={endDate}
      startTime={isAllDay ? undefined : startTime}
      endTime={isAllDay ? undefined : endTime}
      location={event.location || ''}
      options={['Google', 'Apple', 'Outlook.com', 'Microsoft365', 'iCal']}
      buttonStyle={buttonStyle}
      listStyle={listStyle}
      hideTextLabelButton={hideTextLabelButton}
      hideCheckmark={hideCheckmark}
      size={size}
      lightMode={lightMode}
      label={t('sharing.addToCalendar')}
      language="en"
      timeZone="currentBrowser"
    />
  );
}

// Simplified version with explicit date/time props
interface AddToCalendarSimpleProps {
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  location?: string;
  buttonStyle?: 'default' | '3d' | 'flat' | 'round' | 'neumorphism' | 'text' | 'date';
  listStyle?: 'dropdown' | 'modal' | 'overlay';
  size?: '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10';
}

export function AddToCalendarSimple({
  title,
  description = '',
  startDate,
  endDate,
  location = '',
  buttonStyle = 'default',
  listStyle = 'dropdown',
  size = '3',
}: AddToCalendarSimpleProps) {
  const { t } = useTranslation();

  const formattedStartDate = format(startDate, 'yyyy-MM-dd');
  const formattedEndDate = format(endDate, 'yyyy-MM-dd');
  const formattedStartTime = format(startDate, 'HH:mm');
  const formattedEndTime = format(endDate, 'HH:mm');

  const isAllDay = formattedStartTime === '00:00' && formattedEndTime === '00:00';

  return (
    <AddToCalendarButton
      name={title}
      description={description}
      startDate={formattedStartDate}
      endDate={formattedEndDate}
      startTime={isAllDay ? undefined : formattedStartTime}
      endTime={isAllDay ? undefined : formattedEndTime}
      location={location}
      options={['Google', 'Apple', 'Outlook.com', 'Microsoft365', 'iCal']}
      buttonStyle={buttonStyle}
      listStyle={listStyle}
      size={size}
      label={t('sharing.addToCalendar')}
      language="en"
      timeZone="currentBrowser"
    />
  );
}
