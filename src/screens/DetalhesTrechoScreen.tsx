import React from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAppContext } from '../context/AppContext';
import { Ocorrencia } from '../mock/dadosMock';
import { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'DetalhesTrecho'>;

const statusStyles = {
  Normal: { backgroundColor: '#2E7D32', label: 'Normal' },
  Atenção: { backgroundColor: '#D4A017', label: 'Atenção' },
  Crítico: { backgroundColor: '#D95D39', label: 'Crítico' },
} as const;

const proximoStatus: Record<'Pendente' | 'Em Execução' | 'Concluído', 'Pendente' | 'Em Execução' | 'Concluído'> = {
  Pendente: 'Em Execução',
  Em Execução: 'Concluído',
  Concluído: 'Concluído',
};

function DetalhesTrechoScreen({ route }: Props) {
  const { trechos, ocorrencias, atualizarStatusOcorrencia } = useAppContext();
  const trecho = trechos.find((item) => item.id === route.params.trechoId);

  if (!trecho) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>Trecho não encontrado</Text>
        <Text style={styles.emptyText}>Verifique se o trecho selecionado ainda existe na base de mock.</Text>
      </View>
    );
  }

  const ocorrenciasDoTrecho = ocorrencias.filter((item) => item.trechoId === trecho.id);
  const statusConfig = statusStyles[trecho.statusVegetacao];

  const avançarStatus = (ocorrencia: Ocorrencia) => {
    const novoStatus = proximoStatus[ocorrencia.status];

    if (novoStatus === ocorrencia.status) {
      Alert.alert('Ocorrência concluída', 'Esta ocorrência já está com status concluído.');
      return;
    }

    atualizarStatusOcorrencia(ocorrencia.id, novoStatus);
  };

  const renderOcorrencia = ({ item }: { item: Ocorrencia }) => {
    const podeAvancar = item.status !== 'Concluído';

    return (
      <View style={styles.ocorrenciaCard}>
        <View style={styles.ocorrenciaHeader}>
          <View style={{ flex: 1 }}>
            <Text style={styles.ocorrenciaTipo}>{item.tipo}</Text>
            <Text style={styles.ocorrenciaMeta}>{`KM ${item.kmExato.toFixed(1)} | ${new Date(item.dataRegistro).toLocaleString('pt-BR')}`}</Text>
          </View>
          <View style={[styles.statusTag, item.status === 'Pendente' && styles.statusPendente, item.status === 'Em Execução' && styles.statusExecucao, item.status === 'Concluído' && styles.statusConcluido]}>
            <Text style={styles.statusTagText}>{item.status}</Text>
          </View>
        </View>

        <Text style={styles.ocorrenciaDescricao}>{item.descricao}</Text>

        <Pressable
          onPress={() => avançarStatus(item)}
          disabled={!podeAvancar}
          style={({ pressed }) => [styles.actionButton, !podeAvancar && styles.actionButtonDisabled, pressed && podeAvancar && styles.actionButtonPressed]}
        >
          <Text style={styles.actionButtonText}>{podeAvancar ? 'Avançar Status' : 'Concluído'}</Text>
        </Pressable>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerCard}>
        <Text style={styles.rodovia}>{trecho.rodovia}</Text>
        <Text style={styles.km}>{`KM ${trecho.kmInicial.toFixed(1)} até KM ${trecho.kmFinal.toFixed(1)}`}</Text>
        <View style={[styles.badge, { backgroundColor: statusConfig.backgroundColor }]}>
          <Text style={styles.badgeText}>{statusConfig.label}</Text>
        </View>
        <Text style={styles.inspecao}>{`Última inspeção: ${new Date(trecho.ultimaInspecao).toLocaleString('pt-BR')}`}</Text>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Ocorrências vinculadas</Text>
        <Text style={styles.sectionCount}>{ocorrenciasDoTrecho.length}</Text>
      </View>

      <FlatList
        data={ocorrenciasDoTrecho}
        keyExtractor={(item) => item.id}
        renderItem={renderOcorrencia}
        contentContainerStyle={ocorrenciasDoTrecho.length === 0 ? styles.emptyList : styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyStateCard}>
            <Text style={styles.emptyStateTitle}>Nenhuma ocorrência registrada</Text>
            <Text style={styles.emptyStateText}>Este trecho ainda não possui registros vinculados no mock.</Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F5F8',
    padding: 20,
  },
  headerCard: {
    backgroundColor: '#0B1F3A',
    borderRadius: 24,
    padding: 18,
    marginBottom: 16,
  },
  rodovia: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 8,
  },
  km: {
    color: '#D8E2F0',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
  inspecao: {
    color: '#D8E2F0',
    fontSize: 12,
    marginTop: 12,
    lineHeight: 18,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    color: '#0B1F3A',
    fontSize: 18,
    fontWeight: '800',
  },
  sectionCount: {
    color: '#D4A017',
    fontSize: 16,
    fontWeight: '900',
  },
  listContent: {
    gap: 12,
    paddingBottom: 24,
  },
  ocorrenciaCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E4E9F0',
    shadowColor: '#0B1F3A',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  ocorrenciaHeader: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  ocorrenciaTipo: {
    color: '#0B1F3A',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 4,
  },
  ocorrenciaMeta: {
    color: '#6B778C',
    fontSize: 12,
    fontWeight: '600',
  },
  ocorrenciaDescricao: {
    color: '#3C4A5C',
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 14,
  },
  statusTag: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  statusTagText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  statusPendente: {
    backgroundColor: '#C58B1C',
  },
  statusExecucao: {
    backgroundColor: '#1E6F8B',
  },
  statusConcluido: {
    backgroundColor: '#2E7D32',
  },
  actionButton: {
    backgroundColor: '#0B1F3A',
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
  },
  actionButtonPressed: {
    opacity: 0.92,
  },
  actionButtonDisabled: {
    backgroundColor: '#B9C3CF',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  emptyStateCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E4E9F0',
  },
  emptyStateTitle: {
    color: '#0B1F3A',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 6,
  },
  emptyStateText: {
    color: '#5E6B7D',
    fontSize: 13,
    lineHeight: 20,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#F3F5F8',
  },
  emptyTitle: {
    color: '#0B1F3A',
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 8,
  },
  emptyText: {
    color: '#5E6B7D',
    textAlign: 'center',
    lineHeight: 22,
  },
  emptyList: {
    paddingBottom: 24,
  },
});

export default DetalhesTrechoScreen;
