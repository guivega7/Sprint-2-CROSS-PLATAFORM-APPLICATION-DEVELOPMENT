import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppContext } from '../context/AppContext';
import { RootStackParamList } from '../types/navigation';
import { Trecho } from '../mock/dadosMock';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const statusStyles = {
  Normal: { backgroundColor: '#2E7D32', label: 'Normal' },
  Atenção: { backgroundColor: '#D4A017', label: 'Atenção' },
  Crítico: { backgroundColor: '#D95D39', label: 'Crítico' },
} as const;

function HomeScreen({ navigation }: Props) {
  const { top } = useSafeAreaInsets();
  const { trechos, ocorrencias, inspecoes } = useAppContext();

  const totalCriticos = trechos.filter((trecho) => trecho.statusVegetacao === 'Crítico').length;
  const totalAtenção = trechos.filter((trecho) => trecho.statusVegetacao === 'Atenção').length;
  const totalOcorrencias = ocorrencias.length;
  const totalInspecoes = inspecoes.length;

  const renderTrecho = ({ item }: { item: Trecho }) => {
    const statusConfig = statusStyles[item.statusVegetacao];
    const quantidadeOcorrencias = ocorrencias.filter((ocorrencia) => ocorrencia.trechoId === item.id).length;

    return (
      <Pressable
        onPress={() => navigation.navigate('DetalhesTrecho', { trechoId: item.id })}
        style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      >
        <View style={styles.cardHeader}>
          <View style={{ flex: 1 }}>
            <Text style={styles.rodovia}>{item.rodovia}</Text>
            <Text style={styles.km}>{`KM ${item.kmInicial.toFixed(1)} até KM ${item.kmFinal.toFixed(1)}`}</Text>
          </View>
          <View style={[styles.badge, { backgroundColor: statusConfig.backgroundColor }]}> 
            <Text style={styles.badgeText}>{statusConfig.label}</Text>
          </View>
        </View>

        <View style={styles.cardFooter}>
          <Text style={styles.metaLabel}>Última inspeção</Text>
          <Text style={styles.metaValue}>{new Date(item.ultimaInspecao).toLocaleString('pt-BR')}</Text>
        </View>

        <View style={styles.cardFooter}>
          <Text style={styles.metaLabel}>Ocorrências vinculadas</Text>
          <Text style={styles.metaValue}>{quantidadeOcorrencias}</Text>
        </View>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <View style={[styles.hero, { paddingTop: top + 16 }]}>
        <Text style={styles.heroKicker}>CCR Motiva | Sprint 2</Text>
        <Text style={styles.heroTitle}>Monitoramento de vegetação e ocorrências críticas</Text>
        <Text style={styles.heroText}>
          Acompanhe trechos com risco operacional, atualize ocorrências e mantenha a fiscalização em tempo real.
        </Text>

        <View style={styles.summaryRow}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>{trechos.length}</Text>
            <Text style={styles.summaryLabel}>Trechos</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>{totalInspecoes}</Text>
            <Text style={styles.summaryLabel}>Inspeções</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>{totalCriticos}</Text>
            <Text style={styles.summaryLabel}>Críticos</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>{totalAtenção}</Text>
            <Text style={styles.summaryLabel}>Atenção</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>{totalOcorrencias}</Text>
            <Text style={styles.summaryLabel}>Ocorrências</Text>
          </View>
        </View>
      </View>

      <FlatList
        data={trechos}
        keyExtractor={(item) => item.id}
        renderItem={renderTrecho}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      <TouchableOpacity style={styles.fab} activeOpacity={0.9} onPress={() => navigation.navigate('NovaOcorrencia')}>
        <Text style={styles.fabIcon}>+</Text>
        <Text style={styles.fabText}>Nova ocorrência</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F5F8',
  },
  hero: {
    backgroundColor: '#0B1F3A',
    paddingHorizontal: 20,
    paddingBottom: 22,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  heroKicker: {
    color: '#D4A017',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '800',
    lineHeight: 34,
    marginBottom: 10,
  },
  heroText: {
    color: '#D8E2F0',
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 18,
  },
  summaryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  summaryCard: {
    flexGrow: 1,
    flexBasis: '22%',
    minWidth: 78,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
    borderRadius: 16,
    paddingVertical: 12,
    alignItems: 'center',
  },
  summaryValue: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
  summaryLabel: {
    color: '#D8E2F0',
    fontSize: 11,
    marginTop: 4,
  },
  listContent: {
    padding: 20,
    paddingBottom: 120,
    gap: 14,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    shadowColor: '#0B1F3A',
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E4E9F0',
  },
  cardPressed: {
    transform: [{ scale: 0.99 }],
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 16,
  },
  rodovia: {
    color: '#0B1F3A',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 6,
  },
  km: {
    color: '#5E6B7D',
    fontSize: 13,
    fontWeight: '600',
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#EEF2F6',
    marginTop: 8,
  },
  metaLabel: {
    color: '#6B778C',
    fontSize: 12,
    fontWeight: '600',
  },
  metaValue: {
    color: '#0B1F3A',
    fontSize: 12,
    fontWeight: '700',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 24,
    backgroundColor: '#0B1F3A',
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    shadowColor: '#000000',
    shadowOpacity: 0.18,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 5,
  },
  fabIcon: {
    color: '#D4A017',
    fontSize: 22,
    fontWeight: '900',
    marginTop: -2,
  },
  fabText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
});

export default HomeScreen;
