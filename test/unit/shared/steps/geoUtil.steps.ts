/**
 * Steps para pruebas de utilidades geográficas
 */
import { defineFeature, loadFeature } from 'jest-cucumber';
import { calcularDistanciaKm } from '../../../../src/utils/geo.util';

const feature = loadFeature('./test/unit/shared/features/geoUtil.feature');

defineFeature(feature, (test) => {
  let context: {
    lat1: number;
    lon1: number;
    lat2: number;
    lon2: number;
    distancia: number;
  };

  beforeEach(() => {
    context = {
      lat1: 0,
      lon1: 0,
      lat2: 0,
      lon2: 0,
      distancia: 0,
    };
  });

  test('Calcular distancia entre dos puntos cercanos', ({ given, when, then, and }) => {
    given('que tengo dos coordenadas en Lima', () => {
      // San Isidro
      context.lat1 = -12.0964;
      context.lon1 = -77.0228;
      // Miraflores
      context.lat2 = -12.1198;
      context.lon2 = -77.0350;
    });

    when('calculo la distancia entre ellas', () => {
      context.distancia = calcularDistanciaKm(
        context.lat1,
        context.lon1,
        context.lat2,
        context.lon2,
      );
    });

    then('debo obtener una distancia en kilómetros', () => {
      expect(typeof context.distancia).toBe('number');
      expect(context.distancia).toBeGreaterThan(0);
    });

    and('la distancia debe ser mayor a cero', () => {
      expect(context.distancia).toBeGreaterThan(0);
      expect(context.distancia).toBeLessThan(10); // Menos de 10km entre estos puntos
    });
  });

  test('Calcular distancia en el mismo punto', ({ given, when, then }) => {
    given('que tengo las mismas coordenadas', () => {
      context.lat1 = -12.0464;
      context.lon1 = -77.0428;
      context.lat2 = -12.0464;
      context.lon2 = -77.0428;
    });

    when('calculo la distancia', () => {
      context.distancia = calcularDistanciaKm(
        context.lat1,
        context.lon1,
        context.lat2,
        context.lon2,
      );
    });

    then('la distancia debe ser cero', () => {
      expect(context.distancia).toBe(0);
    });
  });

  test('Calcular distancia entre puntos lejanos', ({ given, when, then }) => {
    given('que tengo coordenadas de Lima y Cusco', () => {
      // Lima
      context.lat1 = -12.0464;
      context.lon1 = -77.0428;
      // Cusco
      context.lat2 = -13.5319;
      context.lon2 = -71.9675;
    });

    when('calculo la distancia', () => {
      context.distancia = calcularDistanciaKm(
        context.lat1,
        context.lon1,
        context.lat2,
        context.lon2,
      );
    });

    then('debo obtener una distancia significativa', () => {
      expect(context.distancia).toBeGreaterThan(500);
      expect(context.distancia).toBeLessThan(700);
    });
  });
});
