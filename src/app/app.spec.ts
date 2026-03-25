import { render, screen } from '@testing-library/angular';
import { App } from './app';
import { provideRouter } from '@angular/router';
import { SupabaseService } from './core/services/supabase.service';
import { signal } from '@angular/core';

describe('App', () => {
  it('should render the app shell', async () => {
    await render(App, {
      providers: [
        provideRouter([]),
        { provide: SupabaseService, useValue: { isAuthenticated: signal(true) } }
      ]
    });
    
    // Check if AppShell's core visuals are visible in the integration point
    expect(screen.getByText('Water')).toBeInTheDocument();
  });
});
