/**
 * Fixtures de requests para búsqueda de talleres
 */
import { BuscarTalleresReqDto } from '../../../../../src/dto/talleres/buscar-talleres.req.dto';

export const requestConPlaca: BuscarTalleresReqDto = {
  placa: 'LGM001',
};

export const requestSinPlaca: BuscarTalleresReqDto = {};

export const requestConDistrito: BuscarTalleresReqDto = {
  placa: 'LGM001',
  distrito: 'LA MOLINA',
};

export const requestConTipoMultimarca: BuscarTalleresReqDto = {
  placa: 'LGM001',
  tipoTaller: 'MULTIMARCA',
};

export const requestConTipoConcesionario: BuscarTalleresReqDto = {
  placa: 'ABC777',
  tipoTaller: 'CONCESIONARIO',
};

export const requestConGeolocalizacion: BuscarTalleresReqDto = {
  placa: 'LGM001',
  latitud: -12.0731,
  longitud: -76.9598,
  radioKm: 10,
  top: 5,
};

export const requestCompleto: BuscarTalleresReqDto = {
  placa: 'LGM001',
  distrito: 'SAN ISIDRO',
  tipoTaller: 'MULTIMARCA',
  latitud: -12.0964,
  longitud: -77.0228,
  radioKm: 5,
  top: 10,
};
