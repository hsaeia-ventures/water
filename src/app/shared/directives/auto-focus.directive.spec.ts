import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { AutoFocusDirective } from './auto-focus.directive';

@Component({
  standalone: true,
  imports: [AutoFocusDirective],
  template: `<input id="test-input" appAutoFocus [autoFocusDelay]="delay" />`,
})
class TestHostComponent {
  delay = 0;
}

describe('AutoFocusDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
  });

  it('should create an instance', () => {
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('#test-input');
    expect(input).toBeTruthy();
  });

  it('should focus the element after init', async () => {
    fixture.detectChanges();

    // Wait for requestAnimationFrame
    await new Promise((resolve) => requestAnimationFrame(resolve));

    const input = fixture.nativeElement.querySelector('#test-input');
    expect(document.activeElement).toBe(input);
  });

  it('should delay focus when autoFocusDelay is set', async () => {
    host.delay = 50;
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('#test-input');

    // Before delay, should NOT be focused
    expect(document.activeElement).not.toBe(input);

    // Wait for the delay + buffer
    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(document.activeElement).toBe(input);
  });
});
