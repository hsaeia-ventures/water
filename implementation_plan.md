# Fase 1: Sistema de Captura — Plan de Implementación

El objetivo de esta fase es construir el núcleo del sistema de captura de Water: un "buzón" omnipresente que permita al usuario vaciar su mente de forma inmediata. Cubre las 5 HDUs definidas en [fase1.md](file:///Users/jesuscabezaacero/Desktop/JesusC/Software/hsa/water/water-ang/.antigravity/fase1.md).

## User Review Required

> [!IMPORTANT]
> **Tailwind CSS 4.1** ya está configurado en el proyecto (PostCSS + `@import 'tailwindcss'`). Según el PRD se usa Tailwind CSS 4.1 Engine Oxide. Lo respetaremos.

> [!IMPORTANT]
> **Sobre la IA (HDU 02 — Ghost Tags):** En esta fase implementaremos un parsing **local** basado en regex (detección de `@menciones`, fechas tipo `mañana`, `lunes`, etc., y nombres propios). No se conectará a ningún backend de IA aún. ¿Estás de acuerdo con este enfoque local para el MVP?

> [!WARNING]
> **Web Speech API (HDU 03):** La API de reconocimiento de voz por navegador (`webkitSpeechRecognition`) **requiere conexión a internet** en la mayoría de navegadores y solo funciona en Chrome/Edge. Se implementará con un fallback de estado "no disponible". ¿Es aceptable esta limitación para el MVP?

---

## Proposed Changes

### 1. Design System & App Shell

Configurar el sistema de diseño "Minimal-Robust" y el layout principal responsivo.

#### [MODIFY] [styles.css](file:///Users/jesuscabezaacero/Desktop/JesusC/Software/hsa/water/water-ang/src/styles.css)
- Definir custom theme de Tailwind 4.1 con `@theme`: colores zen (slate/zinc profundos, acentos ámbar/teal), tipografía Inter/Outfit via Google Fonts, escalas de espaciado.
- CSS custom properties para animaciones globales: transiciones de 150ms, easing curves orgánicas.
- Reset y estilos base del body (dark mode profundo por defecto).

#### [NEW] [app-shell.ts](file:///Users/jesuscabezaacero/Desktop/JesusC/Software/hsa/water/water-ang/src/app/layout/app-shell.ts)
- Componente standalone que envuelve `<router-outlet>`.
- Layout responsivo: header mínimo con título "Water" + badge de inbox, área principal centrada.
- Host del Omni-FAB (posición fija en zona del pulgar para móvil).

#### [MODIFY] [app.ts](file:///Users/jesuscabezaacero/Desktop/JesusC/Software/hsa/water/water-ang/src/app/app.ts)
- Integrar `AppShellComponent` como wrapper del `RouterOutlet`.

#### [MODIFY] [index.html](file:///Users/jesuscabezaacero/Desktop/JesusC/Software/hsa/water/water-ang/src/index.html)
- Agregar Google Fonts (Inter, Outfit), meta description, meta color-scheme dark.

---

### 2. HDU 01 — Punto de Entrada Adaptativo

#### [NEW] [capture-ui.service.ts](file:///Users/jesuscabezaacero/Desktop/JesusC/Software/hsa/water/water-ang/src/app/capture/services/capture-ui.service.ts)
- Signal `isOpen` para controlar visibilidad del panel de captura.
- Signal `captureMode` (`'bottom-sheet' | 'spotlight'`) derivado del viewport.
- Métodos `open()`, `close()`, `toggle()`.
- Listener de `Cmd/Ctrl+K` a nivel documento para abrir spotlight.

#### [NEW] [omni-fab.ts](file:///Users/jesuscabezaacero/Desktop/JesusC/Software/hsa/water/water-ang/src/app/capture/components/omni-fab/omni-fab.ts)
- FAB flotante circular en posición fija (bottom-right, zona del pulgar).
- Icono "+" con animación de rotación al abrir.
- Visible solo en viewport móvil (`@media (max-width: 768px)`), oculto en desktop donde `Cmd+K` es el trigger.
- Emite señal a `CaptureUiService.toggle()`.

#### [NEW] [capture-bottom-sheet.ts](file:///Users/jesuscabezaacero/Desktop/JesusC/Software/hsa/water/water-ang/src/app/capture/components/capture-bottom-sheet/capture-bottom-sheet.ts)
- Panel que emerge desde abajo cubriendo ~40% de la pantalla.
- Animación slide-up con CSS transitions (transform + opacity, 200ms ease-out).
- Auto-focus en textarea al abrir.
- Gesture: drag-down para cerrar (touch events).
- Contiene el formulario de captura compartido.

#### [NEW] [capture-spotlight.ts](file:///Users/jesuscabezaacero/Desktop/JesusC/Software/hsa/water/water-ang/src/app/capture/components/capture-spotlight/capture-spotlight.ts)
- Modal centrado con backdrop desenfocado (`backdrop-filter: blur`).
- Input grande (1.25rem+) sin bordes, estilo "lienzo en blanco".
- Cierre con `Escape` o click en backdrop.
- Contiene el formulario de captura compartido.

#### [NEW] [capture-input.ts](file:///Users/jesuscabezaacero/Desktop/JesusC/Software/hsa/water/water-ang/src/app/capture/components/capture-input/capture-input.ts)
- Componente reutilizable con el textarea + botón enviar + botón micrófono.
- Signal `text` para el contenido.
- Al enviar: animación de "entrar en buzón" (encoge y baja 150ms), haptic feedback (API Vibration).
- Emite evento de captura al componente padre.

---

### 3. HDU 02 — Ghost Tags (Pre-procesamiento Local)

#### [NEW] [ghost-tag.service.ts](file:///Users/jesuscabezaacero/Desktop/JesusC/Software/hsa/water/water-ang/src/app/capture/services/ghost-tag.service.ts)
- Recibe un `string` (texto del input) y retorna un array de `GhostTag`.
- Parseo por regex: `@contexto`, fechas naturales (`mañana`, `lunes`, `15 marzo`), nombres propios (heurística mayúscula).
- Debounce de 300ms para no procesar cada keystroke.

#### [NEW] [ghost-tags.ts](file:///Users/jesuscabezaacero/Desktop/JesusC/Software/hsa/water/water-ang/src/app/capture/components/ghost-tags/ghost-tags.ts)
- Lista horizontal de chips/etiquetas debajo del input.
- Cada tag aparece con `fade-in escalonado` (animation-delay incremental).
- Tipos diferenciados por color: contexto (teal), fecha (ámbar), persona (violeta).

#### [NEW] [ghost-tag.model.ts](file:///Users/jesuscabezaacero/Desktop/JesusC/Software/hsa/water/water-ang/src/app/capture/models/ghost-tag.model.ts)
- Interfaz `GhostTag { type: 'context' | 'date' | 'person'; value: string; raw: string }`.

---

### 4. HDU 03 — Captura por Dictado

#### [NEW] [speech-recognition.service.ts](file:///Users/jesuscabezaacero/Desktop/JesusC/Software/hsa/water/water-ang/src/app/capture/services/speech-recognition.service.ts)
- Wrapper de Web Speech API (`webkitSpeechRecognition`).
- Signal `isListening`, signal `transcript` (resultado parcial), signal `isAvailable`.
- Métodos `start()`, `stop()`.
- Fallback: si `webkitSpeechRecognition` no existe, `isAvailable = false`.

#### Integración en [capture-input.ts](file:///Users/jesuscabezaacero/Desktop/JesusC/Software/hsa/water/water-ang/src/app/capture/components/capture-input/capture-input.ts)
- Botón micrófono con estados: idle → listening (pulso animado rojo) → procesando.
- El transcript se concatena al signal `text`.

---

### 5. HDU 04 — Persistencia Offline-First

#### [NEW] [capture-item.model.ts](file:///Users/jesuscabezaacero/Desktop/JesusC/Software/hsa/water/water-ang/src/app/capture/models/capture-item.model.ts)
- Interfaz `CaptureItem { id: string; text: string; ghostTags: GhostTag[]; createdAt: Date; synced: boolean }`.

#### [NEW] [indexed-db.service.ts](file:///Users/jesuscabezaacero/Desktop/JesusC/Software/hsa/water/water-ang/src/app/core/services/indexed-db.service.ts)
- Servicio genérico para operaciones CRUD sobre IndexedDB.
- Usa la API nativa `indexedDB` (sin librerías externas).
- Métodos: `getAll<T>()`, `getById<T>()`, `put<T>()`, `delete()`.
- Manejo de versioning de schema.

#### [NEW] [capture.store.ts](file:///Users/jesuscabezaacero/Desktop/JesusC/Software/hsa/water/water-ang/src/app/capture/services/capture.store.ts)
- Store reactivo basado en signals.
- Signal `items` (lista de capturas), computed `inboxCount`.
- Método `addCapture(text, ghostTags)`: genera id (crypto.randomUUID), persiste en IndexedDB, actualiza signal.
- Método `loadAll()`: lee de IndexedDB al iniciar la app.

---

### 6. HDU 05 — Reminder de Recolección

#### [NEW] [inbox-reminder.service.ts](file:///Users/jesuscabezaacero/Desktop/JesusC/Software/hsa/water/water-ang/src/app/capture/services/inbox-reminder.service.ts)
- Computed signal derivado de `CaptureStore.inboxCount`.
- Lógica de recordatorio: si hay items sin procesar por más de X horas, cambia estado `shouldRemind` a true.
- (Futuro: integración con Notification API del navegador).

#### [NEW] [inbox-badge.ts](file:///Users/jesuscabezaacero/Desktop/JesusC/Software/hsa/water/water-ang/src/app/capture/components/inbox-badge/inbox-badge.ts)
- Badge numérico en el header que muestra `inboxCount`.
- Animación de "bounce" cuando cambia el número.
- Color cambia de teal → ámbar → rojo según la cantidad acumulada.

---

### 7. Routing & Página Inbox

#### [MODIFY] [app.routes.ts](file:///Users/jesuscabezaacero/Desktop/JesusC/Software/hsa/water/water-ang/src/app/app.routes.ts)
- Ruta default `''` → `InboxPage` (lazy loaded).
- Ruta wildcard `'**'` → redirect a `''`.

#### [NEW] [inbox.page.ts](file:///Users/jesuscabezaacero/Desktop/JesusC/Software/hsa/water/water-ang/src/app/pages/inbox/inbox.page.ts)
- Página principal que muestra la lista de capturas pendientes.
- Estado vacío: ilustración zen + mensaje motivacional ("Tu mente está como el agua").
- Lista de capturas con ghost tags visibles, ordenadas por fecha (más reciente primero).

---

## Estructura de Archivos Resultante

```
src/
├── app/
│   ├── app.ts                          (modificado)
│   ├── app.config.ts                   (sin cambios)
│   ├── app.routes.ts                   (modificado)
│   ├── core/
│   │   └── services/
│   │       └── indexed-db.service.ts   [NEW]
│   ├── layout/
│   │   └── app-shell.ts               [NEW]
│   ├── capture/
│   │   ├── models/
│   │   │   ├── capture-item.model.ts   [NEW]
│   │   │   └── ghost-tag.model.ts      [NEW]
│   │   ├── services/
│   │   │   ├── capture-ui.service.ts   [NEW]
│   │   │   ├── capture.store.ts        [NEW]
│   │   │   ├── ghost-tag.service.ts    [NEW]
│   │   │   ├── speech-recognition.service.ts [NEW]
│   │   │   └── inbox-reminder.service.ts     [NEW]
│   │   └── components/
│   │       ├── omni-fab/omni-fab.ts          [NEW]
│   │       ├── capture-bottom-sheet/         [NEW]
│   │       ├── capture-spotlight/            [NEW]
│   │       ├── capture-input/                [NEW]
│   │       ├── ghost-tags/                   [NEW]
│   │       └── inbox-badge/                  [NEW]
│   └── pages/
│       └── inbox/inbox.page.ts         [NEW]
├── index.html                          (modificado)
└── styles.css                          (modificado)
```

---

## Verification Plan

### Automated Tests

Se usará **Vitest** (ya configurado en el proyecto) con el builder de Angular test:

```bash
npm run test
```

Tests nuevos a crear:

| Test File | Qué verifica |
|---|---|
| `ghost-tag.service.spec.ts` | Parsing de @menciones, fechas, nombres → genera GhostTag correcto |
| `capture.store.spec.ts` | `addCapture()` agrega item, `inboxCount` se actualiza, persiste en mock de IndexedDB |
| `capture-ui.service.spec.ts` | `open()`, `close()`, `toggle()` cambian el signal `isOpen` correctamente |
| `speech-recognition.service.spec.ts` | Fallback cuando la API no está disponible, signals cambian correctamente |

### Manual Verification

1. **Abrir la app en el navegador** (`npm run start`, luego navegar a `http://localhost:4200`)
2. **Desktop — Spotlight Mode:**
   - Presionar `Cmd+K` → se abre el modal centrado con backdrop blur
   - Escribir texto con `@casa mañana` → aparecen ghost tags debajo
   - Presionar Enter o botón enviar → animación de buzón, item aparece en inbox
   - Presionar `Escape` → se cierra el modal
3. **Móvil — Bottom Sheet** (usar DevTools → responsive/mobile view ≤768px):
   - Aparece FAB flotante en esquina inferior derecha
   - Tap en FAB → emerge bottom sheet ~40% pantalla, cursor en textarea
   - Escribir y enviar → misma lógica que desktop
   - Drag down → se cierra el bottom sheet
4. **Offline:**
   - Capturar un item → aparece en lista
   - Ir a DevTools → Application → Service Workers → marcar "Offline"
   - Capturar otro item → se guarda sin error
   - Desmarcar "Offline" → ambos items siguen presentes
5. **Voz (solo Chrome):**
   - Click en botón micrófono → pulso rojo, dictar texto → se escribe en textarea
