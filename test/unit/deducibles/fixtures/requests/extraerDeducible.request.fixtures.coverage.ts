/**
 * FIXTURES PARA COBERTURA DE CÓDIGO
 *
 * Este archivo contiene fixtures ADICIONALES necesarios para
 * alcanzar 100% de cobertura en el código (branches, statements, etc.)
 *
 * Estos fixtures NO son casos del requerimiento del proyecto,
 * son casos técnicos para probar diferentes caminos del código.
 *
 * Estos fixtures se usan en:
 * - test/unit/deducibles/steps/deducibleUtil.steps.ts
 */

import { ExtraerDeducibleReqDto } from '../../../../../src/dto/deducibles/extraer-deducible.req.dto';

/**
 * [COVERAGE] Request con tipo Multimarca explícito
 * Para probar detección de "talleres afiliados multimarca"
 */
export const requestConTipoMultimarca: ExtraerDeducibleReqDto = {
  text: `Deducible: 15.00% del monto a indemnizar con un mínimo de US$ 200.00 por evento.

    Puede usar talleres afiliados multimarca para obtener beneficios adicionales.`,
};

/**
 * [COVERAGE] Request con tipo Concesionario explícito
 * Para probar detección de "concesionario"
 */
export const requestConTipoConcesionario: ExtraerDeducibleReqDto = {
  text: `Deducible: 20.00% del monto a indemnizar con un mínimo de S/ 300.00 por evento.

    Puede usar concesionarios autorizados para la reparación.`,
};

/**
 * [COVERAGE] Request con ambos tipos mencionados
 * Para probar detección de ambos: multimarca y concesionarios
 */
export const requestConAmbosTipos: ExtraerDeducibleReqDto = {
  text: `Deducible: 12.50% del monto a indemnizar con un mínimo de USD 180.00 por evento.

    Puede elegir entre talleres afiliados multimarca o concesionarios autorizados para la reparación de su vehículo.`,
};
