import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="example-container">
      <h2>Angular 17 Features Demo</h2>
      
      <!-- Signals Demo -->
      <div class="section">
        <h3>Signals (New in Angular 17)</h3>
        <p>Count: {{ count() }}</p>
        <p>Double Count: {{ doubleCount() }}</p>
        <button (click)="increment()">Increment</button>
        <button (click)="reset()">Reset</button>
      </div>

      <!-- Control Flow Demo -->
      <div class="section">
        <h3>New Control Flow Syntax</h3>
        @if (count() > 0) {
          <p class="positive">Count is positive!</p>
        } @else {
          <p class="zero">Count is zero or negative</p>
        }

        @for (item of items(); track item.id) {
          <div class="item">{{ item.name }}</div>
        } @empty {
          <p>No items available</p>
        }
      </div>

      <!-- Input Demo -->
      <div class="section">
        <h3>Interactive Input</h3>
        <input 
          [(ngModel)]="inputValue" 
          placeholder="Type something..."
          class="input-field"
        >
        <p>You typed: {{ inputValue }}</p>
      </div>
    </div>
  `,
  styles: [`
    .example-container {
      max-width: 600px;
      margin: 2rem auto;
      padding: 2rem;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }

    .section {
      margin-bottom: 2rem;
      padding: 1.5rem;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      background-color: #f9f9f9;
    }

    h2 {
      color: #333;
      text-align: center;
      margin-bottom: 2rem;
    }

    h3 {
      color: #555;
      margin-bottom: 1rem;
    }

    button {
      background-color: #007bff;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      margin: 0.25rem;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.3s;
    }

    button:hover {
      background-color: #0056b3;
    }

    .positive {
      color: #28a745;
      font-weight: bold;
    }

    .zero {
      color: #6c757d;
    }

    .item {
      background-color: #e9ecef;
      padding: 0.5rem;
      margin: 0.25rem 0;
      border-radius: 4px;
    }

    .input-field {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #ccc;
      border-radius: 4px;
      margin-bottom: 1rem;
    }
  `]
})
export class ExampleComponent {
  // Angular 17 Signals
  count = signal(0);
  doubleCount = computed(() => this.count() * 2);
  
  items = signal([
    { id: 1, name: 'Angular 17' },
    { id: 2, name: 'Standalone Components' },
    { id: 3, name: 'Signals' },
    { id: 4, name: 'New Control Flow' }
  ]);

  inputValue = '';

  increment() {
    this.count.update(value => value + 1);
  }

  reset() {
    this.count.set(0);
  }
}
