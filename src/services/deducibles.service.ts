import { Injectable } from '@nestjs/common';
import { ExtraerDeducibleReqDto } from '../dto/deducibles/extraer-deducible.req.dto';
import { DeducibleExtraido } from '../dto/deducibles/extraer-deducible.res.dto';
import { extraerDeducibleUtil } from '../utils/deducible.util';

@Injectable()
export class DeduciblesService {
  extraerDeducible(payload: ExtraerDeducibleReqDto): DeducibleExtraido[] {
    const resultado = extraerDeducibleUtil(payload);
    return resultado.deducibles;
  }
}
