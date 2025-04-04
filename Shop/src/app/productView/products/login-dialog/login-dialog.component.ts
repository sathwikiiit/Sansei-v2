import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.css']
})
export class LoginDialogComponent {
  isVisible: boolean = true;
  @Output() closed = new EventEmitter<boolean>();

  constructor(
    private router: Router
  ) {
    
  }
  onLoginClick(): void {
    this.isVisible = false;
    this.closed.emit(true);
    this.router.navigate(['/login']);
  }

  onNoClick(): void {
    this.isVisible = false;
    this.closed.emit(false);
  }

}