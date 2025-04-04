import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { ApiUserDTO } from '../dao'; // Adjust the path as needed
import { Subscription } from 'rxjs';
import { UserService } from '../services/user.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { AdminService } from '../services/admin.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  imports: [CommonModule],
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnDestroy {
  userProfile: ApiUserDTO | null = null;
  loading: boolean = true;
  error: string | null = null;
  private profileSubscription!: Subscription;
  authSubscription!: Subscription;
  isLoggedIn: boolean = false;
  totalProducts: number | undefined;

  constructor(private userService: UserService, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.loading = true;
    this.profileSubscription = this.userService.getUserProfile().subscribe({
      next: (profile) => {
        this.userProfile = profile;
        this.loading = false;
        this.error = null;
      },
      error: (error) => {
        this.error = error;
        this.loading = false;
        this.userProfile = null;
      }
    }
    );
  }

  ngOnDestroy(): void {
    if (this.profileSubscription) {
      this.profileSubscription.unsubscribe();
    }
  }
  goToCart(): void {
    this.router.navigate(['/cart']);
  }

  goToOrders(): void {
    this.router.navigate(['/orders']); // Assuming '/orders' is your orders page
  }
  shopMore(): void {
    this.router.navigate(['/products']); // Assuming '/products' is your shop page
  }
  loadAdditionalData(): void {
    if (this.isAdminUser()) {
      inject(AdminService).getAllProducts().subscribe({
        next: (products) => {
          this.totalProducts = products.length;
        },
        error: (err) => {
          console.error('Failed to load product count:', err);
        }
      });
    }
    // You can add other data fetching logic here based on the user's role
  }
  goToAdminDashboard() {
    this.router.navigate(['\admin'])
  }
  isAdminUser() {
    const role = this.authService.getRole()
    return role=="ADMIN"
  }

}