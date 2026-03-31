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
    path: 'organize',
    canActivate: [authGuard],
    children: [
      { path: 'contexts', loadComponent: () => import('./pages/organize/contexts.page') },
      { path: 'calendar', loadComponent: () => import('./pages/organize/calendar.page') },
      { path: 'projects', loadComponent: () => import('./pages/organize/projects.page') },
      { path: 'waiting', loadComponent: () => import('./pages/organize/waiting.page') },
      { path: 'someday', loadComponent: () => import('./pages/organize/someday.page') },
      { path: '', redirectTo: 'contexts', pathMatch: 'full' }
    ]
  },
  {
    path: 'reflect',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/reflect/reflect.page').then(m => m.ReflectPage)
  },
  {
    path: 'execute',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/execute/execute.page').then(m => m.ExecutePage)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
