import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { StorageService } from './storage.service';
import { Router } from '@angular/router';

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private storageService: StorageService,
    private router: Router
  ) {
    const savedUser = this.storageService.getItem<User>('user', true);
    if (savedUser) {
      this.currentUserSubject.next(savedUser);
    }
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, { email, password })
      .pipe(
        tap(response => this.handleAuthentication(response))
      );
  }

  register(userData: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/register`, userData)
      .pipe(
        tap(response => this.handleAuthentication(response))
      );
  }

  logout(): void {
    this.storageService.removeItem('user');
    this.storageService.removeItem('token');
    this.storageService.removeItem('refreshToken');
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  refreshToken(): Observable<AuthResponse> {
    const refreshToken = this.storageService.getItem<string>('refreshToken', true);
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/refresh-token`, { refreshToken })
      .pipe(
        tap(response => this.handleAuthentication(response))
      );
  }

  verifyEmail(otp: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/auth/verify-email`, { otp });
  }

  resetPasswordRequest(email: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/auth/reset-password-request`, { email });
  }

  resetPassword(data: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/auth/reset-password`, data);
  }

  private handleAuthentication(response: AuthResponse): void {
    this.storageService.setItem('user', response.user, true);
    this.storageService.setItem('token', response.token, true);
    this.storageService.setItem('refreshToken', response.refreshToken, true);
    this.currentUserSubject.next(response.user);
  }

  getToken(): string | null {
    return this.storageService.getItem<string>('token', true);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  hasRole(role: string): boolean {
    return this.currentUserValue?.role === role;
  }
}
