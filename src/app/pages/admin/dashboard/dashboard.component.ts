import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PontoService } from '../../../core/services/ponto.service';
import { HoraExtra } from '../../../core/models/hora-extra.model';

@Component({
  standalone: true,
  selector: 'app-admin-dashboard',
  templateUrl: './dashboard.component.html',
  imports: [CommonModule],
})
export class AdminDashboardComponent implements OnInit {
  horasExtras: HoraExtra[] = [];

  constructor(private pontoService: PontoService) {}

  ngOnInit(): void {
    this.carregar();
  }

  carregar() {
    this.horasExtras = this.pontoService
      .getTodasHorasExtras()
      .filter(h => h.status === 'PENDENTE');
  }

  aprovar(h: HoraExtra) {
    h.status = 'APROVADA';
    h.iniciadaEm = new Date();

    this.pontoService.atualizarHoraExtra(h);
    this.carregar();
  }

  reprovar(h: HoraExtra) {
    h.status = 'REPROVADA';

    this.pontoService.atualizarHoraExtra(h);
    this.carregar();
  }
}
