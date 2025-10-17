import { Module } from '@nestjs/common';
import { TalleresController } from '../controllers/talleres.controller';
import { TalleresService } from '../services/talleres.service';
import { TalleresRepository } from '../repositories/talleres.repository';
import { DatabaseHelper } from '../database/database.helper';

@Module({
  controllers: [TalleresController],
  providers: [TalleresService, TalleresRepository, DatabaseHelper],
})
export class TalleresModule {}
