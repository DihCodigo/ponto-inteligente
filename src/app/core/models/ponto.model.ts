export interface Pausa {
  inicio: Date;
  fim?: Date;
}

export interface Ponto {
  entrada?: Date;
  saidaAlmoco?: Date;
  voltaAlmoco?: Date;
  saidaFinal?: Date;
  pausas?: Pausa[];
}
