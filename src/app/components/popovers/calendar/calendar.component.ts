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
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { ModalController } from '@ionic/angular';
import { HttpClientService } from '../../../../services/httpclient.service';
import { GoogleOauthService } from '../../../../services/google-oauth.service';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { rrulestr } from 'rrule'
import { HttpErrorResponse } from '@angular/common/http';
import { TranslationService } from '../../../../services/translation.service';
import { DataSharingService } from '../../../../services/data-sharing.service';

registerLocaleData(localeFr);

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})


/**
  This class is in charge of controlling the Calendar data. If a google instance is found, the user events would be fetched
  and the calendar will be populated by these events.
*/

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
  language: string;

  constructor(
      private modalController: ModalController,
      private http: HttpClientService,
      private googleOAuth: GoogleOauthService,
      private translate: TranslationService,
      private dataSharing: DataSharingService
  ) { }

  /**
    Check if the user is logged in to his google account.
    If not logged in, an error would be thrown.
    Else, the calendar will be populated with the user events
  */
  async ngOnInit() {
    try {
      this.googleSession = await this.googleOAuth.getStoredSession();
      this.isReady = false;
      this.calendarTitle = this.translate.getTranslation('calendar-title');
      this.getUserCalendarsRequest();
    } catch(err) {
      this.isReady = true;
      this.events = [];
      this.googleSession = null;

      this.dataSharing.language.subscribe( lang =>{
        if (lang == 'fr'){
          this.language = 'fr';
        }
        else{
          this.language = 'en';
        }
      });
    }
  }

  /**
    Opens the small div with the events detail when a day is clicked. If the day does not contains any events, no div will be displayed
  */
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


  /**
    Event clicked event handler. Will display the direction to the classroom/building of the clicked event
  */
  requestDirections(event: CalendarEvent) {
    console.log(event);
  }

  /**
    Sets the type of view of the Angular-calendar library. Could be monthly, weekly, and daily views
  */

  setView(view: CalendarView) {
    this.view = view;
  }

  /**
    Closes the calendar modal
  */
  close() {
    this.modalController.dismiss();
  }

  /**
    Fetch users calendars. If a calendar is found, start fetching for the user events.
  */
  getUserCalendarsRequest() {
    this.http.getUserCalendars(this.googleSession).subscribe(
      data => {
        this.calendarsList = data['items'];
        this.getUserEventsRequest();
      },
      err => console.error("User does not have calendars")
    );
  }

  /**
    For all of the user calendars, start fetching for events. Http call returns an observable.
    After the array of observables of the events is set up, use forkJoin to subscribe all of the observables.

    For each event, if the response was not an HTTP error (meaning the calendar has events in it), start building the array of events
    that will be displayed in the calendar.
  */
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
              this.events.push(...this.getEventToInsert(res[i]['items'], { primary: this.calendarsList[i].backgroundColor, secondary: this.calendarsList[i].backgroundColor }));
            }
          }

          this.isReady = true;
        },
        (error) => console.log(error)
      );
    }

  /**
    Parse events fetched from google calendar to something that angular-calendar understands
  */
  private getEventToInsert(events: any, color: any) {
    let eventsList: CalendarEvent[] = [];
    let entry: CalendarEvent;
    let allDay: boolean;
    let start: Date;
    let end: Date;

    // If the event does not have a dateTime, it means the event is a full day event.
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

      // If event has some type of recurrence (Rrule)
      if(event.recurrence) {
        // Parse the Rrule to something angular-calendar understands. Limited to 3 events for performance
        let startRrule = rrulestr(`DTSTART;TZID=America/Adak:${format(start, "yyyyMMdd'T'HHmmss'Z'")}\n${event.recurrence[0]};COUNT=10`, {cache: true}).all();
        let endRrule = rrulestr(`DTSTART;TZID=America/Adak:${format(end, "yyyyMMdd'T'HHmmss'Z'")}\n${event.recurrence[0]};COUNT=10`, {cache: true}).all()

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
