/**
 * Fixtures de vehículos para pruebas unitarias
 */

export const vehiculoToyotaNuevo = {
  id_vehiculo: 1,
  id_poliza: 1,
  poliza: '2101|001',
  placa: 'LGM001',
  marca: 'TOYOTA',
  modelo: 'COROLLA',
  anio: 2022,
  fecha_inicio_cobertura: new Date('2024-01-01'),
  fecha_fin_cobertura: new Date('2025-12-31'),
  antiguedad_vehiculo: 3,
};

export const vehiculoAudiUsado = {
  id_vehiculo: 2,
  id_poliza: 2,
  poliza: '2101|058',
  placa: 'ABC777',
  marca: 'AUDI',
  modelo: 'A4',
  anio: 2019,
  fecha_inicio_cobertura: new Date('2024-01-01'),
  fecha_fin_cobertura: new Date('2025-12-31'),
  antiguedad_vehiculo: 6,
};

export const vehiculoSinCobertura = {
  id_vehiculo: 3,
  id_poliza: 3,
  poliza: '2101|999',
  placa: 'XYZ999',
  marca: 'HONDA',
  modelo: 'CIVIC',
  anio: 2020,
  fecha_inicio_cobertura: new Date('2023-01-01'),
  fecha_fin_cobertura: new Date('2023-12-31'), // Cobertura vencida
  antiguedad_vehiculo: 5,
};
