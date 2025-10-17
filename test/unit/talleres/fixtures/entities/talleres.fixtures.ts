/**
 * Fixtures de talleres para pruebas unitarias
 */
import { TallerDto } from '../../../../../src/dto/talleres/taller.dto';

export const tallerVEHA03Toyota: TallerDto = {
  id: 1,
  nombre: 'DERCO PERU',
  nombreSucursal: 'SEDE JAVIER PRADO',
  direccion: 'AV. JAVIER PRADO ESTE 5268',
  distrito: 'LA MOLINA',
  telefono: '6197000',
  tipo: 'CONCESIONARIO',
  esMultimarca: false,
  marcasAtendidas: ['TOYOTA'],
  codigoRedTaller: 'VEHA03',
  categoriaTaller: 'Talleres Afiliados',
  latitud: -12.0731,
  longitud: -76.9598,
};

export const tallerVEHA03Multimarca: TallerDto = {
  id: 2,
  nombre: 'AUTOMOTORES GILDEMEISTER',
  nombreSucursal: 'SEDE LIMA',
  direccion: 'AV. REPÚBLICA DE PANAMA 3535',
  distrito: 'SAN ISIDRO',
  telefono: '4116100',
  tipo: 'MULTIMARCA',
  esMultimarca: true,
  marcasAtendidas: ['AUDI', 'BMW', 'HONDA', 'TOYOTA'],
  codigoRedTaller: 'VEHA03',
  categoriaTaller: 'Multimarcas Vehículos Ligeros',
  latitud: -12.0964,
  longitud: -77.0228,
};

export const tallerVEHA09: TallerDto = {
  id: 3,
  nombre: 'ASISTENCIA AUTOMOTRIZ',
  nombreSucursal: 'SEDE PRINCIPAL',
  direccion: 'AV. ARGENTINA 2833',
  distrito: 'LIMA',
  telefono: '4247575',
  tipo: 'MULTIMARCA',
  esMultimarca: true,
  marcasAtendidas: ['AUDI', 'BMW', 'HONDA', 'TOYOTA'],
  codigoRedTaller: 'VEHA09',
  latitud: -12.0564,
  longitud: -77.0528,
};

export const tallerVEHA10Audi: TallerDto = {
  id: 4,
  nombre: 'DIVEMOTOR',
  nombreSucursal: 'SEDE SURQUILLO',
  direccion: 'AV. CAMINOS DEL INCA 1369',
  distrito: 'SURQUILLO',
  telefono: '2116000',
  tipo: 'CONCESIONARIO',
  esMultimarca: false,
  marcasAtendidas: ['AUDI'],
  codigoRedTaller: 'VEHA10',
  latitud: -12.1131,
  longitud: -77.0098,
};

export const tallerConDistancia: TallerDto = {
  ...tallerVEHA03Toyota,
  distanciaKm: 2.5,
};

export const tallerAdicionalConValidacion: TallerDto = {
  id: 5,
  nombre: 'TALLER ADICIONAL TEST',
  nombreSucursal: 'SEDE TEST',
  direccion: 'AV. TEST 123',
  distrito: 'MIRAFLORES',
  tipo: 'MULTIMARCA',
  esMultimarca: true,
  marcasAtendidas: ['TOYOTA'],
  codigoRedTaller: 'VEHA03',
  categoriaTaller: 'Talleres Adicionales',
  requiereValidacionAntiguedad: true,
  aniosMaximosAntiguedad: 4,
  recargoDeducible: 50,
  requiereAprobacion: true,
  cumpleRequisitosAntiguedad: false,
};
