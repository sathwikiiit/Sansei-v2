import { Component, OnInit } from "@angular/core";
import { Order } from "../../dao";
import { AdminService } from "../../services/admin.service";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

@Component({
  selector: 'app-admin-orders',
  imports:[CommonModule,FormsModule],
  templateUrl: './admin-orders.component.html',
  styleUrls: ['./admin-orders.component.css']
})
export class AdminOrdersComponent implements OnInit {
  pendingOrders: Order[] = [];
  allOrders: Order[] = [];
  loadingPending = false;
  loadingAll = false;
  errorPending: string | null = null;
  errorAll: string | null = null;
date: any;
paymentMethod: any;

  constructor(private adminService: AdminService) { }

  ngOnInit(): void {
    this.loadPendingOrders();
    this.loadAllOrders();
  }

  loadPendingOrders(): void {
    this.loadingPending = true;
    this.adminService.getPendingOrders().subscribe({
      next: (orders) => {
        this.pendingOrders = orders
        this.loadingPending = false;
      },
      error: (error) => {
        this.errorPending = error.message;
        this.loadingPending = false;
      }
    });
  }
  loadAllOrders(): void {
    this.loadingPending = true;
    this.adminService.getAllOrders().subscribe({
      next: (orders) => {
        this.allOrders = orders
        this.loadingPending = false;
      },
      error: (error) => {
        this.errorPending = error.message;
        this.loadingPending = false;
      }
    });
  }

  confirmOrder(orderId: number, deliveryDateString: string,paymentMethod:string): void {
    const deliveryDate= new Date(deliveryDateString)
    this.adminService.confirmOrder(orderId, deliveryDate.toISOString(),paymentMethod).subscribe({
      next: (message) => {
        console.log(message);
        // Refresh the pending and all orders lists after confirmation
        this.loadPendingOrders();
        this.loadAllOrders();
      },
      error: (error) => {
        console.error('Error confirming order:', error);
      }
    });
  }
}