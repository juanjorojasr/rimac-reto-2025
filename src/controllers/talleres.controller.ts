import { Controller, Post, Body } from '@nestjs/common';
import { TalleresService } from '../services/talleres.service';
import { ApiRequest } from '../dto/common/api-request.dto';
import { BuscarTalleresReqDto } from '../dto/talleres/buscar-talleres.req.dto';
import { BuscarTalleresResDto } from '../dto/talleres/buscar-talleres.res.dto';
import { UserSession } from '../decorators/user.decorator';

@Controller('talleres')
export class TalleresController {
	constructor(private readonly talleresService: TalleresService) { }

	@Post('buscar')
	async buscarTalleres(
		@Body() body: ApiRequest<BuscarTalleresReqDto>,
		@UserSession() userSession: any,
	): Promise<BuscarTalleresResDto> {
		console.log('Usuario logueado:', userSession.nombreCompleto);
		console.log('DNI:', userSession.dni);

		try {
			const talleres = await this.talleresService.buscarTalleres(
				body.payload,
				userSession.dni,
			);

			return {
				status: 'success',
				data: {
					talleres,
					total: talleres.length,
				},
				code: 200,
			};
		} catch (error) {
			return {
				status: 'error',
				message: error.message || 'Error al buscar talleres',
				code: 500,
			};
		}
	}
}
