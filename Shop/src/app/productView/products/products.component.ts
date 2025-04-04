import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/products.service';
import { Product, ProductResponse } from '../../dao';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductItemComponent } from './product-item/product-item.component';

@Component({
  selector: 'app-products',
  imports: [CommonModule, ProductItemComponent, FormsModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  availableCategories: string[] = [];
  selectedCategory: string = '';
  selectedTags: string = '';
  searchString: string = '';
  currentPage: number = 0; // Initialize to 0 for 0-based indexing
  pageSizeOptions: number[] = [5, 10, 20];
  pageSize: number = this.pageSizeOptions[0];
  totalProducts: number = 0;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadInitialData();
  }

  loadInitialData() {
    this.UpdateProducts(); // Initial load will use default page 0
  }

  applyFilters() {
    this.currentPage = 0;
    this.UpdateProducts(this.selectedCategory, this.selectedTags, this.searchString, this.currentPage, this.pageSize);
  }

  onPageChange(newPage: number) {
    this.currentPage = newPage;
    this.UpdateProducts(this.selectedCategory, this.selectedTags, this.searchString, this.currentPage, this.pageSize);
  }

  onPageSizeChange(newSize: number) {
    this.pageSize = newSize;
    this.currentPage = 0;
    this.UpdateProducts(this.selectedCategory, this.selectedTags, this.searchString, this.currentPage, this.pageSize);
  }

  UpdateProducts(category?: string, tags?: string, searchString?: string, page: number = 0, size?: number) {
    if (size === undefined) {
      size = 5;
    }
    this.productService.getProducts(category, tags, searchString, page, size).subscribe(
      {
        next: (response: ProductResponse) => {
          this.products = response.products;
          this.totalProducts = response.totalProducts;
          this.availableCategories = response.availableCategories;
        },
        error: (_error) => {
          this.products = [];
          this.totalProducts = 0;
        }
      }
    );
  }

  get totalPages(): number {
    return Math.ceil(this.totalProducts / this.pageSize);
  }

  get pages(): number[] {
    const totalPages = this.totalPages;
    const currentPage = this.currentPage;
    const visiblePages = Math.min(totalPages, 3); // Show at most 3 pages
    let startPage = Math.max(0, currentPage - Math.floor(visiblePages / 2));
    let endPage = Math.min(totalPages - 1, startPage + visiblePages - 1); // Adjust endPage to be 0-based

    if (endPage - startPage < visiblePages - 1) {
      startPage = Math.max(0, endPage - visiblePages + 1);
    }

    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  }

  get endProductIndex(): number {
    return Math.min((this.currentPage + 1) * this.pageSize, this.totalProducts);
  }
}