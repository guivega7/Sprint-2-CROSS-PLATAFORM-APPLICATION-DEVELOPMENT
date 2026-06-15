export type StatusVegetacao = 'Normal' | 'Atenção' | 'Crítico';
export type StatusOcorrencia = 'Pendente' | 'Em Execução' | 'Concluído';

export interface Trecho {
  id: string;
  rodovia: string;
  kmInicial: number;
  kmFinal: number;
  statusVegetacao: StatusVegetacao;
  ultimaInspecao: string;
}

export interface Ocorrencia {
  id: string;
  trechoId: string;
  kmExato: number;
  tipo: string;
  status: StatusOcorrencia;
  dataRegistro: string;
  descricao: string;
}

export const trechosMock: Trecho[] = [
  {
    id: 't1',
    rodovia: 'SP-270 - Rodovia Raposo Tavares',
    kmInicial: 18,
    kmFinal: 34,
    statusVegetacao: 'Normal',
    ultimaInspecao: '2026-06-10T08:20:00.000Z',
  },
  {
    id: 't2',
    rodovia: 'SP-270 - Rodovia Raposo Tavares',
    kmInicial: 34,
    kmFinal: 52,
    statusVegetacao: 'Atenção',
    ultimaInspecao: '2026-06-11T10:05:00.000Z',
  },
  {
    id: 't3',
    rodovia: 'SP-270 - Rodovia Raposo Tavares',
    kmInicial: 52,
    kmFinal: 68,
    statusVegetacao: 'Crítico',
    ultimaInspecao: '2026-06-12T14:45:00.000Z',
  },
  {
    id: 't4',
    rodovia: 'SP-280 - Rodovia Castelo Branco',
    kmInicial: 22,
    kmFinal: 40,
    statusVegetacao: 'Normal',
    ultimaInspecao: '2026-06-09T09:10:00.000Z',
  },
  {
    id: 't5',
    rodovia: 'SP-075 - Rodovia Santos Dumont',
    kmInicial: 6,
    kmFinal: 19,
    statusVegetacao: 'Atenção',
    ultimaInspecao: '2026-06-13T07:55:00.000Z',
  },
];

export const ocorrenciasMock: Ocorrencia[] = [
  {
    id: 'o1',
    trechoId: 't2',
    kmExato: 41.8,
    tipo: 'Vegetação alta na faixa de domínio',
    status: 'Pendente',
    dataRegistro: '2026-06-11T10:20:00.000Z',
    descricao: 'Mato alto avançando sobre o acostamento e reduzindo a visibilidade em curva de leve descida.',
  },
  {
    id: 'o2',
    trechoId: 't3',
    kmExato: 58.2,
    tipo: 'Sinalização parcialmente obstruída',
    status: 'Em Execução',
    dataRegistro: '2026-06-12T15:00:00.000Z',
    descricao: 'Vegetação densa cobrindo placa de advertência próxima ao acesso local.',
  },
  {
    id: 'o3',
    trechoId: 't3',
    kmExato: 61.4,
    tipo: 'Mato alto invadindo pista',
    status: 'Pendente',
    dataRegistro: '2026-06-13T06:40:00.000Z',
    descricao: 'Crescimento de vegetação na borda da pista com risco de contato com veículos pesados.',
  },
  {
    id: 'o4',
    trechoId: 't1',
    kmExato: 26.9,
    tipo: 'Margem com vegetação acima do limite',
    status: 'Concluído',
    dataRegistro: '2026-06-10T11:15:00.000Z',
    descricao: 'Intervenção concluída após roçada preventiva no entorno do km 27.',
  },
];
