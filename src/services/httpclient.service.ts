import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HTTP } from '@ionic-native/http/ngx';

@Injectable({
  providedIn: 'root'
})
export class HttpClientService {
  private readonly HTTP_ADDRESS = "https://www.googleapis.com/calendar/v3";

  constructor(private http: HTTP) {}

  public getUserCalendars(session: any): any {
    let headers = {'Authorization': `Bearer ${session.accessToken}`};
    return this.http.get(`${this.HTTP_ADDRESS}/users/me/calendarList`, {}, headers);
  }

  public getEvents(session: any, calendarId: any): any {
    let headers = {'Authorization': `Bearer ${session.accessToken}`};
    return this.http.get(`${this.HTTP_ADDRESS}/calendars/${calendarId}/events`, {}, headers);
  }

  /*public getUserCalendars(session: any): any {
    let headers = new HttpHeaders().append('Authorization', `Bearer ${session.accessToken}`);
    return this.http.get(`${this.HTTP_ADDRESS}/users/me/calendarList`, { headers });
  }

  public getEvents(session: any, calendarId: any) {
    let headers = new HttpHeaders().append('Authorization', `Bearer ${session.accessToken}`);
    return this.http.get(`${this.HTTP_ADDRESS}/calendars/${calendarId}/events`, { headers });
  }*/

}
