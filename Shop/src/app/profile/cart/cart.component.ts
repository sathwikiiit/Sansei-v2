import { Component, OnInit, OnDestroy } from '@angular/core';
import { Cart, Product } from '../../dao';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';
import { Subscription, timer } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-cart',
  imports: [CommonModule, RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit, OnDestroy {
  cartItems: { product: Product; quantity: number }[] = [];
  loading = true;
  error: string | null = null;
  private cartSubscription: Subscription | undefined;
  orderPlaced: boolean | undefined;

  constructor(
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadCart();
    this.cartSubscription = this.userService.cartUpdated$.pipe(
      tap(() => {
        this.loadCart(); // Reload the cart whenever an update occurs
      })
    ).subscribe();
  }

  ngOnDestroy(): void {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }

  loadCart(): void {
    this.loading = true;
    this.userService.getCart().subscribe({
      next: (cart) => {
        this.cartItems = cart ? cart.cartItems.map(item => ({ product: item.product, quantity: item.quantity })) : [];
        this.loading = false;
        this.error = null;
      },
      error: (err) => {
        this.error = err;
        this.loading = false;
        console.error('CartComponent: Error loading cart:', err);
      }
    });
  }

  increaseQuantity(productId: number): void {
    const item = this.cartItems.find(i => i.product.id === productId);
    if (item) {
      item.quantity+=1;
      this.updateCartBackend(productId, item.quantity);
    }
  }

  decreaseQuantity(productId: number): void {
    const item = this.cartItems.find(i => i.product.id === productId);
    if (item && item.quantity > 1) {
      item.quantity-=1;
      this.updateCartBackend(productId, item.quantity);
    } else if (item && item.quantity === 1) {
      this.removeFromCart(productId);
    }
  }

  updateQuantity(productId: number, event: any): void {
    const quantity = parseInt(event.target.value, 10);
    if (!isNaN(quantity) && quantity > 0) {
      const item = this.cartItems.find(i => i.product.id === productId);
      if (item) {
        item.quantity = quantity;
        this.updateCartBackend(productId, quantity);
      }
    } else {
      this.loadCart(); // Reload cart to reflect backend state
    }
  }

  updateCartBackend(productId: number, quantity: number): void {
    this.userService.updateCartItemQuantity(productId, quantity).subscribe({
      // No need to handle success here, cartUpdated$ will trigger the update
      error: (err) => {
        console.error('CartComponent: Error updating cart backend:', err);
        this.loadCart(); // Revert to backend state on error
      }
    });
  }

  removeFromCart(productId: number): void {
    this.userService.removeProductFromCart(productId).subscribe(() => {
      this.loadCart(); // Reload cart after removal
    });
  }

  calculateCartTotal(): number {
    return this.cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  }

  checkout(): void {
    this.userService.placeOrder().subscribe(
      {
        next:()=>{
          this.orderPlaced=true;
          timer(3000).subscribe(() => { // Set orderPlaced to undefined after 3 seconds
            this.orderPlaced = undefined;
            this.loadCart();
          });

        },
        error:()=>{
          this.orderPlaced=false;
          timer(3000).subscribe(() => { // Set orderPlaced to undefined after 3 seconds
            this.orderPlaced = undefined;
          });
        },
      }
    )
    }
}