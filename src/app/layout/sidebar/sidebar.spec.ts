import { render, screen, fireEvent } from '@testing-library/angular';
import { SidebarComponent } from './sidebar';
import { provideRouter, Router } from '@angular/router';
import { SupabaseService } from '../../core/services/supabase.service';
import { IndexedDbService } from '../../core/services/indexed-db.service';
import { signal } from '@angular/core';
import { vi } from 'vitest';

const mockSupabase = {
  isAuthenticated: signal(true),
  currentUser: signal({ id: 'test-user' }),
  signOut: vi.fn().mockResolvedValue(undefined),
};

const mockIndexedDb = {
  STORE_GTD_ITEMS: 'gtd_items',
  clearStore: vi.fn().mockResolvedValue(undefined),
};

describe('SidebarComponent', () => {
  it('should call signOut, clear IndexedDB, and navigate to /auth/login on logout', async () => {
    mockSupabase.signOut.mockClear();
    mockIndexedDb.clearStore.mockClear();

    const { fixture } = await render(SidebarComponent, {
      providers: [
        provideRouter([]),
        { provide: SupabaseService, useValue: mockSupabase },
        { provide: IndexedDbService, useValue: mockIndexedDb },
      ],
    });

    const router = fixture.debugElement.injector.get(Router);
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    const logoutBtn = screen.getByLabelText('Cerrar sesión');
    expect(logoutBtn).toBeInTheDocument();

    fireEvent.click(logoutBtn);

    // Allow async logout to execute
    await new Promise(r => setTimeout(r, 0));

    expect(mockIndexedDb.clearStore).toHaveBeenCalledWith('gtd_items');
    expect(mockSupabase.signOut).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith(['/auth/login']);
  });
});
