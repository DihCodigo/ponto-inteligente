export type StatusHoraExtra =
  | 'PENDENTE'
  | 'APROVADA'
  | 'REPROVADA'
  | 'ENCERRADA';

export interface HoraExtra {
  emailUsuario: string;
  motivo: string;
  status: StatusHoraExtra;
  iniciadaEm?: Date;
  encerradaEm?: Date;
}
