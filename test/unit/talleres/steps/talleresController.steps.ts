import { defineFeature, loadFeature } from 'jest-cucumber';
import { Test, TestingModule } from '@nestjs/testing';
import { TalleresController } from '../../../../src/controllers/talleres.controller';
import { TalleresService } from '../../../../src/services/talleres.service';
import { ApiRequest } from '../../../../src/dto/common/api-request.dto';
import { BuscarTalleresReqDto } from '../../../../src/dto/talleres/buscar-talleres.req.dto';

import { requestConPlaca } from '../fixtures/requests/buscarTalleres.request.fixtures';
import { tallerVEHA03Toyota } from '../fixtures/entities/talleres.fixtures';

const feature = loadFeature('./test/unit/talleres/features/talleresController.feature');

defineFeature(feature, (test) => {
	let controller: TalleresController;
	let mockService: { buscarTalleres: jest.Mock };
	let context: {
		request: ApiRequest<BuscarTalleresReqDto>;
		userSession: any;
		result: any;
	};

	beforeEach(async () => {
		mockService = {
			buscarTalleres: jest.fn(),
		};

		const module: TestingModule = await Test.createTestingModule({
			controllers: [TalleresController],
			providers: [
				{
					provide: TalleresService,
					useValue: mockService,
				},
			],
		}).compile();

		controller = module.get<TalleresController>(TalleresController);

		context = {
			request: {
				payload: {} as BuscarTalleresReqDto,
			},
			userSession: {
				dni: '99999999',
				nombreCompleto: 'Cliente Demo',
			},
			result: null,
		};
	});

	test('Buscar talleres exitosamente', ({ given, when, then, and }) => {
		given('que tengo un request válido con placa', () => {
			context.request.payload = { ...requestConPlaca };
			mockService.buscarTalleres.mockResolvedValue([tallerVEHA03Toyota]);
		});

		when('llamo al endpoint buscar talleres', async () => {
			context.result = await controller.buscarTalleres(context.request, context.userSession);
		});

		then('debo recibir una respuesta exitosa', () => {
			expect(context.result.status).toBe('success');
		});

		and('la respuesta debe contener talleres', () => {
			expect(context.result.data).toBeDefined();
			expect(context.result.data.talleres).toBeDefined();
			expect(context.result.data.total).toBeGreaterThan(0);
		});

		and('el código de estado debe ser 200', () => {
			expect(context.result.code).toBe(200);
		});
	});

	test('Manejar error en búsqueda de talleres', ({ given, when, then, and }) => {
		given('que ocurre un error en el servicio', () => {
			context.request.payload = { ...requestConPlaca };
			mockService.buscarTalleres.mockRejectedValue(new Error('Error de base de datos'));
		});

		when('llamo al endpoint buscar talleres', async () => {
			context.result = await controller.buscarTalleres(context.request, context.userSession);
		});

		then('debo recibir una respuesta de error', () => {
			expect(context.result.status).toBe('error');
			expect(context.result.message).toBeDefined();
		});

		and('el código de estado debe ser 500', () => {
			expect(context.result.code).toBe(500);
		});
	});
});
