import { Component } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { ApiUser, ApiUserDTO } from '../../dao';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-users',
  imports: [CommonModule,FormsModule],
  templateUrl: './admin-users.component.html',
  styleUrl: './admin-users.component.css'
})
export class AdminUsersComponent {

  users: ApiUser[] = [];
  loadingUsers = true;
  usersError: string | null = null;

  newUser: ApiUserDTO = {
    username: '',
    email: '',
    phone: ''
  }; // Object to hold new admin user details
  registrationSuccessMessage: string | null = null;
  registrationErrorMessage: string | null = null;
  isAddingAdmin = false;

  constructor(private adminService: AdminService) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loadingUsers = true;
    this.usersError = null;
    // Assuming you have a backend endpoint to fetch all users for admin
     this.adminService.getAllUsers().subscribe({
       next: (data) => {
         this.users = data;
         this.loadingUsers = false;
       },
       error: (err) => {
         this.usersError = 'Failed to load users.';
         this.loadingUsers = false;
         console.error(err);
       }
     });
    // For now, let's use some dummy data
    this.loadingUsers = false;
  }

  openAddAdminForm(): void {
    this.isAddingAdmin = true;
    this.registrationSuccessMessage = null;
    this.registrationErrorMessage = null;
  }

  closeAddAdminForm(): void {
    this.isAddingAdmin = false;
  }

  registerAdmin(): void {
    this.registrationSuccessMessage = null;
    this.registrationErrorMessage = null;
    this.adminService.registerAdmin(this.newUser).subscribe({
      next: (response) => {
        this.registrationSuccessMessage = response;
        this.isAddingAdmin = false;
        this.loadUsers(); // Reload user list
      },
      error: (err) => {
        this.registrationErrorMessage = err;
        console.error(err);
      }
    });
  }

}
