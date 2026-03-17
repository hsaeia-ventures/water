import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { TrapFocusDirective } from './trap-focus.directive';

@Component({
  standalone: true,
  imports: [TrapFocusDirective],
  template: `
    <div appTrapFocus id="trap-container">
      <button id="btn-first">Primero</button>
      <input id="input-middle" />
      <button id="btn-last">Último</button>
    </div>
  `,
})
class TestHostComponent {}

describe('TrapFocusDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
  });

  it('should create', () => {
    const container = fixture.nativeElement.querySelector('#trap-container');
    expect(container).toBeTruthy();
  });

  it('should trap focus on Tab from last to first element', () => {
    const lastBtn: HTMLElement = fixture.nativeElement.querySelector('#btn-last');
    const firstBtn: HTMLElement = fixture.nativeElement.querySelector('#btn-first');
    lastBtn.focus();

    const event = new KeyboardEvent('keydown', {
      key: 'Tab',
      bubbles: true,
    });
    const preventSpy = vi.spyOn(event, 'preventDefault');

    fixture.nativeElement.querySelector('#trap-container').dispatchEvent(event);

    expect(preventSpy).toHaveBeenCalled();
    expect(document.activeElement).toBe(firstBtn);
  });

  it('should trap focus on Shift+Tab from first to last element', () => {
    const firstBtn: HTMLElement = fixture.nativeElement.querySelector('#btn-first');
    const lastBtn: HTMLElement = fixture.nativeElement.querySelector('#btn-last');
    firstBtn.focus();

    const event = new KeyboardEvent('keydown', {
      key: 'Tab',
      shiftKey: true,
      bubbles: true,
    });
    const preventSpy = vi.spyOn(event, 'preventDefault');

    fixture.nativeElement.querySelector('#trap-container').dispatchEvent(event);

    expect(preventSpy).toHaveBeenCalled();
    expect(document.activeElement).toBe(lastBtn);
  });

  it('should NOT prevent default when Tab is pressed on middle element', () => {
    const middleInput: HTMLElement = fixture.nativeElement.querySelector('#input-middle');
    middleInput.focus();

    const event = new KeyboardEvent('keydown', {
      key: 'Tab',
      bubbles: true,
    });
    const preventSpy = vi.spyOn(event, 'preventDefault');

    fixture.nativeElement.querySelector('#trap-container').dispatchEvent(event);

    expect(preventSpy).not.toHaveBeenCalled();
  });

  it('should ignore non-Tab keys', () => {
    const firstBtn: HTMLElement = fixture.nativeElement.querySelector('#btn-first');
    firstBtn.focus();

    const event = new KeyboardEvent('keydown', {
      key: 'Enter',
      bubbles: true,
    });
    const preventSpy = vi.spyOn(event, 'preventDefault');

    fixture.nativeElement.querySelector('#trap-container').dispatchEvent(event);

    expect(preventSpy).not.toHaveBeenCalled();
  });
});
