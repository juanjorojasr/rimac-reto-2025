/**
 * FIXTURES DE RESPUESTAS - COBERTURA DE CÓDIGO
 *
 * Este archivo contiene respuestas esperadas de fixtures ADICIONALES
 * necesarios para alcanzar 100% de cobertura en el código.
 *
 * Estos fixtures NO son casos del requerimiento del proyecto,
 * son casos técnicos para probar diferentes caminos del código.
 *
 * Estos fixtures se usan en:
 * - test/unit/deducibles/steps/deducibleUtil.steps.ts
 */

import { DeducibleExtraido } from '../../../../../src/dto/deducibles/extraer-deducible.res.dto';

/**
 * [COVERAGE] Respuesta con tipo Multimarca detectado
 */
export const deducibleMultimarca: DeducibleExtraido = {
  deducible: 15,
  copago: 200,
  moneda: 'USD',
  tipo: 'Multimarca',
  marca: 'NO MARCA',
  taller: 'NO TALLER',
};

/**
 * [COVERAGE] Respuesta con tipo Concesionarios detectado
 */
export const deducibleConcesionarios: DeducibleExtraido = {
  deducible: 20,
  copago: 300,
  moneda: 'PEN',
  tipo: 'Concesionarios',
  marca: 'NO MARCA',
  taller: 'NO TALLER',
};

/**
 * [COVERAGE] Respuesta con ambos tipos detectados
 */
export const deducibleAmbosTipos: DeducibleExtraido = {
  deducible: 12.5,
  copago: 180,
  moneda: 'USD',
  tipo: 'Multimarca, Concesionarios',
  marca: 'NO MARCA',
  taller: 'NO TALLER',
};
