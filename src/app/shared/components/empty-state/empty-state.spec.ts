import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmptyStateComponent } from './empty-state';

describe('EmptyStateComponent', () => {
  let fixture: ComponentFixture<EmptyStateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmptyStateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EmptyStateComponent);
    fixture.componentRef.setInput('title', 'Tu bandeja está vacía');
    fixture.componentRef.setInput('iconName', 'inbox');
    fixture.componentRef.setInput('subtitle', 'Captura tu primera idea');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should display title', () => {
    const title = fixture.nativeElement.querySelector('.empty-state__title');
    expect(title.textContent).toContain('Tu bandeja está vacía');
  });

  it('should display subtitle when provided', () => {
    const subtitle = fixture.nativeElement.querySelector('.empty-state__subtitle');
    expect(subtitle).toBeTruthy();
    expect(subtitle.textContent).toContain('Captura tu primera idea');
  });

  it('should hide subtitle when not provided', () => {
    fixture.componentRef.setInput('subtitle', undefined);
    fixture.detectChanges();

    const subtitle = fixture.nativeElement.querySelector('.empty-state__subtitle');
    expect(subtitle).toBeFalsy();
  });

  it('should display icon when iconName is provided', () => {
    const icon = fixture.nativeElement.querySelector('app-icon');
    expect(icon).toBeTruthy();
  });

  it('should hide icon when iconName is not provided', () => {
    fixture.componentRef.setInput('iconName', undefined);
    fixture.detectChanges();

    const icon = fixture.nativeElement.querySelector('app-icon');
    expect(icon).toBeFalsy();
  });
});
