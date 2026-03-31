import { Injectable, inject } from '@angular/core';
import { ExecuteStore } from '../../execute/services/execute.store';
import { OrganizeStore } from '../../organize/services/organize.store';
import { AiInferenceService } from './ai-inference.service';

@Injectable({ providedIn: 'root' })
export class ExecuteService {
  private store = inject(ExecuteStore);
  private organizeStore = inject(OrganizeStore);
  private aiService = inject(AiInferenceService);

  /**
   * Pide a la IA que decida las mejores 3 próximas acciones
   * cruzando la lista limpia de OrganizeStore con el contexto de ExecuteStore.
   */
  public async loadRecommendations(): Promise<void> {
    this.store.isAiLoading.set(true);
    try {
      const pendingNextActions = this.organizeStore.nextActions();
      const energy = this.store.energyLevel();
      const time = this.store.timeAvailable();
      const context = this.store.manualContext();

      const top3 = await this.aiService.getTrifocalRecommendations(
        pendingNextActions,
        energy,
        time,
        context
      );

      this.store.setRecommendations(top3);
    } catch (err) {
      console.error('Failed to load AI recommendations', err);
      // Fallback a selección aleatoria si algo explota
      this.store.setRecommendations(this.organizeStore.nextActions().slice(0, 3));
    } finally {
      this.store.isAiLoading.set(false);
    }
  }

  /**
   * Intenta obtener el contexto actual mediante Geolocalización del navegador bajo demanda
   * (Permisos requeridos). Modifica el manualContext del Store si tiene éxito.
   */
  public async detectContextByLocation(): Promise<string | null> {
    if (!('geolocation' in navigator)) {
      console.warn('Geolocation is not supported by this browser.');
      return null;
    }

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Placeholder para resolver lat/long a un Contexto string ("@oficina", "@casa").
          // En una app real de producción cruzaríamos esto con un mapa guardado de contextos.
          // Aquí simularemos uno aleatorio por ahora u ofreceremos el estático basado en precisión.
          const lat = position.coords.latitude;
          const contextName = lat > 0 ? '@casa' : '@oficina'; // Simple Dummy resolve
          this.store.setContext(contextName);
          resolve(contextName);
        },
        (error) => {
          console.error('Error fetching geolocation', error);
          this.store.setContext(null); // Fallback si no da permisos
          resolve(null);
        },
        { timeout: 5000, enableHighAccuracy: false }
      );
    });
  }
}
