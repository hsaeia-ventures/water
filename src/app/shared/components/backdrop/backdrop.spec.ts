import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BackdropComponent } from './backdrop';

describe('BackdropComponent', () => {
  let fixture: ComponentFixture<BackdropComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BackdropComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BackdropComponent);
    fixture.componentRef.setInput('visible', false);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should not render overlay when visible is false', () => {
    const overlay = fixture.nativeElement.querySelector('.backdrop');
    expect(overlay).toBeFalsy();
  });

  it('should render overlay when visible is true', () => {
    fixture.componentRef.setInput('visible', true);
    fixture.detectChanges();

    const overlay = fixture.nativeElement.querySelector('.backdrop');
    expect(overlay).toBeTruthy();
  });

  it('should emit backdropClick when overlay is clicked', () => {
    fixture.componentRef.setInput('visible', true);
    fixture.detectChanges();

    let clicked = false;
    fixture.componentInstance.backdropClick.subscribe(() => (clicked = true));

    const overlay = fixture.nativeElement.querySelector('.backdrop');
    overlay.click();

    expect(clicked).toBe(true);
  });

  it('should hide overlay when visible changes to false', () => {
    fixture.componentRef.setInput('visible', true);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.backdrop')).toBeTruthy();

    fixture.componentRef.setInput('visible', false);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.backdrop')).toBeFalsy();
  });

  it('should have role="presentation" for accessibility', () => {
    fixture.componentRef.setInput('visible', true);
    fixture.detectChanges();

    const overlay = fixture.nativeElement.querySelector('.backdrop');
    expect(overlay.getAttribute('role')).toBe('presentation');
  });
});
