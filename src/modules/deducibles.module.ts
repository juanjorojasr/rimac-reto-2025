import { Module } from '@nestjs/common';
import { DeduciblesController } from '../controllers/deducibles.controller';
import { DeduciblesService } from '../services/deducibles.service';

@Module({
  controllers: [DeduciblesController],
  providers: [DeduciblesService],
})
export class DeduciblesModule {}
