import {
  Component,
  OnInit,
} from '@angular/core';

import {
  isSameDay,
  isSameMonth,
  format
} from 'date-fns';

import {
  CalendarEvent,
  CalendarView
} from 'angular-calendar';
import { ModalController } from '@ionic/angular';
import { HttpClientService } from '../../../../services/httpclient.service';
import { GoogleOauthService } from '../../../../services/google-oauth.service';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { RRule, RRuleSet, rrulestr } from 'rrule'
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})

export class CalendarComponent implements OnInit {
  private calendarTitle: string = "";
  googleSession: any = null;
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  viewDate: Date = new Date();
  activeDayIsOpen: boolean = false;

  eventsObservables: any[] = [];
  calendarsList: any;

  isReady = false;

  events: CalendarEvent[] = [];

  constructor(private modalController: ModalController, private http: HttpClientService, private googleOAuth: GoogleOauthService) { }

  async ngOnInit() {
    try {
      this.googleSession = await this.googleOAuth.getStoredSession();
      this.isReady = false;
      this.calendarTitle = "Your Calendar";
      this.getUserCalendarsRequest();
    } catch(err) {
      this.isReady = true;
      this.events = [];
      this.googleSession = null;
    }
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

    //Directions logic in here
    requestDirections(event: CalendarEvent) {
      console.log(event);
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

private getUserEventsRequest() {
    for(let i in this.calendarsList) {
      this.eventsObservables.push(this.http.getEvents(this.googleSession, this.calendarsList[i].id).pipe(
        catchError(error => of(error))
      ));
    }

    forkJoin(this.eventsObservables).subscribe(
      (res) => {
        for(let i in res) {
          if(!(res[i] instanceof HttpErrorResponse)) {
            console.log(res[i]['items']);
            this.events.push(...this.getEventToInsert(res[i]['items'], { primary: this.calendarsList[i].backgroundColor, secondary: this.calendarsList[i].backgroundColor }));
          }
        }

        this.isReady = true;
      },
      (error) => console.log(error)
    );

  }

/*
{
  start:  subDays(startOfDay(new Date()), 1),
  end: addDays(new Date(), 1),
  title: 'A 3 day event',
  color: colors.red,
  allDay: true
}
*/

  private getEventToInsert(events: any, color: any) {
    let eventsList: CalendarEvent[] = [];
    let entry: CalendarEvent;
    let allDay: boolean;
    let start: Date;
    let end: Date;

    for(let event of events) {
      if(event.start.dateTime) {
          start = new Date(event.start.dateTime);
          end = new Date(event.end.dateTime);
          allDay = false;
      } else {
          start = new Date(event.start.date);
          end = new Date(event.end.date);
          allDay = true;
      }

      if(event.recurrence) {
        let startRrule = rrulestr(`DTSTART;TZID=America/Adak:${format(start, "yyyyMMdd'T'HHmmss'Z'")}\n${event.recurrence[0]};COUNT=3`).all();
        let endRrule = rrulestr(`DTSTART;TZID=America/Adak:${format(end, "yyyyMMdd'T'HHmmss'Z'")}\n${event.recurrence[0]};COUNT=3`).all()

        for(let i in startRrule) {
          entry  = {
            start: startRrule[i],
            end: endRrule[i],
            title: event.summary,
            color: color,
            allDay: allDay
          }
          eventsList.push(entry);
        }
      } else {
        entry  = {
          start: start,
          end: end,
          title: event.summary,
          color: color,
          allDay: allDay
        }
        eventsList.push(entry);
      }
    }

    return eventsList;
  }

  /**
    To login when the user is not logged in in the calendar
  */
  async login() {
    await this.googleOAuth.loginUser();
    this.googleSession = await this.googleOAuth.getStoredSession();
    this.ngOnInit();
  }
}
