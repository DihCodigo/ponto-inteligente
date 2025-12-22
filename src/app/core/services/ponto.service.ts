import { Injectable } from '@angular/core';
import { Ponto } from '../models/ponto.model';
import { HoraExtra } from '../models/hora-extra.model';

@Injectable({ providedIn: 'root' })
export class PontoService {
  private PONTOS_KEY = 'pontos_por_usuario';
  private HORAS_EXTRA_KEY = 'horas_extra_por_usuario';

  getPonto(email: string): Ponto {
    const data = this.getAllPontos();
    return data[email] || {};
  }

  salvarPonto(email: string, ponto: Ponto): void {
    const data = this.getAllPontos();
    data[email] = ponto;
    localStorage.setItem(this.PONTOS_KEY, JSON.stringify(data));
  }

  getHorasExtras(email: string): HoraExtra[] {
    const data = this.getAllHorasExtras();
    return data[email] || [];
  }

  salvarHorasExtras(email: string, horas: HoraExtra[]): void {
    const data = this.getAllHorasExtras();
    data[email] = horas;
    localStorage.setItem(this.HORAS_EXTRA_KEY, JSON.stringify(data));
  }

  getTodasHorasExtras(): HoraExtra[] {
    const data = this.getAllHorasExtras();
    return Object.values(data).flat();
  }

  private getAllPontos(): Record<string, Ponto> {
    return JSON.parse(localStorage.getItem(this.PONTOS_KEY) || '{}');
  }

  private getAllHorasExtras(): Record<string, HoraExtra[]> {
    return JSON.parse(localStorage.getItem(this.HORAS_EXTRA_KEY) || '{}');
  }

  atualizarHoraExtra(hora: HoraExtra): void {
  const data = this.getAllHorasExtras();
  const horasUsuario = data[hora.emailUsuario] || [];

  const index = horasUsuario.findIndex(
    h =>
      h.motivo === hora.motivo &&
      h.status !== 'ENCERRADA'
  );

  if (index !== -1) {
    horasUsuario[index] = hora;
    data[hora.emailUsuario] = horasUsuario;
    localStorage.setItem(this.HORAS_EXTRA_KEY, JSON.stringify(data));
  }
}

}


