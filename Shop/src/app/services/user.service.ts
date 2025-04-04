import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { ApiUserDTO, Cart, CartItemRequest, Order } from '../dao';
import { AuthService } from './auth.service';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  apiUrl: string;
  private cartUpdatedSubject = new BehaviorSubject<void>(undefined);
  cartUpdated$ = this.cartUpdatedSubject.asObservable();

  constructor(private http: HttpClient, private authService: AuthService) {
    this.apiUrl = `${this.authService.ApiUrl}/user`;
  }

  getUserProfile(): Observable<ApiUserDTO> {
    return this.http.get<ApiUserDTO>(`${this.apiUrl}/profile`, { headers: this.authService.getAuthHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  getCart(): Observable<Cart> {
    return this.http.get<Cart>(`${this.apiUrl}/cart`, { headers: this.authService.getAuthHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  updateCartItemQuantity(productId: number, quantity: number): Observable<string> {
    const body: CartItemRequest = { productId: productId, quantity: quantity };
    return this.http.post(`${this.apiUrl}/cart/items`, body, { headers: this.authService.getAuthHeaders(),responseType:'text' }).pipe(
      catchError(this.handleError),
      tap(() => this.cartUpdatedSubject.next(undefined))
    );
  }

  removeProductFromCart(productId: number): Observable<string> {
    return this.http.delete(`${this.apiUrl}/cart/remove?productId=${productId}`, { headers: this.authService.getAuthHeaders(),responseType:'text' }).pipe(
      catchError(this.handleError),
      tap(() => this.cartUpdatedSubject.next(undefined))
    );
  }

  placeOrder(): Observable<string> {
    return this.http.post(`${this.apiUrl}/order`, {}, { headers: this.authService.getAuthHeaders(),responseType:'text' }).pipe(
      catchError(this.handleError),
    );
  }

  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/orders`, { headers: this.authService.getAuthHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  getOrder(orderId: number): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/orders/${orderId}`, { headers: this.authService.getAuthHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any) {
    let errorMessage = 'An unexpected error occurred.';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      let backendMessage = error.error?.message || error.error || 'Backend error';
      if (error.status === 401) {
        errorMessage = backendMessage;
      } else if (error.status === 404) {
        errorMessage = backendMessage;
      }
       else {
        errorMessage = `Error Code: ${error.status}\nMessage: ${backendMessage}`;
      }
    }
    return throwError(() => errorMessage);
  }
}