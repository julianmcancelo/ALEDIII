import { Injectable } from '@angular/core';

export interface NavItem {
  label: string;
  path: string;
  icon: string; // SVG path data
  roles: string[]; // Roles that can see this link
  isSectionTitle?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  private allLinks: NavItem[] = [
    // General
    { label: 'Dashboard', path: '/dashboard', icon: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z', roles: ['admin', 'profesor', 'student'] },
    { label: 'Instalaciones', path: '/instalaciones', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z', roles: ['admin', 'profesor', 'student'] },

    // Académico
    { label: 'Académico', path: '', icon: '', roles: ['admin', 'profesor'], isSectionTitle: true },
    { label: 'Estudiantes', path: '/dashboard/estudiantes', icon: 'M12 14l9-5-9-5-9 5 9 5zM12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z', roles: ['admin', 'profesor'] },

    // Administración
    { label: 'Administración', path: '', icon: '', roles: ['admin'], isSectionTitle: true },
    { label: 'Gestión de Usuarios', path: '/dashboard/gestion-usuarios', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z', roles: ['admin'] },
    { label: 'Gestión de Carreras', path: '/dashboard/gestion-carreras', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253', roles: ['admin'] },
    { label: 'Gestión de Materias', path: '/dashboard/gestion-materias', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', roles: ['admin'] },
    { label: 'Gestión de Profesores', path: '/dashboard/gestion-profesores', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z', roles: ['admin'] },
  ];

  constructor() { }

  getNavigationForRole(role: string): NavItem[] {
    return this.allLinks.filter(link => link.roles.includes(role));
  }
}
