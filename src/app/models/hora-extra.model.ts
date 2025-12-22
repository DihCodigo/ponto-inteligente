export type StatusHoraExtra = 'PENDENTE' | 'APROVADA' | 'NEGADA' | 'ENCERRADA';

export interface HoraExtra {
  motivo: string;
  status: StatusHoraExtra;
  solicitadaEm: Date;
  respondidaEm?: Date;
  iniciadaEm?: Date;
  encerradaEm?: Date;
}
