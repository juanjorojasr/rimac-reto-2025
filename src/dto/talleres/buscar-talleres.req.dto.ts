import { IsOptional, IsString, IsNumber, Min, Max } from 'class-validator';

export class BuscarTalleresReqDto {
  @IsOptional()
  @IsString()
  placa?: string;

  @IsOptional()
  @IsString()
  distrito?: string;

  @IsOptional()
  @IsString()
  tipoTaller?: string;

  @IsOptional()
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitud?: number;

  @IsOptional()
  @IsNumber()
  @Min(-180)
  @Max(180)
  longitud?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  radioKm?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  top?: number;
}
