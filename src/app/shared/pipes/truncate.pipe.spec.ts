import { TruncatePipe } from './truncate.pipe';

describe('TruncatePipe', () => {
  let pipe: TruncatePipe;

  beforeEach(() => {
    pipe = new TruncatePipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return empty string for null', () => {
    expect(pipe.transform(null)).toBe('');
  });

  it('should return empty string for undefined', () => {
    expect(pipe.transform(undefined)).toBe('');
  });

  it('should return the same string if shorter than maxLength', () => {
    expect(pipe.transform('Hola mundo', 50)).toBe('Hola mundo');
  });

  it('should return the same string if exactly maxLength', () => {
    expect(pipe.transform('12345', 5)).toBe('12345');
  });

  it('should truncate and add ellipsis when longer than maxLength', () => {
    const result = pipe.transform('Este es un texto largo que necesita ser cortado', 20);
    expect(result).toBe('Este es un texto lar...');
    expect(result.length).toBeLessThanOrEqual(20 + 3); // maxLength + suffix
  });

  it('should use custom suffix', () => {
    const result = pipe.transform('Texto largo para probar', 10, ' →');
    expect(result).toBe('Texto larg →');
  });

  it('should default maxLength to 100', () => {
    const longText = 'a'.repeat(150);
    const result = pipe.transform(longText);
    expect(result.length).toBe(103); // 100 + '...'
  });

  it('should trim trailing whitespace before adding suffix', () => {
    const result = pipe.transform('Hola   mundo bonito', 7);
    // 'Hola   ' → trimEnd → 'Hola' + '...'
    expect(result).toBe('Hola...');
  });
});
