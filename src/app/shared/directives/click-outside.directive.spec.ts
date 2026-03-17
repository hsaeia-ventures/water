import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { ClickOutsideDirective } from './click-outside.directive';

@Component({
  standalone: true,
  imports: [ClickOutsideDirective],
  template: `
    <div id="outside">Fuera</div>
    <div id="inside" appClickOutside (clickOutside)="onClickOutside()">
      <span id="child">Dentro</span>
    </div>
  `,
})
class TestHostComponent {
  outsideClicked = false;
  onClickOutside() {
    this.outsideClicked = true;
  }
}

describe('ClickOutsideDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    const inside = fixture.nativeElement.querySelector('#inside');
    expect(inside).toBeTruthy();
  });

  it('should emit clickOutside when clicking outside the host', async () => {
    // Wait for setTimeout in directive
    await new Promise((resolve) => setTimeout(resolve, 20));

    const outside = fixture.nativeElement.querySelector('#outside');
    outside.click();

    expect(host.outsideClicked).toBe(true);
  });

  it('should NOT emit when clicking inside the host', async () => {
    await new Promise((resolve) => setTimeout(resolve, 20));

    const inside = fixture.nativeElement.querySelector('#inside');
    inside.click();

    expect(host.outsideClicked).toBe(false);
  });

  it('should NOT emit when clicking on a child of the host', async () => {
    await new Promise((resolve) => setTimeout(resolve, 20));

    const child = fixture.nativeElement.querySelector('#child');
    child.click();

    expect(host.outsideClicked).toBe(false);
  });
});
