import { IsDefined, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class ApiRequest<T> {
  @IsDefined()
  @ValidateNested()
  @Type(() => Object)
  payload: T;
}
