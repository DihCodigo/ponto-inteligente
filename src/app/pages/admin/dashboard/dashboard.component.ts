import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';
import { PontoService } from '../../../core/services/ponto.service';
import { ConfiguracaoService } from '../../../core/services/configuracao.service';

import { HoraExtra } from '../../../core/models/hora-extra.model';
import { Ponto } from '../../../core/models/ponto.model';

@Component({
  standalone: true,
  selector: 'app-admin-dashboard',
  templateUrl: './dashboard.component.html',
  imports: [CommonModule],
})
export class AdminDashboardComponent implements OnInit, OnDestroy {

  horasExtras: HoraExtra[] = [];
  funcionariosTrabalhando: { email: string; ponto: Ponto }[] = [];

  agora: Date = new Date();
  private timer!: any;

  constructor(
    private pontoService: PontoService,
    private auth: AuthService,
    private router: Router,
    private configService: ConfiguracaoService
  ) {}

  ngOnInit(): void {
    this.carregarHorasExtras();
    this.carregarFuncionariosTrabalhando();

    this.timer = setInterval(() => {
      this.agora = new Date();
    }, 1000);
  }

  ngOnDestroy(): void {
    clearInterval(this.timer);
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  carregarHorasExtras(): void {
    this.horasExtras = this.pontoService
      .getTodasHorasExtras()
      .filter(h => h.status === 'PENDENTE');
  }

  aprovar(h: HoraExtra): void {
    h.status = 'APROVADA';
    h.iniciadaEm = new Date();
    this.pontoService.atualizarHoraExtra(h);
    this.carregarHorasExtras();
  }

  reprovar(h: HoraExtra): void {
    h.status = 'REPROVADA';
    this.pontoService.atualizarHoraExtra(h);
    this.carregarHorasExtras();
  }

  carregarFuncionariosTrabalhando(): void {
    const pontos = this.pontoService.getAllPontosPublic();

    this.funcionariosTrabalhando = Object.entries(pontos)
      .map(([email, ponto]) => ({ email, ponto }))
      .filter(f => f.ponto?.entrada && !f.ponto?.saidaFinal);
  }

  tempoTrabalhando(ponto: Ponto): string {
    if (!ponto?.entrada) return '00:00:00';

    const agora = this.agora.getTime();
    let total = 0;

    const entrada = new Date(ponto.entrada).getTime();

    if (ponto.saidaAlmoco) {
      total += new Date(ponto.saidaAlmoco).getTime() - entrada;
    } else {
      total += agora - entrada;
    }

    if (ponto.voltaAlmoco) {
      const volta = new Date(ponto.voltaAlmoco).getTime();

      if (ponto.saidaFinal) {
        total += new Date(ponto.saidaFinal).getTime() - volta;
      } else {
        total += agora - volta;
      }
    }

    if (ponto.pausas?.length) {
      for (const pausa of ponto.pausas) {
        const inicio = new Date(pausa.inicio).getTime();
        const fim = pausa.fim ? new Date(pausa.fim).getTime() : agora;
        total -= fim - inicio;
      }
    }

    return this.formatarTempo(Math.max(total, 0));
  }

  private formatarTempo(ms: number): string {
    const horas = Math.floor(ms / 3600000);
    const minutos = Math.floor((ms % 3600000) / 60000);
    const segundos = Math.floor((ms % 60000) / 1000);
    return `${this.pad(horas)}:${this.pad(minutos)}:${this.pad(segundos)}`;
  }

  private pad(n: number): string {
    return n < 10 ? '0' + n : n.toString();
  }

  definirCargaHoraria(email: string): void {
    const valor = prompt(
      `Definir carga horária diária para ${email} (HH:mm)`,
      '08:00'
    );

    if (!valor) return;

    const [h, m] = valor.split(':').map(Number);

    if (
      isNaN(h) || isNaN(m) ||
      h < 0 || m < 0 || m > 59
    ) {
      alert('Formato inválido. Use HH:mm (ex: 08:48)');
      return;
    }

    const minutos = h * 60 + m;

    this.configService.salvar({
      emailUsuario: email,
      cargaDiariaMinutos: minutos
    });

    alert('Carga horária diária salva com sucesso.');
  }

  obterCargaHoraria(email: string): string {
    const minutos = this.configService.obter(email)?.cargaDiariaMinutos ?? 0;
    return this.formatarCargaHoraria(minutos);
  }

  private formatarCargaHoraria(minutos: number): string {
    const h = Math.floor(minutos / 60);
    const m = minutos % 60;
    return `${this.pad(h)}:${this.pad(m)}`;
  }
}
