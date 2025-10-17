import type { RowDataPacket } from 'mysql2/promise';

/**
 * Mock genérico del DatabaseHelper
 * Compartido entre todos los módulos que requieran acceso a BD
 */
export const createMockDatabaseHelper = () => ({
  query: jest.fn(),
  queryOne: jest.fn(),
  execute: jest.fn(),
  getConnection: jest.fn(),
});

export type MockDatabaseHelper = ReturnType<typeof createMockDatabaseHelper>;

/**
 * Helper para configurar respuesta de queryOne()
 * Útil para mockear métodos del repository que usan queryOne()
 *
 * @example
 * mockQueryOne(mockDbHelper, vehiculoToyota0km());
 */
export const mockQueryOne = <T extends RowDataPacket>(
  mockDb: MockDatabaseHelper,
  result: T | null,
): void => {
  mockDb.queryOne.mockResolvedValueOnce(result);
};

/**
 * Helper para configurar respuesta de query() con array de resultados
 * Útil para mockear métodos del repository que usan query()
 *
 * @example
 * mockQuery(mockDbHelper, [tallerAfiliadoToyota(), tallerMultimarca()]);
 */
export const mockQuery = <T extends RowDataPacket>(
  mockDb: MockDatabaseHelper,
  results: T[],
): void => {
  mockDb.query.mockResolvedValueOnce(results);
};

/**
 * Helper para configurar múltiples respuestas secuenciales de query()
 * Útil cuando un test llama query() varias veces
 *
 * @example
 * mockQuerySequence(mockDbHelper, [
 *   [vehiculoToyota0km(), vehiculoAudiUsado()],
 *   [tallerAfiliadoToyota()],
 * ]);
 */
export const mockQuerySequence = <T extends RowDataPacket>(
  mockDb: MockDatabaseHelper,
  resultsSequence: T[][],
): void => {
  resultsSequence.forEach(results => {
    mockDb.query.mockResolvedValueOnce(results);
  });
};

/**
 * Helper para verificar que se llamó queryOne con la query esperada
 *
 * @example
 * expectQueryOneCalled(mockDbHelper, 'SELECT', ['99999999', 'LGM001']);
 */
export const expectQueryOneCalled = (
  mockDb: MockDatabaseHelper,
  queryContains: string,
  params?: any[],
): void => {
  expect(mockDb.queryOne).toHaveBeenCalledWith(
    expect.stringContaining(queryContains),
    params || expect.any(Array),
  );
};

/**
 * Helper para verificar que se llamó query con la query esperada
 *
 * @example
 * expectQueryCalled(mockDbHelper, 'SELECT', ['99999999']);
 */
export const expectQueryCalled = (
  mockDb: MockDatabaseHelper,
  queryContains: string,
  params?: any[],
): void => {
  expect(mockDb.query).toHaveBeenCalledWith(
    expect.stringContaining(queryContains),
    params || expect.any(Array),
  );
};

/**
 * Helper para resetear todos los mocks del DatabaseHelper
 * Útil en beforeEach() para limpiar estado entre tests
 *
 * @example
 * resetMockDatabase(mockDbHelper);
 */
export const resetMockDatabase = (mockDb: MockDatabaseHelper): void => {
  mockDb.query.mockClear();
  mockDb.queryOne.mockClear();
  mockDb.execute.mockClear();
  mockDb.getConnection.mockClear();
};
