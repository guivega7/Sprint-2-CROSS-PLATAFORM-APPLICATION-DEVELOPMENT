import React, { createContext, useContext, useMemo, useState } from 'react';
import { Ocorrencia, StatusOcorrencia, Trecho, ocorrenciasMock, trechosMock } from '../mock/dadosMock';

interface NovaOcorrenciaInput {
  trechoId: string;
  kmExato: number;
  tipo: string;
  status: StatusOcorrencia;
  dataRegistro: string;
  descricao: string;
}

interface AppContextData {
  trechos: Trecho[];
  ocorrencias: Ocorrencia[];
  adicionarOcorrencia: (nova: NovaOcorrenciaInput) => void;
  atualizarStatusOcorrencia: (id: string, novoStatus: StatusOcorrencia) => void;
}

const AppContext = createContext<AppContextData | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [trechos, setTrechos] = useState<Trecho[]>(() => trechosMock.map((trecho) => ({ ...trecho })));
  const [ocorrencias, setOcorrencias] = useState<Ocorrencia[]>(() => ocorrenciasMock.map((ocorrencia) => ({ ...ocorrencia })));

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

  const value = useMemo(
    () => ({ trechos, ocorrencias, adicionarOcorrencia, atualizarStatusOcorrencia }),
    [trechos, ocorrencias],
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
