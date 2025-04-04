import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../services/user.service';
import { ApiUserDTO, Cart } from '../dao';
import { AuthService } from '../services/auth.service';
@Component({
    selector: 'app-header',
    imports: [CommonModule, RouterLink],
    templateUrl: './header.component.html',
    styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit,OnDestroy{

  title="MY SHOP"
  disabled=false;
  cartSubscription: any;
  itemCount: number | undefined;
  username: string | undefined;
  constructor(private userService:UserService,private authService:AuthService,private router:Router){}
  ngOnInit(): void {
    this.cartSubscription = this.userService.cartUpdated$.subscribe(() => {
      if (this.authService.isLoggedIn()) {
        this.fetchCartItems(); // Re-fetch cart when it's updated
      }
    });
    
  }
  ngOnDestroy(): void {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }

  fetchCartItems(): void {
    this.userService.getUserProfile().subscribe(
      {
        next:(user:ApiUserDTO)=>this.username=user.username,
        error:(error)=>console.error('Error fetching cart:', error)
      }
    )
    this.userService.getCart().subscribe({
      next: (cart: Cart) => {
        this.itemCount = cart.cartItems.reduce((total, cartItem) => total + cartItem.quantity, 0);
      },
      error: (error) => {
        console.error('Error fetching cart:', error);
        // Handle error appropriately
      }
    });
  }
  logout(){
    this.authService.logout()
    this.router.navigate(['/login']).then(()=>{
      this.username=undefined;
      this.itemCount=undefined
    }

    )
  }
  get isLoggedIn(){
    return this.authService.getRole()
  }
}
