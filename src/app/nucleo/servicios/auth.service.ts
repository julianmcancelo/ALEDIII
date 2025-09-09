import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'student' | 'profesor';
  password?: string;
  dni?: string;
  legajo?: string;
  carrera?: string;
  especialidad?: string;
  telefono?: string;
  departamento?: string;
  created_at?: string;
}

export interface CheckUsersResponse {
  hasUsers: boolean;
  count: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = `${environment.apiUrl}/users`;

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      this.currentUserSubject.next(JSON.parse(savedUser));
    }
  }

  login(email: string, password: string): Observable<boolean> {
    return this.http.get<User[]>(`${this.apiUrl}?email=${email}&password=${password}`).pipe(
      map(users => {
        if (users.length > 0) {
          const user = users[0];
          this.currentUserSubject.next(user);
          localStorage.setItem('currentUser', JSON.stringify(user));
          return true;
        } else {
          return false;
        }
      }),
      catchError(error => {
        console.error('Login failed:', error);
        return of(false);
      })
    );
  }

  logout(): void {
    this.currentUserSubject.next(null);
    localStorage.removeItem('currentUser');
    this.router.navigate(['/auth/login']);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return this.currentUserSubject.value !== null;
  }

  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user ? user.role === role : false;
  }

  isAdmin(): boolean {
    return this.hasRole('admin');
  }

  isTeacher(): boolean {
    return this.hasRole('profesor');
  }

  isStudent(): boolean {
    return this.hasRole('student');
  }

  checkUsersExist(): Observable<CheckUsersResponse> {
    return this.http.get<CheckUsersResponse>(`${this.apiUrl}?check=true`).pipe(
      catchError(error => {
        console.error('Error checking users:', error);
        return of({ hasUsers: true, count: 0 });
      })
    );
  }

  createUser(userData: Partial<User>): Observable<User> {
    return this.http.post<User>(this.apiUrl, userData).pipe(
      catchError(error => {
        console.error('Error creating user:', error);
        throw error;
      })
    );
  }
}
