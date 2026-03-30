import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MemoryVaultComponent } from './memory-vault';
import { OrganizeStore } from '../../../organize/services/organize.store';
import { signal } from '@angular/core';
import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('MemoryVaultComponent', () => {
  let component: MemoryVaultComponent;
  let fixture: ComponentFixture<MemoryVaultComponent>;
  let mockOrganize: any;

  beforeEach(async () => {
    mockOrganize = {
      somedayItems: signal([])
    };

    await TestBed.configureTestingModule({
      imports: [MemoryVaultComponent],
      providers: [
        { provide: OrganizeStore, useValue: mockOrganize }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MemoryVaultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render items for someday', () => {
    mockOrganize.somedayItems.set([
      { id: '1', title: 'Great Idea', notes: 'Maybe later' }
    ]);
    fixture.detectChanges();
    const h3 = fixture.nativeElement.querySelector('h3');
    expect(h3.textContent).toContain('Great Idea');
  });

  it('should render empty state if no items in someday', () => {
    mockOrganize.somedayItems.set([]);
    fixture.detectChanges();
    const p = fixture.nativeElement.querySelector('p');
    expect(p.textContent).toContain('Bóveda de recuerdos está vacía');
  });
});
