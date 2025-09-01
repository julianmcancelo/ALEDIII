import { Component, HostListener, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NewsletterService } from '../../core/services/newsletter.service';
import Swal from 'sweetalert2';
import { User, AuthService } from '../../core/services/auth.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-home',
    imports: [CommonModule, RouterLink, ReactiveFormsModule],
    templateUrl: './home.component.html',
    styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, OnDestroy {
  subscriptionForm: FormGroup;
  isMenuOpen = false;
  showBackToTop = false;

  // Propiedades para gestionar el estado de autenticación del usuario.
  currentUser: User | null = null;
  private userSubscription: Subscription | undefined;

  // Inyección de dependencias moderna con inject() para mayor claridad.
  private fb = inject(FormBuilder);
  private newsletterService = inject(NewsletterService);
  private authService = inject(AuthService); // Servicio para la gestión de autenticación.
  private router = inject(Router); // Servicio para la navegación.

  constructor() {
    this.subscriptionForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    // Nos suscribimos al observable del usuario actual para reaccionar a los cambios de sesión (login/logout).
    // Esto mantiene la UI sincronizada con el estado de autenticación en tiempo real.
        this.userSubscription = this.authService.currentUser$.subscribe((user: User | null) => {
      this.currentUser = user;
    });
  }

  ngOnDestroy(): void {
    // Es una buena práctica desuscribirse de los observables al destruir el componente para evitar fugas de memoria.
    this.userSubscription?.unsubscribe();
  }

  /**
   * Cierra la sesión del usuario actual a través del AuthService y lo redirige a la página de inicio.
   */
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.showBackToTop = (window.pageYOffset > 300);
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onSubscribe() {
    if (this.subscriptionForm.invalid) {
      Swal.fire({
        icon: 'error',
        title: 'Email Inválido',
        text: 'Por favor, introduce una dirección de correo electrónico válida.',
      });
      return;
    }

    const email = this.subscriptionForm.value.email;
    this.newsletterService.subscribe(email).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: '¡Suscripción Exitosa!',
          text: 'Gracias por suscribirte a nuestro boletín.',
          timer: 2000,
          showConfirmButton: false
        });
        this.subscriptionForm.reset();
      },
      error: (error) => {
        console.error('Subscription error:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error en la Suscripción',
          text: 'No se pudo completar la suscripción. Por favor, intenta de nuevo más tarde.',
        });
      }
    });
  }
}
