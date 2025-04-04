import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { Product } from '../../dao';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-product-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-product-list.component.html',
  styleUrl: './admin-product-list.component.css'
})
export class AdminProductListComponent implements OnInit {

  products: Product[] = [];
  loading = true;
  error: string | null = null;
  productToBeEdited: number | undefined;

  constructor(private adminService: AdminService) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.error = null;
    this.adminService.getAllProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load products.';
        this.loading = false;
        console.error(err);
      }
    });
  }

  editProduct(id: number) {
    this.productToBeEdited = id;
  }

  cancelEdit() {
    this.productToBeEdited = undefined;
  }

  saveEdit(product: Product) {
    this.loading = true;
    this.error = null;
    this.adminService.updateProduct(product.id,product).subscribe({
      next: () => {
        console.log(product);
        this.loadProducts(); // Reload to reflect changes
        this.productToBeEdited = undefined; // Exit edit mode
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to update product.';
        this.loading = false;
        console.error(err);
      }
    });
  }

  removeProduct(id: number) {
    this.adminService.removeProduct(id)
  }
}