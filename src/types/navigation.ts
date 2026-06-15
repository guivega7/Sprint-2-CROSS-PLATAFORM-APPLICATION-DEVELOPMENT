export type RootStackParamList = {
  Home: undefined;
  DetalhesTrecho: { trechoId: string };
  NovaOcorrencia: { trechoId?: string } | undefined;
};