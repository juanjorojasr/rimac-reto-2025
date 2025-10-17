import { defineFeature, loadFeature } from 'jest-cucumber';
import { Test, TestingModule } from '@nestjs/testing';
import { DeduciblesController } from '../../../../src/controllers/deducibles.controller';
import { DeduciblesService } from '../../../../src/services/deducibles.service';
import { ApiRequest } from '../../../../src/dto/common/api-request.dto';
import { ExtraerDeducibleReqDto } from '../../../../src/dto/deducibles/extraer-deducible.req.dto';

import { requestCaso1PolizaConExcepciones } from '../fixtures/requests/extraerDeducible.request.fixtures.proyecto';
import { responseCaso1 } from '../fixtures/responses/extraerDeducible.response.fixtures.proyecto';

const feature = loadFeature('./test/unit/deducibles/features/deduciblesController.feature');

defineFeature(feature, (test) => {
  let controller: DeduciblesController;
  let mockService: { extraerDeducible: jest.Mock };
  let context: {
    request: ApiRequest<ExtraerDeducibleReqDto>;
    result: any;
  };

  beforeEach(async () => {
    mockService = {
      extraerDeducible: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeduciblesController],
      providers: [
        {
          provide: DeduciblesService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<DeduciblesController>(DeduciblesController);

    context = {
      request: {
        payload: {} as ExtraerDeducibleReqDto,
      },
      result: null,
    };
  });

  test('Extraer deducible exitosamente', ({ given, when, then, and }) => {
    given('que tengo un request válido con texto', () => {
      context.request.payload = { ...requestCaso1PolizaConExcepciones };
      mockService.extraerDeducible.mockReturnValue([responseCaso1]);
    });

    when('llamo al endpoint extraer deducible', () => {
      context.result = controller.extraerDeducible(context.request);
    });

    then('debo recibir un payload con deducibles', () => {
      expect(context.result.payload).toBeDefined();
      expect(Array.isArray(context.result.payload)).toBe(true);
      expect(context.result.payload.length).toBeGreaterThan(0);
    });

    and('el código de estado debe ser 200', () => {
      expect(context.result.statusCode).toBe(200);
    });
  });

  test('Extraer múltiples deducibles', ({ given, when, then }) => {
    given('que tengo un texto con múltiples tipos', () => {
      context.request.payload = { ...requestCaso1PolizaConExcepciones };
      // simular respuesta con múltiples deducibles (para casos futuros)
      mockService.extraerDeducible.mockReturnValue([
        {
          deducible: 10,
          copago: 150,
          moneda: 'USD',
          tipo: 'Multimarca',
          marca: 'NO MARCA',
          taller: 'NO TALLER',
        },
        {
          deducible: 10,
          copago: 150,
          moneda: 'USD',
          tipo: 'Concesionarios',
          marca: 'NO MARCA',
          taller: 'NO TALLER',
        },
      ]);
    });

    when('llamo al endpoint extraer deducible', () => {
      context.result = controller.extraerDeducible(context.request);
    });

    then('debo recibir múltiples deducibles en el payload', () => {
      expect(context.result.payload.length).toBe(2);
      expect(context.result.payload[0].tipo).toBe('Multimarca');
      expect(context.result.payload[1].tipo).toBe('Concesionarios');
    });
  });
});
