import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider } from './src/context/AppContext';
import HomeScreen from './src/screens/HomeScreen';
import DetalhesTrechoScreen from './src/screens/DetalhesTrechoScreen';
import NovaOcorrenciaScreen from './src/screens/NovaOcorrenciaScreen';
import { cores } from './src/theme/cores';
import { RootStackParamList } from './src/types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Home"
            screenOptions={{
              headerStyle: { backgroundColor: cores.azulEscuro },
              headerTintColor: cores.branco,
              headerTitleStyle: { fontWeight: '700' },
              contentStyle: { backgroundColor: cores.cinzaClaro },
            }}
          >
            <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Dashboard de Fiscalização' }} />
            <Stack.Screen name="DetalhesTrecho" component={DetalhesTrechoScreen} options={{ title: 'Detalhes do Trecho' }} />
            <Stack.Screen name="NovaOcorrencia" component={NovaOcorrenciaScreen} options={{ title: 'Nova Ocorrência' }} />
          </Stack.Navigator>
        </NavigationContainer>
      </AppProvider>
    </SafeAreaProvider>
  );
}
