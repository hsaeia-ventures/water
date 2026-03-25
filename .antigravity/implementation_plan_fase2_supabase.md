# Fase 2: ACLARAR (Procesar) — Plan de Implementación (Rediseño con Supabase)

Este plan actualiza la arquitectura de la **Fase 2** para incorporar la persistencia en la nube utilizando **Supabase**, garantizando un ecosistema multi-usuario (Login). Además, se propone el **esquema de base de datos unificado** que satisfará los requerimientos de **todas las fases (1 a 5)** del modelo GTD en AppGTD, así como el seguimiento del uso (Logs).

---

## User Review Required

> [!IMPORTANT]
> **Uso del MCP de Supabase:** Este plan asume la utilización del MCP de Supabase para realizar las migraciones de base de datos directamente desde el entorno de desarrollo y evitar procesos manuales en el dashboard.

> [!CAUTION]
> **Migración y Refactor de la Fase 1:** Para adoptar el modelo unificado, debemos alterar el componente de Captura desarrollado en la Fase 1. La tabla local `captures` de IndexedDB dejará de existir, pasando a usar la tabla `gtd_items` con `type: 'capture'` y `status: 'inbox'`.

> [!TIP]
> **Sincronización Offline-First:** Dado que la Fase 1 estableció IndexedDB como motor principal, la UI seguirá leyendo/escribiendo en IndexedDB localmente para mantener la **latencia cero**. Se creará un servicio `SupabaseSyncService` que correrá en background (o al detectar conexión) para empujar los cambios locales a Supabase usando una cola de sincronización.

---

## 1. Diseño de Base de Datos (Supabase MCP) — Full GTD Model

Utilizaremos el MCP de Supabase para aplicar migraciones (`apply_migration`) y crear las siguientes tablas y políticas. Este esquema soporta captura, procesamiento, proyectos, contextos con geolocalización (Fase 5), métricas de revisión (Fase 4) y tracking de uso/analytics.

### Tabla `profiles`
Extendemos el usuario con configuraciones propias de GTD.
* `id` (uuid, PK, FK a auth.users)
* `full_name` (text)
* `avatar_url` (text)
* `theme_preference` (text: 'dark' | 'light' | 'system')
* `created_at` (timestamptz)

### Tabla `gtd_items` (El núcleo de AppGTD)
Maneja Capturas, Acciones, Proyectos, Referencias, etc. Todo en GTD es un ítem que cambia de estado.
* `id` (uuid, PK)
* `user_id` (uuid, FK a auth.users, Indexado para RLS)
* `type` (text: `'capture' | 'action' | 'project' | 'reference'`)
* `status` (text: `'inbox' | 'next_action' | 'waiting' | 'someday' | 'calendar' | 'done' | 'trashed'`)
* `title` (text) — El texto principal de la captura/acción.
* `notes` (text) — Detalles adicionales agregados en la reflexión.
* `parent_id` (uuid, FK a gtd_items.id) — Relación Acciones -> Proyectos.
* `context_id` (uuid, FK a contexts.id) — Contexto de ejecución (@casa, @oficina).
* `delegated_to` (text) — Para status `waiting`.
* `energy_level` (int: 1, 2, 3) — Para Fase 5 (Baja, Media, Alta energía).
* `time_estimate_mins` (int) — Para Fase 5 (Regla 2 mins, pomodoros).
* `due_date` (timestamptz) — Fecha límite estricta.
* `scheduled_date` (timestamptz) — Para el "Hard Landscape" (Calendario - Fase 3).
* `ghost_tags` (jsonb) — Etiquetas extraídas por la IA en Fase 1.
* `created_at` (timestamptz)
* `updated_at` (timestamptz)
* `completed_at` (timestamptz) — Fecha de finalización para estadísticas.

### Tabla `contexts` (Fase 3 y 5)
* `id` (uuid, PK)
* `user_id` (uuid, FK a auth.users)
* `name` (text) — Ej: "@oficina".
* `icon` (text)
* `geo_lat` (float8) — Para Geofencing (Notificaciones por proximidad - Fase 5).
* `geo_lng` (float8)
* `radius_meters` (int)

### Tabla `usage_logs` (Tracking y Analytics de Usuario)
Registro inmutable del uso de la app para análisis, gamificación y la barra de progreso.
* `id` (uuid, PK)
* `user_id` (uuid, FK a auth.users)
* `event_type` (text) — Ej: `'item_captured'`, `'inbox_processed'`, `'action_completed'`, `'deep_work_session'`, `'weekly_review_done'`.
* `metadata` (jsonb) — Datos extra (ej: tiempo de sesión de deep work, items borrados).
* `created_at` (timestamptz)

### Seguridad y Privacidad (RLS) configurada vía MCP
En Supabase se configurará **Row Level Security (RLS)** obligatoria mediante migraciones SQL con el MCP. Crearemos las políticas para restringir que los usuarios solo accedan a sus propios `gtd_items` y `usage_logs` usando `auth.uid() = user_id`.

---

## 2. Cambios Arquitectónicos en Fase 2 (Frontend)

### A. Capa de Datos Locales y Refactor de Fase 1

#### [MODIFY] [indexed-db.service.ts](file:///Users/jesuscabezaacero/Desktop/JesusC/Software/hsa/water/water-ang/src/app/core/services/indexed-db.service.ts)
- Aumentar `DB_VERSION` a `2`.
- Migrar de tener una tabla `captures` a una tabla unificada `gtd_items` local.
- Crear una nueva tabla `sync_queue` para almacenar mutaciones pendientes de envío al servidor.

#### [NEW] [sync-queue.model.ts](file:///Users/jesuscabezaacero/Desktop/JesusC/Software/hsa/water/water-ang/src/app/core/models/sync-queue.model.ts)
- Modelo para encolar `INSERT`, `UPDATE`, `DELETE` locales y sincronizarlos cuando haya conexión.

#### [MODIFY] Componentes de Fase 1 (Captura)
- Actualizar `CaptureStore` y los formularios de captura creados en la Fase 1 para que escriban en `gtd_items` (con `type: 'capture', status: 'inbox'`) en lugar del antiguo modelo de `captures`.

### B. Integración Supabase SDK

- Ejecutar `npm install @supabase/supabase-js`.
- Configurar `src/environments/environment.ts` con `SUPABASE_URL` y `SUPABASE_ANON_KEY`.

#### [NEW] [supabase.service.ts](file:///Users/jesuscabezaacero/Desktop/JesusC/Software/hsa/water/water-ang/src/app/core/services/supabase.service.ts)
- Inicializa el cliente oficial `@supabase/supabase-js`.
- Provee un signal `currentUser` para saber si hay alguien logueado.
- Maneja el flujo de login/logout básico.

#### [NEW] [sync.service.ts](file:///Users/jesuscabezaacero/Desktop/JesusC/Software/hsa/water/water-ang/src/app/core/services/sync.service.ts)
- Escucha el estado de red (`navigator.onLine`).
- Efectúa un "Background Sync": lee la `sync_queue` local y empuja los cambios a Supabase en lote.
- Descarga los cambios remotos al loguearse.

### C. Fase 2: El Flujo de "Aclarar" y Experiencia de Usuario (UI/UX)

#### [MODIFY] [clarify.store.ts](file:///Users/jesuscabezaacero/Desktop/JesusC/Software/hsa/water/water-ang/src/app/clarify/services/clarify.store.ts)
- Maneja la lógica de procesar un ítem con estado `inbox`.
- Al tomar una decisión local (ej. "Próxima Acción"), actualiza el objeto local (`type = 'action'`, `status = 'next_action'`).
- Guarda en IndexedDB, encola una operación `UPDATE` en la `sync_queue` y encola un evento a `usage_logs`.

#### UI Components e Integraciones de Experiencia
- **`ProcessCardComponent`**: Implementa el patrón "Tarjetas Apiladas" (Single-item view) sin distracciones.
- **`DecisionTreeComponent` (Árbol GTD)**: Flujo con accesibilidad. Se implementarán **Atajos de Teclado** (`E` para eliminar, `I` para incubar, `Enter` para siguiente paso).
- **Fricción Positiva:** El componente bloqueará el guardado de un "Proyecto" si el usuario no define primero una "Próxima Acción" física (validación de formulario/estado).
- **`TwoMinuteRuleService`**: Un servicio estático que evaluará el texto capturado usando heurísticas (ej., menos de N palabras/caracteres, o detección de verbos sencillos) o llamadas a la API/IA real, resaltando el botón "Hacer ahora" para tareas cortas.

---

## Verification Plan

### Automated Tests (Angular)
- **`sync.service.spec.ts`:** Probar que cuando hay internet, la cola local se procesa e invoca al SDK de Supabase.
- **`clarify.store.spec.ts`:** Verificar que procesar un ítem actualiza localmente en `gtd_items` y agrega entrada a `sync_queue`.

### Manual Verification
1. **Verificación de la Base de Datos con Supabase MCP**: Asegurarse de que el MCP haya creado las tablas con los esquemas correctos.
2. **Login Flow:** Confirmar que la app exige/permite login (email/pass o magic link genérico).
3. **Modo Offline e Inserción de Fase 1:**
   - Crear 3 capturas viendo que se almacenan como `gtd_items`.
   - Apagar red (DevTools). Ir al proceso de "Aclarar". Procesar 1 como Acción y 1 a la Basura. Validar en `sync_queue`.
4. **Sincronización:** Prender la red, verificar en consola y dashboard de Supabase (con el MCP se pueden hacer consultas) que los datos replican.
