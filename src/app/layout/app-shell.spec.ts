import { render, screen } from '@testing-library/angular';
import { AppShellComponent } from './app-shell';
import { provideRouter } from '@angular/router';

describe('AppShellComponent', () => {
  it('should render the minimal header with brand and inbox link', async () => {
    await render(AppShellComponent, {
      providers: [provideRouter([])], // Provide router for routerLink
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
