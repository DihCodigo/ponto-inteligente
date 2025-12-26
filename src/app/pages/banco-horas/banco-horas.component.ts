import { Component, OnInit } from '@angular/core';
import { BancoHorasService } from '../../core/services/banco-horas.service';
import { BancoHorasMensal } from '../../core/models/banco-horas.model';
import { AuthService } from '../../core/services/auth.service';
import { PontoService } from '../../core/services/ponto.service';

@Component({
  selector: 'app-banco-horas',
  templateUrl: './banco-horas.component.html'
})
export class BancoHorasComponent implements OnInit {

  banco!: BancoHorasMensal;

  ano = new Date().getFullYear();
  mes = new Date().getMonth();

  constructor(
    private bancoHorasService: BancoHorasService,
    private auth: AuthService,
    private pontoService: PontoService
  ) {}

  ngOnInit(): void {
    const email = this.auth.usuarioLogado.email;
    const pontos = this.pontoService.obterPontosUsuario(email);

    this.banco = this.bancoHorasService.gerarMes(
      email,
      pontos,
      this.ano,
      this.mes
    );
  }

  formatarMinutos(min: number): string {
    const sinal = min < 0 ? '-' : '';
    const abs = Math.abs(min);
    const h = Math.floor(abs / 60);
    const m = abs % 60;
    return `${sinal}${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;
  }
  
  exportarCSV(): void {
  if (!this.banco) return;

  const linhas: string[] = [];

  // Cabeçalho
  linhas.push('Data,Trabalhado (min),Esperado (min),Saldo (min)');

  // Conteúdo
  this.banco.dias.forEach(d => {
    linhas.push(
      `${d.data},${d.minutosTrabalhados},${d.minutosEsperados},${d.saldoMinutos}`
    );
  });

  // Total do mês
  linhas.push('');
  linhas.push(`Saldo Total (min),,,${this.banco.saldoTotalMinutos}`);

  const csv = linhas.join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `banco-horas-${this.banco.mes}.csv`;
  link.click();

  URL.revokeObjectURL(url);
}

}
