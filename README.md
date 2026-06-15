# Sprint 2 CCR Motiva

Aplicativo mobile desenvolvido em **Expo + React Native + TypeScript** para simular o monitoramento operacional da CCR Motiva, com foco em vegetação, ocorrências críticas e inspeções de campo.

## O que este app entrega

- 3 telas funcionais com navegação entre dashboard, detalhes do trecho e cadastro de ocorrência.
- Mock de dados realista com trechos, ocorrências e histórico de inspeções.
- Fluxo completo de atualização de estado: registrar ocorrência, avançar status e registrar inspeção preventiva.
- Captura de localização do dispositivo na tela de nova ocorrência usando `expo-location`.
- Estado global reativo via Context API, sem dependência de APIs externas.

## Funcionalidades principais

- Dashboard com indicadores de trechos, inspeções, ocorrências e trechos críticos.
- Tela de detalhes com ocorrências vinculadas, histórico de inspeções e ação para registrar nova inspeção preventiva.
- Tela de nova ocorrência com seleção de tipo, trecho, KM exato e GPS do dispositivo.
- Atualização coerente do estado da interface após cada ação do usuário.

## Tecnologias usadas

- Expo
- React Native
- TypeScript
- React Navigation
- Context API
- `expo-location`
- StyleSheet nativo

## Estrutura do projeto

```text
.
├── App.tsx
├── app.json
├── babel.config.js
├── package.json
├── tsconfig.json
└── src
    ├── context
    │   └── AppContext.tsx
    ├── mock
    │   └── dadosMock.ts
    ├── screens
    │   ├── DetalhesTrechoScreen.tsx
    │   ├── HomeScreen.tsx
    │   └── NovaOcorrenciaScreen.tsx
    ├── theme
    │   └── cores.ts
    └── types
        └── navigation.ts
```

## Como executar

### 1. Instalar dependências

```bash
npm install
```

### 2. Iniciar o projeto

```bash
npm start
```

### 3. Abrir no Android

Com o emulador já aberto, pressione `a` no terminal do Expo ou rode:

```bash
npm run android
```

Se preferir abrir diretamente o Expo no Android com um emulador já ligado:

```bash
npx expo start --android
```

Para evitar o erro recorrente de "No Android connected device found", use o comando abaixo:

```bash
npm run android:auto
```

Esse script:

- inicia o emulador automaticamente (AVD padrão: `Pixel_6`),
- espera o Android completar o boot,
- e só depois executa `expo start --android`.

Se quiser usar outro AVD, rode com a variável de ambiente:

```powershell
$env:ANDROID_AVD='Pixel_10'; npm run android:auto
```

Se precisar trocar a porta do Expo usada pelo script automático:

```powershell
$env:EXPO_PORT='8085'; npm run android:auto
```

## Como testar o fluxo principal

1. Abra o app na tela inicial.
2. Toque em um trecho para ver os detalhes e o histórico de inspeções.
3. Use `Registrar inspeção preventiva` para atualizar o status do trecho e criar um novo registro no histórico.
4. Use `Nova ocorrência` para registrar um problema com tipo, KM e localização do dispositivo.
5. Volte ao dashboard para ver os indicadores atualizados.

## Regras de negócio simuladas

- Ao adicionar uma nova ocorrência, o trecho correspondente passa automaticamente para o status de vegetação `Crítico`.
- Ao avançar o status de uma ocorrência, ela evolui de `Pendente` para `Em Execução` e depois para `Concluído`.
- Ao registrar uma inspeção preventiva, o trecho cria um novo item no histórico e reduz o status de vegetação quando aplicável.
- Toda a atualização acontece em memória, simulando comportamento real sem backend.

## Dados mockados

Os mocks foram pensados para o contexto da Motiva e incluem:

- Trechos rodoviários reais de referência, como SP-270, SP-280 e SP-075.
- Ocorrências de vegetação alta, sinalização obstruída e invasão de pista.
- Histórico de inspeções com responsável, observação, status de vegetação e coordenadas opcionais.

## Vídeo de demonstração

Para gravar o vídeo de até 3 minutos, mostre nesta ordem:

1. Dashboard com os indicadores e lista de trechos.
2. Tela de detalhes com histórico de inspeção e ação preventiva.
3. Tela de nova ocorrência com captura de GPS.
4. Retorno ao dashboard exibindo o estado atualizado.

## Cores do projeto

- Azul escuro para interface institucional e cabeçalhos.
- Amarelo ouro para botões e destaques.
- Cinza claro para fundo.
- Verde, amarelo e vermelho para os estados operacionais.

## Observações

- O projeto foi pensado como entrega acadêmica da Sprint 2.
- Não há integração com APIs externas nesta fase.
- A estrutura foi organizada para facilitar evolução para APIs reais nas próximas sprints.
