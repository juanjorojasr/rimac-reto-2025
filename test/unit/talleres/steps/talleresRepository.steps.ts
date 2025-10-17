import { defineFeature, loadFeature } from 'jest-cucumber';
import { TalleresRepository } from '@/repositories/talleres.repository';
import {
	createMockDatabaseHelper,
	mockQuery,
	mockQueryOne,
	mockQuerySequence,
	resetMockDatabase,
	type MockDatabaseHelper,
} from '@test/unit/shared/mocks/database.helper.mock';
import {
	crearVehiculoRow,
	vehiculoToyota0km,
	vehiculoAudiUsado,
	crearTallerRow,
	tallerAfiliadoToyota,
	tallerMultimarca,
	tallerAdicionalConValidacion,
	tallerConDistancia,
	type VehiculoRow,
	type TallerRow,
} from '@test/unit/shared/fixtures/database';
import type { TallerDto } from '@/dto/talleres/taller.dto';

const feature = loadFeature('test/unit/talleres/features/talleresRepository.feature');

defineFeature(feature, (test) => {
	let repository: TalleresRepository;
	let mockDbHelper: MockDatabaseHelper;
	let result: any;
	let dniCliente: string;
	let placa: string;
	let idPoliza: number;
	let distrito: string;
	let tipoTaller: string;
	let latitud: number;
	let longitud: number;
	let radioKm: number;
	let top: number;

	beforeEach(() => {
		mockDbHelper = createMockDatabaseHelper();
		repository = new TalleresRepository(mockDbHelper as any);

		result = undefined;
		dniCliente = '';
		placa = '';
		idPoliza = 0;
		distrito = '';
		tipoTaller = '';
		latitud = 0;
		longitud = 0;
		radioKm = 0;
		top = 0;
	});

	afterEach(() => {
		resetMockDatabase(mockDbHelper);
	});

	test('Obtener vehículo existente por placa', ({ given, and, when, then }) => {
		given('un cliente con DNI "99999999"', () => {
			dniCliente = '99999999';
		});

		and('un vehículo con placa "LGM001" con cobertura vigente', () => {
			placa = 'LGM001';
			mockQueryOne(mockDbHelper, vehiculoToyota0km());
		});

		when('consulto el vehículo por placa', async () => {
			result = await repository.obtenerVehiculoPorPlaca(placa, dniCliente);
		});

		then('la query debe ejecutarse correctamente', () => {
			expect(mockDbHelper.queryOne).toHaveBeenCalledTimes(1);
			expect(mockDbHelper.queryOne).toHaveBeenCalledWith(
				expect.stringContaining('SELECT'),
				[dniCliente, placa],
			);
		});

		and('debe retornar los datos del vehículo con marca y antigüedad', () => {
			expect(result).not.toBeNull();
			expect(result).toHaveProperty('placa', 'LGM001');
			expect(result).toHaveProperty('marca', 'TOYOTA');
			expect(result).toHaveProperty('antiguedad_vehiculo');
		});
	});

	test('Vehículo no encontrado por placa', ({ given, and, when, then }) => {
		given('un cliente con DNI "99999999"', () => {
			dniCliente = '99999999';
		});

		and('una placa inexistente "NOEXIST"', () => {
			placa = 'NOEXIST';
			mockQueryOne(mockDbHelper, null);
		});

		when('consulto el vehículo por placa', async () => {
			result = await repository.obtenerVehiculoPorPlaca(placa, dniCliente);
		});

		then('la query debe ejecutarse correctamente', () => {
			expect(mockDbHelper.queryOne).toHaveBeenCalledTimes(1);
		});

		and('debe retornar null', () => {
			expect(result).toBeNull();
		});
	});

	test('Búsqueda con placa específica (delega a buscarPorVehiculoEspecifico)', ({ given, and, when, then }) => {
		given('un cliente con DNI "99999999"', () => {
			dniCliente = '99999999';
		});

		and('filtros con idPoliza 1 y placa "LGM001"', () => {
			idPoliza = 1;
			placa = 'LGM001';
			mockQuery(mockDbHelper, [tallerAfiliadoToyota(), tallerMultimarca()]);
		});

		when('busco talleres con filtros', async () => {
			result = await repository.buscarPorClienteYFiltros(
				dniCliente,
				idPoliza,
				placa,
			);
		});

		then('debe llamar al método buscarPorVehiculoEspecifico', () => {
			expect(mockDbHelper.query).toHaveBeenCalled();
		});

		and('debe retornar talleres compatibles con el vehículo', () => {
			expect(result).toBeDefined();
			expect(Array.isArray(result)).toBe(true);
		});
	});

	test('Búsqueda sin placa (delega a buscarPorTodosLosVehiculos)', ({ given, and, when, then }) => {
		given('un cliente con DNI "99999999"', () => {
			dniCliente = '99999999';
		});

		and('filtros sin placa específica', () => {
			mockQuery(mockDbHelper, [vehiculoToyota0km(), vehiculoAudiUsado()]);
			mockQuerySequence(mockDbHelper, [
				[tallerAfiliadoToyota()],
				[tallerMultimarca()],
			]);
		});

		when('busco talleres con filtros', async () => {
			result = await repository.buscarPorClienteYFiltros(dniCliente);
		});

		then('debe llamar al método buscarPorTodosLosVehiculos', () => {
			expect(mockDbHelper.query).toHaveBeenCalledTimes(3); // 1 obtenerVehiculos + 2 buscarPorVehiculo
		});

		and('debe retornar talleres compatibles con todos los vehículos', () => {
			expect(result).toBeDefined();
			expect(Array.isArray(result)).toBe(true);
		});
	});

	test('Búsqueda de talleres para vehículo específico con filtros básicos', ({ given, and, when, then }) => {
		given('un cliente con DNI "99999999"', () => {
			dniCliente = '99999999';
		});

		and('un vehículo Toyota con idPoliza 1 y placa "LGM001"', () => {
			idPoliza = 1;
			placa = 'LGM001';
		});

		and('filtros de distrito "SAN ISIDRO"', () => {
			distrito = 'SAN ISIDRO';
			mockQuery(mockDbHelper, [tallerAfiliadoToyota()]);
		});

		when('busco talleres para el vehículo específico', async () => {
			result = await repository.buscarPorClienteYFiltros(
				dniCliente,
				idPoliza,
				placa,
				distrito,
			);
		});

		then('debe ejecutar query con JOIN de pólizas y vehículos', () => {
			expect(mockDbHelper.query).toHaveBeenCalledWith(
				expect.stringContaining('INNER JOIN polizas'),
				expect.any(Array),
			);
		});

		and('debe filtrar talleres por compatibilidad de marca', () => {
			expect(mockDbHelper.query).toHaveBeenCalledWith(
				expect.stringContaining('es_multimarca'),
				expect.any(Array),
			);
		});

		and('debe aplicar filtro de distrito', () => {
			expect(mockDbHelper.query).toHaveBeenCalledWith(
				expect.stringContaining('s.distrito = ?'),
				expect.arrayContaining(['99999999', 1, 'LGM001', 'SAN ISIDRO']),
			);
		});

		and('debe retornar talleres únicos sin duplicados', () => {
			expect(result).toBeDefined();
			expect(Array.isArray(result)).toBe(true);
		});
	});

	test('Búsqueda con geolocalización y cálculo de distancia', ({ given, and, when, then }) => {
		given('un cliente con DNI "99999999"', () => {
			dniCliente = '99999999';
		});

		and('un vehículo Toyota con idPoliza 1 y placa "LGM001"', () => {
			idPoliza = 1;
			placa = 'LGM001';
		});

		and('coordenadas latitud -12.0897 y longitud -77.0436', () => {
			latitud = -12.0897;
			longitud = -77.0436;
		});

		and('radio de búsqueda de 10 km', () => {
			radioKm = 10;
			mockQuery(mockDbHelper, [tallerConDistancia(5.2)]);
		});

		when('busco talleres para el vehículo específico', async () => {
			result = await repository.buscarPorClienteYFiltros(
				dniCliente,
				idPoliza,
				placa,
				undefined,
				undefined,
				latitud,
				longitud,
				radioKm,
			);
		});

		then('debe incluir fórmula Haversine en el SELECT', () => {
			expect(mockDbHelper.query).toHaveBeenCalledWith(
				expect.stringContaining('6371 * acos'),
				expect.any(Array),
			);
		});

		and('debe aplicar Bounding Box en el WHERE', () => {
			expect(mockDbHelper.query).toHaveBeenCalledWith(
				expect.stringContaining('s.latitud BETWEEN'),
				expect.any(Array),
			);
		});

		and('debe ordenar por distancia ascendente', () => {
			expect(mockDbHelper.query).toHaveBeenCalledWith(
				expect.stringContaining('ORDER BY distancia_km ASC'),
				expect.any(Array),
			);
		});

		and('debe filtrar talleres dentro del radio con HAVING', () => {
			expect(mockDbHelper.query).toHaveBeenCalledWith(
				expect.stringContaining('HAVING distancia_km <= 10'),
				expect.any(Array),
			);
		});
	});

	test('Búsqueda con top limitando resultados', ({ given, and, when, then }) => {
		given('un cliente con DNI "99999999"', () => {
			dniCliente = '99999999';
		});

		and('un vehículo Toyota con idPoliza 1 y placa "LGM001"', () => {
			idPoliza = 1;
			placa = 'LGM001';
		});

		and('límite top de 5 talleres', () => {
			top = 5;
			mockQuery(mockDbHelper, [tallerAfiliadoToyota()]);
		});

		when('busco talleres para el vehículo específico', async () => {
			result = await repository.buscarPorClienteYFiltros(
				dniCliente,
				idPoliza,
				placa,
				undefined,
				undefined,
				undefined,
				undefined,
				undefined,
				top,
			);
		});

		then('debe aplicar LIMIT 5 en la query', () => {
			expect(mockDbHelper.query).toHaveBeenCalledWith(
				expect.stringContaining('LIMIT 5'),
				expect.any(Array),
			);
		});

		and('debe retornar máximo 5 talleres', () => {
			expect(result.length).toBeLessThanOrEqual(5);
		});
	});

	test('Búsqueda filtrando por tipo de taller Multimarca', ({ given, and, when, then }) => {
		given('un cliente con DNI "99999999"', () => {
			dniCliente = '99999999';
		});

		and('un vehículo Toyota con idPoliza 1 y placa "LGM001"', () => {
			idPoliza = 1;
			placa = 'LGM001';
		});

		and('filtro de tipo "MULTIMARCA"', () => {
			tipoTaller = 'MULTIMARCA';
			mockQuery(mockDbHelper, [tallerMultimarca()]);
		});

		when('busco talleres para el vehículo específico', async () => {
			result = await repository.buscarPorClienteYFiltros(
				dniCliente,
				idPoliza,
				placa,
				undefined,
				tipoTaller,
			);
		});

		then('debe agregar condición es_multimarca = TRUE', () => {
			expect(mockDbHelper.query).toHaveBeenCalledWith(
				expect.stringContaining('t.es_multimarca = TRUE'),
				expect.any(Array),
			);
		});

		and('debe retornar solo talleres multimarca', () => {
			expect(result).toBeDefined();
			expect(result.every((t: TallerDto) => t.esMultimarca === true)).toBe(true);
		});
	});

	test('Búsqueda filtrando por tipo Concesionario', ({ given, and, when, then }) => {
		given('un cliente con DNI "99999999"', () => {
			dniCliente = '99999999';
		});

		and('un vehículo Toyota con idPoliza 1 y placa "LGM001"', () => {
			idPoliza = 1;
			placa = 'LGM001';
		});

		and('filtro de tipo "CONCESIONARIO"', () => {
			tipoTaller = 'CONCESIONARIO';
			mockQuery(mockDbHelper, [tallerAfiliadoToyota()]);
		});

		when('busco talleres para el vehículo específico', async () => {
			result = await repository.buscarPorClienteYFiltros(
				dniCliente,
				idPoliza,
				placa,
				undefined,
				tipoTaller,
			);
		});

		then('debe agregar condición tipo CONCESIONARIO o SERVICIO_ESPECIALIZADO', () => {
			expect(mockDbHelper.query).toHaveBeenCalledWith(
				expect.stringContaining("t.tipo = 'CONCESIONARIO'"),
				expect.any(Array),
			);
		});

		and('debe retornar solo concesionarios', () => {
			expect(result).toBeDefined();
			expect(result.every((t: TallerDto) => t.tipo === 'CONCESIONARIO')).toBe(true);
		});
	});

	test('Búsqueda filtrando por tipo exacto de BD (SERVICIO_ESPECIALIZADO)', ({ given, and, when, then }) => {
		given('un cliente con DNI "99999999"', () => {
			dniCliente = '99999999';
		});

		and('un vehículo Toyota con idPoliza 1 y placa "LGM001"', () => {
			idPoliza = 1;
			placa = 'LGM001';
		});

		and('filtro de tipo exacto "SERVICIO_ESPECIALIZADO"', () => {
			tipoTaller = 'SERVICIO_ESPECIALIZADO';
			mockQuery(mockDbHelper, [
				crearTallerRow({ tipo: 'SERVICIO_ESPECIALIZADO', nombre: 'SERVICIO TOYOTA' })
			]);
		});

		when('busco talleres para el vehículo específico', async () => {
			result = await repository.buscarPorClienteYFiltros(
				dniCliente,
				idPoliza,
				placa,
				undefined,
				tipoTaller,
			);
		});

		then('debe agregar condición tipo exacto con parámetro', () => {
			expect(mockDbHelper.query).toHaveBeenCalledWith(
				expect.stringContaining('t.tipo = ?'),
				expect.arrayContaining(['SERVICIO_ESPECIALIZADO']),
			);
		});

		and('debe retornar talleres del tipo especificado', () => {
			expect(result).toBeDefined();
			expect(result.every((t: TallerDto) => t.tipo === 'SERVICIO_ESPECIALIZADO')).toBe(true);
		});
	});

	test('Búsqueda combinada para múltiples vehículos', ({ given, and, when, then }) => {
		given('un cliente con DNI "99999999"', () => {
			dniCliente = '99999999';
		});

		and('el cliente tiene 2 vehículos con cobertura activa', () => {
			mockQuery(mockDbHelper, [vehiculoToyota0km(), vehiculoAudiUsado()]);
			const taller1 = tallerMultimarca();
			const taller2 = { ...tallerMultimarca() };
			mockQuerySequence(mockDbHelper, [[taller1], [taller2]]);
		});

		when('busco talleres para todos los vehículos', async () => {
			result = await repository.buscarPorClienteYFiltros(dniCliente);
		});

		then('debe obtener lista de vehículos del cliente', () => {
			expect(mockDbHelper.query).toHaveBeenCalledWith(
				expect.stringContaining('FROM vehiculos v'),
				['99999999'],
			);
		});

		and('debe buscar talleres para cada vehículo', () => {
			expect(mockDbHelper.query).toHaveBeenCalledTimes(3); // 1 obtenerVehiculos + 2 buscarPorVehiculo
		});

		and('debe agrupar talleres por nombre y dirección', () => {
			expect(result.length).toBe(1);
		});

		and('debe agregar campo placasAtendidas con array de placas', () => {
			expect(result[0]).toHaveProperty('placasAtendidas');
			expect(Array.isArray(result[0].placasAtendidas)).toBe(true);
			expect(result[0].placasAtendidas).toContain('LGM001');
			expect(result[0].placasAtendidas).toContain('ABC777');
		});
	});

	test('Búsqueda para todos con geolocalización', ({ given, and, when, then }) => {
		given('un cliente con DNI "99999999"', () => {
			dniCliente = '99999999';
		});

		and('el cliente tiene 2 vehículos con cobertura activa', () => {
			mockQuery(mockDbHelper, [vehiculoToyota0km(), vehiculoAudiUsado()]);
		});

		and('coordenadas latitud -12.0897 y longitud -77.0436', () => {
			latitud = -12.0897;
			longitud = -77.0436;
			const taller1 = crearTallerRow({ id: 10, nombre: 'TALLER LEJANO', distancia_km: 8.5 });
			const taller2 = crearTallerRow({ id: 20, nombre: 'TALLER CERCANO', distancia_km: 3.2 });
			const taller3 = crearTallerRow({ id: 30, nombre: 'TALLER MEDIO', distancia_km: 5.0 });
			mockQuerySequence(mockDbHelper, [
				[taller1, taller2],
				[taller3],
			]);
		});

		when('busco talleres para todos los vehículos', async () => {
			result = await repository.buscarPorClienteYFiltros(
				dniCliente,
				undefined,
				undefined,
				undefined,
				undefined,
				latitud,
				longitud,
			);
		});

		then('debe buscar con coordenadas para cada vehículo', () => {
			const calls = mockDbHelper.query.mock.calls;
			const searchCalls = calls.filter(call =>
				call[0].includes('6371 * acos')
			);
			expect(searchCalls.length).toBeGreaterThanOrEqual(2);
		});

		and('debe ordenar talleres agrupados por distancia', () => {
			expect(result.length).toBe(3);
			expect(result[0].distanciaKm).toBe(3.2);
			expect(result[1].distanciaKm).toBe(5.0);
			expect(result[2].distanciaKm).toBe(8.5);
		});

		and('debe retornar talleres ordenados por cercanía', () => {
			expect(result).toBeDefined();
			expect(Array.isArray(result)).toBe(true);
		});
	});

	test('Búsqueda para todos con límite top', ({ given, and, when, then }) => {
		given('un cliente con DNI "99999999"', () => {
			dniCliente = '99999999';
		});

		and('el cliente tiene 2 vehículos con cobertura activa', () => {
			mockQuery(mockDbHelper, [vehiculoToyota0km(), vehiculoAudiUsado()]);
			const talleres1 = Array.from({ length: 15 }, (_, i) =>
				crearTallerRow({ id: i + 1, nombre: `TALLER ${i + 1}` })
			);
			const talleres2 = Array.from({ length: 15 }, (_, i) =>
				crearTallerRow({ id: i + 100, nombre: `TALLER ${i + 100}` })
			);
			mockQuerySequence(mockDbHelper, [talleres1, talleres2]);
		});

		and('límite top de 10 talleres', () => {
			top = 10;
		});

		when('busco talleres para todos los vehículos', async () => {
			result = await repository.buscarPorClienteYFiltros(
				dniCliente,
				undefined,
				undefined,
				undefined,
				undefined,
				undefined,
				undefined,
				undefined,
				top,
			);
		});

		then('debe agrupar resultados primero', () => {
			expect(mockDbHelper.query).toHaveBeenCalledTimes(3);
		});

		and('debe aplicar límite después de agrupar', () => {
			expect(result.length).toBeLessThanOrEqual(10);
		});

		and('debe retornar máximo 10 talleres agrupados', () => {
			expect(result.length).toBe(10);
		});
	});

	test('Búsqueda para todos con filtro de tipo exacto', ({ given, and, when, then }) => {
		given('un cliente con DNI "99999999"', () => {
			dniCliente = '99999999';
		});

		and('el cliente tiene 2 vehículos con cobertura activa', () => {
			mockQuery(mockDbHelper, [vehiculoToyota0km(), vehiculoAudiUsado()]);
		});

		and('filtro de tipo exacto "SERVICIO_ESPECIALIZADO"', () => {
			tipoTaller = 'SERVICIO_ESPECIALIZADO';
			const taller = crearTallerRow({ tipo: 'SERVICIO_ESPECIALIZADO' });
			mockQuerySequence(mockDbHelper, [[taller], [taller]]);
		});

		when('busco talleres para todos los vehículos', async () => {
			result = await repository.buscarPorClienteYFiltros(
				dniCliente,
				undefined,
				undefined,
				undefined,
				tipoTaller,
			);
		});

		then('debe aplicar filtro de tipo exacto en las búsquedas', () => {
			const calls = mockDbHelper.query.mock.calls;
			const searchCalls = calls.filter(call =>
				call[0].includes('t.tipo = ?')
			);
			expect(searchCalls.length).toBeGreaterThanOrEqual(2);
		});

		and('debe retornar talleres del tipo especificado', () => {
			expect(result).toBeDefined();
			expect(result.every((t: TallerDto) => t.tipo === 'SERVICIO_ESPECIALIZADO')).toBe(true);
		});
	});

	test('Cliente sin vehículos', ({ given, and, when, then }) => {
		given('un cliente con DNI "11111111"', () => {
			dniCliente = '11111111';
		});

		and('el cliente no tiene vehículos con cobertura activa', () => {
			mockQuery(mockDbHelper, []); // Array vacío
		});

		when('busco talleres para todos los vehículos', async () => {
			result = await repository.buscarPorClienteYFiltros(dniCliente);
		});

		then('debe obtener lista vacía de vehículos', () => {
			expect(mockDbHelper.query).toHaveBeenCalledTimes(1);
		});

		and('debe retornar array vacío sin ejecutar búsquedas', () => {
			expect(result).toEqual([]);
		});
	});

	test('Obtener múltiples vehículos del cliente', ({ given, when, then, and }) => {
		given('un cliente con DNI "99999999"', () => {
			dniCliente = '99999999';
			mockQuery(mockDbHelper, [vehiculoToyota0km(), vehiculoAudiUsado()]);
		});

		when('obtengo la lista de vehículos del cliente', async () => {
			mockQuerySequence(mockDbHelper, [
				[tallerAfiliadoToyota()],
				[tallerMultimarca()],
			]);
			result = await repository.buscarPorClienteYFiltros(dniCliente);
		});

		then('debe ejecutar query con JOIN de pólizas activas', () => {
			expect(mockDbHelper.query).toHaveBeenCalledWith(
				expect.stringContaining("p.estado = 'activa'"),
				[dniCliente],
			);
		});

		and('debe filtrar por cobertura vigente', () => {
			expect(mockDbHelper.query).toHaveBeenCalledWith(
				expect.stringContaining('pv.fecha_fin_cobertura'),
				[dniCliente],
			);
		});

		and('debe retornar array con todos los vehículos', () => {
			expect(result).toBeDefined();
			expect(Array.isArray(result)).toBe(true);
		});
	});

	test('Eliminar duplicados de talleres por nombre y dirección', ({ given, when, then, and }) => {
		let talleres: TallerDto[];

		given('una lista con 3 talleres donde 2 tienen mismo nombre y dirección', () => {
			talleres = [
				{
					id: 1,
					nombre: 'AUTOELITE',
					nombreSucursal: 'SAN ISIDRO',
					direccion: 'AV. JAVIER PRADO ESTE 8045',
					distrito: 'SAN ISIDRO',
					tipo: 'CONCESIONARIO',
					esMultimarca: false,
					marcasAtendidas: ['TOYOTA'],
					codigoRedTaller: 'VEHA03',
					categoriaTaller: 'Talleres Afiliados',
				},
				{
					id: 1,
					nombre: 'AUTOELITE',
					nombreSucursal: 'SAN ISIDRO',
					direccion: 'AV. JAVIER PRADO ESTE 8045', // Mismo nombre y dirección
					distrito: 'SAN ISIDRO',
					tipo: 'CONCESIONARIO',
					esMultimarca: false,
					marcasAtendidas: ['TOYOTA'],
					codigoRedTaller: 'VEHA09', // Diferente red
					categoriaTaller: null,
				},
				{
					id: 2,
					nombre: 'ASISTENCIA AUTOMOTRIZ',
					nombreSucursal: 'LINCE',
					direccion: 'AV. ARENALES 2850',
					distrito: 'LINCE',
					tipo: null,
					esMultimarca: true,
					marcasAtendidas: ['AUDI', 'BMW', 'TOYOTA'],
					codigoRedTaller: 'VEHA03',
					categoriaTaller: 'Multimarcas Vehículos Ligeros',
				},
			] as TallerDto[];
		});

		when('elimino duplicados', () => {
			mockQuery(mockDbHelper, [
				tallerAfiliadoToyota(),
				tallerAfiliadoToyota(), // Duplicado
				tallerMultimarca(),
			]);
			result = repository.buscarPorClienteYFiltros(dniCliente, 1, 'LGM001');
		});

		then('debe retornar 2 talleres únicos', async () => {
			const talleres = await result;
			expect(talleres.length).toBe(2);
		});

		and('debe mantener el primer taller encontrado', async () => {
			const talleres = await result;
			expect(talleres[0].nombre).toBe('AUTOELITE');
		});
	});

	test('Agrupar talleres por placas atendidas', ({ given, and, when, then }) => {
		given('talleres encontrados para 2 placas diferentes', () => {
			dniCliente = '99999999';
			mockQuery(mockDbHelper, [vehiculoToyota0km(), vehiculoAudiUsado()]);
		});

		and('algunos talleres atienden ambas placas', () => {
			const taller = tallerMultimarca();
			mockQuerySequence(mockDbHelper, [[taller], [taller]]);
		});

		when('agrupo talleres por placas', async () => {
			result = await repository.buscarPorClienteYFiltros(dniCliente);
		});

		then('debe combinar talleres duplicados', () => {
			expect(result.length).toBe(1);
		});

		and('debe agregar campo placasAtendidas con array de placas', () => {
			expect(result[0]).toHaveProperty('placasAtendidas');
			expect(result[0].placasAtendidas).toContain('LGM001');
			expect(result[0].placasAtendidas).toContain('ABC777');
		});
	});

	test('rowToDto convierte TallerRow a TallerDto', ({ given, when, then, and }) => {
		let tallerRow: TallerRow;

		given('un TallerRow con todos los campos', () => {
			tallerRow = tallerAfiliadoToyota();
			mockQuery(mockDbHelper, [tallerRow]);
		});

		when('convierto a DTO', async () => {
			result = await repository.buscarPorClienteYFiltros(dniCliente, 1, 'LGM001');
		});

		then('debe mapear correctamente todos los campos', () => {
			expect(result[0]).toHaveProperty('id', tallerRow.id);
			expect(result[0]).toHaveProperty('nombre', tallerRow.nombre);
			expect(result[0]).toHaveProperty('direccion', tallerRow.direccion);
		});

		and('debe convertir es_multimarca a boolean', () => {
			expect(typeof result[0].esMultimarca).toBe('boolean');
			expect(result[0].esMultimarca).toBe(Boolean(tallerRow.es_multimarca));
		});

		and('debe parsear marcas separadas por comas', () => {
			expect(Array.isArray(result[0].marcasAtendidas)).toBe(true);
			if (tallerRow.marcas) {
				expect(result[0].marcasAtendidas.length).toBeGreaterThan(0);
			}
		});
	});

	test('rowToDto con validación de antigüedad (Talleres Adicionales)', ({ given, and, when, then }) => {
		let tallerRow: TallerRow;

		given('un TallerRow con requiere_validacion_antiguedad = 1', () => {
			tallerRow = tallerAdicionalConValidacion();
		});

		and('vehículo de 2022 con es_vehiculo_nuevo = 1', () => {
			tallerRow.anio_vehiculo = 2022;
			tallerRow.es_vehiculo_nuevo = 1;
		});

		and('anios_maximos_antiguedad = 4', () => {
			tallerRow.anios_maximos_antiguedad = 4;
			mockQuery(mockDbHelper, [tallerRow]);
		});

		when('convierto a DTO', async () => {
			result = await repository.buscarPorClienteYFiltros(dniCliente, 1, 'LGM001');
		});

		then('debe calcular cumpleRequisitosAntiguedad = true', () => {
			expect(result[0]).toHaveProperty('cumpleRequisitosAntiguedad', true);
		});

		and('debe incluir flags de validación en el DTO', () => {
			expect(result[0]).toHaveProperty('requiereValidacionAntiguedad', true);
			expect(result[0]).toHaveProperty('aniosMaximosAntiguedad', 4);
		});
	});

	test('rowToDto con vehículo que no cumple antigüedad', ({ given, and, when, then }) => {
		let tallerRow: TallerRow;

		given('un TallerRow con requiere_validacion_antiguedad = 1', () => {
			tallerRow = tallerAdicionalConValidacion();
		});

		and('vehículo de 2015 con es_vehiculo_nuevo = 0', () => {
			tallerRow.anio_vehiculo = 2015;
			tallerRow.es_vehiculo_nuevo = 0; // NO es 0km
		});

		and('anios_maximos_antiguedad = 4', () => {
			tallerRow.anios_maximos_antiguedad = 4;
			mockQuery(mockDbHelper, [tallerRow]);
		});

		when('convierto a DTO', async () => {
			result = await repository.buscarPorClienteYFiltros(dniCliente, 1, 'LGM001');
		});

		then('debe calcular cumpleRequisitosAntiguedad = false', () => {
			expect(result[0]).toHaveProperty('cumpleRequisitosAntiguedad', false);
		});

		and('debe incluir recargoDeducible y requiereAprobacion en el DTO', () => {
			expect(result[0]).toHaveProperty('recargoDeducible', 50);
			expect(result[0]).toHaveProperty('requiereAprobacion', true);
		});
	});
});
