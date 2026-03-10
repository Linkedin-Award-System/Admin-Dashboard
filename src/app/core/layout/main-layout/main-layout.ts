import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { HeaderComponent } from '../header/header';
import { SidebarComponent } from '../sidebar/sidebar';
import { ToastComponent } from '../../components/toast/toast.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, MatSidenavModule, HeaderComponent, SidebarComponent, ToastComponent],
  template: `
    <div class="layout-container">
      <app-toast></app-toast>
      <app-header (toggleSidebar)="sidenav.toggle()"></app-header>
      
      <mat-sidenav-container class="sidenav-container">
        <mat-sidenav #sidenav mode="side" opened class="app-sidebar">
          <app-sidebar></app-sidebar>
        </mat-sidenav>
        
        <mat-sidenav-content class="main-content">
          <router-outlet></router-outlet>
        </mat-sidenav-content>
      </mat-sidenav-container>
    </div>
  `,
  styles: `
    .layout-container {
      display: flex;
      flex-direction: column;
      height: 100vh;
    }
    .sidenav-container {
      flex: 1;
    }
    .app-sidebar {
      width: 260px;
      border-right: 1px solid #e0e0e0;
      background-color: #f8f9fa;
    }
    .main-content {
      background-color: #ffffff;
    }
  `
})
export class MainLayoutComponent {}
