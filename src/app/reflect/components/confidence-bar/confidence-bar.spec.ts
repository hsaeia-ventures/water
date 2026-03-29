import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfidenceBarComponent } from './confidence-bar';
import { ReflectStore } from '../../services/reflect.store';
import { signal } from '@angular/core';
import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('ConfidenceBarComponent', () => {
  let component: ConfidenceBarComponent;
  let fixture: ComponentFixture<ConfidenceBarComponent>;
  let mockStore: any;
  let confidenceSignal: any;

  beforeEach(async () => {
    confidenceSignal = signal(100);
    mockStore = {
      systemConfidence: confidenceSignal
    };

    await TestBed.configureTestingModule({
      imports: [ConfidenceBarComponent],
      providers: [
        { provide: ReflectStore, useValue: mockStore }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ConfidenceBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return green for score 90', () => {
    confidenceSignal.set(90);
    expect(component.statusColor()).toBe('#10b981');
    expect(component.statusText()).toBe('Mente como el agua');
  });

  it('should return red for score 30', () => {
    confidenceSignal.set(30);
    expect(component.statusColor()).toBe('#ef4444');
    expect(component.statusText()).toBe('Sistema crítico');
  });

  it('should update bar width based on score', () => {
    confidenceSignal.set(50);
    fixture.detectChanges();
    const barElement = fixture.nativeElement.querySelector('[style*="width: 50%"]');
    expect(barElement).toBeTruthy();
  });
});
