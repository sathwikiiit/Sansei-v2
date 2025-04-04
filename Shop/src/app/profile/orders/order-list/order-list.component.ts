import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Order } from '../../../dao';
import { UserService } from '../../../services/user.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-order-list',
  imports:[CommonModule],
  templateUrl: './order-list.component.html',
  styleUrl: './order-list.component.css',
})
export class OrderListComponent implements OnInit, OnDestroy {
  orders: Order[] = [];
  loading = true;
  error: string | null = null;
  private ordersSubscription: Subscription | undefined;

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  ngOnDestroy(): void {
    if (this.ordersSubscription) {
      this.ordersSubscription.unsubscribe();
    }
  }

  loadOrders(): void {
    this.loading = true;
    this.ordersSubscription = this.userService.getOrders().subscribe({
      next: (orders) => {
        this.orders = orders;
        this.loading = false;
        this.error = null;
      },
      error: (err) => {
        this.error = err;
        this.loading = false;
      },
    });
  }

  viewOrderDetails(orderId: number): void {
    this.router.navigate(['/orders', orderId]); // Or '/orders/:orderId/invoice', adjust as needed
  }
}
