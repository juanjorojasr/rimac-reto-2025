import type { RowDataPacket } from 'mysql2/promise';

/**
 * Interface TallerRow que retorna la query del repository
 */
export interface TallerRow extends RowDataPacket {
	id: number;
	nombre: string;
	nombre_sucursal: string;
	direccion: string;
	distrito: string;
	tipo: string;
	es_multimarca: number;
	codigo_red_taller: string;
	categoria_taller: string | null;
	categoria_orden: number | null;
	telefono: string | null;
	latitud: number | null;
	longitud: number | null;
	marcas: string | null;
	requiere_validacion_antiguedad: number | null;
	anios_maximos_antiguedad: number | null;
	recargo_deducible: number | null;
	requiere_aprobacion: number | null;
	anio_vehiculo: number | null;
	es_vehiculo_nuevo: number | null;
	distancia_km?: number | null;
}

/**
 * Builder para crear TallerRow de prueba
 * Útil para mockear respuestas de queries en todos los tests
 */
export const crearTallerRow = (overrides?: Partial<Omit<TallerRow, 'constructor' | 'length'>>): TallerRow => {
	const defaults: TallerRow = {
		id: 1,
		nombre: 'TALLER DE PRUEBA',
		nombre_sucursal: 'SUCURSAL PRINCIPAL',
		direccion: 'AV. PRINCIPAL 123',
		distrito: 'SAN ISIDRO',
		tipo: 'CONCESIONARIO',
		es_multimarca: 0,
		codigo_red_taller: 'VEHA03',
		categoria_taller: 'Talleres Afiliados',
		categoria_orden: 1,
		telefono: '987654321',
		latitud: -12.0897,
		longitud: -77.0436,
		marcas: 'TOYOTA',
		requiere_validacion_antiguedad: null,
		anios_maximos_antiguedad: null,
		recargo_deducible: null,
		requiere_aprobacion: null,
		anio_vehiculo: null,
		es_vehiculo_nuevo: null,
		distancia_km: null,
		// propiedades de RowDataPacket
		constructor: {
			name: 'RowDataPacket',
		},
		length: 0,
	} as TallerRow;

	return { ...defaults, ...overrides };
};

/**
 * Fixture: Taller Afiliado Toyota (VEHA03)
 */
export const tallerAfiliadoToyota = (): TallerRow => crearTallerRow({
	id: 1,
	nombre: 'AUTOELITE',
	nombre_sucursal: 'SAN ISIDRO',
	direccion: 'AV. JAVIER PRADO ESTE 8045',
	distrito: 'SAN ISIDRO',
	tipo: 'CONCESIONARIO',
	es_multimarca: 0,
	codigo_red_taller: 'VEHA03',
	categoria_taller: 'Talleres Afiliados',
	categoria_orden: 1,
	telefono: '963456789',
	latitud: -12.0897,
	longitud: -77.0436,
	marcas: 'TOYOTA',
});

/**
 * Fixture: Taller Multimarca (VEHA03 y VEHA09)
 */
export const tallerMultimarca = (): TallerRow => crearTallerRow({
	id: 2,
	nombre: 'ASISTENCIA AUTOMOTRIZ',
	nombre_sucursal: 'LINCE',
	direccion: 'AV. ARENALES 2850',
	distrito: 'LINCE',
	tipo: null,
	es_multimarca: 1,
	codigo_red_taller: 'VEHA03',
	categoria_taller: 'Multimarcas Vehículos Ligeros',
	categoria_orden: 2,
	telefono: '987123456',
	latitud: -12.0840,
	longitud: -77.0405,
	marcas: 'AUDI,BMW,CHEVROLET,FORD,HONDA,HYUNDAI,KIA,MAZDA,NISSAN,PEUGEOT,RENAULT,TOYOTA,VOLKSWAGEN',
});

/**
 * Fixture: Taller Adicional con validación antigüedad (VEHA03)
 */
export const tallerAdicionalConValidacion = (): TallerRow => crearTallerRow({
	id: 3,
	nombre: 'PERUVIAN AUTO CENTER',
	nombre_sucursal: 'MIRAFLORES',
	direccion: 'AV. BENAVIDES 3580',
	distrito: 'MIRAFLORES',
	tipo: null,
	es_multimarca: 1,
	codigo_red_taller: 'VEHA03',
	categoria_taller: 'Talleres Adicionales',
	categoria_orden: 3,
	telefono: '965432100',
	latitud: -12.1189,
	longitud: -77.0289,
	marcas: 'AUDI,BMW,CHEVROLET,FORD,HONDA,HYUNDAI,KIA,MAZDA,NISSAN,PEUGEOT,RENAULT,TOYOTA,VOLKSWAGEN',
	requiere_validacion_antiguedad: 1,
	anios_maximos_antiguedad: 4,
	recargo_deducible: 50.0,
	requiere_aprobacion: 1,
	anio_vehiculo: 2022,
	es_vehiculo_nuevo: 1,
});

/**
 * Fixture: Taller Afiliado Audi (VEHA10)
 */
export const tallerAfiliadoAudi = (): TallerRow => crearTallerRow({
	id: 4,
	nombre: 'MOTORMAX AUTOS',
	nombre_sucursal: 'SURCO',
	direccion: 'AV. CAMINOS DEL INCA 1385',
	distrito: 'SANTIAGO DE SURCO',
	tipo: 'CONCESIONARIO',
	es_multimarca: 0,
	codigo_red_taller: 'VEHA10',
	categoria_taller: null,
	categoria_orden: null,
	telefono: '987000111',
	latitud: -12.1350,
	longitud: -77.0050,
	marcas: 'AUDI',
});

/**
 * Fixture: Taller con distancia calculada
 */
export const tallerConDistancia = (distanciaKm: number): TallerRow => crearTallerRow({
	id: 5,
	nombre: 'TALLER CERCANO',
	nombre_sucursal: 'LOCAL UNICO',
	direccion: 'AV. CERCANA 100',
	distrito: 'SAN BORJA',
	tipo: null,
	es_multimarca: 1,
	codigo_red_taller: 'VEHA09',
	categoria_taller: null,
	categoria_orden: null,
	latitud: -12.0900,
	longitud: -77.0400,
	marcas: 'AUDI,BMW,CHEVROLET,FORD,HONDA,HYUNDAI,KIA,MAZDA,NISSAN,PEUGEOT,RENAULT,TOYOTA,VOLKSWAGEN',
	distancia_km: distanciaKm,
});
