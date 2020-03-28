import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HttpClientService {
  private readonly HTTP_ADDRESS = "https://www.googleapis.com/calendar/v3";


  constructor(private http: HttpClient) {}

  public async getUserCalendars(session: any): Promise<any> {
    try{
      return new Promise(async function(resolve, reject) {
    		const formBody = 'access_token=' + session.access_token;
    		const url = 'https://www.googleapis.com/calendar/v3/users/me/calendarList?' + formBody;
    		let headers =  {'Content-Type': 'application/x-www-form-urlencoded'};
    		let calendarIdLIst: string[] = [];
        try{
          this.http.get({
      			url: url,
      			headers: headers,
      		}, async (error, response, body) => {
      			if(error){
      				console.log(error);
      				reject(error);
      			} else {
      				let parsedResponse = JSON.parse(body);
      				parsedResponse.items.forEach(item => {
      					calendarIdLIst.push(item.id);
      				});
      				resolve(calendarIdLIst)
      			}
      		})
        } catch(err){
          console.error("Error with http call: " + err);
        }
      });
    } catch (e){
      console.error("Error returning promise: " + e)
    }
  }

  public getEvents(session: any, calendarId: any) {
    let headers = new HttpHeaders().append('Authorization', `Bearer ${session.accessToken}`);
    return this.http.get(`${this.HTTP_ADDRESS}/calendars/${calendarId}/events`, { headers });
  }

}
