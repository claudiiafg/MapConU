import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HttpClientService {
  private readonly HTTP_ADDRESS = "https://www.googleapis.com/calendar/v3";

  constructor(private http: HttpClient) {}

  public getUserCalendars(session: any): any {
    let headers = new HttpHeaders().append('Authorization', `Bearer ${session.accessToken}`);
    return this.http.get(`${this.HTTP_ADDRESS}/users/me/calendarList`, { headers });
  }

  public getEvents(session: any, calendarId: any) {
    let headers = new HttpHeaders().append('Authorization', `Bearer ${session.accessToken}`);
    return this.http.get(`${this.HTTP_ADDRESS}/calendars/${calendarId}/events`, { headers });
  }

}
