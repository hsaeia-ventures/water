import { Injectable, signal, computed, inject } from '@angular/core';
import { GtdItem } from '../../core/models/gtd-item.model';

export type EnergyLevel = 'baja' | 'media' | 'alta';
export type TimeAvailable = '15m' | '30m' | '60m' | 'ilimitado';

@Injectable({ providedIn: 'root' })
export class ExecuteStore {
  
  // ─── Selector State ────────────────────────────────────────────────────────
  public readonly energyLevel = signal<EnergyLevel>('media');
  public readonly timeAvailable = signal<TimeAvailable>('30m');
  public readonly manualContext = signal<string | null>(null);

  // ─── AI Recommendations State ──────────────────────────────────────────────
  public readonly suggestedActions = signal<GtdItem[]>([]);
  public readonly isAiLoading = signal<boolean>(false);

  // ─── Deep Work State ───────────────────────────────────────────────────────
  public readonly deepWorkTask = signal<GtdItem | null>(null);
  public readonly pomodoroSeconds = signal<number>(0);
  public readonly isPomodoroActive = signal<boolean>(false);
  private timerInterval: any = null;

  // ─── Mutations / Selectors ─────────────────────────────────────────────────
  
  public setParameters(energy: EnergyLevel, time: TimeAvailable) {
    this.energyLevel.set(energy);
    this.timeAvailable.set(time);
  }

  public setContext(contextId: string | null) {
    this.manualContext.set(contextId);
  }

  public setRecommendations(tasks: GtdItem[]) {
    this.suggestedActions.set(tasks);
  }

  public startDeepWork(task: GtdItem) {
    this.deepWorkTask.set(task);
    
    // Set pomodoro time based on selected time limit
    let mins = 25; // default pomodoro
    const timeLimit = this.timeAvailable();
    if (timeLimit === '15m') mins = 15;
    if (timeLimit === '30m') mins = 30; // 30 mins straight
    if (timeLimit === '60m') mins = 60; 
    
    this.pomodoroSeconds.set(mins * 60);
    this.isPomodoroActive.set(false);
  }

  public endDeepWork() {
    this.pausePomodoro();
    this.deepWorkTask.set(null);
    this.pomodoroSeconds.set(0);
  }

  public togglePomodoro() {
    if (this.isPomodoroActive()) {
      this.pausePomodoro();
    } else {
      this.playPomodoro();
    }
  }

  private playPomodoro() {
    this.isPomodoroActive.set(true);
    this.timerInterval = setInterval(() => {
      const current = this.pomodoroSeconds();
      if (current > 0) {
        this.pomodoroSeconds.set(current - 1);
      } else {
        this.pausePomodoro();
      }
    }, 1000);
  }

  private pausePomodoro() {
    this.isPomodoroActive.set(false);
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }
}
