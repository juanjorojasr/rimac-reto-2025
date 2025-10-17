/**
 * Funciones auxiliares compartidas para TODAS las pruebas unitarias
 */
import { Test, TestingModule } from '@nestjs/testing';

/**
 * DNI del cliente de prueba usado en todos los tests
 */
export const DNI_CLIENTE_PRUEBA = '99999999';

/**
 * Crea un módulo de prueba genérico de NestJS
 * @param providers - Array de providers para el módulo de prueba
 * @returns TestingModule compilado
 */
export async function createTestingModule(providers: any[]): Promise<TestingModule> {
  return await Test.createTestingModule({
    providers,
  }).compile();
}

/**
 * Valida que un objeto tenga las propiedades requeridas
 * @param obj - Objeto a validar
 * @param requiredProperties - Array de nombres de propiedades requeridas
 */
export function validateObjectStructure(obj: any, requiredProperties: string[]): void {
  requiredProperties.forEach((prop) => {
    expect(obj).toHaveProperty(prop);
  });
}

/**
 * Valida que una respuesta tenga la estructura estándar de la API
 * @param response - Respuesta a validar
 */
export function validateApiResponse(response: any): void {
  expect(response).toHaveProperty('status');
  expect(response).toHaveProperty('code');
  expect(['success', 'fail', 'error']).toContain(response.status);
  expect(typeof response.code).toBe('number');
}

/**
 * Valida que una respuesta exitosa tenga datos
 * @param response - Respuesta a validar
 */
export function validateSuccessResponse(response: any): void {
  validateApiResponse(response);
  expect(response.status).toBe('success');
  expect(response).toHaveProperty('data');
}

/**
 * Valida que una respuesta de error tenga mensaje
 * @param response - Respuesta a validar
 */
export function validateErrorResponse(response: any): void {
  validateApiResponse(response);
  expect(response.status).toBe('error');
  expect(response).toHaveProperty('message');
}

/**
 * Resetea todos los mocks de un objeto mockeado
 * @param mockObject - Objeto con métodos mockeados
 */
export function resetAllMocks(mockObject: any): void {
  Object.values(mockObject).forEach((mock: any) => {
    if (jest.isMockFunction(mock)) {
      mock.mockReset();
    }
  });
}

/**
 * Crea un contexto de prueba genérico
 * @returns Objeto de contexto inicializado
 */
export function createTestContext<T = any>(): {
  dniCliente: string;
  request: T;
  result: any;
} {
  return {
    dniCliente: DNI_CLIENTE_PRUEBA,
    request: {} as T,
    result: null,
  };
}
