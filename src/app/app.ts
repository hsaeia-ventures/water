import { Component } from '@angular/core';
import { AppShellComponent } from './layout/app-shell';
import { ToastContainerComponent } from './shared/components/toast-container/toast-container.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AppShellComponent, ToastContainerComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  // Application root state can go here in the future
}
