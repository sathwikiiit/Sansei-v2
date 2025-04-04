import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Cart, Product } from '../../../dao';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { LoginDialogComponent } from '../login-dialog/login-dialog.component';
import { UserService } from '../../../services/user.service';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { tap, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-product-item',
  imports: [CommonModule, LoginDialogComponent, FormsModule],
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.css']
})
export class ProductItemComponent implements OnInit, OnDestroy {
  @Input() product!: Product;
  showLoginDialog = false;
  quantityInCart: number = 0;
  private cartSubscription: Subscription | undefined;

  constructor(private authService: AuthService, private router: Router, private userService: UserService) { }

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      // Subscribe to cart updates
      this.cartSubscription = this.userService.cartUpdated$.pipe(
        // When cart is updated, fetch the latest cart data
        switchMap(() => this.userService.getCart())
      ).subscribe(cart => {
        this.updateQuantityFromCart(cart);
      });
      this.fetchQuantityInCart(); // Fetch initial quantity
    }
  }

  ngOnDestroy(): void {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }

  fetchQuantityInCart(): void {
    this.userService.getCart().subscribe(cart => {
      this.updateQuantityFromCart(cart);
    });
  }

  updateQuantityFromCart(cart: Cart): void {
    const cartItem = cart.cartItems.find(item => item.product.id === this.product.id);
    this.quantityInCart = cartItem ? cartItem.quantity : 0;
  }

  addToCart(product: Product) {
    if (this.authService.isLoggedIn()) {
      this.userService.updateCartItemQuantity(product.id, 1).subscribe();
      // The cartUpdated$ observable will trigger the subscription and update the quantity
    } else {
      this.showLoginDialog = true;
    }
  }

  increaseQuantity(product: Product): void {
    if (this.authService.isLoggedIn() && this.quantityInCart < product.stock) {
      this.userService.updateCartItemQuantity(product.id, this.quantityInCart + 1).subscribe();
      // The cartUpdated$ observable will trigger the subscription and update the quantity
    } else if (!this.authService.isLoggedIn()) {
      this.showLoginDialog = true;
    }
  }

  decreaseQuantity(product: Product): void {
    if (this.authService.isLoggedIn() && this.quantityInCart > 0) {
      this.userService.updateCartItemQuantity(product.id, this.quantityInCart - 1).subscribe();
      // The cartUpdated$ observable will trigger the subscription and update the quantity
    } else if (!this.authService.isLoggedIn()) {
      this.showLoginDialog = true;
    }
  }

  updateQuantity(product: Product, event: any): void {
    const newQuantity = parseInt(event.target.value, 10);
    if (this.authService.isLoggedIn() && !isNaN(newQuantity) && newQuantity >= 0 && newQuantity <= product.stock) {
      this.userService.updateCartItemQuantity(product.id, newQuantity).subscribe();
      // The cartUpdated$ observable will trigger the subscription and update the quantity
    } else {
      if (!this.authService.isLoggedIn()) {
        this.showLoginDialog = true;
      } else {
        event.target.value = this.quantityInCart;
      }
    }
  }

  isProductInCart(product: Product): boolean {
    return this.quantityInCart > 0;
  }

  handleLoginDialogClose(loggedIn: boolean | undefined) {
    this.showLoginDialog = false;
    if (loggedIn === true) {
      this.router.navigate(['/login']);
      this.fetchQuantityInCart();
    }
  }
}