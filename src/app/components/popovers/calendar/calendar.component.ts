import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  NativeGeocoder,
  NativeGeocoderResult,
} from '@ionic-native/native-geocoder/ngx';
import { Events, ModalController } from '@ionic/angular';
import { CalendarEvent, CalendarView } from 'angular-calendar';
import { format, isSameDay, isSameMonth } from 'date-fns';
import { rrulestr } from 'rrule';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DataSharingService } from 'src/services/data-sharing.service';
import { DirectionService } from 'src/services/direction.service';
import { GeolocationServices } from 'src/services/geolocation.services';
import { CalendarEventClicked } from '../../../../models/calendarEventClickedModel';
import { GoogleOauthService } from '../../../../services/google-oauth.service';
import { HttpClientService } from '../../../../services/httpclient.service';
import { DirectionsManagerService } from 'src/services/directionsManager.service';
import { Direction } from 'src/models/directionModel';
import { Coordinates } from 'src/models/coordinates';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})

/**
  This class is in charge of controlling the Calendar data. If a google instance is found, the user events would be fetched
  and the calendar will be populated by these events.
*/
export class CalendarComponent implements OnInit {
  private calendarTitle: string = '';
  googleSession: any = null;
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  viewDate: Date = new Date();
  activeDayIsOpen: boolean = false;

  eventsObservables: any[] = [];
  calendarsList: any;

  isReady = false;

  events: CalendarEvent[] = [];

  constructor(
    private modalController: ModalController,
    private http: HttpClientService,
    private googleOAuth: GoogleOauthService,
    private nativeGeocoder: NativeGeocoder,
    private directionService: DirectionService,
    private dataSharingService: DataSharingService,
    private geolocationService: GeolocationServices,
    private directionManager: DirectionsManagerService,
    private ionicEvents: Events
  ) {}

  /**
    Check if the user is logged in to his google account.
    If not logged in, an error would be thrown.
    Else, the calendar will be populated with the user events
  */
  public async ngOnInit() {
    try {
      this.googleSession = await this.googleOAuth.getStoredSession();
      this.isReady = false;
      this.calendarTitle = 'Your Calendar';
      this.getUserCalendarsRequest();
    } catch (err) {
      this.isReady = true;
      this.events = [];
      this.googleSession = null;
    }
  }

  /**
    Opens the small div with the events detail when a day is clicked. If the day does not contains any events, no div will be displayed
    @param date Date day clicked
    @param events Events in the date
  */
  public dayClicked({
    date,
    events,
  }: {
    date: Date;
    events: CalendarEvent[];
  }): void {
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
   * Function to calculate steps after user clic on class or event with location
   * @param CalendarEventClicked Calendar object with Calendar Event and Mouse Event
   */
  public requestDirections($event: CalendarEventClicked) {
    if (
      $event.event.meta.location ||
      this.getConcordiaRoomFromCalendarEvent($event.event)
    ) {
      if (this.getConcordiaRoomFromCalendarEvent($event.event)) {
        // prettier-ignore
        let roomNumber: string = this.getConcordiaRoomFromCalendarEvent($event.event);
        this.directionService.isDirectionSet.next(true);
        this.directionManager.getPathToRoom(roomNumber);
        this.ionicEvents.publish('building-to-floor');
      } else {
        this.goToCalendarOutsideDirection($event);
      }
      this.close();
    } else {
      alert('There isn\'t any location or room number associated with this event');
    }
  }

  /**
   * Function to set outside route if event has a location.
   * @param CalendarEventClicked Calendar object with Calendar Event and Mouse Event
   */
  public goToCalendarOutsideDirection($event: CalendarEventClicked) {
    let latitudeTo: number;
    let longitudeTo: number;

    this.nativeGeocoder
      .forwardGeocode($event.event.meta.location)
      .then((result: NativeGeocoderResult[]) => {
        latitudeTo = +result[0].latitude;
        longitudeTo = +result[0].longitude;

        let sourceCoordinates: Coordinates = {
          lat: this.geolocationService.getLatitude(),
          lng: this.geolocationService.getLongitude(),
        };

        let destinationCoordinates: Coordinates = {
          lat: latitudeTo,
          lng: longitudeTo,
        };

        let direction: Direction = {
          origin: sourceCoordinates,
          destination: destinationCoordinates,
        };

        this.directionService.outputDirectionOnMap(direction, -210);
      })
      .catch((error: any) => console.log(error));
  }

  /**
    Sets the type of view of the Angular-calendar library. Could be monthly, weekly, and daily views
    @param view MONTLY | WEEKLY | DAILY calendar view
  */

  public setView(view: CalendarView) {
    this.view = view;
  }

  /**
    Closes the calendar modal
  */
  public close() {
    this.modalController.dismiss();
  }

  /**
    Fetch users calendars. If a calendar is found, start fetching for the user events.
  */
  public getUserCalendarsRequest() {
    this.http.getUserCalendars(this.googleSession).subscribe(
      (data) => {
        this.calendarsList = data['items'];
        this.getUserEventsRequest();
      },
      (err) => console.error('User does not have calendars')
    );
  }

  /**
    To login when the user is not logged in in the calendar
  */
  public async login() {
    await this.googleOAuth.loginUser();
    this.googleSession = await this.googleOAuth.getStoredSession();
    this.ngOnInit();
  }

  /**
    For all of the user calendars, start fetching for events. Http call returns an observable.
    After the array of observables of the events is set up, use forkJoin to subscribe all of the observables.

    For each event, if the response was not an HTTP error (meaning the calendar has events in it), start building the array of events
    that will be displayed in the calendar.
  */
  private getUserEventsRequest() {
    for (let i in this.calendarsList) {
      this.eventsObservables.push(
        this.http
          .getEvents(this.googleSession, this.calendarsList[i].id)
          .pipe(catchError((error) => of(error)))
      );
    }

    forkJoin(this.eventsObservables).subscribe(
      (res) => {
        for (let i in res) {
          if (!(res[i] instanceof HttpErrorResponse)) {
            this.events.push(
              ...this.getEventToInsert(res[i]['items'], {
                primary: this.calendarsList[i].backgroundColor,
                secondary: this.calendarsList[i].backgroundColor,
              })
            );
          }
        }

        this.isReady = true;
      },
      (error) => console.log(error)
    );
  }

  /**
    Parse events fetched from google calendar to something that angular-calendar understands
    @param events List of events in the calendar
    @param color Color of the calendar the event belongs to
  */
  private getEventToInsert(events: any, color: any) {
    let eventsList: CalendarEvent[] = [];
    let entry: CalendarEvent;
    let allDay: boolean;
    let start: Date;
    let end: Date;

    // If the event does not have a dateTime, it means the event is a full day event.
    for (let event of events) {
      if (event.start.dateTime) {
        start = new Date(event.start.dateTime);
        end = new Date(event.end.dateTime);
        allDay = false;
      } else {
        start = new Date(event.start.date);
        end = new Date(event.end.date);
        allDay = true;
      }

      // If event has some type of recurrence (Rrule)
      if (event.recurrence) {
        // Parse the Rrule to something angular-calendar understands. Limited to 3 events for performance

        // prettier-ignore
        let startRrule = rrulestr(`DTSTART;TZID=America/Adak:${format(start, "yyyyMMdd'T'HHmmss'Z'")}\n${event.recurrence[0]};COUNT=10`, {cache: true}).all();
        // prettier-ignore
        let endRrule = rrulestr(`DTSTART;TZID=America/Adak:${format(end, "yyyyMMdd'T'HHmmss'Z'")}\n${event.recurrence[0]};COUNT=10`, {cache: true}).all()

        for (let i in startRrule) {
          entry = {
            start: startRrule[i],
            end: endRrule[i],
            title: event.summary,
            color: color,
            allDay: allDay,
            meta: {
              location: event.location,
            },
          };
          eventsList.push(entry);
        }
      } else {
        entry = {
          start: start,
          end: end,
          title: event.summary,
          color: color,
          allDay: allDay,
          meta: {
            location: event.location,
            description: event.description,
          },
        };
        eventsList.push(entry);
      }
    }

    return eventsList;
  }

  /**
   * Function to see if there is a room number inside the description or title of a calendar event.
   * @param calendarEvent Event from angular calendar
   * @returns string|undefined Returns a room number or undefined
   */
  private getConcordiaRoomFromCalendarEvent(calendarEvent: CalendarEvent) {
    let room: string | undefined = undefined;

    // Title has hall room number in it.
    if (
      calendarEvent.title &&
      (calendarEvent.title.match(/([H|h])-([0-9][0-9][0-9])/g) ||
        calendarEvent.title.match(/([H|h])([0-9][0-9][0-9])/g))
    ) {
      room = calendarEvent.title.match(/([H|h])-([0-9][0-9][0-9])/g)
        ? calendarEvent.title.match(/([H|h])-([0-9][0-9][0-9])/g)[0]
        : calendarEvent.title.match(/([H|h])([0-9][0-9][0-9])/g)[0];
      return room;
    }

    // Description has hall room number in it.
    if (
      calendarEvent.meta.description &&
      (calendarEvent.meta.description.match(/([H|h])-([0-9][0-9][0-9])/g) ||
        calendarEvent.meta.description.match(/([H|h])([0-9][0-9][0-9])/g))
    ) {
      room = calendarEvent.meta.description.match(/([H|h])-([0-9][0-9][0-9])/g)
        ? calendarEvent.meta.description.match(/([H|h])-([0-9][0-9][0-9])/g)[0]
        : calendarEvent.meta.description.match(/([H|h])([0-9][0-9][0-9])/g)[0];
      // prettier-ignore
      return room;
    }

    let titleToLowerCase: string = calendarEvent.title.toLocaleLowerCase();

    if (
      titleToLowerCase.includes('mb1-210') ||
      titleToLowerCase.includes('mb1210')
    ) {
      return (room = 'mb1-210');
    }

    if (calendarEvent.meta.description) {
      let descriptionToLowerCase: string = calendarEvent.meta.description.toLocaleLowerCase();
      if (
        descriptionToLowerCase.includes('mb1-210') ||
        descriptionToLowerCase.includes('mb1210')
      ) {
        return (room = 'mb1-210');
      }
    }

    return room;
  }

  /**
    Present the calendars popover
  */
  async presentCalendars() {

  }
}
