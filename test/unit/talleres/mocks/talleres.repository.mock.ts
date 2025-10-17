/**
 * Mock del repositorio de talleres
 */
import { TallerDto } from '../../../../src/dto/talleres/taller.dto';

export const createMockTalleresRepository = () => ({
  obtenerVehiculoPorPlaca: jest.fn(),
  buscarPorClienteYFiltros: jest.fn(),
});

export type MockTalleresRepository = ReturnType<typeof createMockTalleresRepository>;
