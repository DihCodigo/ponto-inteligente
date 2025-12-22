import { RegistroPonto } from './registro-ponto.model';
import { HoraExtra } from './hora-extra.model';

export interface DiaTrabalho {
  data: string; // YYYY-MM-DD
  ponto: RegistroPonto;
  horasExtras: HoraExtra[];
}
