## FASE 1: CAPTURAR (RECOLECTAR)
**Resumen:** El objetivo es vaciar la mente de forma inmediata. La interfaz actúa como un "buzón" omnipresente que recolecta ideas, tareas y compromisos sin procesarlos en el momento. La rapidez es la métrica de éxito.

### Historias de Usuario (Gherkin)

### HDU 01: Punto de Entrada Adaptativo
**Como** usuario de AppGTD, 
**Quiero** disponer de un acceso inmediato al sistema de captura, 
**Para** no perder ideas debido a la lentitud de apertura de la interfaz.
**ESCENARIO 1: Apertura en móvil (Bottom Sheet)**
- **Dado** que el usuario está en la pantalla principal.
- **Cuando** presiona el botón "Omni-FAB".
- **Entonces** emerge un panel inferior (Bottom Sheet) cubriendo el 40% de la pantalla.
- **Y** el cursor se posiciona automáticamente en el campo de texto.
**ESCENARIO 2: Apertura en escritorio (Spotlight Mode)**
- **Dado** que el usuario tiene la aplicación abierta en segundo plano.
- **Cuando** presiona el atajo de teclado global `CMD/CTRL + K`.
- **Entonces** aparece un modal de captura centrado con un fondo desenfocado.

### HDU 02: Pre-procesamiento con IA (Ghost Tags)
**Como** usuario que busca eficiencia,
**Quiero** que el sistema extraiga datos relevantes de mi lenguaje natural,
**Para** reducir la carga de trabajo en la fase posterior de "Aclarar".
**ESCENARIO 1: Identificación de entidades en tiempo real**
- **Dado** que el usuario está escribiendo una nota de captura.
- **Cuando** introduce palabras clave de contexto (@), fechas o personas.
- **Entonces** la IA genera etiquetas visuales (Ghost Tags) debajo del input.

### HDU 03: Captura por Dictado con Escucha Activa
**Como** usuario que captura en movimiento,
**Quiero** dictar mis pensamientos mediante voz,
**Para** no depender de la escritura manual cuando mis manos están ocupadas.

### HDU 04: Persistencia Offline-First (Resiliencia)
**Como** usuario que depende de su sistema de confianza,
**Quiero** que mis capturas se guarden aunque no tenga conexión,
**Para** garantizar que ninguna idea se pierda jamás.

### HDU 05: El Hábito de Recolección (Reminder)
**Como** practicante de la metodología GTD,
**Quiero** que el sistema me ayude a mantener mi bandeja de entrada limpia,
**Para** evitar la acumulación de "bucles abiertos".

### Notas de Arquitectura UI/UX (Equipo)
1. **Layout:** Omni-FAB en móvil (zona del pulgar) y Command Palette en Desktop (Cmd+K).
2. **Micro-interacciones:** Animación de éxito donde el input se encoge y baja (150ms) simulando entrar en un buzón. Haptic Feedback (vibración corta) al guardar.
3. **Tipografía:** Input grande (1.25rem+) sin bordes, enfocado en el lienzo en blanco.
4. **IA:** Ghost Tags en modo "Fade-in escalonado" debajo del texto.
5. **Offline:** Uso de Service Workers e IndexedDB para guardado instantáneo sin spinners de carga.