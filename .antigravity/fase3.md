## FASE 3: ORGANIZAR
**Resumen:** Poner cada cosa en su lugar. Esta fase crea los "contenedores" fiables: Calendario, Proyectos, Próximas Acciones (por contextos), A la Espera y Algún Día/Tal Vez.

### Historias de Usuario (Gherkin)

### HDU 11: Navegación por "Contextos Inteligentes" (@)
**Como** usuario enfocado en la ejecución,
**Quiero** ver mis próximas acciones agrupadas por contexto (@casa, @oficina),
**Para** solo ver lo que puedo hacer ahora.

### HDU 12: Gestión del "Hard Landscape" (Calendario Estricto)
**Como** purista de GTD,
**Quiero** que el sistema distinga estrictamente entre "Acciones" e "Eventos de Calendario".

### HDU 13: Jerarquía Plana de Proyectos
**Como** usuario que gestiona múltiples frentes,
**Quiero** tener una lista de Proyectos vinculados a sus próximas acciones.

### HDU 14: Tracking Dinámico de "A la Espera"
**Como** profesional que delega,
**Quiero** centralizar lo que espero de otros con tracking de fechas.

### HDU 15: La Incubadora (Algún Día / Tal Vez)
**Como** mente creativa,
**Quiero** un espacio seguro para ideas futuras sin que saturen mi día a día.

### Notas de Arquitectura UI/UX (Equipo)
1. **Contextual Dashboard:** En móvil, pestañas deslizables para contextos. En Desktop, layout de 3 columnas (Nav, Lista, Detalle).
2. **Jerarquía Visual:** El Calendario (Hard Landscape) usa bloques sólidos y rígidos. Las acciones (Soft Landscape) usan listas fluidas y ligeras.
3. **Indicadores de Salud:** Proyectos sin acciones deben mostrar un icono de alerta sutil (⚠️).
4. **IA Curadora:** La IA sugiere activar contextos basados en geolocalización o la hora (ej: destacar @recados cerca de un súper).