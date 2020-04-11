import { CalendarEvent } from 'angular-calendar';

export interface CalendarEventClicked {
  event: CalendarEvent;
  sourceEvent: MouseEvent;
}
