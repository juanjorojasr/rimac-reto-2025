import { Controller, Post, Body } from '@nestjs/common';
import { DeduciblesService } from '../services/deducibles.service';
import { ApiRequest } from '../dto/common/api-request.dto';
import { ExtraerDeducibleReqDto } from '../dto/deducibles/extraer-deducible.req.dto';
import type { ExtraerDeducibleResDto } from '../dto/deducibles/extraer-deducible.res.dto';

@Controller('deducibles')
export class DeduciblesController {
	constructor(private readonly deduciblesService: DeduciblesService) { }

	@Post('extraer')
	extraerDeducible(
		@Body() body: ApiRequest<ExtraerDeducibleReqDto>,
	): ExtraerDeducibleResDto {
		const deducibles = this.deduciblesService.extraerDeducible(body.payload);

		return {
			payload: deducibles,
			statusCode: 200,
		};
	}
}
