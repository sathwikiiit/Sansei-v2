import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'api'; // Your Spring Boot API base URL
  private tokenKey = 'authToken';
  private currentTokenSubject = new BehaviorSubject<string | null>(localStorage.getItem(this.tokenKey));
  public currentToken = this.currentTokenSubject.asObservable();
  jwtHelper: JwtHelperService = new JwtHelperService();

  constructor(private http: HttpClient) {
  }

  login(credentials: any): Observable<string> {
    return this.http.post(`${this.apiUrl}/login`, {}, {
      params: credentials,
      responseType: 'text' // Add this line
    }).pipe(
      tap(token => {
        this.currentTokenSubject.next(token);
        localStorage.setItem(this.tokenKey, token);
      })
    );
  }

  register(userData: any) {
    return this.http.post(`${this.apiUrl}/register`, userData, {
      responseType: 'text',
    });
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    return !!token && !this.jwtHelper.isTokenExpired(token);
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.currentTokenSubject.next(null);
  }

  getToken(): string | null {
    return this.currentTokenSubject.value;
  }

  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  getRole(): string | null {
    const token = this.currentTokenSubject.value;
    if (token != null) {
      try {
        const decodedToken = this.jwtHelper.decodeToken(token);
        return decodedToken.Role; // Assuming your role claim is named 'role'
      } catch (error) {
        console.error('Error decoding token:', error);
        return null;
      }
    }
    return null;
  }

  get ApiUrl() {
    return this.apiUrl;
  }
}