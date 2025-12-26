import { Injectable } from '@angular/core';
import { ConfiguracaoCargaHoraria } from '../models/configuracao-carga-horaria.model';

@Injectable({
  providedIn: 'root',
})
export class ConfiguracaoService {

  private STORAGE_KEY = 'configuracao_carga_horaria';

  salvar(config: ConfiguracaoCargaHoraria): void {
    const configs = this.getAll();

    configs[config.emailUsuario] = config;

    localStorage.setItem(
      this.STORAGE_KEY,
      JSON.stringify(configs)
    );
  }

  obter(email: string): ConfiguracaoCargaHoraria {
    const configs = this.getAll();

    // default profissional
    return (
      configs[email] ?? {
        emailUsuario: email,
        cargaDiariaMinutos: 8 * 60 // padrão 8h
      }
    );
  }

  private getAll(): Record<string, ConfiguracaoCargaHoraria> {
    return JSON.parse(
      localStorage.getItem(this.STORAGE_KEY) || '{}'
    );
  }
}
