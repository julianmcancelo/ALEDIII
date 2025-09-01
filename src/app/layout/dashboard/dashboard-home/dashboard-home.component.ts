import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService, User } from '../../../core/services/auth.service';

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard-home.component.html',
})
export class DashboardHomeComponent implements OnInit {
  currentUser: User | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  getRoleLabel(role?: string): string {
    const labels: { [key: string]: string } = {
      'admin': 'Administrador',
      'teacher': 'Profesor',
      'student': 'Estudiante'
    };
    return role ? labels[role] : '';
  }
}
