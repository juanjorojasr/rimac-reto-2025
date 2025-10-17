/**
 * Helpers específicos para pruebas del módulo Talleres
 */
import { Test, TestingModule } from '@nestjs/testing';
import { TalleresService } from '../../../../src/services/talleres.service';
import { TalleresRepository } from '../../../../src/repositories/talleres.repository';
import { TallerDto } from '../../../../src/dto/talleres/taller.dto';

/**
 * Crea un módulo de prueba con el servicio de talleres
 */
export async function createTalleresTestingModule(
  mockRepository: any,
): Promise<TestingModule> {
  return await Test.createTestingModule({
    providers: [
      TalleresService,
      {
        provide: TalleresRepository,
        useValue: mockRepository,
      },
    ],
  }).compile();
}

/**
 * Valida la estructura completa de un TallerDto
 */
export function validarEstructuraTaller(taller: any): void {
  expect(taller).toHaveProperty('id');
  expect(taller).toHaveProperty('nombre');
  expect(taller).toHaveProperty('nombreSucursal');
  expect(taller).toHaveProperty('direccion');
  expect(taller).toHaveProperty('distrito');
  expect(taller).toHaveProperty('tipo');
  expect(taller).toHaveProperty('esMultimarca');
  expect(taller).toHaveProperty('marcasAtendidas');
  expect(taller).toHaveProperty('codigoRedTaller');

  // Validaciones de tipo
  expect(typeof taller.id).toBe('number');
  expect(typeof taller.nombre).toBe('string');
  expect(typeof taller.esMultimarca).toBe('boolean');
  expect(Array.isArray(taller.marcasAtendidas)).toBe(true);
  expect(['VEHA03', 'VEHA09', 'VEHA10']).toContain(taller.codigoRedTaller);
}

/**
 * Valida que un taller sea de tipo multimarca
 */
export function validarTallerMultimarca(taller: TallerDto): void {
  expect(taller.esMultimarca).toBe(true);
}

/**
 * Valida que un taller sea de tipo concesionario
 */
export function validarTallerConcesionario(taller: TallerDto): void {
  expect(taller.tipo).toMatch(/CONCESIONARIO|SERVICIO ESPECIALIZADO/i);
}

/**
 * Valida que un taller tenga información de distancia
 */
export function validarTallerConDistancia(taller: TallerDto): void {
  expect(taller).toHaveProperty('distanciaKm');
  expect(typeof taller.distanciaKm).toBe('number');
  expect(taller.distanciaKm).toBeGreaterThanOrEqual(0);
}

/**
 * Valida que un taller pertenezca a una red VEHA específica
 */
export function validarRedVEHA(taller: TallerDto, codigoRed: string): void {
  expect(taller.codigoRedTaller).toBe(codigoRed);
}
