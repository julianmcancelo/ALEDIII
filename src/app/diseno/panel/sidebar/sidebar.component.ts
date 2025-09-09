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
    <nav class="w-64 bg-white shadow-lg min-h-screen">
      <div class="p-4">
        <div class="flex items-center mb-6">
          <img src="assets/logo.png" alt="Logo" class="h-10 w-auto mr-3">
          <span class="text-lg font-bold text-gray-800">ALED III</span>
        </div>
        <ul class="space-y-2">
          <li *ngFor="let item of navigationItems">
            <!-- Section Title -->
            <div *ngIf="item.isSectionTitle" class="px-3 pt-4 pb-2 text-xs font-bold text-gray-500 uppercase">
              {{ item.label }}
            </div>

            <!-- Navigation Link -->
            <a *ngIf="!item.isSectionTitle" 
               [routerLink]="item.path" 
               routerLinkActive="bg-blue-100 text-blue-700 font-semibold" 
               [routerLinkActiveOptions]="{exact: true}"
               class="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors text-gray-700">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" [attr.d]="item.icon"></path>
              </svg>
              <span>{{ item.label }}</span>
            </a>
          </li>
        </ul>
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
}
