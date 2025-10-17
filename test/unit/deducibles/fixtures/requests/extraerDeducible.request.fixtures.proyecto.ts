/**
 * FIXTURES DE REQUERIMIENTOS DEL PROYECTO
 *
 * Este archivo contiene ÚNICAMENTE los fixtures de los casos
 * requeridos por el proyecto (Caso 1, Caso 2, Caso 3, etc.)
 *
 * Estos fixtures se usan en:
 * - test/unit/deducibles/features/extraerDeducible.feature
 * - test/unit/deducibles/steps/extraerDeducible.steps.ts
 */

import { ExtraerDeducibleReqDto } from '../../../../../src/dto/deducibles/extraer-deducible.req.dto';

/**
 * CASO 1: Póliza con Excepciones y Copago
 *
 * Escenario: Póliza con múltiples porcentajes de deducible (todos 10%) y copagos mínimos variados
 * Valores esperados:
 * - Deducible: 10% (todos los porcentajes son 10%)
 * - Copago: 150 USD (mínimo entre US$200, US$150, US$150, 150, 150)
 * - Moneda: USD
 * - Tipo: NO TIPO (no menciona multimarca ni concesionarios)
 * - Marca: NO MARCA
 * - Taller: NO TALLER
 */
export const requestCaso1PolizaConExcepciones: ExtraerDeducibleReqDto = {
  text: `(No Inclueye I.G.V.)
Por evento 10% del monto a indemnizar, mínimo US$200.00
Excepto para:
Robo Parcial 10% del monto a indemnizar, mínimo US$150.00
Siniestros atendidos en talleres preferenciales 10% del monto a indemnizar, mínimo US$150.00
Robo de accesorios Musicales 10% del monto a indemnizar, mínimo 150.00
Responsabilidad civil 10% del monto a indemnizar, mínimo 150.00
Robo total solo se aseguran con GPS obligatorio hasta el segundo año de antigüedad, sin coaseguro. Tercer año, coaseguro 80/20`,
};

/**
 * CASO 2: Póliza con Talleres Especiales VEHA07
 *
 * Escenario: Póliza con deducible único y copago con espacio después del símbolo de moneda
 * Valores esperados:
 * - Deducible: 20% (único porcentaje)
 * - Copago: 200 USD (único copago mínimo)
 * - Moneda: USD
 * - Tipo: NO TIPO (menciona talleres especiales pero no multimarca ni concesionarios)
 * - Marca: NO MARCA
 * - Taller: NO TALLER
 */
export const requestCaso2TalleresEspeciales: ExtraerDeducibleReqDto = {
  text: `*Los siniestros, serán atendidos únicamente en la relación de talleres especiales descritos en la cláusula  VEHA07
20% del monto indemnizable, mínimo US$ 200
20% del monto indemnizable para pérdida total`,
};

/**
 * CASO 3: Póliza con múltiples tipos de talleres
 *
 * Escenario: Póliza con diferentes opciones de talleres y copagos distintos
 * Valores esperados:
 * - Deducible 1: 15%, copago 150 USD, tipo Multimarca (menciona "Talleres Afiliados Multimarca")
 * - Deducible 2: 15%, copago 250 USD, tipo NO TIPO (menciona "Talleres Afiliados" sin especificar)
 * - Moneda: USD
 * - Marca: NO MARCA
 * - Taller: NO TALLER
 */
export const requestCaso3MultipleTalleres: ExtraerDeducibleReqDto = {
  text: `* Por Evento 15% del monto del siniestro, mínimo US$ 150.00 en Talleres Afiliados Multimarca
 * Por Evento 15% del monto del siniestro, mínimo US$ 250.00 en Talleres Afiliados`,
};

/**
 * CASO 4: Póliza con ausencia de control y múltiples talleres
 *
 * Escenario: Póliza con líneas que empiezan con guión (-) y diferentes tipos de talleres
 * Valores esperados:
 * - Deducible 1: 25%, copago 500 USD, tipo NO TIPO (menciona "Talleres Afiliados" sin especificar)
 * - Deducible 2: 25%, copago 300 USD, tipo Multimarca (menciona "Talleres Afiliados Multimarca")
 * - Moneda: USD
 * - Marca: NO MARCA
 * - Taller: NO TALLER
 */
export const requestCaso4AusenciaControl: ExtraerDeducibleReqDto = {
  text: `- Ausencia de control: 25.00% del monto indemnizar, mínimo US$ 500.00 (Talleres Afiliados).
- Ausencia de control: 25.00% del monto indemnizar, mínimo US$ 300.00 (Talleres Afiliados Multimarca).
-Pérdida total por ausencia de control: 25.00% del monto a i`,
};

/**
 * CASO 5: Póliza con múltiples líneas sin marcadores
 *
 * Escenario: Póliza con varias líneas que mencionan talleres, algunas con copago y otras sin copago
 * Solo se procesan las líneas que tienen TODA la información (porcentaje, copago y tipo de taller)
 * Valores esperados:
 * - Deducible 1: 20%, copago 250 USD, tipo NO TIPO (talleres afiliados sin especificar)
 * - Deducible 2: 20%, copago 200 USD, tipo Multimarca (talleres afiliados multimarca)
 * - Moneda: USD
 * - Marca: NO MARCA
 * - Taller: NO TALLER
 *
 * Nota: Las otras líneas se ignoran porque no tienen copago completo o no mencionan talleres específicos
 */
export const requestCaso5MultipleLineas: ExtraerDeducibleReqDto = {
  text: `. 20% del monto a indemnizar, mínimo US$ 250.00, para todo y cada evento, en talleres afiliados
20% del monto a indemnizar, mínimo US$ 200.00, para todo y cada evento, en talleres afiliados multimarca
Pérdida Total, Incendio, Robo Total:  20% del monto del siniestro
Conductor varón menor  de 25 años, 25% del monto del siniestro mínimo US$ 300, para todo y cada evento
Rotura de lunas, solo para reposición de lunas nacionales sin deducible
Vías no autorizadas 25% del monto a indemnizar, mínimo US$ 300.00, para todo y cada evento`,
};

/**
 * CASO 6: Póliza con talleres específicos por nombre
 *
 * Escenario: Primera vez que se extrae el NOMBRE del taller (no solo tipo)
 * Valores esperados:
 * - Deducible 1: 10%, copago 500 USD, tipo NO TIPO, taller "Nissan Maquinarias"
 * - Deducible 2: 10%, copago 700 USD, tipo NO TIPO, taller "NO TALLER" (porque es "Otros Talleres")
 * - Moneda: USD
 * - Marca: NO MARCA
 *
 * Nota: "Talleres Nissan Maquinarias" extrae el nombre específico del taller
 * "Otros Talleres" se considera genérico, por lo que retorna "NO TALLER"
 */
export const requestCaso6TalleresEspecificos: ExtraerDeducibleReqDto = {
  text: `10% del monto del siniestro, minimo US$ 500.00 en Talleres Nissan Maquinarias
10% del monto del siniestro, minimo US$ 700.00 en Otros Talleres
En caso de discrepancia prevalece el mayor. No incluye I.G.V.`,
};

/**
 * CASO 7: Ausencia de control en talleres con nombre específico en mayúsculas
 *
 * Escenario: Taller específico con nombre en mayúsculas "JAPAN AUTOS"
 * Valores esperados:
 * - Deducible: 22%
 * - Copago: 500 USD
 * - Moneda: USD
 * - Tipo: NO TIPO (no menciona multimarca ni concesionarios)
 * - Marca: NO MARCA
 * - Taller: "JAPAN AUTOS" (nombre específico extraído en mayúsculas)
 *
 * Nota: "EN TALLERES JAPAN AUTOS" debe extraer el nombre del taller en mayúsculas
 */
export const requestCaso7AusenciaControlTallerEspecifico: ExtraerDeducibleReqDto = {
  text: 'AUSENCIA DE CONTROL EN TALLERES JAPAN AUTOS, 22% del DEL MONTO DEL SINIESTRO, Mínimo de US$500.00. AUSENCIA DE CONTROL',
};

/**
 * CASO 8: Póliza con múltiples líneas y extracción de MARCA de vehículo
 *
 * Escenario: Primera vez que se extrae la MARCA del vehículo de líneas como "Marca Mercedes Benz, BMW..."
 * Valores esperados:
 * - Deducible 1: 15%, copago 150 USD, tipo NO TIPO, marca NO MARCA (primera línea sin marca)
 * - Deducible 2: 10%, copago 150 USD, tipo Multimarca, marca NO MARCA (segunda línea sin marca)
 * - Deducible 3: 15%, copago 200 USD, tipo NO TIPO, marca "MERCEDES BENZ, BMW, AUDI, PORSCHE CAYENNE"
 * - Deducible 4: 10%, copago 150 USD, tipo Multimarca, marca "MERCEDES BENZ, BMW, AUDI, PORSCHE CAYENNE"
 * - Moneda: USD
 * - Taller: NO TALLER
 *
 * Nota: Las líneas 6 y 7 tienen el patrón "Por evento, Marca [LISTA]: ..." que debe extraer la lista de marcas en MAYÚSCULAS
 */
export const requestCaso8MultipleMarcas: ExtraerDeducibleReqDto = {
  text: `Por evento 15.00% del monto a indemnizar, mínimo US$ 150.00, en talleres afiliados
Siniestros atendidos en red de talleres afiliados multimarca  10.00% del monto a indemnizar, mínimo US$ 150.00
Robo Parcial 15% del monto a indemnizar, mínimo US$ 150.00
Accesorios musicales 10.00% del monto a indemnizar, mínimo US$ 150.00
Hyundai Tucson, Santa Fe: coaseguro por Robo Total (nuevos y hasta 2 años de antigüedad) 20%. Si el vehículo cuenta con GPS, se excluirá el coaseguro.
Por evento, Marca Mercedes Benz, BMW, Audi, Porsche Cayenne: 15% del monto a indemnizar, mínimo US$ 200.00 en talleres afiliados
Por evento, Marca Mercedes Benz, BMW, Audi, Porsche Cayenne: 10% del monto a indemnizar, mínimo US$ 150.00 en talleres afiliados multimarca
Marca Mercedes Benz, BMW, Audi, Porsche Cayenne
Mayores a US$ 75,000 hasta US$ 100,000: 15% del monto a indemnizar, mínimo US$ 1,500 para daños por hueco o daños por despiste contra sardineles por llantas Runflat
Menores a US$ 75,000: 15% del monto a indemnizar, mínimo US$ 800.00 para daños por hueco o daños por despiste contra sardineles por llantas Runflat
Reposición de lunas nacionales, sin deducible`,
};
