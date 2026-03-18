## FASE 5: HACER (EJECUTAR)
**Resumen:** Elegir la mejor acción en el momento actual basado en Contexto, Tiempo disponible, Energía disponible y Prioridad. La IA actúa como un motor de recomendación inteligente.

### Historias de Usuario (Gherkin)

### HDU 20: El "Selector de Acción" Tri-Focal (IA)
**Como** usuario abrumado,
**Quiero** que el sistema me sugiera las 3 mejores tareas para realizar ahora según mi contexto, tiempo y energía.

### HDU 21: Modo "Enfoque Profundo" (Deep Work Mode)
**Como** profesional,
**Quiero** una vista que bloquee visualmente todo lo que no sea la tarea actual.

### HDU 22: Notificaciones Contextuales por Proximidad (Geofencing)
**Como** usuario olvidadizo,
**Quiero** alertas basadas en ubicación para el contexto @recados.

### HDU 23: Gamificación del Cierre de Bucles
**Como** usuario que necesita motivación,
**Quiero** visualizar mi progreso diario de acciones completadas.

### Notas de Arquitectura UI/UX (Equipo)
1. **Selector de Estado:** Uso de Segmented Controls con iconos intuitivos (Rayos para energía, Relojes para tiempo).
2. **Deep Work Mode:** Ocultar navegación, activar modo Zen y mostrar un Pomodoro sutil.
3. **Explosión de Éxito:** Al completar una tarea en modo enfoque, usar partículas (confeti) para recompensar el cierre del bucle.
4. **Algoritmo de IA:** Priorizar tareas cruzando `Contexto (GPS) + Energía + Tiempo`.