/**
 * Helpers específicos para pruebas del módulo Deducibles
 * (Preparado para implementación futura)
 */
import { Test, TestingModule } from '@nestjs/testing';

/**
 * Crea un módulo de prueba con el servicio de deducibles
 */
export async function createDeduciblesTestingModule(
  mockService: any,
): Promise<TestingModule> {
  // TODO: Implementar cuando se creen las pruebas de deducibles
  return await Test.createTestingModule({
    providers: [],
  }).compile();
}

/**
 * Valida la estructura de un deducible parseado
 */
export function validarEstructuraDeducible(deducible: any): void {
  expect(deducible).toHaveProperty('deducible');
  expect(deducible).toHaveProperty('copago');
  expect(deducible).toHaveProperty('moneda');
  expect(deducible).toHaveProperty('tipo');
  expect(deducible).toHaveProperty('marca');
  expect(deducible).toHaveProperty('taller');
}

/**
 * Valida que un porcentaje de deducible sea válido
 */
export function validarPorcentajeDeducible(porcentaje: string): void {
  expect(porcentaje).toMatch(/^\d+(\.\d+)?%$/);
  const valor = parseFloat(porcentaje);
  expect(valor).toBeGreaterThan(0);
  expect(valor).toBeLessThanOrEqual(100);
}

/**
 * Valida que un copago tenga formato correcto
 */
export function validarCopago(copago: number): void {
  expect(typeof copago).toBe('number');
  expect(copago).toBeGreaterThanOrEqual(0);
}

/**
 * Valida que la moneda sea válida
 */
export function validarMoneda(moneda: string): void {
  expect(['USD', 'PEN']).toContain(moneda);
}
