import { ExtraerDeducibleReqDto } from '../dto/deducibles/extraer-deducible.req.dto';
import { DeducibleExtraido } from '../dto/deducibles/extraer-deducible.res.dto';

export function extraerDeducibleUtil(
  request: ExtraerDeducibleReqDto,
): { deducibles: DeducibleExtraido[] } {
  const texto = request.text;

  // Detectar si hay líneas con estructura específica que requieren procesamiento independiente:
  // - Líneas con "* Por Evento... en Talleres..." (Caso 3)
  // - Líneas con "- Ausencia de control... (Talleres...)" (Caso 4)
  // - Líneas con porcentaje + copago + mención de talleres (Caso 5)
  // - Líneas con porcentaje + copago + "en Talleres" (Caso 6)
  const lineasConEstructura = texto.split('\n').filter(linea => {
    const tieneEstructuraPorEvento = /\*\s*Por\s+Evento.*en\s+Talleres/i.test(linea);
    const tieneEstructuraAusencia = /-\s*Ausencia\s+de\s+control.*\(Talleres/i.test(linea);

    // Nueva lógica para Caso 5: líneas que tienen porcentaje + copago + talleres afiliados
    const tienePorcentaje = /\d{1,2}(?:\.\d{1,2})?\s*%/.test(linea);
    const tieneCopago = /m[íi]nimo\s+(?:de\s+)?(?:US\$|USD|S\/|PEN)\s*\d+/i.test(linea);
    const mencionaTalleresAfiliados = /talleres\s+afiliados/i.test(linea);
    const tieneInformacionCompleta = tienePorcentaje && tieneCopago && mencionaTalleresAfiliados;

    // Nueva lógica para Caso 6: líneas con porcentaje + copago + "en Talleres [nombre]" o "en Otros Talleres"
    const mencionaTalleresEspecificos = /en\s+(?:Otros\s+)?Talleres/i.test(linea);
    const tieneInformacionTallerEspecifico = tienePorcentaje && tieneCopago && mencionaTalleresEspecificos;

    return tieneEstructuraPorEvento || tieneEstructuraAusencia || tieneInformacionCompleta || tieneInformacionTallerEspecifico;
  });

  if (lineasConEstructura.length > 1) {
    // Caso especial: Múltiples líneas con diferentes tipos de talleres
    return procesarLineasIndependientes(lineasConEstructura);
  }

  // Si hay exactamente 1 línea con taller específico, procesarla independientemente para extraer nombre
  if (lineasConEstructura.length === 1) {
    const linea = lineasConEstructura[0];
    const tieneTallerEspecifico = /en\s+(?:Otros\s+)?Talleres/i.test(linea);
    if (tieneTallerEspecifico) {
      return procesarLineasIndependientes(lineasConEstructura);
    }
  }

  // Caso normal: Procesar todo el texto como un solo bloque
  return procesarTextoCompleto(texto);
}

/**
 * Procesa líneas independientes cuando cada línea tiene su propio deducible y tipo
 */
function procesarLineasIndependientes(lineas: string[]): { deducibles: DeducibleExtraido[] } {
  const deducibles: DeducibleExtraido[] = [];

  for (const linea of lineas) {
    // Extraer porcentaje de la línea
    const deducibleMatch = linea.match(/(\d{1,2}(?:\.\d{1,2})?)\s*%/);
    const deducible = deducibleMatch ? parseFloat(deducibleMatch[1]) : 0;

    // Extraer copago de la línea
    const copagoMatch = linea.match(/m[íi]nimo\s+(?:de\s+)?(?:US\$|USD|S\/|PEN)\s*(\d+(?:[.,]\d{1,2})?)/i);
    const copago = copagoMatch ? parseFloat(copagoMatch[1].replace(',', '.')) : 0;

    // Determinar moneda
    let moneda = 'USD';
    const monedaMatch = linea.match(/(?:US\$|USD|S\/|PEN)/i);
    if (monedaMatch) {
      if (/S\/|PEN/i.test(monedaMatch[0])) moneda = 'PEN';
      if (/US\$|USD/i.test(monedaMatch[0])) moneda = 'USD';
    }

    // Determinar tipo de taller según la línea específica
    let tipo = 'NO TIPO';
    if (/talleres\s+afiliados\s+multimarca/i.test(linea)) {
      tipo = 'Multimarca';
    } else if (/concesionari[oa]s?/i.test(linea)) {
      tipo = 'Concesionarios';
    }

    // Extraer nombre de taller específico (Casos 6 y 7)
    // Solo extrae nombres propios (mayúscula en cada palabra o todo mayúsculas), no frases genéricas como "Afiliados Multimarca"
    let taller = 'NO TALLER';
    // Regex que captura: "Nissan Maquinarias" (formato título) o "JAPAN AUTOS" (todo mayúsculas)
    const tallerMatch = linea.match(/en\s+Talleres\s+([A-ZÁÉÍÓÚ][A-ZÁÉÍÓÚa-záéíóúñ]+(?:\s+[A-ZÁÉÍÓÚ][A-ZÁÉÍÓÚa-záéíóúñ]+)*)/i);
    if (tallerMatch) {
      const nombreTaller = tallerMatch[1].trim();
      // Si es "Otros Talleres" es genérico, devolvemos NO TALLER
      // Si contiene palabras genéricas también es genérico
      const palabrasGenericas = /Afiliados|preferenciales/i;
      if (!/^Otros\s+Talleres$/i.test(nombreTaller) && !palabrasGenericas.test(nombreTaller)) {
        taller = nombreTaller;
      }
    }

    // Extraer marca de vehículo (Caso 8)
    // Patrón: "Marca [LISTA DE MARCAS]: ..." o "Por evento, Marca [LISTA]: ..."
    let marca = 'NO MARCA';
    const marcaMatch = linea.match(/Marca\s+([A-Za-zÁ-ú\s,]+?):/i);
    if (marcaMatch) {
      // Extraer y normalizar la lista de marcas a mayúsculas
      const listaMarcas = marcaMatch[1].trim().toUpperCase();
      marca = listaMarcas;
    }

    deducibles.push({
      deducible,
      copago,
      moneda,
      tipo,
      marca,
      taller,
    });
  }

  return { deducibles };
}

/**
 * Procesa el texto completo como un solo bloque (casos 1 y 2)
 */
function procesarTextoCompleto(texto: string): { deducibles: DeducibleExtraido[] } {
  // Extraer todos los porcentajes de deducible y tomar el menor
  const deducibleMatches = texto.matchAll(/(\d{1,2}(?:\.\d{1,2})?)\s*%/g);
  const porcentajes = Array.from(deducibleMatches).map(match => parseFloat(match[1]));
  const deducible = porcentajes.length > 0 ? Math.min(...porcentajes) : 0;

  // Extraer todos los copagos y tomar el menor
  const copagoMatches = texto.matchAll(/m[íi]nimo\s+(?:de\s+)?(?:US\$|USD|S\/|PEN)\s*(\d+(?:[.,]\d{1,2})?)/gi);
  const copagos = Array.from(copagoMatches).map(match => parseFloat(match[1].replace(',', '.')));
  const copago = copagos.length > 0 ? Math.min(...copagos) : 0;

  // Determinar moneda (buscar la primera mención)
  let moneda = 'USD';
  const monedaMatch = texto.match(/(?:US\$|USD|S\/|PEN)/i);
  if (monedaMatch) {
    if (/S\/|PEN/i.test(monedaMatch[0])) moneda = 'PEN';
    if (/US\$|USD/i.test(monedaMatch[0])) moneda = 'USD';
  }

  // Extraer tipo de taller
  const tipos: string[] = [];
  if (/talleres\s+afiliados\s+multimarca/i.test(texto)) {
    tipos.push('Multimarca');
  }
  if (/concesionari[oa]s?/i.test(texto)) {
    tipos.push('Concesionarios');
  }
  if (tipos.length === 0) {
    tipos.push('NO TIPO');
  }

  // Construir respuesta para cada tipo detectado
  const deducibles: DeducibleExtraido[] = tipos.map((tipo) => ({
    deducible,
    copago,
    moneda,
    tipo,
    marca: 'NO MARCA',
    taller: 'NO TALLER',
  }));

  return { deducibles };
}
