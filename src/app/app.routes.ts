import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/inbox/inbox.page')
  },
  {
    path: 'clarify',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/clarify/clarify.page')
  },
  {
    path: 'auth/login',
    loadComponent: () => import('./pages/auth/login.page')
  },
  {
    path: '**',
    redirectTo: ''
  }
];
