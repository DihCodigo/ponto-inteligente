import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { PontoService } from '../../../core/services/ponto.service';
import { Ponto } from '../../../core/models/ponto.model';
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
    private pontoService: PontoService
  ) {}

  ngOnInit(): void {
    this.email = this.auth.getUser()!.email;
    this.ponto = this.pontoService.getPonto(this.email);
    this.horasExtras = this.pontoService.getHorasExtras(this.email);
    this.horaExtraAtiva =
      this.horasExtras.find(h => h.status === 'APROVADA') || null;
  }

  registrarEntrada() {
    this.ponto.entrada = new Date();
    this.pontoService.salvarPonto(this.email, this.ponto);
  }

  registrarSaidaAlmoco() {
    this.ponto.saidaAlmoco = new Date();
    this.pontoService.salvarPonto(this.email, this.ponto);
  }

  registrarVoltaAlmoco() {
    this.ponto.voltaAlmoco = new Date();
    this.pontoService.salvarPonto(this.email, this.ponto);
  }

  registrarSaidaFinal() {
    this.ponto.saidaFinal = new Date();
    this.pontoService.salvarPonto(this.email, this.ponto);
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
