import { Injectable } from '@angular/core';
import { HoraExtra } from '../models/hora-extra.model';
import { PontoService } from './ponto.service';

@Injectable({ providedIn: 'root' })
export class HoraExtraService {

  constructor(private pontoService: PontoService) {}

  getHorasExtras(): HoraExtra[] {
    return this.pontoService.getDiaAtual().horasExtras;
  }

  getHoraExtraAtiva(): HoraExtra | undefined {
    return this.getHorasExtras().find(h => h.status === 'APROVADA');
  }

  solicitar(motivo: string) {
    const nova: HoraExtra = {
      motivo,
      status: 'PENDENTE',
      solicitadaEm: new Date()
    };

    this.getHorasExtras().push(nova);

    // Simulação aprovação admin
    setTimeout(() => {
      nova.status = 'APROVADA';
      nova.respondidaEm = new Date();
      nova.iniciadaEm = new Date();
    }, 3000);
  }

  encerrar(horaExtra: HoraExtra) {
    horaExtra.status = 'ENCERRADA';
    horaExtra.encerradaEm = new Date();
  }
}
