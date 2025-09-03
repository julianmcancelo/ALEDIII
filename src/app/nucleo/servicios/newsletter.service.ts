import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Subscription {
  id?: string;
  email: string;
  subscribedAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class NewsletterService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/newsletter`;

  subscribe(email: string): Observable<Subscription> {
    const newSubscription: Subscription = {
      email,
      subscribedAt: new Date()
    };
    return this.http.post<Subscription>(this.apiUrl, newSubscription);
  }
}
