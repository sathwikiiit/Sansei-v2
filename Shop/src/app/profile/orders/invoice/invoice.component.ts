import { Component } from '@angular/core';
import { Invoice, Order } from '../../../dao';
import { UserService } from '../../../services/user.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-invoice',
  imports: [CommonModule],
  templateUrl: './invoice.component.html',
  styleUrl: './invoice.component.css'
})
export class InvoiceComponent {
  invoice: Invoice | null = null;
  loading = true;
  error: string | null = null;
  private invoiceSubscription: Subscription | undefined;
  orderId: number;

  constructor(private userService: UserService, private route: ActivatedRoute) {
    this.orderId = Number(this.route.snapshot.paramMap.get('orderId'));
  }

  ngOnInit(): void {
    this.invoiceSubscription = this.userService.getOrder(this.orderId).subscribe({
      next: (order: Order) => {
  
        this.invoice =  {invoiceDate:order.deliveryDate,shippingCost:order.orderTotal*0.9,tax:order.orderTotal*0.9,totalAmount:order.orderTotal,id:order.id}
        this.loading = false;
        this.error = null;
      },
      error: (err) => {
        this.error = err;
        this.loading = false;
      },
    });
  }

  ngOnDestroy(): void {
    if (this.invoiceSubscription) {
      this.invoiceSubscription.unsubscribe();
    }
  }

}
