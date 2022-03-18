import { Injectable } from '@angular/core';
import { HttpBackend, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CallMethodService {

  constructor(
    private http: HttpClient,
    public httpClient: HttpClient,
    public handler: HttpBackend) {
    this.httpClient = new HttpClient(handler);
  }

  login(opts: any): Observable<any> {
    return this.http.post('signin', opts)
  }

  signUp(opts: any): Observable<any> {
    return this.http.post('signup', opts)
  }

  createEvent(opts: any): Observable<any> {
    return this.http.post('event/create', opts)
  }
  getAllEvents(opts: any): Observable<any> {
    return this.http.post('event/get',opts)
  }
  joinEvent(opts: any): Observable<any> {
    return this.http.post('event/join',opts)
  }
  getJoinEvent(opts: any): Observable<any> {
    return this.http.post('event/join/get',opts)
  }
  leaveEvent(opts: any): Observable<any> {
    return this.http.post('event/join/leave',opts)
  }
  updateUser(opts: any): Observable<any> {
    return this.http.post('user/edit', opts)
  }
  getParticipant(opts: any): Observable<any> {
    return this.http.post('event/participant/get', opts)
  }
}
