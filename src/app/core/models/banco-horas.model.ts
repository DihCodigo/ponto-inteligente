export interface BancoHorasDia {
  data: string; // YYYY-MM-DD
  minutosTrabalhados: number;
  minutosEsperados: number;
  saldoMinutos: number;
}

export interface BancoHorasMensal {
  emailUsuario: string;
  mes: string; // YYYY-MM
  dias: BancoHorasDia[];
  saldoTotalMinutos: number;
}
