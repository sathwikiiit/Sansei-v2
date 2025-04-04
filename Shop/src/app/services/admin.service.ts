import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiUser, Order, Product } from '../dao';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = this.authService.ApiUrl + '/admin'; // Base URL for the admin API endpoints

  constructor(private http: HttpClient, private authService: AuthService) { }

  getAllUsers(): Observable<ApiUser[]> {
    return this.http.get<ApiUser[]>(`${this.apiUrl}/users`, { headers: this.authService.getAuthHeaders() });
  }

  registerAdmin(user: any): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/register`, user, { headers: this.authService.getAuthHeaders() });
  }

  removeProduct(id: number): Observable<string> {
    return this.http.delete(`${this.apiUrl}/products/${id}`, { headers: this.authService.getAuthHeaders(), responseType: 'text' });
  }

  updateProduct(id: number, product: Product): Observable<string> {
    return this.http.put(`${this.apiUrl}/products/${id}`, product, { headers: this.authService.getAuthHeaders(), responseType: 'text' });
  }

  addProduct(product: Product): Observable<string> {
    return this.http.post(`${this.apiUrl}/products/add`, product, { headers: this.authService.getAuthHeaders(), responseType: 'text' });
  }

  addProducts(products: Product[]): Observable<string> {
    return this.http.post(`${this.apiUrl}/products/addJson`, products, { headers: this.authService.getAuthHeaders(), responseType: 'text' });
  }

  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products`, { headers: this.authService.getAuthHeaders() });
  }

  restockProduct(pid: number, quantity: number): Observable<string> {
    return this.http.put<string>(`${this.apiUrl}/restock/${pid}?quantity=${quantity}`, null, { headers: this.authService.getAuthHeaders() });
  }

  getPendingOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/orders/Pending`, { headers: this.authService.getAuthHeaders() });
  }

  confirmOrder(oid: number, deliveryDate: string,paymentMethod:string): Observable<string> {
    return this.http.put(`${this.apiUrl}/orders/confirm/${oid}?deliveryDate=${deliveryDate.toString()}&paymentMethod=${paymentMethod}`, null, { headers: this.authService.getAuthHeaders(),responseType:'text' });
  }
 
  getAllOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/orders`, { headers: this.authService.getAuthHeaders() });
  }
}