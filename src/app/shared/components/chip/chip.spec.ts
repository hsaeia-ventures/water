import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChipComponent, ChipColor } from './chip';

describe('ChipComponent', () => {
  let fixture: ComponentFixture<ChipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChipComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ChipComponent);
    fixture.componentRef.setInput('label', '@casa');
    fixture.componentRef.setInput('color', 'teal');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should display label text', () => {
    const span = fixture.nativeElement.querySelector('span');
    expect(span.textContent.trim()).toBe('@casa');
  });

  it('should apply teal class when color is teal', () => {
    const span = fixture.nativeElement.querySelector('span');
    expect(span.classList.contains('chip-teal')).toBe(true);
  });

  it('should apply amber class when color is amber', () => {
    fixture.componentRef.setInput('color', 'amber');
    fixture.detectChanges();

    const span = fixture.nativeElement.querySelector('span');
    expect(span.classList.contains('chip-amber')).toBe(true);
  });

  it('should apply violet class when color is violet', () => {
    fixture.componentRef.setInput('color', 'violet');
    fixture.detectChanges();

    const span = fixture.nativeElement.querySelector('span');
    expect(span.classList.contains('chip-violet')).toBe(true);
  });

  it('should apply default class when color is default', () => {
    fixture.componentRef.setInput('color', 'default');
    fixture.detectChanges();

    const span = fixture.nativeElement.querySelector('span');
    expect(span.classList.contains('chip-default')).toBe(true);
  });

  it('should update label when input changes', () => {
    fixture.componentRef.setInput('label', 'mañana');
    fixture.detectChanges();

    const span = fixture.nativeElement.querySelector('span');
    expect(span.textContent.trim()).toBe('mañana');
  });
});
