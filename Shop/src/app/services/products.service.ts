// src/app/services/product.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service'; // Assuming AuthService handles JWT
import { Product, ProductResponse } from '../dao';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl:String;

  constructor(private http: HttpClient, private authService: AuthService) { 
    this.apiUrl= `${authService.ApiUrl}/products`
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken(); // Method in AuthService to get the JWT
    if (token) {
      return new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
    }
    return new HttpHeaders(); // Return empty headers if no token
  }

  getAllProducts(): Observable<Product[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<Product[]>(`${this.apiUrl}/all`, { headers });
  }

  getProductById(pId: number): Observable<Product> {
    const headers = this.getAuthHeaders();
    return this.http.get<Product>(`${this.apiUrl}/${pId}`, { headers });
  }

  getProducts(
    category?: string,
    tags?: string,
    searchString?: string,
    page: number = 0,
    size: number=10
  ): Observable<ProductResponse> {
    const headers = this.getAuthHeaders();
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size',size.toString())
    if (category) {
      params = params.set('category', category);
    }
    if (tags) {
      params = params.set('tags', tags);
    }
    if (searchString) {
      params = params.set('searchString', searchString);
    }

    return this.http.get<ProductResponse>(`${this.apiUrl}/filter`, { headers, params });
  }
}