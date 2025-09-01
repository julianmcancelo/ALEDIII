import { Component, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NewsletterService } from '../../core/services/newsletter.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  subscriptionForm: FormGroup;
  isMenuOpen = false;
  showBackToTop = false;

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

  private fb = inject(FormBuilder);
  private newsletterService = inject(NewsletterService);

  constructor() {
    this.subscriptionForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
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
