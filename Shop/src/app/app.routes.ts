import {Routes} from '@angular/router';
import { AuthorizationComponent } from './authorization/authorization.component';
import { ProductsComponent } from './productView/products/products.component';
import { authGuard } from './auth.guard';
import { ProfileComponent } from './profile/profile.component';
import { AdminComponent } from './admin/admin.component';
import { AdminProductListComponent } from './admin/admin-product-list/admin-product-list.component';
import { AdminOrdersComponent } from './admin/admin-orders/admin-orders.component';
import { AdminUsersComponent } from './admin/admin-users/admin-users.component';
import { CartComponent } from './profile/cart/cart.component';
import { DetailsComponent } from './profile/orders/details/details.component';
import { OrderListComponent } from './profile/orders/order-list/order-list.component';
import { InvoiceComponent } from './profile/orders/invoice/invoice.component';
import { OrdersComponent } from './profile/orders/orders.component';

export const routes: Routes = [
  {
    path: "login",
    pathMatch:"full",
    component: AuthorizationComponent,
    canActivate:[authGuard]
  },
  {
    path:'',
    redirectTo:'login',
    pathMatch:'full'
  },
  {
    path:"products",
    pathMatch:"full",
    component:ProductsComponent,
  },
  {
    path:"profile",
    pathMatch:"full",
    component:ProfileComponent,
    canActivate: [authGuard],
    data: { role: ['Admin','User'] } 
  },
  {
    path:"cart",
    pathMatch:"full",
    component:CartComponent,
    canActivate:[authGuard],
    data:{role:['User']}
  },
  {
    path:"orders",
    pathMatch:"prefix",
    component:OrdersComponent,
    canActivate:[authGuard],
    data:{role:['User']},
    children:[
      {path:'',component:OrderListComponent},
      {path:':orderId',component:DetailsComponent},
      {path:':orderId/invoice',component:InvoiceComponent},
    ]
  },
  
  {
    path:"admin",
    component:AdminComponent,
    canActivate:[authGuard],
    data:{role:['Admin']},
    children: [
      { path: 'products', component: AdminProductListComponent },
      { path: 'orders', component: AdminOrdersComponent },
      { path: 'users', component: AdminUsersComponent },
    ]
  }
];

export default routes
