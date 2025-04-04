import { Component, inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-authorization',
    imports: [CommonModule, FormsModule, RouterModule],
    templateUrl: './authorization.component.html',
    styleUrl: './authorization.component.css'
})
export class AuthorizationComponent {
  isLogin = true; // Flag to toggle between login and register forms
  username = '';
  password = '';
  email = '';
  phone = '';
  currentAdress = '';
  errorMessage: string | null = null; // To display error messages

  private authService = inject(AuthService);
  private router = inject(Router);

  constructor() {
    // No need to inject in the constructor anymore
  }

  toggleForm(): void {
    this.isLogin = !this.isLogin;
    this.errorMessage = null; // Clear any previous errors when toggling
  }

  login(): void {
    this.authService.login({ username: this.username, password: this.password }).subscribe({
      next: (token) => {
        // After successful login, the role is available in the AuthService
        const role = this.authService.getRole();
        this.router.navigate(['/profile']); // Navigate to a protected route after login
      },
      error: (error) => {
        this.errorMessage = 'Invalid credentials'; // Set specific error message for login
      }
    });
  }

  register(): void {
    const userData = {
      username: this.username,
      password: this.password,
      email: this.email,
      phone: this.phone,
      currentAdress: this.currentAdress
    };
    this.authService.register(userData).subscribe({
      next: (response) => {
        this.isLogin = true; // Switch to login form after successful registration
        this.errorMessage = null; // Clear any previous errors
      },
      error: (error) => {
        console.error('Registration failed:', error);
        let message = 'Registration failed. Please try again.';
        this.errorMessage = message;
      }
    });
  }
}