import { Injectable, NestMiddleware } from '@nestjs/common';
import { CLIENTE_AUTENTICADO } from '../constants/session.constants';

@Injectable()
export class SessionMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    // simular obtener userSession
    req['userSession'] = CLIENTE_AUTENTICADO;
    next();
  }
}
