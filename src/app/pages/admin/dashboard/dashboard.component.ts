import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { PontoService } from '../../../core/services/ponto.service';
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
    private router: Router
  ) { }

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

  carregarFuncionariosTrabalhando(): void {
    const pontos = this.pontoService.getAllPontosPublic();

    this.funcionariosTrabalhando = Object.entries(pontos)
      .map(([email, ponto]) => ({ email, ponto }))
      .filter(f => f.ponto.entrada && !f.ponto.saidaFinal);
  }

  tempoTrabalhando(ponto: Ponto): string {
    if (!ponto.entrada) return '00:00:00';

    const agora = this.agora.getTime();
    let total = 0;

    const entrada = new Date(ponto.entrada).getTime();

    // ⏳ Antes do almoço
    if (ponto.saidaAlmoco) {
      total += new Date(ponto.saidaAlmoco).getTime() - entrada;
    } else {
      total += agora - entrada;
    }

    // ⏳ Depois do almoço
    if (ponto.voltaAlmoco) {
      const volta = new Date(ponto.voltaAlmoco).getTime();

      if (ponto.saidaFinal) {
        total += new Date(ponto.saidaFinal).getTime() - volta;
      } else {
        total += agora - volta;
      }
    }

    // ⏸️ DESCONTA PAUSAS MANUAIS
    if (ponto.pausas?.length) {
      for (const pausa of ponto.pausas) {
        const inicio = new Date(pausa.inicio).getTime();
        const fim = pausa.fim
          ? new Date(pausa.fim).getTime()
          : agora;

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
}