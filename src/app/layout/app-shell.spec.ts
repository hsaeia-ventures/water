import { render, screen, fireEvent } from '@testing-library/angular';
import { AppShellComponent } from './app-shell';
import { provideRouter } from '@angular/router';
import { SupabaseService } from '../core/services/supabase.service';
import { IndexedDbService } from '../core/services/indexed-db.service';
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

describe('AppShellComponent', () => {
  it('should render the minimal header with brand and inbox link', async () => {
    await render(AppShellComponent, {
      providers: [
        provideRouter([]),
        { provide: SupabaseService, useValue: mockSupabase },
        { provide: IndexedDbService, useValue: mockIndexedDb },
      ],
    });

    const brandLabel = screen.getByLabelText('Water Home');
    expect(brandLabel).toBeInTheDocument();
    expect(screen.getByText('Water')).toBeInTheDocument();

    const inboxLink = screen.getByLabelText('Go to Inbox');
    expect(inboxLink).toBeInTheDocument();
    expect(screen.getByText('Inbox')).toBeInTheDocument();
  });

  it('should render the mobile logout button and call signOut on click', async () => {
    mockSupabase.signOut.mockClear();
    mockIndexedDb.clearStore.mockClear();

    await render(AppShellComponent, {
      providers: [
        provideRouter([]),
        { provide: SupabaseService, useValue: mockSupabase },
        { provide: IndexedDbService, useValue: mockIndexedDb },
      ],
    });

    const logoutBtns = screen.getAllByLabelText('Cerrar sesión');
    expect(logoutBtns.length).toBeGreaterThan(0);

    fireEvent.click(logoutBtns[0]);

    // Allow async logout to execute
    await new Promise(r => setTimeout(r, 0));

    expect(mockIndexedDb.clearStore).toHaveBeenCalledWith('gtd_items');
    expect(mockSupabase.signOut).toHaveBeenCalled();
  });
});
