import React, { useMemo, useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as Location from 'expo-location';
import { useAppContext } from '../context/AppContext';
import { RootStackParamList } from '../types/navigation';

const initialTrechoId = '';

type Props = NativeStackScreenProps<RootStackParamList, 'NovaOcorrencia'>;

function NovaOcorrenciaScreen({ navigation, route }: Props) {
  const { trechos, adicionarOcorrencia } = useAppContext();
  const trechoInicial = route.params?.trechoId ?? initialTrechoId;
  const [trechoIdSelecionado, setTrechoIdSelecionado] = useState(trechoInicial || trechos[0]?.id ?? '');
  const [kmExato, setKmExato] = useState('');
  const [descricao, setDescricao] = useState('');
  const [tipoOcorrencia, setTipoOcorrencia] = useState('Vegetação alta na faixa de domínio');
  const [coordenadas, setCoordenadas] = useState<{ latitude: number; longitude: number } | null>(null);
  const [capturandoLocalizacao, setCapturandoLocalizacao] = useState(false);

  const trechoSelecionado = useMemo(
    () => trechos.find((item) => item.id === trechoIdSelecionado),
    [trechos, trechoIdSelecionado],
  );

  const tiposOcorrencia = [
    'Vegetação alta na faixa de domínio',
    'Sinalização parcialmente obstruída',
    'Mato alto invadindo pista',
    'Risco de queda de galhos',
  ];

  const capturarLocalizacao = async () => {
    setCapturandoLocalizacao(true);

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert('Permissão negada', 'A localização é opcional, mas ajuda a simular a fiscalização em campo.');
        return;
      }

      const localAtual = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      setCoordenadas({
        latitude: localAtual.coords.latitude,
        longitude: localAtual.coords.longitude,
      });
    } catch {
      Alert.alert('Falha ao obter localização', 'Não foi possível capturar o GPS do dispositivo neste momento.');
    } finally {
      setCapturandoLocalizacao(false);
    }
  };

  const salvar = () => {
    const kmNumerico = Number(kmExato.replace(',', '.'));

    if (!trechoSelecionado) {
      Alert.alert('Selecione um trecho', 'Escolha o trecho de referência antes de salvar.');
      return;
    }

    if (!kmExato.trim() || Number.isNaN(kmNumerico) || kmNumerico <= 0) {
      Alert.alert('KM inválido', 'Informe um KM exato válido para a ocorrência.');
      return;
    }

    if (!descricao.trim()) {
      Alert.alert('Descrição obrigatória', 'Explique o problema observado para concluir o registro.');
      return;
    }

    adicionarOcorrencia({
      trechoId: trechoSelecionado.id,
      kmExato: kmNumerico,
      tipo: tipoOcorrencia,
      status: 'Pendente',
      dataRegistro: new Date().toISOString(),
      descricao: `${descricao.trim()}${coordenadas ? ` | GPS: ${coordenadas.latitude.toFixed(5)}, ${coordenadas.longitude.toFixed(5)}` : ''}`,
    });

    setKmExato('');
    setDescricao('');
    setCoordenadas(null);
    navigation.navigate('Home');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registrar nova ocorrência</Text>
      <Text style={styles.subtitle}>Simulação de inserção via campo/GPS para fiscalização em rodovias concessionadas.</Text>

      <Text style={styles.sectionLabel}>Trecho de referência</Text>
      <FlatList
        data={trechos}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.trechoList}
        renderItem={({ item }) => {
          const selected = item.id === trechoIdSelecionado;
          return (
            <Pressable
              onPress={() => setTrechoIdSelecionado(item.id)}
              style={[styles.trechoChip, selected && styles.trechoChipSelected]}
            >
              <Text style={[styles.trechoChipTitle, selected && styles.trechoChipTitleSelected]}>{item.rodovia}</Text>
              <Text style={[styles.trechoChipText, selected && styles.trechoChipTextSelected]}>{`KM ${item.kmInicial.toFixed(1)} - ${item.kmFinal.toFixed(1)}`}</Text>
            </Pressable>
          );
        }}
      />

      <View style={styles.formCard}>
        <Text style={styles.inputLabel}>Tipo de ocorrência</Text>
        <FlatList
          data={tiposOcorrencia}
          keyExtractor={(item) => item}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tipoList}
          renderItem={({ item }) => {
            const selected = item === tipoOcorrencia;

            return (
              <Pressable onPress={() => setTipoOcorrencia(item)} style={[styles.tipoChip, selected && styles.tipoChipSelected]}>
                <Text style={[styles.tipoChipText, selected && styles.tipoChipTextSelected]}>{item}</Text>
              </Pressable>
            );
          }}
        />

        <Text style={styles.inputLabel}>KM Exato</Text>
        <TextInput
          value={kmExato}
          onChangeText={setKmExato}
          placeholder="Ex.: 41,8"
          placeholderTextColor="#8B95A5"
          keyboardType="decimal-pad"
          style={styles.input}
        />

        <Text style={styles.inputLabel}>Descrição do problema</Text>
        <TextInput
          value={descricao}
          onChangeText={setDescricao}
          placeholder="Ex.: Mato alto invadindo o acostamento e cobrindo parte da sinalização..."
          placeholderTextColor="#8B95A5"
          multiline
          numberOfLines={5}
          textAlignVertical="top"
          style={[styles.input, styles.textArea]}
        />

        <Pressable onPress={capturarLocalizacao} style={({ pressed }) => [styles.locationButton, pressed && styles.saveButtonPressed]}>
          <Text style={styles.locationButtonText}>{capturandoLocalizacao ? 'Capturando GPS...' : 'Usar localização do dispositivo'}</Text>
        </Pressable>

        <Text style={styles.locationNote}>
          {coordenadas
            ? `Localização capturada: ${coordenadas.latitude.toFixed(5)}, ${coordenadas.longitude.toFixed(5)}`
            : 'A localização é opcional, mas ajuda a registrar o ponto exato da ocorrência.'}
        </Text>

        <Pressable onPress={salvar} style={({ pressed }) => [styles.saveButton, pressed && styles.saveButtonPressed]}>
          <Text style={styles.saveButtonText}>Salvar</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F5F8',
    padding: 20,
  },
  title: {
    color: '#0B1F3A',
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 8,
  },
  subtitle: {
    color: '#5E6B7D',
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 20,
  },
  sectionLabel: {
    color: '#0B1F3A',
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 10,
  },
  trechoList: {
    gap: 12,
    paddingBottom: 16,
  },
  trechoChip: {
    width: 220,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E4E9F0',
  },
  trechoChipSelected: {
    backgroundColor: '#0B1F3A',
    borderColor: '#0B1F3A',
  },
  trechoChipTitle: {
    color: '#0B1F3A',
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 6,
  },
  trechoChipTitleSelected: {
    color: '#FFFFFF',
  },
  trechoChipText: {
    color: '#5E6B7D',
    fontSize: 12,
    fontWeight: '600',
  },
  trechoChipTextSelected: {
    color: '#D8E2F0',
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E4E9F0',
    shadowColor: '#0B1F3A',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  tipoList: {
    gap: 10,
    paddingBottom: 10,
  },
  tipoChip: {
    backgroundColor: '#F8FAFC',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#D9E1EA',
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginRight: 10,
  },
  tipoChipSelected: {
    backgroundColor: '#0B1F3A',
    borderColor: '#0B1F3A',
  },
  tipoChipText: {
    color: '#0B1F3A',
    fontSize: 12,
    fontWeight: '700',
  },
  tipoChipTextSelected: {
    color: '#FFFFFF',
  },
  inputLabel: {
    color: '#0B1F3A',
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 8,
    marginTop: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D9E1EA',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 14,
    color: '#0B1F3A',
    fontSize: 14,
    marginBottom: 12,
  },
  textArea: {
    minHeight: 120,
  },
  saveButton: {
    backgroundColor: '#D4A017',
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 4,
  },
  saveButtonPressed: {
    opacity: 0.92,
  },
  locationButton: {
    backgroundColor: '#123A63',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 8,
  },
  locationButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  locationNote: {
    color: '#5E6B7D',
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 14,
  },
  saveButtonText: {
    color: '#0B1F3A',
    fontSize: 15,
    fontWeight: '900',
  },
});

export default NovaOcorrenciaScreen;
