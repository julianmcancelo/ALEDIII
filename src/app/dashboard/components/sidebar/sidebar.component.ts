import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService, User } from '../../../nucleo/servicios/auth.service';
import { NavigationService, NavItem } from '../../../nucleo/servicios/navigation.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <!-- 
      SIDEBAR  - SIN MOVIMIENTO
      Diseño limpio, estático y profesional inspirado en Argon Dashboard
      Eliminadas todas las animaciones, transiciones y efectos que causan movimiento
    -->
    <nav class="fixed left-0 top-0 w-64 bg-white shadow-sm border-r border-gray-200 h-screen z-30">
      <div class="p-6">
        <!-- Brand/Logo Section -->
        <div class="mb-8 pb-6 border-b border-gray-200">
          <div class="flex items-center">
            <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"></path>
              </svg>
            </div>
            <span class="ml-3 text-lg font-semibold text-gray-900">Dashboard</span>
          </div>
        </div>

        <!-- Navigation Menu -->
        <ul class="space-y-1">
          <li *ngFor="let item of navigationItems">
            <!-- Section Title -->
            <div *ngIf="item.isSectionTitle" class="px-3 pt-6 pb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider border-t border-gray-200 first:border-t-0 first:pt-0">
              {{ item.label }}
            </div>

            <!-- Navigation Link -->
            <a *ngIf="!item.isSectionTitle" 
               [routerLink]="item.path" 
               routerLinkActive="bg-blue-50 text-blue-700 border-r-2 border-blue-600" 
               [routerLinkActiveOptions]="{exact: true}"
               class="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md">
              <svg class="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" [attr.d]="item.icon"></path>
              </svg>
              {{ item.label }}
            </a>
          </li>
        </ul>

        <!-- User Info Section -->
        <div class="mt-8 pt-6 border-t border-gray-200" *ngIf="currentUser">
          <div class="bg-gray-50 rounded-lg p-4">
            <div class="flex items-center">
              <div class="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <span class="text-sm font-medium text-white">{{ getUserInitials() }}</span>
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium text-gray-900">{{ currentUser.name }}</p>
                <p class="text-xs text-gray-500">{{ getRoleLabel() }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
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
}
