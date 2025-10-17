export class TallerDto {
	id: number;
	nombre: string;
	nombreSucursal: string;
	direccion: string;
	distrito: string;
	telefono?: string;
	tipo: string;
	esMultimarca: boolean;
	marcasAtendidas: string[];
	codigoRedTaller: string; // VEHA03, VEHA09, VEHA10
	categoriaTaller?: string; // Solo para VEHA03
	latitud?: number;
	longitud?: number;
	distanciaKm?: number; // distancia desde coordenadas proporcionadas
	requiereValidacionAntiguedad?: boolean; // según categoría se valida antigüedad
	aniosMaximosAntiguedad?: number;
	recargoDeducible?: number; // recargo si excede antigüedad
	requiereAprobacion?: boolean; // requiere aprobación de Rímac
	cumpleRequisitosAntiguedad?: boolean;
	placasAtendidas?: string[]; // placas de vehículos que puede atender en esta sucursal
}
