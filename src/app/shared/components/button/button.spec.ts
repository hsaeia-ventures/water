import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ButtonComponent, ButtonVariant } from './button';

describe('ButtonComponent', () => {
  let fixture: ComponentFixture<ButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ButtonComponent);
    fixture.detectChanges();
  });

  it('should create', () => {
    const button = fixture.nativeElement.querySelector('button');
    expect(button).toBeTruthy();
  });

  it('should apply primary class by default', () => {
    const button = fixture.nativeElement.querySelector('button');
    expect(button.classList.contains('btn-primary')).toBe(true);
  });

  it('should apply ghost class when variant is ghost', () => {
    fixture.componentRef.setInput('variant', 'ghost');
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button');
    expect(button.classList.contains('btn-ghost')).toBe(true);
  });

  it('should apply icon-only class', () => {
    fixture.componentRef.setInput('variant', 'icon-only');
    fixture.componentRef.setInput('iconName', 'plus');
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button');
    expect(button.classList.contains('btn-icon-only')).toBe(true);
  });

  it('should be disabled when disabled input is true', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(button.disabled).toBe(true);
  });

  it('should show spinner when loading', () => {
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();

    const spinner = fixture.nativeElement.querySelector('.btn-spinner');
    expect(spinner).toBeTruthy();
  });

  it('should not show spinner when not loading', () => {
    fixture.componentRef.setInput('loading', false);
    fixture.detectChanges();

    const spinner = fixture.nativeElement.querySelector('.btn-spinner');
    expect(spinner).toBeFalsy();
  });

  it('should render icon when iconName is provided', () => {
    fixture.componentRef.setInput('iconName', 'send');
    fixture.detectChanges();

    const icon = fixture.nativeElement.querySelector('app-icon');
    expect(icon).toBeTruthy();
  });

  it('should not render icon when iconName is undefined', () => {
    fixture.componentRef.setInput('iconName', undefined);
    fixture.detectChanges();

    const icon = fixture.nativeElement.querySelector('app-icon');
    expect(icon).toBeFalsy();
  });

  it('should have type="button" by default', () => {
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(button.type).toBe('button');
  });

  it('should set aria-busy when loading', () => {
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button');
    expect(button.getAttribute('aria-busy')).toBe('true');
  });
});
