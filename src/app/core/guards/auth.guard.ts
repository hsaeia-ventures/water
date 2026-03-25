import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { SupabaseService } from '../services/supabase.service';

export const authGuard: CanActivateFn = async () => {
  const supabaseService = inject(SupabaseService);
  const router = inject(Router);

  // Intentamos obtener la sesión directamente para no depender de que el signal ya se haya inicializado
  const { data: { session } } = await supabaseService.client.auth.getSession();

  if (session) {
    return true;
  }

  // Si no hay sesión, mandamos al login
  return router.parseUrl('/auth/login');
};
