import type { RowDataPacket } from 'mysql2/promise';

/**
 * Interface VehiculoRow que retorna la query del repository
 */
export interface VehiculoRow extends RowDataPacket {
	id_vehiculo: number;
	id_poliza: number;
	poliza: string;
	placa: string;
	marca: string;
	modelo: string | null;
	anio: number | null;
	fecha_inicio_cobertura: Date;
	fecha_fin_cobertura: Date | null;
	antiguedad_vehiculo: number;
}

/**
 * Builder para crear VehiculoRow de prueba
 * Útil para mockear respuestas de queries en todos los tests
 */
export const crearVehiculoRow = (overrides?: Partial<Omit<VehiculoRow, 'constructor' | 'length'>>): VehiculoRow => {
	const defaults: VehiculoRow = {
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
		// propiedades de RowDataPacket
		constructor: {
			name: 'RowDataPacket',
		},
		length: 0,
	} as VehiculoRow;

	return { ...defaults, ...overrides };
};

/**
 * Fixture predefinida: Vehículo Toyota 0km (VEHA03)
 */
export const vehiculoToyota0km = (): VehiculoRow => crearVehiculoRow({
	id_vehiculo: 1,
	id_poliza: 1,
	poliza: '2101|001',
	placa: 'LGM001',
	marca: 'TOYOTA',
	modelo: 'COROLLA',
	anio: 2022,
	antiguedad_vehiculo: 3,
});

/**
 * Fixture predefinida: Vehículo Audi usado (VEHA09, VEHA10)
 */
export const vehiculoAudiUsado = (): VehiculoRow => crearVehiculoRow({
	id_vehiculo: 2,
	id_poliza: 2,
	poliza: '2101|058',
	placa: 'ABC777',
	marca: 'AUDI',
	modelo: 'A4',
	anio: 2019,
	antiguedad_vehiculo: 6,
});

/**
 * Fixture predefinida: Vehículo antiguo (>4 años)
 */
export const vehiculoAntiguo = (): VehiculoRow => crearVehiculoRow({
	id_vehiculo: 3,
	id_poliza: 1,
	poliza: '2101|001',
	placa: 'OLD999',
	marca: 'TOYOTA',
	modelo: 'YARIS',
	anio: 2015,
	antiguedad_vehiculo: 10,
});
