import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { PontoService } from '../../../core/services/ponto.service';
import { Ponto, Pausa } from '../../../core/models/ponto.model';
import { HoraExtra } from '../../../core/models/hora-extra.model';

@Component({
  standalone: true,
  selector: 'app-user-dashboard',
  templateUrl: './dashboard.component.html',
  imports: [CommonModule],
})
export class UserDashboardComponent implements OnInit {
  email!: string;
  ponto!: Ponto;
  horasExtras: HoraExtra[] = [];
  horaExtraAtiva: HoraExtra | null = null;

  constructor(
    private auth: AuthService,
    private pontoService: PontoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.email = this.auth.getUser()!.email;
    this.ponto = this.pontoService.getPonto(this.email);

    if (!this.ponto.pausas) {
      this.ponto.pausas = [];
    }

    this.horasExtras = this.pontoService.getHorasExtras(this.email);
    this.horaExtraAtiva =
      this.horasExtras.find(h => h.status === 'APROVADA') || null;
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  salvar() {
    this.pontoService.salvarPonto(this.email, this.ponto);
  }

  registrarEntrada() {
    this.ponto.entrada = new Date();
    this.salvar();
  }

  registrarSaidaAlmoco() {
    this.ponto.saidaAlmoco = new Date();
    this.salvar();
  }

  registrarVoltaAlmoco() {
    this.ponto.voltaAlmoco = new Date();
    this.salvar();
  }

  registrarSaidaFinal() {
    this.ponto.saidaFinal = new Date();
    this.salvar();
  }

  estaEmPausa(): boolean {
    const ultima = this.ponto.pausas?.at(-1);
    return !!ultima && !ultima.fim;
  }

  pausarTrabalho() {
    this.ponto.pausas!.push({
      inicio: new Date(),
    });
    this.salvar();
  }

  retomarTrabalho() {
    const ultima = this.ponto.pausas?.at(-1);
    if (ultima && !ultima.fim) {
      ultima.fim = new Date();
      this.salvar();
    }
  }

  podeSolicitarHoraExtra(): boolean {
    return !!this.ponto.saidaFinal && !this.horaExtraAtiva;
  }

  solicitarHoraExtra() {
    const motivo = prompt('Motivo da hora extra:');
    if (!motivo) return;

    const hora: HoraExtra = {
      emailUsuario: this.email,
      motivo,
      status: 'PENDENTE',
      iniciadaEm: new Date(),
    };

    this.horasExtras.push(hora);
    this.pontoService.salvarHorasExtras(this.email, this.horasExtras);
  }

  encerrarHoraExtra(h: HoraExtra) {
    h.status = 'ENCERRADA';
    h.encerradaEm = new Date();
    this.horaExtraAtiva = null;
    this.pontoService.salvarHorasExtras(this.email, this.horasExtras);
  }
}
