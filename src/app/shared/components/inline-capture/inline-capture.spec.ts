import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InlineCaptureComponent } from './inline-capture';
import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('InlineCaptureComponent', () => {
  let component: InlineCaptureComponent;
  let fixture: ComponentFixture<InlineCaptureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InlineCaptureComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(InlineCaptureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not emit save event if text is empty', () => {
    const emitSpy = vi.spyOn(component.save, 'emit');
    component.text.set('   ');
    
    const event = new Event('submit');
    const preventSpy = vi.spyOn(event, 'preventDefault');

    component.onSubmit(event);

    expect(preventSpy).toHaveBeenCalled();
    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('should emit save event and clear text when text is valid', () => {
    const emitSpy = vi.spyOn(component.save, 'emit');
    component.text.set('New Task');
    
    const event = new Event('submit');
    const preventSpy = vi.spyOn(event, 'preventDefault');

    component.onSubmit(event);

    expect(preventSpy).toHaveBeenCalled();
    expect(emitSpy).toHaveBeenCalledWith('New Task');
    expect(component.text()).toBe('');
  });

  it('should emit cancel event and clear text on cancel', () => {
    const emitSpy = vi.spyOn(component.cancel, 'emit');
    component.text.set('Partial text');
    
    component.onCancel();

    expect(emitSpy).toHaveBeenCalled();
    expect(component.text()).toBe('');
  });
});
