import { defineFeature, loadFeature } from 'jest-cucumber';
import { TalleresService } from '../../../../src/services/talleres.service';
import { BuscarTalleresReqDto } from '../../../../src/dto/talleres/buscar-talleres.req.dto';
import { TallerDto } from '../../../../src/dto/talleres/taller.dto';

import { vehiculoToyotaNuevo } from '../fixtures/entities/vehiculos.fixtures';
import {
	tallerVEHA03Toyota,
	tallerVEHA03Multimarca,
	tallerConDistancia,
} from '../fixtures/entities/talleres.fixtures';
import {
	requestConPlaca,
	requestSinPlaca,
	requestConDistrito,
	requestConTipoMultimarca,
	requestConGeolocalizacion,
} from '../fixtures/requests/buscarTalleres.request.fixtures';

import { createMockTalleresRepository } from '../mocks/talleres.repository.mock';

import {
	DNI_CLIENTE_PRUEBA,
	createTestContext
} from '../../shared/helpers/common.test-helper';
import {
	createTalleresTestingModule,
	validarEstructuraTaller
} from '../../shared/helpers/talleres.test-helper';

const feature = loadFeature('./test/unit/talleres/features/buscarTalleres.feature');

defineFeature(feature, (test) => {
	let service: TalleresService;
	let mockRepository: ReturnType<typeof createMockTalleresRepository>;
	let context: {
		dniCliente: string;
		request: BuscarTalleresReqDto;
		result: TallerDto[];
	};

	beforeEach(async () => {
		mockRepository = createMockTalleresRepository();

		const module = await createTalleresTestingModule(mockRepository);
		service = module.get<TalleresService>(TalleresService);

		context = createTestContext<BuscarTalleresReqDto>();
		context.result = [];
	});

	test('Buscar talleres con placa válida', ({ given, when, then, and }) => {
		given('que soy un cliente autenticado con DNI "99999999"', () => {
			context.dniCliente = DNI_CLIENTE_PRUEBA;
		});

		given('que tengo un vehículo con placa "LGM001"', () => {
			context.request = { ...requestConPlaca };

			mockRepository.obtenerVehiculoPorPlaca.mockResolvedValue(vehiculoToyotaNuevo);
		});

		when('busco talleres para mi vehículo', async () => {
			mockRepository.buscarPorClienteYFiltros.mockResolvedValue([
				tallerVEHA03Toyota,
				tallerVEHA03Multimarca,
			]);

			context.result = await service.buscarTalleres(context.request, context.dniCliente);
		});

		then('debo recibir una lista de talleres disponibles', () => {
			expect(context.result).toBeDefined();
			expect(context.result.length).toBeGreaterThan(0);
		});

		and('los talleres deben pertenecer a las redes VEHA de mi póliza', () => {
			context.result.forEach((taller) => {
				expect(taller.codigoRedTaller).toMatch(/^VEHA(03|09|10)$/);
				validarEstructuraTaller(taller);
			});
		});
	});

	test('Buscar talleres sin especificar placa', ({ given, when, then }) => {
		given('que soy un cliente autenticado con DNI "99999999"', () => {
			context.dniCliente = DNI_CLIENTE_PRUEBA;
		});

		when('busco talleres sin especificar una placa', async () => {
			context.request = { ...requestSinPlaca };

			mockRepository.buscarPorClienteYFiltros.mockResolvedValue([
				tallerVEHA03Toyota,
				tallerVEHA03Multimarca,
			]);

			context.result = await service.buscarTalleres(context.request, context.dniCliente);
		});

		then('debo recibir talleres compatibles con todos mis vehículos', () => {
			expect(context.result).toBeDefined();
			expect(mockRepository.buscarPorClienteYFiltros).toHaveBeenCalledWith(
				context.dniCliente,
				undefined,
				undefined,
				undefined,
				undefined,
				undefined,
				undefined,
				undefined,
				undefined,
			);
		});
	});

	test('Buscar talleres con placa inválida', ({ given, when, then }) => {
		given('que soy un cliente autenticado con DNI "99999999"', () => {
			context.dniCliente = DNI_CLIENTE_PRUEBA;
		});

		given('que tengo una placa "INVALIDA" que no me pertenece', () => {
			context.request = { placa: 'INVALIDA' };

			mockRepository.obtenerVehiculoPorPlaca.mockResolvedValue(null);
		});

		when('busco talleres para esa placa', async () => {
			context.result = await service.buscarTalleres(context.request, context.dniCliente);
		});

		then('debo recibir una lista vacía de talleres', () => {
			expect(context.result).toEqual([]);
			expect(mockRepository.buscarPorClienteYFiltros).not.toHaveBeenCalled();
		});
	});

	test('Buscar talleres con filtro de distrito', ({ given, and, when, then }) => {
		given('que soy un cliente autenticado con DNI "99999999"', () => {
			context.dniCliente = DNI_CLIENTE_PRUEBA;
		});

		given('que tengo un vehículo con placa "LGM001"', () => {
			mockRepository.obtenerVehiculoPorPlaca.mockResolvedValue(vehiculoToyotaNuevo);
		});

		and('quiero buscar en el distrito "LA MOLINA"', () => {
			context.request = { ...requestConDistrito };
		});

		when('busco talleres aplicando el filtro de distrito', async () => {
			mockRepository.buscarPorClienteYFiltros.mockResolvedValue([tallerVEHA03Toyota]);

			context.result = await service.buscarTalleres(context.request, context.dniCliente);
		});

		then('debo recibir solo talleres ubicados en "LA MOLINA"', () => {
			expect(context.result).toBeDefined();
			expect(mockRepository.buscarPorClienteYFiltros).toHaveBeenCalledWith(
				context.dniCliente,
				vehiculoToyotaNuevo.id_poliza,
				'LGM001',
				'LA MOLINA',
				undefined,
				undefined,
				undefined,
				undefined,
				undefined,
			);
		});
	});

	test('Buscar talleres multimarca', ({ given, and, when, then }) => {
		given('que soy un cliente autenticado con DNI "99999999"', () => {
			context.dniCliente = DNI_CLIENTE_PRUEBA;
		});

		given('que tengo un vehículo con placa "LGM001"', () => {
			mockRepository.obtenerVehiculoPorPlaca.mockResolvedValue(vehiculoToyotaNuevo);
		});

		and('quiero buscar talleres tipo "MULTIMARCA"', () => {
			context.request = { ...requestConTipoMultimarca };
		});

		when('busco talleres aplicando el filtro de tipo', async () => {
			mockRepository.buscarPorClienteYFiltros.mockResolvedValue([tallerVEHA03Multimarca]);

			context.result = await service.buscarTalleres(context.request, context.dniCliente);
		});

		then('debo recibir solo talleres multimarca', () => {
			expect(context.result).toBeDefined();
			context.result.forEach((taller) => {
				expect(taller.esMultimarca).toBe(true);
			});
		});
	});

	test('Buscar talleres con geolocalización', ({ given, and, when, then }) => {
		given('que soy un cliente autenticado con DNI "99999999"', () => {
			context.dniCliente = DNI_CLIENTE_PRUEBA;
		});

		given('que tengo un vehículo con placa "LGM001"', () => {
			mockRepository.obtenerVehiculoPorPlaca.mockResolvedValue(vehiculoToyotaNuevo);
		});

		and('proporciono coordenadas de geolocalización', () => {
			context.request = { ...requestConGeolocalizacion };
		});

		when('busco talleres cercanos', async () => {
			mockRepository.buscarPorClienteYFiltros.mockResolvedValue([tallerConDistancia]);

			context.result = await service.buscarTalleres(context.request, context.dniCliente);
		});

		then('debo recibir talleres ordenados por distancia', () => {
			expect(context.result).toBeDefined();
			expect(mockRepository.buscarPorClienteYFiltros).toHaveBeenCalledWith(
				context.dniCliente,
				vehiculoToyotaNuevo.id_poliza,
				'LGM001',
				undefined,
				undefined,
				-12.0731,
				-76.9598,
				10,
				5,
			);
		});

		and('cada taller debe incluir su distancia en kilómetros', () => {
			context.result.forEach((taller) => {
				if (taller.distanciaKm !== undefined) {
					expect(typeof taller.distanciaKm).toBe('number');
					expect(taller.distanciaKm).toBeGreaterThanOrEqual(0);
				}
			});
		});
	});
});
