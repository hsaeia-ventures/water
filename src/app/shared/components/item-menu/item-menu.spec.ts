import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ItemMenuComponent, MenuAction } from './item-menu';
import { By } from '@angular/platform-browser';
import { describe, it, expect, beforeEach } from 'vitest';

describe('ItemMenuComponent', () => {
  let component: ItemMenuComponent;
  let fixture: ComponentFixture<ItemMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemMenuComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ItemMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle menu open state on click', () => {
    const button = fixture.debugElement.query(By.css('button'));
    
    expect(component.isOpen()).toBe(false);
    
    button.triggerEventHandler('click', new MouseEvent('click'));
    fixture.detectChanges();
    expect(component.isOpen()).toBe(true);
    
    button.triggerEventHandler('click', new MouseEvent('click'));
    fixture.detectChanges();
    expect(component.isOpen()).toBe(false);
  });
});
