import { TestBed } from '@angular/core/testing';
import { GhostTagService } from './ghost-tag.service';

describe('GhostTagService (Regex/NLU Local)', () => {
  let service: GhostTagService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GhostTagService);
  });

  it('should return empty array for empty inputs', () => {
    expect(service.parseText('')).toEqual([]);
    expect(service.parseText('    ')).toEqual([]);
  });

  it('should detect context tags with @ symbols', () => {
    const tags = service.parseText('Recordar enviar un email a mi jefe @oficina usando el @computador');
    
    expect(tags).toContainEqual(expect.objectContaining({ type: 'context', value: 'oficina', raw: '@oficina' }));
    expect(tags).toContainEqual(expect.objectContaining({ type: 'context', value: 'computador', raw: '@computador' }));
  });

  it('should handle special characters in context tags', () => {
    const tags = service.parseText('Revisar facturación con @maría o @niños');
    
    expect(tags).toContainEqual(expect.objectContaining({ type: 'context', value: 'maría' }));
    expect(tags).toContainEqual(expect.objectContaining({ type: 'context', value: 'niños' }));
  });

  it('should detect natural date phrases as date tags', () => {
    const tags = service.parseText('Tengo que comprar pan mañana en la panadería, y llamar el LUNES.');
    
    expect(tags).toHaveLength(2);
    expect(tags).toContainEqual(expect.objectContaining({ type: 'date', value: 'mañana', raw: 'mañana' }));
    // Valida que el keyword sale en minúscula pero el raw respetó el original "LUNES"
    expect(tags).toContainEqual(expect.objectContaining({ type: 'date', value: 'lunes', raw: 'LUNES' }));
  });

  it('should intelligently detect proper nouns/persons with prepositions', () => {
    const tags = service.parseText('Hay que hablar con Marta sobre el proyecto para enviar correcciones a José.');
    
    expect(tags).toHaveLength(2);
    expect(tags).toContainEqual(expect.objectContaining({ type: 'person', value: 'Marta', raw: 'con Marta' }));
    expect(tags).toContainEqual(expect.objectContaining({ type: 'person', value: 'José', raw: 'a José' }));
  });

  it('should avoid duplicating the exact same tag in the results', () => {
    const tags = service.parseText('Iré @oficina en la mañana y en la tarde estaré otra vez en @oficina con Marta. Traer pan mañana.');
    
    const oficinas = tags.filter(t => t.type === 'context' && t.value === 'oficina');
    const mananas = tags.filter(t => t.type === 'date' && t.value === 'mañana');
    
    expect(oficinas.length).toBe(1);
    expect(mananas.length).toBe(1); // Detectó dos "mañana", pero consolidó a uno.
  });
});
