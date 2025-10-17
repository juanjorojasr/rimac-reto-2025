import { Injectable, Logger } from '@nestjs/common';
import { TalleresRepository } from '../repositories/talleres.repository';
import { BuscarTalleresReqDto } from '../dto/talleres/buscar-talleres.req.dto';
import { TallerDto } from '../dto/talleres/taller.dto';

@Injectable()
export class TalleresService {
  private readonly logger = new Logger(TalleresService.name);

  constructor(private readonly talleresRepository: TalleresRepository) {}

  async buscarTalleres(
    payload: BuscarTalleresReqDto,
    dniCliente: string,
  ): Promise<TallerDto[]> {
    this.logger.log('Iniciando búsqueda: recibiendo filtros del cliente para determinar talleres disponibles según póliza');

    let idPoliza: number | undefined;
    let placa: string | undefined;

    // Si se proporciona placa, validar propiedad del vehículo
    if (payload.placa) {
      this.logger.log('Validando propiedad: verificando que el vehículo pertenezca al cliente y tenga cobertura activa');

      const vehiculo = await this.talleresRepository.obtenerVehiculoPorPlaca(
        payload.placa,
        dniCliente,
      );

      if (!vehiculo) {
        this.logger.warn('Validación fallida: la placa no pertenece al cliente o no tiene cobertura vigente');
        return [];
      }

      this.logger.log('Validación exitosa: vehículo identificado para filtrar talleres por marca y antigüedad');

      idPoliza = vehiculo.id_poliza;
      placa = payload.placa;
    } else {
      this.logger.log('Búsqueda amplia: sin placa específica, se retornarán talleres de todas las redes VEHA del cliente');
    }

    // Buscar talleres aplicando filtros
    this.logger.log('Consultando talleres: filtrando por redes VEHA, cobertura activa y criterios adicionales');

    const talleres = await this.talleresRepository.buscarPorClienteYFiltros(
      dniCliente,
      idPoliza,
      placa,
      payload.distrito,
      payload.tipoTaller,
      payload.latitud,
      payload.longitud,
      payload.radioKm,
      payload.top,
    );

    this.logger.log(`Resultados obtenidos: ${talleres.length} talleres cumplen los criterios de búsqueda`);
    this.logger.log(`Búsqueda completada: retornando ${talleres.length} talleres disponibles al cliente`);

    return talleres;
  }
}
