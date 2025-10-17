import { defineFeature, loadFeature } from 'jest-cucumber';
import { extraerDeducibleUtil } from '../../../../src/utils/deducible.util';
import { ExtraerDeducibleReqDto } from '../../../../src/dto/deducibles/extraer-deducible.req.dto';
import { DeducibleExtraido } from '../../../../src/dto/deducibles/extraer-deducible.res.dto';
import { requestCaso1PolizaConExcepciones } from '../fixtures/requests/extraerDeducible.request.fixtures.proyecto';
import {
	requestConTipoMultimarca,
	requestConTipoConcesionario,
	requestConAmbosTipos,
} from '../fixtures/requests/extraerDeducible.request.fixtures.coverage';

const feature = loadFeature('./test/unit/deducibles/features/deducibleUtil.feature');

defineFeature(feature, (test) => {
	let context: {
		request: ExtraerDeducibleReqDto;
		result: { deducibles: DeducibleExtraido[] };
	};

	beforeEach(() => {
		context = {
			request: {} as ExtraerDeducibleReqDto,
			result: { deducibles: [] },
		};
	});

	test('Extraer el deducible mínimo cuando hay múltiples porcentajes', ({ given, when, then }) => {
		given('que tengo el utilty de extracción de deducibles', () => { });

		given(/^un texto con múltiples porcentajes: (\d+)%, (\d+)%, (\d+)%$/, () => {
			context.request = { ...requestCaso1PolizaConExcepciones };
		});

		when('ejecuto la extracción de deducible', () => {
			context.result = extraerDeducibleUtil(context.request);
		});

		then(/^el deducible extraído debe ser (\d+)$/, (deducible) => {
			expect(context.result.deducibles.length).toBe(1);
			expect(context.result.deducibles[0].deducible).toBe(parseInt(deducible));
		});
	});

	test('Extraer el copago mínimo cuando hay múltiples valores', ({ given, when, then }) => {
		given('que tengo el utilty de extracción de deducibles', () => { });

		given(/^un texto con múltiples copagos: US\$ (\d+), US\$ (\d+), US\$ (\d+)$/, () => {
			context.request = { ...requestCaso1PolizaConExcepciones };
		});

		when('ejecuto la extracción de deducible', () => {
			context.result = extraerDeducibleUtil(context.request);
		});

		then(/^el copago extraído debe ser (\d+)$/, (copago) => {
			expect(context.result.deducibles[0].copago).toBe(parseInt(copago));
		});
	});

	test('Detectar moneda USD correctamente', ({ given, when, then }) => {
		given('que tengo el utilty de extracción de deducibles', () => { });

		given('un texto con moneda "US$"', () => {
			context.request = { ...requestCaso1PolizaConExcepciones };
		});

		when('ejecuto la extracción de deducible', () => {
			context.result = extraerDeducibleUtil(context.request);
		});

		then(/^la moneda extraída debe ser "([^"]+)"$/, (moneda) => {
			expect(context.result.deducibles[0].moneda).toBe(moneda);
		});
	});

	test('Detectar tipo NO TIPO cuando no hay mención específica', ({ given, when, then }) => {
		given('que tengo el utilty de extracción de deducibles', () => { });

		given('un texto sin mencionar tipo de taller específico', () => {
			context.request = { ...requestCaso1PolizaConExcepciones };
		});

		when('ejecuto la extracción de deducible', () => {
			context.result = extraerDeducibleUtil(context.request);
		});

		then(/^el tipo extraído debe ser "([^"]+)"$/, (tipo) => {
			expect(context.result.deducibles.length).toBe(1);
			expect(context.result.deducibles[0].tipo).toBe(tipo);
		});
	});

	test('Detectar tipo Multimarca correctamente', ({ given, when, then }) => {
		given('que tengo el utilty de extracción de deducibles', () => { });

		given('un texto que menciona "talleres afiliados multimarca"', () => {
			context.request = { ...requestConTipoMultimarca };
		});

		when('ejecuto la extracción de deducible', () => {
			context.result = extraerDeducibleUtil(context.request);
		});

		then(/^el tipo extraído debe ser "([^"]+)"$/, (tipo) => {
			expect(context.result.deducibles.length).toBe(1);
			expect(context.result.deducibles[0].tipo).toBe(tipo);
		});
	});

	test('Detectar tipo Concesionarios correctamente', ({ given, when, then }) => {
		given('que tengo el utilty de extracción de deducibles', () => { });

		given('un texto que menciona "concesionarios"', () => {
			context.request = { ...requestConTipoConcesionario };
		});

		when('ejecuto la extracción de deducible', () => {
			context.result = extraerDeducibleUtil(context.request);
		});

		then(/^el tipo extraído debe ser "([^"]+)"$/, (tipo) => {
			expect(context.result.deducibles.length).toBe(1);
			expect(context.result.deducibles[0].tipo).toBe(tipo);
		});
	});

	test('Detectar ambos tipos cuando se mencionan multimarca y concesionarios', ({ given, when, then }) => {
		given('que tengo el utilty de extracción de deducibles', () => { });

		given('un texto que menciona "talleres afiliados multimarca" y "concesionarios"', () => {
			context.request = { ...requestConAmbosTipos };
		});

		when('ejecuto la extracción de deducible', () => {
			context.result = extraerDeducibleUtil(context.request);
		});

		then('se deben extraer 2 deducibles con tipos diferentes', () => {
			expect(context.result.deducibles.length).toBe(2);

			const tipos = context.result.deducibles.map(d => d.tipo).sort();
			expect(tipos).toEqual(['Concesionarios', 'Multimarca']);
		});
	});

	test('Retornar marca y taller por defecto', ({ given, when, then, and }) => {
		given('que tengo el utilty de extracción de deducibles', () => { });

		given('un texto sin mencionar marca ni taller específico', () => {
			context.request = { ...requestCaso1PolizaConExcepciones };
		});

		when('ejecuto la extracción de deducible', () => {
			context.result = extraerDeducibleUtil(context.request);
		});

		then(/^la marca debe ser "([^"]+)"$/, (marca) => {
			expect(context.result.deducibles[0].marca).toBe(marca);
		});

		and(/^el taller debe ser "([^"]+)"$/, (taller) => {
			expect(context.result.deducibles[0].taller).toBe(taller);
		});
	});

	test('Manejar texto sin porcentaje', ({ given, when, then }) => {
		given('que tengo el utilty de extracción de deducibles', () => { });

		given('un texto sin porcentaje de deducible', () => {
			context.request = {
				text: 'Cobertura completa sin deducible especificado con copago mínimo US$ 100',
			};
		});

		when('ejecuto la extracción de deducible', () => {
			context.result = extraerDeducibleUtil(context.request);
		});

		then('el deducible debe ser 0', () => {
			expect(context.result.deducibles[0].deducible).toBe(0);
		});
	});

	test('Manejar texto sin copago', ({ given, when, then }) => {
		given('que tengo el utilty de extracción de deducibles', () => { });

		given('un texto sin mención de copago', () => {
			context.request = {
				text: 'Deducible: 15% del monto a indemnizar',
			};
		});

		when('ejecuto la extracción de deducible', () => {
			context.result = extraerDeducibleUtil(context.request);
		});

		then('el copago debe ser 0', () => {
			expect(context.result.deducibles[0].copago).toBe(0);
		});
	});

	test('Usar USD por defecto si no se especifica moneda', ({ given, when, then }) => {
		given('que tengo el utilty de extracción de deducibles', () => { });

		given('un texto sin mención de moneda', () => {
			context.request = {
				text: 'Deducible: 15% del monto a indemnizar con un mínimo de 200',
			};
		});

		when('ejecuto la extracción de deducible', () => {
			context.result = extraerDeducibleUtil(context.request);
		});

		then(/^la moneda debe ser "([^"]+)" por defecto$/, (moneda) => {
			expect(context.result.deducibles[0].moneda).toBe(moneda);
		});
	});
});
