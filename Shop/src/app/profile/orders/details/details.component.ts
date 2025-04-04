import { Component } from '@angular/core';
import { Order } from '../../../dao';
import { Subscription } from 'rxjs';
import { UserService } from '../../../services/user.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-details',
  imports: [CommonModule],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css'
})
export class DetailsComponent {
  order: Order | null = null;
  loading = true;
  error: string | null = null;
  private orderSubscription: Subscription | undefined;
  orderId: number;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute
  ) {
    this.orderId = Number(this.route.snapshot.paramMap.get('orderId'));
  }

  ngOnInit(): void {
    this.orderSubscription = this.userService.getOrder(this.orderId).subscribe({
      next: (order) => {
        this.order = order;
        this.loading = false;
        this.error = null;
      },
      error: (err) => {
        this.error = err;
        this.loading = false;
      },
    });
  }
}
