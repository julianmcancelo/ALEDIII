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
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, OnDestroy {
  subscriptionForm: FormGroup;
  isMenuOpen = false;
  showBackToTop = false;
  
  // Propiedades del slider
  currentSlide = 0;
  autoSlideInterval: any;
  readonly SLIDE_INTERVAL = 5000; // 5 segundos entre slides

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
    
    // Iniciar el slider automático
    this.startAutoSlide();
  }

  ngOnDestroy(): void {
    // Es una buena práctica desuscribirse de los observables al destruir el componente para evitar fugas de memoria.
    this.userSubscription?.unsubscribe();
    
    // Detener el slider automático al destruir el componente
    this.stopAutoSlide();
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

  // Métodos para el slider
  
  /**
   * Inicia el desplazamiento automático del slider
   */
  startAutoSlide(): void {
    this.autoSlideInterval = setInterval(() => {
      this.nextSlide();
    }, this.SLIDE_INTERVAL);
  }

  /**
   * Detiene el desplazamiento automático del slider
   */
  stopAutoSlide(): void {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
    }
  }

  /**
   * Muestra la siguiente imagen del slider
   */
  nextSlide(): void {
    // Reiniciar el slider automático para evitar cambios bruscos
    this.stopAutoSlide();
    
    // Avanzar al siguiente slide (con ciclo de 0 a 2)
    this.currentSlide = (this.currentSlide + 1) % 3;
    
    // Reiniciar el timer
    this.startAutoSlide();
  }

  /**
   * Muestra la imagen anterior del slider
   */
  prevSlide(): void {
    // Reiniciar el slider automático
    this.stopAutoSlide();
    
    // Retroceder al slide anterior (con ciclo)
    this.currentSlide = (this.currentSlide - 1 + 3) % 3;
    
    // Reiniciar el timer
    this.startAutoSlide();
  }

  /**
   * Muestra una imagen específica del slider
   */
  setSlide(index: number): void {
    // Reiniciar el slider automático
    this.stopAutoSlide();
    
    // Establecer el slide específico
    this.currentSlide = index;
    
    // Reiniciar el timer
    this.startAutoSlide();
  }
}
