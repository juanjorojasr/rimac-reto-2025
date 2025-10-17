import { defineFeature, loadFeature } from 'jest-cucumber';
import { DeduciblesService } from '../../../../src/services/deducibles.service';
import { ExtraerDeducibleReqDto } from '../../../../src/dto/deducibles/extraer-deducible.req.dto';
import { DeducibleExtraido } from '../../../../src/dto/deducibles/extraer-deducible.res.dto';

import {
	requestCaso1PolizaConExcepciones,
	requestCaso2TalleresEspeciales,
	requestCaso3MultipleTalleres,
	requestCaso4AusenciaControl,
	requestCaso5MultipleLineas,
	requestCaso6TalleresEspecificos,
	requestCaso7AusenciaControlTallerEspecifico,
	requestCaso8MultipleMarcas,
} from '../fixtures/requests/extraerDeducible.request.fixtures.proyecto';

import {
	responseCaso1,
	responseCaso2,
	responseCaso3Deducible1,
	responseCaso3Deducible2,
	responseCaso4Deducible1,
	responseCaso4Deducible2,
	responseCaso5Deducible1,
	responseCaso5Deducible2,
	responseCaso6Deducible1,
	responseCaso6Deducible2,
	responseCaso7,
	responseCaso8Deducible1,
	responseCaso8Deducible2,
	responseCaso8Deducible3,
	responseCaso8Deducible4,
} from '../fixtures/responses/extraerDeducible.response.fixtures.proyecto';

import {
	validarEstructuraDeducible,
	validarMoneda,
} from '../../shared/helpers/deducibles.test-helper';

const feature = loadFeature('./test/unit/deducibles/features/extraerDeducible.feature');

defineFeature(feature, (test) => {
	let service: DeduciblesService;
	let context: {
		request: ExtraerDeducibleReqDto;
		result: DeducibleExtraido[];
	};

	beforeEach(() => {
		service = new DeduciblesService();
		context = {
			request: {} as ExtraerDeducibleReqDto,
			result: [],
		};
	});

	test('Caso 1 - Póliza con excepciones y copago', ({ given, when, then }) => {
		given('la póliza tiene un deducible en forma de texto con múltiples excepciones', () => {
			context.request = { ...requestCaso1PolizaConExcepciones };
		});

		when('ejecutamos el conversor de deducible', () => {
			context.result = service.extraerDeducible(context.request);
		});

		then('obtenemos el deducible 10%, copago US$ 150.00, moneda USD, tipo NO TIPO', () => {
			expect(context.result.length).toBe(1);

			validarEstructuraDeducible(context.result[0]);

			expect(context.result[0].deducible).toBe(responseCaso1.deducible);
			expect(context.result[0].copago).toBe(responseCaso1.copago);
			expect(context.result[0].moneda).toBe(responseCaso1.moneda);
			expect(context.result[0].tipo).toBe(responseCaso1.tipo);
			expect(context.result[0].marca).toBe(responseCaso1.marca);
			expect(context.result[0].taller).toBe(responseCaso1.taller);

			validarMoneda(context.result[0].moneda);
		});
	});

	test('Caso 2 - Póliza con talleres especiales VEHA07', ({ given, when, then }) => {
		given('la póliza tiene un deducible con talleres especiales VEHA07', () => {
			context.request = { ...requestCaso2TalleresEspeciales };
		});

		when('ejecutamos el conversor de deducible', () => {
			context.result = service.extraerDeducible(context.request);
		});

		then('obtenemos el deducible 20%, copago US$ 200, moneda USD, tipo NO TIPO', () => {
			expect(context.result.length).toBe(1);

			validarEstructuraDeducible(context.result[0]);

			expect(context.result[0].deducible).toBe(responseCaso2.deducible);
			expect(context.result[0].copago).toBe(responseCaso2.copago);
			expect(context.result[0].moneda).toBe(responseCaso2.moneda);
			expect(context.result[0].tipo).toBe(responseCaso2.tipo);
			expect(context.result[0].marca).toBe(responseCaso2.marca);
			expect(context.result[0].taller).toBe(responseCaso2.taller);

			validarMoneda(context.result[0].moneda);
		});
	});

	test('Caso 3 - Póliza con múltiples tipos de talleres', ({ given, when, then }) => {
		given('la póliza tiene un deducible con múltiples tipos de talleres', () => {
			context.request = { ...requestCaso3MultipleTalleres };
		});

		when('ejecutamos el conversor de deducible', () => {
			context.result = service.extraerDeducible(context.request);
		});

		then('obtenemos 2 deducibles con diferentes tipos y copagos', () => {
			expect(context.result.length).toBe(2);

			validarEstructuraDeducible(context.result[0]);
			validarEstructuraDeducible(context.result[1]);

			// Validar Deducible 1: Multimarca con copago 150
			expect(context.result[0].deducible).toBe(responseCaso3Deducible1.deducible);
			expect(context.result[0].copago).toBe(responseCaso3Deducible1.copago);
			expect(context.result[0].moneda).toBe(responseCaso3Deducible1.moneda);
			expect(context.result[0].tipo).toBe(responseCaso3Deducible1.tipo);
			expect(context.result[0].marca).toBe(responseCaso3Deducible1.marca);
			expect(context.result[0].taller).toBe(responseCaso3Deducible1.taller);

			// Validar Deducible 2: NO TIPO con copago 250
			expect(context.result[1].deducible).toBe(responseCaso3Deducible2.deducible);
			expect(context.result[1].copago).toBe(responseCaso3Deducible2.copago);
			expect(context.result[1].moneda).toBe(responseCaso3Deducible2.moneda);
			expect(context.result[1].tipo).toBe(responseCaso3Deducible2.tipo);
			expect(context.result[1].marca).toBe(responseCaso3Deducible2.marca);
			expect(context.result[1].taller).toBe(responseCaso3Deducible2.taller);

			validarMoneda(context.result[0].moneda);
			validarMoneda(context.result[1].moneda);
		});
	});

	test('Caso 4 - Póliza con ausencia de control', ({ given, when, then }) => {
		given('la póliza tiene un deducible por ausencia de control con múltiples talleres', () => {
			context.request = { ...requestCaso4AusenciaControl };
		});

		when('ejecutamos el conversor de deducible', () => {
			context.result = service.extraerDeducible(context.request);
		});

		then('obtenemos 2 deducibles por ausencia de control con diferentes copagos', () => {
			expect(context.result.length).toBe(2);

			validarEstructuraDeducible(context.result[0]);
			validarEstructuraDeducible(context.result[1]);

			// Validar Deducible 1: NO TIPO con copago 500
			expect(context.result[0].deducible).toBe(responseCaso4Deducible1.deducible);
			expect(context.result[0].copago).toBe(responseCaso4Deducible1.copago);
			expect(context.result[0].moneda).toBe(responseCaso4Deducible1.moneda);
			expect(context.result[0].tipo).toBe(responseCaso4Deducible1.tipo);
			expect(context.result[0].marca).toBe(responseCaso4Deducible1.marca);
			expect(context.result[0].taller).toBe(responseCaso4Deducible1.taller);

			// Validar Deducible 2: Multimarca con copago 300
			expect(context.result[1].deducible).toBe(responseCaso4Deducible2.deducible);
			expect(context.result[1].copago).toBe(responseCaso4Deducible2.copago);
			expect(context.result[1].moneda).toBe(responseCaso4Deducible2.moneda);
			expect(context.result[1].tipo).toBe(responseCaso4Deducible2.tipo);
			expect(context.result[1].marca).toBe(responseCaso4Deducible2.marca);
			expect(context.result[1].taller).toBe(responseCaso4Deducible2.taller);

			validarMoneda(context.result[0].moneda);
			validarMoneda(context.result[1].moneda);
		});
	});

	test('Caso 5 - Póliza con múltiples líneas sin marcadores', ({ given, when, then }) => {
		given('la póliza tiene un deducible con múltiples líneas que mencionan talleres', () => {
			context.request = { ...requestCaso5MultipleLineas };
		});

		when('ejecutamos el conversor de deducible', () => {
			context.result = service.extraerDeducible(context.request);
		});

		then('obtenemos 2 deducibles de las líneas con información completa', () => {
			expect(context.result.length).toBe(2);

			validarEstructuraDeducible(context.result[0]);
			validarEstructuraDeducible(context.result[1]);

			// Validar Deducible 1: NO TIPO con copago 250
			expect(context.result[0].deducible).toBe(responseCaso5Deducible1.deducible);
			expect(context.result[0].copago).toBe(responseCaso5Deducible1.copago);
			expect(context.result[0].moneda).toBe(responseCaso5Deducible1.moneda);
			expect(context.result[0].tipo).toBe(responseCaso5Deducible1.tipo);
			expect(context.result[0].marca).toBe(responseCaso5Deducible1.marca);
			expect(context.result[0].taller).toBe(responseCaso5Deducible1.taller);

			// Validar Deducible 2: Multimarca con copago 200
			expect(context.result[1].deducible).toBe(responseCaso5Deducible2.deducible);
			expect(context.result[1].copago).toBe(responseCaso5Deducible2.copago);
			expect(context.result[1].moneda).toBe(responseCaso5Deducible2.moneda);
			expect(context.result[1].tipo).toBe(responseCaso5Deducible2.tipo);
			expect(context.result[1].marca).toBe(responseCaso5Deducible2.marca);
			expect(context.result[1].taller).toBe(responseCaso5Deducible2.taller);

			validarMoneda(context.result[0].moneda);
			validarMoneda(context.result[1].moneda);
		});
	});

	test('Caso 6 - Póliza con talleres específicos por nombre', ({ given, when, then }) => {
		given('la póliza tiene un deducible con talleres específicos por nombre', () => {
			context.request = { ...requestCaso6TalleresEspecificos };
		});

		when('ejecutamos el conversor de deducible', () => {
			context.result = service.extraerDeducible(context.request);
		});

		then('obtenemos 2 deducibles con nombres de talleres específicos', () => {
			expect(context.result.length).toBe(2);

			validarEstructuraDeducible(context.result[0]);
			validarEstructuraDeducible(context.result[1]);

			// Validar Deducible 1: Nissan Maquinarias con copago 500
			expect(context.result[0].deducible).toBe(responseCaso6Deducible1.deducible);
			expect(context.result[0].copago).toBe(responseCaso6Deducible1.copago);
			expect(context.result[0].moneda).toBe(responseCaso6Deducible1.moneda);
			expect(context.result[0].tipo).toBe(responseCaso6Deducible1.tipo);
			expect(context.result[0].marca).toBe(responseCaso6Deducible1.marca);
			expect(context.result[0].taller).toBe(responseCaso6Deducible1.taller);

			// Validar Deducible 2: NO TALLER con copago 700
			expect(context.result[1].deducible).toBe(responseCaso6Deducible2.deducible);
			expect(context.result[1].copago).toBe(responseCaso6Deducible2.copago);
			expect(context.result[1].moneda).toBe(responseCaso6Deducible2.moneda);
			expect(context.result[1].tipo).toBe(responseCaso6Deducible2.tipo);
			expect(context.result[1].marca).toBe(responseCaso6Deducible2.marca);
			expect(context.result[1].taller).toBe(responseCaso6Deducible2.taller);

			validarMoneda(context.result[0].moneda);
			validarMoneda(context.result[1].moneda);
		});
	});

	test('Caso 7 - Ausencia de control en taller específico con nombre en mayúsculas', ({ given, when, then }) => {
		given('la póliza tiene un deducible por ausencia de control en un taller específico', () => {
			context.request = { ...requestCaso7AusenciaControlTallerEspecifico };
		});

		when('ejecutamos el conversor de deducible', () => {
			context.result = service.extraerDeducible(context.request);
		});

		then('obtenemos 1 deducible con nombre de taller en mayúsculas', () => {
			expect(context.result.length).toBe(1);

			validarEstructuraDeducible(context.result[0]);

			expect(context.result[0].deducible).toBe(responseCaso7.deducible);
			expect(context.result[0].copago).toBe(responseCaso7.copago);
			expect(context.result[0].moneda).toBe(responseCaso7.moneda);
			expect(context.result[0].tipo).toBe(responseCaso7.tipo);
			expect(context.result[0].marca).toBe(responseCaso7.marca);
			expect(context.result[0].taller).toBe(responseCaso7.taller);

			validarMoneda(context.result[0].moneda);
		});
	});

	test('Caso 8 - Póliza con múltiples líneas y extracción de marca de vehículo', ({ given, when, then }) => {
		given('la póliza tiene múltiples líneas con y sin marcas de vehículos específicas', () => {
			context.request = { ...requestCaso8MultipleMarcas };
		});

		when('ejecutamos el conversor de deducible', () => {
			context.result = service.extraerDeducible(context.request);
		});

		then('obtenemos 4 deducibles donde 2 tienen marca específica y 2 no', () => {
			expect(context.result.length).toBe(4);

			validarEstructuraDeducible(context.result[0]);
			validarEstructuraDeducible(context.result[1]);
			validarEstructuraDeducible(context.result[2]);
			validarEstructuraDeducible(context.result[3]);

			// Validar Deducible 1: 15%, copago 150, NO TIPO, NO MARCA
			expect(context.result[0].deducible).toBe(responseCaso8Deducible1.deducible);
			expect(context.result[0].copago).toBe(responseCaso8Deducible1.copago);
			expect(context.result[0].moneda).toBe(responseCaso8Deducible1.moneda);
			expect(context.result[0].tipo).toBe(responseCaso8Deducible1.tipo);
			expect(context.result[0].marca).toBe(responseCaso8Deducible1.marca);
			expect(context.result[0].taller).toBe(responseCaso8Deducible1.taller);

			// Validar Deducible 2: 10%, copago 150, Multimarca, NO MARCA
			expect(context.result[1].deducible).toBe(responseCaso8Deducible2.deducible);
			expect(context.result[1].copago).toBe(responseCaso8Deducible2.copago);
			expect(context.result[1].moneda).toBe(responseCaso8Deducible2.moneda);
			expect(context.result[1].tipo).toBe(responseCaso8Deducible2.tipo);
			expect(context.result[1].marca).toBe(responseCaso8Deducible2.marca);
			expect(context.result[1].taller).toBe(responseCaso8Deducible2.taller);

			// Validar Deducible 3: 15%, copago 200, NO TIPO, MERCEDES BENZ, BMW, AUDI, PORSCHE CAYENNE
			expect(context.result[2].deducible).toBe(responseCaso8Deducible3.deducible);
			expect(context.result[2].copago).toBe(responseCaso8Deducible3.copago);
			expect(context.result[2].moneda).toBe(responseCaso8Deducible3.moneda);
			expect(context.result[2].tipo).toBe(responseCaso8Deducible3.tipo);
			expect(context.result[2].marca).toBe(responseCaso8Deducible3.marca);
			expect(context.result[2].taller).toBe(responseCaso8Deducible3.taller);

			// Validar Deducible 4: 10%, copago 150, Multimarca, MERCEDES BENZ, BMW, AUDI, PORSCHE CAYENNE
			expect(context.result[3].deducible).toBe(responseCaso8Deducible4.deducible);
			expect(context.result[3].copago).toBe(responseCaso8Deducible4.copago);
			expect(context.result[3].moneda).toBe(responseCaso8Deducible4.moneda);
			expect(context.result[3].tipo).toBe(responseCaso8Deducible4.tipo);
			expect(context.result[3].marca).toBe(responseCaso8Deducible4.marca);
			expect(context.result[3].taller).toBe(responseCaso8Deducible4.taller);

			validarMoneda(context.result[0].moneda);
			validarMoneda(context.result[1].moneda);
			validarMoneda(context.result[2].moneda);
			validarMoneda(context.result[3].moneda);
		});
	});
});
