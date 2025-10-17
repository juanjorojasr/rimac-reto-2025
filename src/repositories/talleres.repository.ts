import { Injectable, Logger } from '@nestjs/common';
import type { RowDataPacket } from 'mysql2/promise';
import { TallerDto } from '../dto/talleres/taller.dto';
import { DatabaseHelper } from '../database/database.helper';

interface TallerRow extends RowDataPacket {
	id: number;
	nombre: string;
	nombre_sucursal: string;
	direccion: string;
	distrito: string;
	tipo: string;
	es_multimarca: number;
	codigo_red_taller: string;
	categoria_taller: string | null;
	categoria_orden: number | null;
	telefono: string | null;
	latitud: number | null;
	longitud: number | null;
	marcas: string | null;
	requiere_validacion_antiguedad: number | null;
	anios_maximos_antiguedad: number | null;
	recargo_deducible: number | null;
	requiere_aprobacion: number | null;
	anio_vehiculo: number | null;
	es_vehiculo_nuevo: number | null;
	distancia_km?: number | null;
}

interface VehiculoRow extends RowDataPacket {
	id_vehiculo: number;
	id_poliza: number;
	poliza: string;
	placa: string;
	marca: string;
	modelo: string | null;
	anio: number | null;
	fecha_inicio_cobertura: Date;
	fecha_fin_cobertura: Date | null;
	antiguedad_vehiculo: number;
}

@Injectable()
export class TalleresRepository {
	private readonly logger = new Logger(TalleresRepository.name);

	constructor(private readonly dbHelper: DatabaseHelper) { }

	async obtenerVehiculoPorPlaca(
		placa: string,
		dniCliente: string,
	): Promise<VehiculoRow | null> {
		this.logger.log('Validación de propiedad: consultando relación cliente-vehículo y cobertura activa');

		const query = `
      SELECT
        v.id AS id_vehiculo,
        p.id AS id_poliza,
        p.numero AS poliza,
        v.placa,
        m.nombre AS marca,
        mo.nombre AS modelo,
        v.anio,
        pv.fecha_inicio_cobertura,
        pv.fecha_fin_cobertura,
        TIMESTAMPDIFF(YEAR, STR_TO_DATE(CONCAT(v.anio, '-01-01'), '%Y-%m-%d'), CURDATE()) AS antiguedad_vehiculo
      FROM vehiculos v
      INNER JOIN polizas_vehiculos pv ON v.id = pv.id_vehiculo
      INNER JOIN polizas p ON pv.id_poliza = p.id
      INNER JOIN clientes c ON p.id_cliente = c.id
      INNER JOIN marcas m ON v.id_marca = m.id
      LEFT JOIN modelos mo ON v.id_modelo = mo.id
      WHERE c.dni = ?
        AND v.placa = ?
        AND p.estado = 'activa'
        AND (pv.fecha_fin_cobertura IS NULL OR pv.fecha_fin_cobertura >= CURDATE())
      LIMIT 1
    `;

		const result = await this.dbHelper.queryOne<VehiculoRow>(query, [dniCliente, placa]);

		if (result) {
			this.logger.log('Vehículo verificado: se obtuvo marca y antigüedad para aplicar reglas de red VEHA');
		} else {
			this.logger.warn('Vehículo no encontrado: la placa no existe o no tiene cobertura vigente en el periodo actual');
		}

		return result;
	}

	async buscarPorClienteYFiltros(
		dniCliente: string,
		idPoliza?: number,
		placa?: string,
		distrito?: string,
		tipoTaller?: string,
		latitud?: number,
		longitud?: number,
		radioKm?: number,
		top?: number,
	): Promise<TallerDto[]> {
		this.logger.log('Construyendo query: ensamblando consulta dinámica según filtros recibidos');

		// Si hay placa específica, buscar solo talleres compatibles con ese vehículo
		if (idPoliza !== undefined && placa) {
			return this.buscarPorVehiculoEspecifico(
				dniCliente,
				idPoliza,
				placa,
				distrito,
				tipoTaller,
				latitud,
				longitud,
				radioKm,
				top,
			);
		}

		// Si NO hay placa, buscar talleres compatibles con TODOS los vehículos del cliente
		return this.buscarPorTodosLosVehiculos(
			dniCliente,
			distrito,
			tipoTaller,
			latitud,
			longitud,
			radioKm,
			top,
		);
	}

	private async buscarPorVehiculoEspecifico(
		dniCliente: string,
		idPoliza: number,
		placa: string,
		distrito?: string,
		tipoTaller?: string,
		latitud?: number,
		longitud?: number,
		radioKm?: number,
		top?: number,
	): Promise<TallerDto[]> {
		this.logger.log('Filtro por póliza: limitando búsqueda a talleres de la red VEHA específica del vehículo');

		// Construir SELECT dinámico con cálculo de distancia si hay coordenadas
		let selectClause = `
        t.id,
        t.nombre,
        s.nombre_sucursal,
        s.direccion,
        s.distrito,
        t.tipo,
        t.es_multimarca,
        rt.codigo AS codigo_red_taller,
        ct.nombre AS categoria_taller,
        ct.orden AS categoria_orden,
        s.telefono,
        s.latitud,
        s.longitud,
        GROUP_CONCAT(DISTINCT m_taller.nombre ORDER BY m_taller.nombre) AS marcas,
        ct.requiere_validacion_antiguedad,
        ct.anios_maximos_antiguedad,
        ct.recargo_deducible,
        ct.requiere_aprobacion,
        v.anio AS anio_vehiculo,
        v.es_nuevo AS es_vehiculo_nuevo`;

		// Si hay coordenadas, agregar cálculo de distancia con fórmula de Haversine
		if (latitud !== undefined && longitud !== undefined) {
			this.logger.log('Agregando cálculo de distancia: usando fórmula de Haversine en MySQL para ordenamiento eficiente');
			selectClause += `,
        (6371 * acos(
          cos(radians(?)) * cos(radians(s.latitud)) *
          cos(radians(s.longitud) - radians(?)) +
          sin(radians(?)) * sin(radians(s.latitud))
        )) AS distancia_km`;
		}

		const baseQuery = `
      SELECT DISTINCT
        ${selectClause}
      FROM talleres t
      INNER JOIN sucursales s ON t.id = s.id_taller
      INNER JOIN talleres_redes tr ON t.id = tr.id_taller
      INNER JOIN redes_talleres rt ON tr.id_red_taller = rt.id
      LEFT JOIN categorias_talleres ct ON tr.id_categoria_taller = ct.id
      INNER JOIN clausulas cl ON rt.id = cl.id_red_taller AND cl.tipo = 'VEHA'
      INNER JOIN polizas_clausulas pc ON cl.id = pc.id_clausula
      INNER JOIN polizas p ON pc.id_poliza = p.id
      INNER JOIN clientes c ON p.id_cliente = c.id
      INNER JOIN polizas_vehiculos pv ON p.id = pv.id_poliza
      INNER JOIN vehiculos v ON pv.id_vehiculo = v.id
      LEFT JOIN marcas m_vehiculo ON v.id_marca = m_vehiculo.id
      LEFT JOIN talleres_marcas tm ON t.id = tm.id_taller
      LEFT JOIN marcas m_taller ON tm.id_marca = m_taller.id
    `;

		const conditions: string[] = [
			'c.dni = ?',
			'p.id = ?',
			'v.placa = ?',
			"p.estado = 'activa'",
			't.activo = TRUE',
			's.activo = TRUE',
			'(pv.fecha_fin_cobertura IS NULL OR pv.fecha_fin_cobertura >= CURDATE())',
		];

		const params: any[] = [];

		// Si hay coordenadas, agregar parámetros para el cálculo de distancia
		if (latitud !== undefined && longitud !== undefined) {
			params.push(latitud, longitud, latitud);
		}

		// Agregar parámetros de condiciones
		params.push(dniCliente, idPoliza, placa);

		// Validación de marca: Multimarca O taller especializado en la marca del vehículo
		this.logger.log('Filtro de compatibilidad: incluyendo solo talleres multimarca o especializados en la marca del vehículo');
		conditions.push(`(
      t.es_multimarca = TRUE
      OR EXISTS (
        SELECT 1 FROM talleres_marcas tm2
        WHERE tm2.id_taller = t.id AND tm2.id_marca = v.id_marca
      )
    )`);

		this.aplicarFiltrosOpcionales(conditions, params, distrito, tipoTaller, latitud, longitud, radioKm);

		// Construir ORDER BY dinámico
		let orderByClause = '';
		if (latitud !== undefined && longitud !== undefined) {
			// Si hay coordenadas, ordenar por distancia primero
			this.logger.log('Ordenamiento por cercanía: priorizando talleres más cercanos a las coordenadas proporcionadas');
			orderByClause = 'ORDER BY distancia_km ASC, ct.orden ASC, t.nombre ASC';
		} else {
			// Sin coordenadas, ordenar por categoría y nombre
			orderByClause = 'ORDER BY ct.orden ASC, t.nombre ASC';
		}

		// Agregar filtro HAVING para radioKm (después de calcular distancia)
		let havingClause = '';
		if (latitud !== undefined && longitud !== undefined && radioKm !== undefined && radioKm > 0) {
			this.logger.log(`Filtro de radio: limitando a talleres dentro de ${radioKm} km usando distancia calculada`);
			havingClause = `HAVING distancia_km <= ${radioKm}`;
		}

		// Agregar LIMIT si se especifica top
		let limitClause = '';
		if (top !== undefined && top > 0) {
			this.logger.log(`Limitando resultados: retornando los ${top} talleres más relevantes`);
			limitClause = `LIMIT ${top}`;
		}

		const query = `
      ${baseQuery}
      WHERE ${conditions.join(' AND ')}
      GROUP BY t.id, s.id, rt.codigo, ct.nombre, ct.orden, ct.requiere_validacion_antiguedad, ct.anios_maximos_antiguedad, ct.recargo_deducible, ct.requiere_aprobacion, v.anio, v.es_nuevo${latitud !== undefined && longitud !== undefined ? ', distancia_km' : ''}
      ${havingClause}
      ${orderByClause}
      ${limitClause}
    `;

		this.logger.log('Ejecutando query: consultando MySQL con filtros aplicados');

		const rows = await this.dbHelper.query<TallerRow>(query, params);

		this.logger.log(`Resultados de BD: ${rows.length} registros obtenidos antes de procesamiento`);

		const talleres = rows.map((row) => this.rowToDto(row));
		const talleresUnicos = this.eliminarDuplicados(talleres);

		this.logger.log(`Post-procesamiento: ${talleresUnicos.length} talleres únicos listos para retornar`);

		return talleresUnicos;
	}

	private async buscarPorTodosLosVehiculos(
		dniCliente: string,
		distrito?: string,
		tipoTaller?: string,
		latitud?: number,
		longitud?: number,
		radioKm?: number,
		top?: number,
	): Promise<TallerDto[]> {
		this.logger.log('Filtro amplio: buscando talleres compatibles con todos los vehículos del cliente');

		// Estrategia: Buscar talleres por cada vehículo del cliente y combinar resultados
		const vehiculos = await this.obtenerVehiculosDelCliente(dniCliente);

		if (vehiculos.length === 0) {
			this.logger.warn('Cliente sin vehículos: no se encontraron vehículos con cobertura activa');
			return [];
		}

		this.logger.log(`Cliente tiene ${vehiculos.length} vehículo(s) con cobertura activa`);

		// Buscar talleres para cada vehículo (sin aplicar top todavía)
		const resultadosPorVehiculo = await Promise.all(
			vehiculos.map(async (vehiculo) => {
				const talleres = await this.buscarPorVehiculoEspecifico(
					dniCliente,
					vehiculo.id_poliza,
					vehiculo.placa,
					distrito,
					tipoTaller,
					latitud,
					longitud,
					radioKm,
					undefined, // No aplicar top individual
				);
				// Agregar la placa a cada taller encontrado
				return talleres.map(taller => ({
					...taller,
					placaAsociada: vehiculo.placa
				}));
			}),
		);

		// Combinar resultados y agrupar por taller único
		const todosLosTalleres = resultadosPorVehiculo.flat();
		let talleresAgrupados = this.agruparTalleresPorPlacas(todosLosTalleres);

		// Si hay coordenadas, ordenar por distancia
		if (latitud !== undefined && longitud !== undefined && talleresAgrupados.length > 0) {
			this.logger.log('Ordenamiento por cercanía: priorizando talleres más cercanos después de agrupar');
			talleresAgrupados = talleresAgrupados.sort((a, b) => {
				const distA = a.distanciaKm ?? Number.POSITIVE_INFINITY;
				const distB = b.distanciaKm ?? Number.POSITIVE_INFINITY;
				return distA - distB;
			});
		}

		// Aplicar límite top después de agrupar
		if (top !== undefined && top > 0) {
			this.logger.log(`Limitando resultados combinados: retornando los ${top} talleres más relevantes`);
			talleresAgrupados = talleresAgrupados.slice(0, top);
		}

		this.logger.log(`Resultados combinados: ${talleresAgrupados.length} talleres únicos disponibles para todos los vehículos`);

		return talleresAgrupados;
	}

	private async obtenerVehiculosDelCliente(dniCliente: string): Promise<VehiculoRow[]> {
		this.logger.log(`Consultando vehículos: obteniendo todos los vehículos con cobertura activa del cliente DNI=${dniCliente}`);

		const query = `
      SELECT DISTINCT
        v.id AS id_vehiculo,
        p.id AS id_poliza,
        p.numero AS poliza,
        v.placa,
        m.nombre AS marca,
        mo.nombre AS modelo,
        v.anio,
        pv.fecha_inicio_cobertura,
        pv.fecha_fin_cobertura,
        TIMESTAMPDIFF(YEAR, STR_TO_DATE(CONCAT(v.anio, '-01-01'), '%Y-%m-%d'), CURDATE()) AS antiguedad_vehiculo
      FROM vehiculos v
      INNER JOIN polizas_vehiculos pv ON v.id = pv.id_vehiculo
      INNER JOIN polizas p ON pv.id_poliza = p.id
      INNER JOIN clientes c ON p.id_cliente = c.id
      INNER JOIN marcas m ON v.id_marca = m.id
      LEFT JOIN modelos mo ON v.id_modelo = mo.id
      WHERE c.dni = ?
        AND p.estado = 'activa'
        AND (pv.fecha_fin_cobertura IS NULL OR pv.fecha_fin_cobertura >= CURDATE())
    `;

		const vehiculos = await this.dbHelper.query<VehiculoRow>(query, [dniCliente]);

		this.logger.log(`Vehículos encontrados: ${vehiculos.length} vehículos con cobertura activa`);
		vehiculos.forEach(v => {
			this.logger.log(`  - Placa ${v.placa} (${v.marca} ${v.modelo || ''} ${v.anio}) - Póliza ${v.poliza}`);
		});

		return vehiculos;
	}

	private aplicarFiltrosOpcionales(
		conditions: string[],
		params: any[],
		distrito?: string,
		tipoTaller?: string,
		latitud?: number,
		longitud?: number,
		radioKm?: number,
	): void {
		if (distrito) {
			this.logger.log('Filtro por distrito: limitando resultados a sucursales en la ubicación geográfica solicitada');
			conditions.push('s.distrito = ?');
			params.push(distrito);
		}

		if (tipoTaller) {
			this.logger.log('Filtro por tipo: aplicando lógica de filtrado según concepto de negocio');

			const tipoNormalizado = tipoTaller.toUpperCase();

			if (tipoNormalizado === 'MULTIMARCA') {
				// Filtrar por talleres multimarca (independiente del tipo)
				this.logger.log('Filtrando por Multimarca: talleres con es_multimarca = TRUE');
				conditions.push('t.es_multimarca = TRUE');
			} else if (tipoNormalizado === 'CONCESIONARIO') {
				// Filtrar por concesionarios y servicios especializados (no multimarca)
				this.logger.log('Filtrando por Concesionario: talleres tipo CONCESIONARIO o SERVICIO_ESPECIALIZADO');
				conditions.push("(t.tipo = 'CONCESIONARIO' OR t.tipo = 'SERVICIO_ESPECIALIZADO')");
			} else {
				// Si envía el tipo exacto de BD (CONCESIONARIO, SERVICIO_ESPECIALIZADO)
				this.logger.log(`Filtrando por tipo exacto de BD: ${tipoTaller}`);
				conditions.push('t.tipo = ?');
				params.push(tipoTaller);
			}
		}

		// Filtro de geolocalización: Bounding Box para pre-filtrar candidatos cercanos
		if (latitud !== undefined && longitud !== undefined) {
			this.logger.log('Filtro geográfico: aplicando Bounding Box para pre-seleccionar talleres cercanos antes del cálculo exacto');

			const radioGrados = (radioKm || 50) / 111;

			conditions.push('s.latitud IS NOT NULL');
			conditions.push('s.longitud IS NOT NULL');
			conditions.push('s.latitud BETWEEN ? AND ?');
			conditions.push('s.longitud BETWEEN ? AND ?');

			params.push(latitud - radioGrados);
			params.push(latitud + radioGrados);
			params.push(longitud - radioGrados);
			params.push(longitud + radioGrados);
		}
	}

	private eliminarDuplicados(talleres: TallerDto[]): TallerDto[] {
		const seen = new Set<string>();
		const duplicadosEliminados = talleres.filter((taller) => {
			const key = `${taller.nombre.toLowerCase()}|${taller.direccion.toLowerCase()}`;
			if (seen.has(key)) {
				return false;
			}
			seen.add(key);
			return true;
		});

		const cantidadDuplicados = talleres.length - duplicadosEliminados.length;
		if (cantidadDuplicados > 0) {
			this.logger.log(`Eliminación de duplicados: ${cantidadDuplicados} registros removidos (mismo taller en múltiples redes)`);
		}

		return duplicadosEliminados;
	}

	private agruparTalleresPorPlacas(talleres: (TallerDto & { placaAsociada: string })[]): TallerDto[] {
		const talleresMap = new Map<string, TallerDto & { placas: Set<string> }>();

		for (const taller of talleres) {
			const key = `${taller.nombre.toLowerCase()}|${taller.direccion.toLowerCase()}`;

			if (talleresMap.has(key)) {
				// Taller ya existe, agregar placa
				talleresMap.get(key)!.placas.add(taller.placaAsociada);
			} else {
				// Nuevo taller, crear entrada
				const { placaAsociada, ...tallerSinPlaca } = taller;
				talleresMap.set(key, {
					...tallerSinPlaca,
					placas: new Set([placaAsociada])
				});
			}
		}

		// Convertir Set de placas a array
		const talleresAgrupados: TallerDto[] = Array.from(talleresMap.values()).map(taller => {
			const { placas, ...tallerDto } = taller;
			return {
				...tallerDto,
				placasAtendidas: Array.from(placas).sort()
			};
		});

		const totalPlacasAgrupadas = talleresAgrupados.reduce(
			(sum, t) => sum + (t.placasAtendidas?.length || 0),
			0
		);

		this.logger.log(`Agrupación completada: ${talleresAgrupados.length} talleres únicos con ${totalPlacasAgrupadas} asociaciones de placas`);

		return talleresAgrupados;
	}

	private rowToDto(row: TallerRow): TallerDto {
		const dto: TallerDto = {
			id: row.id,
			nombre: row.nombre,
			nombreSucursal: row.nombre_sucursal,
			direccion: row.direccion,
			distrito: row.distrito,
			tipo: row.tipo,
			esMultimarca: Boolean(row.es_multimarca),
			marcasAtendidas: row.marcas ? row.marcas.split(',') : [],
			codigoRedTaller: row.codigo_red_taller,
			categoriaTaller: row.categoria_taller || undefined,
			telefono: row.telefono || undefined,
			latitud: row.latitud || undefined,
			longitud: row.longitud || undefined,
		};

		// Agregar distancia si está disponible en el row
		if (row.distancia_km !== undefined && row.distancia_km !== null) {
			dto.distanciaKm = Number(row.distancia_km.toFixed(2));
		}

		// Validar antigüedad del vehículo para Talleres Adicionales (requiere_validacion_antiguedad)
		if (row.requiere_validacion_antiguedad && row.anio_vehiculo) {
			const anioActual = new Date().getFullYear();
			const antiguedadVehiculo = anioActual - row.anio_vehiculo;
			const aniosMaximos = row.anios_maximos_antiguedad || 0;
			const esNuevo = row.es_vehiculo_nuevo === 1;

			// AMBAS condiciones deben cumplirse: es_nuevo = TRUE AND antigüedad <= 4 años
			const cumpleRequisitos = esNuevo && antiguedadVehiculo <= aniosMaximos;

			dto.requiereValidacionAntiguedad = true;
			dto.aniosMaximosAntiguedad = row.anios_maximos_antiguedad || undefined;
			dto.recargoDeducible = row.recargo_deducible || undefined;
			dto.requiereAprobacion = Boolean(row.requiere_aprobacion);
			dto.cumpleRequisitosAntiguedad = cumpleRequisitos;
		}

		return dto;
	}
}
