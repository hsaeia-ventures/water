---
name: human-centric-angular-ui-engineering
description: Guía experta para diseñar y desarrollar interfaces web modernas, orgánicas y emocionalmente atractivas en Angular, utilizando Signals para una reactividad de vanguardia y evitando prototipos generados por IA estériles.
---

# Human-Centric Custom UI/UX & Angular Signals Engineering

## Use this skill when
- El usuario solicita la creación de una aplicación web, landing page o componentes de interfaz desde cero utilizando Angular.
- Se requiere estructurar el estado de la interfaz de usuario y la lógica de presentación.
- El objetivo es refactorizar un diseño existente para hacerlo ver más moderno, profesional, "humano" y con un rendimiento superior.
- Se están diseñando micro-interacciones, animaciones o transiciones de estado en el frontend.

## Do not use this skill when
- El usuario solicita explícitamente un prototipo rápido sin estilos, wireframes de baja fidelidad o layouts anticuados.
- La tarea involucra flujos de datos asíncronos complejos, manejo de websockets o eventos basados en tiempo donde RxJS sigue siendo la herramienta obligatoria (aunque el consumo final en la UI deba ser un Signal).

## Instructions

1. **Rompe el molde de la "Típica IA":** Evita los diseños excesivamente simétricos y las interfaces genéricas. Busca un diseño que se sienta artesanal, auténtico y humano.
2. **Asimetría y Flujo Orgánico:** Implementa layouts que utilicen el espacio en blanco de manera estratégica. Usa asimetría controlada, superposición de elementos y bordes suavizados.
3. **Tipografía y Color con Personalidad:** Propón combinaciones tipográficas modernas con jerarquías claras. Utiliza esquemas de color vibrantes, pasteles suaves o modos oscuros profundos con códigos HEX exactos.
4. **Arquitectura Reactiva Moderna con Signals:** Para el manejo de estado síncrono en la UI, utiliza **exclusivamente Angular Signals** (`signal`, `computed`, `effect`). Diseña la interfaz para que reaccione instantáneamente a los cambios de estado local sin el boilerplate de RxJS.
5. **Sintaxis y Estructura Angular Actualizada:** Genera siempre Componentes Standalone (`standalone: true`). Utiliza el Control Flow moderno de Angular (`@if`, `@for`, `@switch`) en los templates para un código limpio, facilitando la creación de layouts complejos y dinámicos sin directivas estructurales antiguas.
6. **Interoperabilidad Estratégica (RxJS a Signals):** Mantén RxJS en la capa de servicios para llamadas HTTP o flujos asíncronos complejos, pero conviértelos inmediatamente a Signals usando `toSignal()` antes de consumirlos en el template. El template no debe tener `AsyncPipe`; debe consumir Signals directamente.
7. **Rendimiento Visual y Micro-interacciones:** Aprovecha que Signals notifica cambios directamente a la vista. Define transiciones suaves de CSS (`transition: all 0.3s ease-in-out`) para estados interactivos (`:hover`, `:focus`, `:active`) y ata estas animaciones a la mutación de un `signal` para lograr interacciones a 60fps.
8. **Contenido Realista:** Evita el *Lorem Ipsum*. Genera textos de relleno persuasivos y contextuales que demuestren cómo se verá la interfaz con datos reales.