import { Component } from '@angular/core';
import { AdminService } from '../services/admin.service';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin',
  imports: [CommonModule, RouterOutlet],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {
  jsonContent: string | null = null;
  uploadSuccessMessage: string | null = null;
  uploadErrorMessage: string | null = null;

  constructor(private adminService: AdminService, private router:Router) { } // Inject the AdminService

  ngOnInit(): void {
    // Optionally, you can set a default view or perform other initializations
  }

  handleFileInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = (e: any) => {
        this.jsonContent = e.target.result;
        console.log('JSON Content:', this.jsonContent);
      };

      reader.readAsText(file);
    }
  }

  submitJson(): void {
    if (this.jsonContent) {
      this.adminService.addProducts(JSON.parse(this.jsonContent)).subscribe({
        next: (response) => {
          console.log('Upload successful', response);
          this.uploadSuccessMessage = 'Products added successfully!';
          this.uploadErrorMessage = null;
          this.jsonContent = null;
        },
        error: (error) => {
          console.error('Upload failed', error);
          this.uploadErrorMessage = 'Failed to add products. Please check the JSON format.';
          this.uploadSuccessMessage = null;
        }
      });
    } else {
      console.error('No JSON content to submit.');
      this.uploadErrorMessage = 'Please select a JSON file.';
      this.uploadSuccessMessage = null;
    }
  }
  navigateToProducts() {
    this.router.navigate(['/admin/products']);
  }

  navigateToOrders() {
    this.router.navigate(['/admin/orders']);
  }

  navigateToUsers() {
    this.router.navigate(['/admin/users']);
  }
}
