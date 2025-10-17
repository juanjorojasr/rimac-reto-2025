/**
 * FIXTURES DE RESPUESTAS - REQUERIMIENTOS DEL PROYECTO
 *
 * Este archivo contiene ÚNICAMENTE las respuestas esperadas de los casos
 * requeridos por el proyecto (Caso 1, Caso 2, Caso 3, etc.)
 *
 * Estos fixtures se usan en:
 * - test/unit/deducibles/features/extraerDeducible.feature
 * - test/unit/deducibles/steps/extraerDeducible.steps.ts
 */

import { DeducibleExtraido } from '../../../../../src/dto/deducibles/extraer-deducible.res.dto';

/**
 * RESPUESTA ESPERADA - CASO 1: Póliza con Excepciones y Copago
 *
 * Valores extraídos del texto plano:
 * - Deducible: 10 (mínimo entre 10%, 30%, 35%)
 * - Copago: 150 (mínimo entre US$ 150, US$ 300, US$ 400)
 * - Moneda: USD
 * - Tipo: NO TIPO (no menciona multimarca ni concesionarios específicamente)
 * - Marca: NO MARCA (valor por defecto)
 * - Taller: NO TALLER (valor por defecto)
 */
export const responseCaso1: DeducibleExtraido = {
  deducible: 10,
  copago: 150,
  moneda: 'USD',
  tipo: 'NO TIPO',
  marca: 'NO MARCA',
  taller: 'NO TALLER',
};

/**
 * RESPUESTA ESPERADA - CASO 2: Póliza con Talleres Especiales VEHA07
 *
 * Valores extraídos del texto plano:
 * - Deducible: 20 (único porcentaje en el texto)
 * - Copago: 200 (único copago mínimo)
 * - Moneda: USD
 * - Tipo: NO TIPO (menciona talleres especiales pero no multimarca ni concesionarios)
 * - Marca: NO MARCA (valor por defecto)
 * - Taller: NO TALLER (valor por defecto)
 */
export const responseCaso2: DeducibleExtraido = {
  deducible: 20,
  copago: 200,
  moneda: 'USD',
  tipo: 'NO TIPO',
  marca: 'NO MARCA',
  taller: 'NO TALLER',
};

/**
 * RESPUESTA ESPERADA - CASO 3: Póliza con múltiples tipos de talleres
 *
 * Se retornan 2 deducibles porque hay 2 líneas con información diferente:
 *
 * Deducible 1: Línea con "Talleres Afiliados Multimarca"
 * - Deducible: 15% (primer porcentaje)
 * - Copago: 150 (primer copago mínimo US$ 150.00)
 * - Moneda: USD
 * - Tipo: Multimarca (detectado por "Talleres Afiliados Multimarca")
 * - Marca: NO MARCA
 * - Taller: NO TALLER
 *
 * Deducible 2: Línea con "Talleres Afiliados" (sin especificar tipo)
 * - Deducible: 15% (segundo porcentaje, mismo valor)
 * - Copago: 250 (segundo copago mínimo US$ 250.00)
 * - Moneda: USD
 * - Tipo: NO TIPO (no especifica multimarca ni concesionarios)
 * - Marca: NO MARCA
 * - Taller: NO TALLER
 */
export const responseCaso3Deducible1: DeducibleExtraido = {
  deducible: 15,
  copago: 150,
  moneda: 'USD',
  tipo: 'Multimarca',
  marca: 'NO MARCA',
  taller: 'NO TALLER',
};

export const responseCaso3Deducible2: DeducibleExtraido = {
  deducible: 15,
  copago: 250,
  moneda: 'USD',
  tipo: 'NO TIPO',
  marca: 'NO MARCA',
  taller: 'NO TALLER',
};

/**
 * RESPUESTA ESPERADA - CASO 4: Póliza con ausencia de control y múltiples talleres
 *
 * Se retornan 2 deducibles porque hay 2 líneas con copago (la tercera línea está incompleta):
 *
 * Deducible 1: Primera línea con "Talleres Afiliados" (sin especificar tipo)
 * - Deducible: 25% (primer porcentaje)
 * - Copago: 500 (primer copago mínimo US$ 500.00)
 * - Moneda: USD
 * - Tipo: NO TIPO (solo menciona "Talleres Afiliados" sin especificar)
 * - Marca: NO MARCA
 * - Taller: NO TALLER
 *
 * Deducible 2: Segunda línea con "Talleres Afiliados Multimarca"
 * - Deducible: 25% (segundo porcentaje, mismo valor)
 * - Copago: 300 (segundo copago mínimo US$ 300.00)
 * - Moneda: USD
 * - Tipo: Multimarca (detectado por "Talleres Afiliados Multimarca")
 * - Marca: NO MARCA
 * - Taller: NO TALLER
 */
export const responseCaso4Deducible1: DeducibleExtraido = {
  deducible: 25,
  copago: 500,
  moneda: 'USD',
  tipo: 'NO TIPO',
  marca: 'NO MARCA',
  taller: 'NO TALLER',
};

export const responseCaso4Deducible2: DeducibleExtraido = {
  deducible: 25,
  copago: 300,
  moneda: 'USD',
  tipo: 'Multimarca',
  marca: 'NO MARCA',
  taller: 'NO TALLER',
};

/**
 * RESPUESTA ESPERADA - CASO 5: Póliza con múltiples líneas sin marcadores
 *
 * Se retornan 2 deducibles porque solo las 2 primeras líneas tienen información completa
 * (porcentaje + copago + mención de talleres):
 *
 * Deducible 1: Primera línea "talleres afiliados" (sin especificar tipo)
 * - Deducible: 20%
 * - Copago: 250 (mínimo US$ 250.00)
 * - Moneda: USD
 * - Tipo: NO TIPO (menciona "talleres afiliados" sin especificar multimarca)
 * - Marca: NO MARCA
 * - Taller: NO TALLER
 *
 * Deducible 2: Segunda línea "talleres afiliados multimarca"
 * - Deducible: 20%
 * - Copago: 200 (mínimo US$ 200.00)
 * - Moneda: USD
 * - Tipo: Multimarca (detectado por "talleres afiliados multimarca")
 * - Marca: NO MARCA
 * - Taller: NO TALLER
 *
 * Nota: Las otras líneas no se procesan porque no tienen toda la información necesaria
 * o no mencionan talleres específicos
 */
export const responseCaso5Deducible1: DeducibleExtraido = {
  deducible: 20,
  copago: 250,
  moneda: 'USD',
  tipo: 'NO TIPO',
  marca: 'NO MARCA',
  taller: 'NO TALLER',
};

export const responseCaso5Deducible2: DeducibleExtraido = {
  deducible: 20,
  copago: 200,
  moneda: 'USD',
  tipo: 'Multimarca',
  marca: 'NO MARCA',
  taller: 'NO TALLER',
};

/**
 * RESPUESTA ESPERADA - CASO 6: Póliza con talleres específicos por nombre
 *
 * Se retornan 2 deducibles con nombres de talleres específicos:
 *
 * Deducible 1: Primera línea "Talleres Nissan Maquinarias"
 * - Deducible: 10%
 * - Copago: 500 (mínimo US$ 500.00)
 * - Moneda: USD
 * - Tipo: NO TIPO (no menciona multimarca ni concesionarios)
 * - Marca: NO MARCA
 * - Taller: "Nissan Maquinarias" (nombre específico extraído)
 *
 * Deducible 2: Segunda línea "Otros Talleres"
 * - Deducible: 10%
 * - Copago: 700 (mínimo US$ 700.00)
 * - Moneda: USD
 * - Tipo: NO TIPO
 * - Marca: NO MARCA
 * - Taller: "NO TALLER" (porque "Otros Talleres" es genérico)
 */
export const responseCaso6Deducible1: DeducibleExtraido = {
  deducible: 10,
  copago: 500,
  moneda: 'USD',
  tipo: 'NO TIPO',
  marca: 'NO MARCA',
  taller: 'Nissan Maquinarias',
};

export const responseCaso6Deducible2: DeducibleExtraido = {
  deducible: 10,
  copago: 700,
  moneda: 'USD',
  tipo: 'NO TIPO',
  marca: 'NO MARCA',
  taller: 'NO TALLER',
};

/**
 * RESPUESTA ESPERADA - CASO 7: Ausencia de control en talleres con nombre específico
 *
 * Se retorna 1 deducible:
 *
 * - Deducible: 22%
 * - Copago: 500 (Mínimo de US$500.00)
 * - Moneda: USD
 * - Tipo: NO TIPO (no menciona multimarca ni concesionarios)
 * - Marca: NO MARCA
 * - Taller: "JAPAN AUTOS" (nombre específico en mayúsculas)
 *
 * Nota: El nombre del taller se extrae de "EN TALLERES JAPAN AUTOS"
 */
export const responseCaso7: DeducibleExtraido = {
  deducible: 22,
  copago: 500,
  moneda: 'USD',
  tipo: 'NO TIPO',
  marca: 'NO MARCA',
  taller: 'JAPAN AUTOS',
};

/**
 * RESPUESTA ESPERADA - CASO 8: Póliza con múltiples líneas y extracción de MARCA
 *
 * Se retornan 4 deducibles:
 *
 * Deducible 1: Primera línea "en talleres afiliados" sin marca específica
 * - Deducible: 15%
 * - Copago: 150
 * - Moneda: USD
 * - Tipo: NO TIPO
 * - Marca: NO MARCA
 * - Taller: NO TALLER
 *
 * Deducible 2: Segunda línea "talleres afiliados multimarca" sin marca específica
 * - Deducible: 10%
 * - Copago: 150
 * - Moneda: USD
 * - Tipo: Multimarca
 * - Marca: NO MARCA
 * - Taller: NO TALLER
 *
 * Deducible 3: Línea 6 "Marca Mercedes Benz, BMW, Audi, Porsche Cayenne" con tipo NO TIPO
 * - Deducible: 15%
 * - Copago: 200
 * - Moneda: USD
 * - Tipo: NO TIPO
 * - Marca: "MERCEDES BENZ, BMW, AUDI, PORSCHE CAYENNE" (en mayúsculas)
 * - Taller: NO TALLER
 *
 * Deducible 4: Línea 7 "Marca Mercedes Benz, BMW, Audi, Porsche Cayenne" con tipo Multimarca
 * - Deducible: 10%
 * - Copago: 150
 * - Moneda: USD
 * - Tipo: Multimarca
 * - Marca: "MERCEDES BENZ, BMW, AUDI, PORSCHE CAYENNE" (en mayúsculas)
 * - Taller: NO TALLER
 */
export const responseCaso8Deducible1: DeducibleExtraido = {
  deducible: 15,
  copago: 150,
  moneda: 'USD',
  tipo: 'NO TIPO',
  marca: 'NO MARCA',
  taller: 'NO TALLER',
};

export const responseCaso8Deducible2: DeducibleExtraido = {
  deducible: 10,
  copago: 150,
  moneda: 'USD',
  tipo: 'Multimarca',
  marca: 'NO MARCA',
  taller: 'NO TALLER',
};

export const responseCaso8Deducible3: DeducibleExtraido = {
  deducible: 15,
  copago: 200,
  moneda: 'USD',
  tipo: 'NO TIPO',
  marca: 'MERCEDES BENZ, BMW, AUDI, PORSCHE CAYENNE',
  taller: 'NO TALLER',
};

export const responseCaso8Deducible4: DeducibleExtraido = {
  deducible: 10,
  copago: 150,
  moneda: 'USD',
  tipo: 'Multimarca',
  marca: 'MERCEDES BENZ, BMW, AUDI, PORSCHE CAYENNE',
  taller: 'NO TALLER',
};
