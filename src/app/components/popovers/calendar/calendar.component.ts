import {
  Component,
  OnInit,
} from '@angular/core';

import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours
} from 'date-fns';

import {
  CalendarEvent,
  CalendarView
} from 'angular-calendar';
import { ModalController } from '@ionic/angular';
import { HttpClientService } from '../../../../services/httpclient.service';
import { GoogleOauthService } from '../../../../services/google-oauth.service';

const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3'
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF'
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA'
  }
};

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})

export class CalendarComponent implements OnInit {
  private googleSession: any = null;
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  viewDate: Date = new Date();
  activeDayIsOpen: boolean = true;

  private calendarsList: any;

  events: CalendarEvent[] = [
    {
      start: subDays(startOfDay(new Date()), 1),
      end: addDays(new Date(), 1),
      title: 'A 3 day event',
      color: colors.red,
      allDay: true
    },
    {
      start: startOfDay(new Date()),
      title: 'An event with no end date',
      color: colors.yellow
    },
    {
      start: subDays(endOfMonth(new Date()), 3),
      end: addDays(endOfMonth(new Date()), 3),
      title: 'A long event that spans 2 months',
      color: colors.blue,
      allDay: true
    },
    {
      start: addHours(startOfDay(new Date()), 2),
      end: addHours(new Date(), 2),
      title: 'Another Event',
      color: colors.yellow
    }
  ];

  constructor(private modalController: ModalController, private http: HttpClientService, private googleOAuth: GoogleOauthService) { }

  async ngOnInit() {
    try {
      this.googleSession = await this.googleOAuth.getStoredSession();
    } catch(err) {
      this.googleSession = null;
    }

   this.getUserCalendarsRequest();
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
      if (isSameMonth(date, this.viewDate)) {
        if (
          (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
          events.length === 0
        ) {
          this.activeDayIsOpen = false;
        } else {
          this.activeDayIsOpen = true;
        }
        this.viewDate = date;
      }
    }

  setView(view: CalendarView) {
    this.view = view;
  }

  close() {
    this.modalController.dismiss();
  }

  getUserCalendarsRequest() {
    this.http.getUserCalendars(this.googleSession).subscribe(data => {
      this.calendarsList = data['items'];
      this.getUserEventsRequest();
    });
  }

  getUserEventsRequest() {
    for(let i in this.calendarsList) {
      try {
        this.http.getEvents(this.googleSession, this.calendarsList[i].id).subscribe(data => {
          this.events.push(...this.getEventToInsert(data['items'], this.calendarsList[i].backgroundColor));
          console.log(this.events);
        });
      } catch(err) {
        console.error("No events in calendar: " + this.calendarsList[i].id);
      }
    }
  }

/*
{
  start: subDays(startOfDay(new Date()), 1),
  end: addDays(new Date(), 1),
  title: 'A 3 day event',
  color: colors.red,
  allDay: true
}
*/

  private getEventToInsert(events: any, color: any) {
    let eventsList: CalendarEvent[] = [];

    for(let event of events) {
      let entry: CalendarEvent = {
        start: new Date(event.start.dateTime),
        end: new Date(event.end.dateTime),
        title: event.summary,
        color: color
      }
      eventsList.push(entry);
    }
    return eventsList;
  }
}
