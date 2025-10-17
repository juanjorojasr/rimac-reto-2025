import { IsString, IsDefined } from 'class-validator';

export class ExtraerDeducibleReqDto {
  @IsDefined()
  @IsString()
  text: string;
}
