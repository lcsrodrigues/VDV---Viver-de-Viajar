export type Program = {
  id: string;
  programa: string;
  tipoPrograma: 'Milhas' | 'Pontos' | 'Cashback';
  subTipoPrograma: 'Aéreo' | 'Bancário' | 'Marketplace' | 'Cartão';
  valor: string; // e.g., "1 ponto = R$ 1,00"
};

