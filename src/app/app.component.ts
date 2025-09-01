import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ExampleComponent } from './example.component';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, ExampleComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Beltran';
}
