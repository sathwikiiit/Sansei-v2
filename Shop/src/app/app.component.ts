import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
@Component({
    selector: 'app-root',
    imports: [RouterOutlet, RouterModule, CommonModule, HeaderComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    providers: []
})

export class AppComponent implements OnInit{

  title = 'Shop';
  items:number[]
  
  
  constructor(){
    this.items=[];
  }
  ngOnInit(): void {
  }

}
