import { Component } from '@angular/core';
import { AppShellComponent } from './layout/app-shell';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AppShellComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  // Application root state can go here in the future
}
