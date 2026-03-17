## FASE 2: ACLARAR (PROCESAR)
**Resumen:** Se trata de decidir qué significa cada cosa capturada. El sistema obliga al usuario a procesar de uno en uno los elementos del Inbox, aplicando el algoritmo de GTD: ¿Es accionable? -> Si no: Basura/Referencia/Incubar. -> Si sí: ¿Próxima acción?

### Historias de Usuario (Gherkin)

### HDU 06: Interfaz de Procesamiento Focalizado
**Como** usuario con una bandeja de entrada llena,
**Quiero** procesar los elementos de uno en uno en una interfaz sin distracciones,
**Para** cumplir con la regla GTD de no devolver nada al "Inbox".

### HDU 07: Asistente de la "Regla de los 2 Minutos" (IA)
**Como** usuario que busca agilidad,
**Quiero** que la IA estime si una tarea requiere menos de 2 minutos,
**Para** ejecutarla inmediatamente.

### HDU 08: Definición de la "Próxima Acción" y Proyectos
**Como** usuario que procesa un compromiso complejo,
**Quiero** que el sistema me obligue a definir una acción física y visible,
**Para** evitar que los elementos queden estancados.

### HDU 09: Delegación Inteligente (Lista de "A la Espera")
**Como** usuario que trabaja en equipo o familia,
**Quiero** asignar tareas a otros de forma fluida durante el proceso de aclarado.

### HDU 10: Clasificación de No Accionables
**Como** usuario procesando información,
**Quiero** descartar o archivar rápidamente lo que no requiere acción inmediata.

### Notas de Arquitectura UI/UX (Equipo)
1. **Layout:** Patrón de "Tarjetas Apiladas" (Single-item view). No mostrar el ítem 2 hasta decidir sobre el ítem 1.
2. **Progressive Disclosure:** Botones dinámicos que se revelan según el flujo (¿Es accionable? -> Sí -> ¿Toma -2min?).
3. **Fricción Positiva:** Bloquear el guardado de un "Proyecto" si el usuario no define una "Próxima Acción" física.
4. **IA Predictiva:** Resaltar el botón "Hacer ahora" si la IA detecta una tarea simple y corta.
5. **Atajos:** `E` (Eliminar), `I` (Incubar), `Enter` (Siguiente paso).