export interface DeducibleExtraido {
  deducible: number;
  copago: number;
  moneda: string;
  tipo: string;
  marca: string;
  taller: string;
}

export interface ExtraerDeducibleResDto {
  payload: DeducibleExtraido[];
  statusCode: number;
}
