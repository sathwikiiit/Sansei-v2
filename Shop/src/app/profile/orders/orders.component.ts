import { Component, OnInit, OnDestroy } from '@angular/core';
import { Order } from '../../dao'; // Import the Order interface
import { UserService } from '../../services/user.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common'; // Import CommonModule for ngFor
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-orders',
  imports: [CommonModule,RouterOutlet], // Add CommonModule to imports
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css' // Create this CSS file
})
export class OrdersComponent implements OnInit, OnDestroy {
  orderCount: number | undefined;
  private ordersSubscription: Subscription | undefined;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.ordersSubscription = this.userService.getOrders().subscribe({
      next: (orders) => {
        this.orderCount = orders.length;
      },
      error: (err) => {
        console.error('Error fetching orders:', err);
        this.orderCount = 0;
      },
    });
  }

  ngOnDestroy(): void {
    if (this.ordersSubscription) {
      this.ordersSubscription.unsubscribe();
    }
  }
}
