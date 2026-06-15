import React, { createContext, useContext, useMemo, useState } from 'react';
import {
  Inspecao,
  Ocorrencia,
  StatusOcorrencia,
  StatusVegetacao,
  Trecho,
  inspecoesMock,
  ocorrenciasMock,
  trechosMock,
} from '../mock/dadosMock';

interface NovaOcorrenciaInput {
  trechoId: string;
  kmExato: number;
  tipo: string;
  status: StatusOcorrencia;
  dataRegistro: string;
  descricao: string;
}

interface NovaInspecaoInput {
  trechoId: string;
  responsavel: string;
  statusVegetacao: StatusVegetacao;
  observacao: string;
  dataRegistro: string;
  latitude?: number;
  longitude?: number;
}

interface AppContextData {
  trechos: Trecho[];
  ocorrencias: Ocorrencia[];
  inspecoes: Inspecao[];
  adicionarOcorrencia: (nova: NovaOcorrenciaInput) => void;
  atualizarStatusOcorrencia: (id: string, novoStatus: StatusOcorrencia) => void;
  registrarInspecao: (nova: NovaInspecaoInput) => void;
}

const AppContext = createContext<AppContextData | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [trechos, setTrechos] = useState<Trecho[]>(() => trechosMock.map((trecho) => ({ ...trecho })));
  const [ocorrencias, setOcorrencias] = useState<Ocorrencia[]>(() => ocorrenciasMock.map((ocorrencia) => ({ ...ocorrencia })));
  const [inspecoes, setInspecoes] = useState<Inspecao[]>(() => inspecoesMock.map((inspecao) => ({ ...inspecao })));

  const adicionarOcorrencia = (nova: NovaOcorrenciaInput) => {
    const ocorrenciaFormatada: Ocorrencia = {
      id: `o-${Date.now()}`,
      trechoId: nova.trechoId,
      kmExato: nova.kmExato,
      tipo: nova.tipo,
      status: nova.status,
      dataRegistro: nova.dataRegistro,
      descricao: nova.descricao,
    };

    setOcorrencias((listaAtual: Ocorrencia[]) => [ocorrenciaFormatada, ...listaAtual]);
    setTrechos((listaAtual: Trecho[]) =>
      listaAtual.map((trecho: Trecho) =>
        trecho.id === nova.trechoId
          ? { ...trecho, statusVegetacao: 'Crítico', ultimaInspecao: nova.dataRegistro }
          : trecho,
      ),
    );
  };

  const atualizarStatusOcorrencia = (id: string, novoStatus: StatusOcorrencia) => {
    setOcorrencias((listaAtual: Ocorrencia[]) =>
      listaAtual.map((ocorrencia: Ocorrencia) =>
        ocorrencia.id === id ? { ...ocorrencia, status: novoStatus } : ocorrencia,
      ),
    );
  };

  const registrarInspecao = (nova: NovaInspecaoInput) => {
    const inspecaoFormatada: Inspecao = {
      id: `i-${Date.now()}`,
      trechoId: nova.trechoId,
      dataRegistro: nova.dataRegistro,
      responsavel: nova.responsavel,
      statusVegetacao: nova.statusVegetacao,
      observacao: nova.observacao,
      latitude: nova.latitude,
      longitude: nova.longitude,
    };

    setInspecoes((listaAtual) => [inspecaoFormatada, ...listaAtual]);
    setTrechos((listaAtual) =>
      listaAtual.map((trecho) =>
        trecho.id === nova.trechoId
          ? {
              ...trecho,
              statusVegetacao: nova.statusVegetacao,
              ultimaInspecao: nova.dataRegistro,
            }
          : trecho,
      ),
    );
  };

  const value = useMemo(
    () => ({ trechos, ocorrencias, inspecoes, adicionarOcorrencia, atualizarStatusOcorrencia, registrarInspecao }),
    [trechos, ocorrencias, inspecoes],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext deve ser usado dentro de AppProvider.');
  }
  return context;
}
