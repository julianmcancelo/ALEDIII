import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService, User } from '../../../nucleo/servicios/auth.service';
import { NavigationService, NavItem } from '../../../nucleo/servicios/navigation.service';

// Angular Material Imports
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatListModule, MatIconModule, MatDividerModule, MatCardModule, MatChipsModule],
  template: `
    <!-- Material Design Sidebar -->
    <nav class="fixed left-0 top-0 w-64 bg-white shadow-lg h-screen z-30">
      <div class="p-4">
        <!-- Brand/Logo Section -->
        <div class="mb-6">
          <div class="flex items-center p-4">
            <mat-icon class="text-primary mr-3" color="primary">dashboard</mat-icon>
            <span class="text-lg font-semibold text-gray-900">Dashboard</span>
          </div>
          <mat-divider></mat-divider>
        </div>

        <!-- Navigation Menu -->
        <mat-nav-list>
          <ng-container *ngFor="let item of navigationItems">
            <!-- Section Title -->
            <div *ngIf="item.isSectionTitle" class="px-4 py-2">
              <mat-chip color="accent" class="text-xs">{{ item.label }}</mat-chip>
              <mat-divider class="mt-2"></mat-divider>
            </div>

            <!-- Navigation Link -->
            <mat-list-item *ngIf="!item.isSectionTitle" 
                          [routerLink]="item.path" 
                          routerLinkActive="mat-list-item-active"
                          [routerLinkActiveOptions]="{exact: true}">
              <mat-icon matListItemIcon>{{ getMatIcon(item.icon) }}</mat-icon>
              <span matListItemTitle>{{ item.label }}</span>
            </mat-list-item>
          </ng-container>
        </mat-nav-list>

        <!-- User Info Section -->
        <div class="mt-6" *ngIf="currentUser">
          <mat-divider class="mb-4"></mat-divider>
          <mat-card class="user-card">
            <mat-card-content class="p-3">
              <div class="flex items-center">
                <div class="w-10 h-10 bg-primary rounded-full flex items-center justify-center mr-3">
                  <span class="text-sm font-medium text-white">{{ getUserInitials() }}</span>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-900 mb-1">{{ currentUser.name }}</p>
                  <mat-chip color="primary" class="text-xs">{{ getRoleLabel() }}</mat-chip>
                </div>
              </div>
            </mat-card-content>
          </mat-card>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .mat-list-item-active {
      background-color: rgba(63, 81, 181, 0.1) !important;
      color: #3f51b5 !important;
    }
    
    .user-card {
      background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
    }
    
    .mat-mdc-list-item {
      border-radius: 8px !important;
      margin-bottom: 4px !important;
    }
    
    .mat-mdc-list-item:hover {
      background-color: rgba(0, 0, 0, 0.04) !important;
    }
  `
})
export class SidebarComponent implements OnInit {
  private authService = inject(AuthService);
  private navigationService = inject(NavigationService);

  currentUser: User | null = null;
  navigationItems: NavItem[] = [];

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user && user.role) {
        this.navigationItems = this.navigationService.getNavigationForRole(user.role);
      } else {
        this.navigationItems = []; // Or handle guest/logged-out state
      }
    });
  }

  getUserInitials(): string {
    if (!this.currentUser?.name) return 'U';
    return this.currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }

  getRoleLabel(): string {
    if (!this.currentUser?.role) return '';
    const labels: { [key: string]: string } = {
      'student': 'Estudiante',
      'profesor': 'Profesor',
      'admin': 'Administrador'
    };
    return labels[this.currentUser.role] || this.currentUser.role;
  }

  getMatIcon(svgPath: string): string {
    // Mapeo de paths SVG a iconos Material
    const iconMap: { [key: string]: string } = {
      'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6': 'home',
      'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z': 'people',
      'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16': 'delete',
      'M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4': 'dashboard',
      'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z': 'description',
      'M12 14l9-5-9-5-9 5 9 5z': 'school'
    };
    
    return iconMap[svgPath] || 'circle';
  }
}
