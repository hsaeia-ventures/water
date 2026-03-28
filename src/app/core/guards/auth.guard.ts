import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { SupabaseService } from '../services/supabase.service';

export const authGuard: CanActivateFn = async () => {
  const supabaseService = inject(SupabaseService);
  const router = inject(Router);

  // Usamos getUser() en lugar de getSession() para validar el JWT contra
  // los servidores de Supabase en cada navegación protegida.
  // Esto evita que un token expirado o comprometido almacenado localmente
  // pueda conceder acceso (defensa en profundidad).
  const { data: { user } } = await supabaseService.client.auth.getUser();

  if (user) {
    return true;
  }

  // Si no hay usuario válido, mandamos al login
  return router.parseUrl('/auth/login');
};
