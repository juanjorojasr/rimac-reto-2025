import { TallerDto } from './taller.dto';

export class BuscarTalleresResDto {
  status: 'success' | 'fail' | 'error';
  data?: {
    talleres: TallerDto[];
    total: number;
  };
  message?: string;
  code: number;
}
