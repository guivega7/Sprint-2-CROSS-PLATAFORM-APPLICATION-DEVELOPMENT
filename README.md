# Sprint 2 CCR Motiva

Aplicativo mobile desenvolvido em **Expo + React Native + TypeScript** para a Sprint 2 da FIAP, com foco no monitoramento e fiscalização da vegetação e de ocorrências críticas nas rodovias da CCR Motiva.

## Proposta

O app simula um painel operacional para acompanhar trechos rodoviários, registrar ocorrências em campo e atualizar o status de atendimento das demandas.

### Funcionalidades principais

- Dashboard com lista de trechos e badge de status da vegetação.
- Tela de detalhes com as ocorrências vinculadas a cada trecho.
- Registro de nova ocorrência por formulário simples.
- Estado global reativo via Context API.
- Dados totalmente mockados, sem consumo de APIs externas.

## Tecnologias usadas

- Expo
- React Native
- TypeScript
- React Navigation
- Context API
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

### 3. Rodar em plataforma específica

```bash
npm run android
```

```bash
npm run ios
```

```bash
npm run web
```

## Regras de negócio simuladas

- Ao adicionar uma nova ocorrência, o trecho correspondente passa automaticamente para o status de vegetação **Crítico**.
- Ao tocar em **Avançar Status**, a ocorrência evolui de **Pendente** para **Em Execução** e depois para **Concluído**.
- Toda a atualização acontece em memória, simulando reatividade de estado sem backend.

## Dados mockados

Os trechos e ocorrências foram criados de forma realista, com referência a rodovias como:

- SP-270 - Rodovia Raposo Tavares
- SP-280 - Rodovia Castelo Branco
- SP-075 - Rodovia Santos Dumont

## Cores do projeto

- Azul escuro para interface institucional e cabeçalhos.
- Amarelo ouro para botões e destaques.
- Cinza claro para fundo.
- Verde, amarelo, laranja e vermelho para os estados operacionais.

## Observações

- O projeto foi pensado para funcionar como entrega acadêmica da Sprint 2.
- Não há integração com APIs externas.
- A lógica de navegação e estado foi organizada para facilitar demonstração em sala.
