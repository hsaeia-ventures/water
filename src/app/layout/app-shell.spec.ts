import { render, screen } from '@testing-library/angular';
import { AppShellComponent } from './app-shell';
import { provideRouter } from '@angular/router';
import { SupabaseService } from '../core/services/supabase.service';
import { signal } from '@angular/core';

describe('AppShellComponent', () => {
  it('should render the minimal header with brand and inbox link', async () => {
    await render(AppShellComponent, {
      providers: [
        provideRouter([]),
        { provide: SupabaseService, useValue: { isAuthenticated: signal(true) } }
      ], // Provide router for routerLink
    });

    // We verify what the user sees
    const brandLabel = screen.getByLabelText('Water Home');
    expect(brandLabel).toBeInTheDocument();
    
    // There should be an "Water" text somewhere in the header
    expect(screen.getByText('Water')).toBeInTheDocument();

    const inboxLink = screen.getByLabelText('Go to Inbox');
    expect(inboxLink).toBeInTheDocument();
    expect(screen.getByText('Inbox')).toBeInTheDocument();
  });
});
