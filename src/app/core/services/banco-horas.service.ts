import { Injectable } from '@angular/core';
import { BancoHorasMensal, BancoHorasDia } from '../models/banco-horas.model';
import { Ponto } from '../models/ponto.model';
import { ConfiguracaoService } from './configuracao.service';

@Injectable({ providedIn: 'root' })
export class BancoHorasService {

  constructor(
    private configService: ConfiguracaoService
  ) {}

  gerarDia(
    email: string,
    ponto: Ponto,
    data: Date
  ): BancoHorasDia {

    const config = this.configService.obter(email);

    const minutosEsperados = config.cargaDiariaMinutos;
    const minutosTrabalhados = this.calcularMinutosTrabalhados(ponto);

    const saldo = minutosTrabalhados - minutosEsperados;

    return {
      data: data.toISOString().split('T')[0],
      minutosTrabalhados,
      minutosEsperados,
      saldoMinutos: saldo
    };
  }

  gerarMes(
    email: string,
    pontos: Record<string, Ponto>,
    ano: number,
    mes: number
  ): BancoHorasMensal {

    const dias: BancoHorasDia[] = [];
    let saldoTotal = 0;

    Object.entries(pontos).forEach(([dataStr, ponto]) => {
      const data = new Date(dataStr);

      if (
        data.getFullYear() === ano &&
        data.getMonth() === mes
      ) {
        const dia = this.gerarDia(email, ponto, data);
        dias.push(dia);
        saldoTotal += dia.saldoMinutos;
      }
    });

    return {
      emailUsuario: email,
      mes: `${ano}-${String(mes + 1).padStart(2, '0')}`,
      dias,
      saldoTotalMinutos: saldoTotal
    };
  }

  private calcularMinutosTrabalhados(ponto: Ponto): number {
    if (!ponto.entrada || !ponto.saidaFinal) return 0;

    let total =
      new Date(ponto.saidaFinal).getTime() -
      new Date(ponto.entrada).getTime();

    // ⏳ Almoço
    if (ponto.saidaAlmoco && ponto.voltaAlmoco) {
      total -=
        new Date(ponto.voltaAlmoco).getTime() -
        new Date(ponto.saidaAlmoco).getTime();
    }

    // ⏸️ Pausas manuais
    ponto.pausas?.forEach(p => {
      if (p.fim) {
        total -=
          new Date(p.fim).getTime() -
          new Date(p.inicio).getTime();
      }
    });

    // converte para minutos
    return Math.floor(total / 60000);
  }
}
