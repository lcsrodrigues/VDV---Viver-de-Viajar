# IDDAS - Sistema de Gestão de Milhas

Um sistema web moderno para gerenciamento de programas de milhas e pontos, desenvolvido com React, TypeScript, Tailwind CSS e Recharts.

## 🚀 Funcionalidades

### Dashboard
- Visão geral com KPIs principais
- Gráficos interativos de movimentações por tipo
- Análise de economia por programa
- Métricas de desempenho mensal

### Movimentações
- Listagem completa de todas as movimentações
- Filtros avançados por tipo de operação
- Busca por programa, loja ou tipo
- Operações CRUD (Criar, Ler, Atualizar, Deletar)
- Duplicação de registros

### Cotações
- Gerenciamento de cotações de passagens
- Controle de status (Emitida/Pendente)
- Cálculo automático de economia
- Filtros por período e tipo

### Metas
- Definição de metas por programa
- Acompanhamento de progresso em tempo real
- Barras de progresso visuais
- Edição inline de metas

### Cadastros
- Gerenciamento de programas de milhas/pontos
- Cadastro de produtos e lojas
- Interface tabular com CRUD completo
- Organização por abas

### Relatórios
- Exportação de dados em CSV
- Filtros personalizáveis
- Prévia dos dados antes da exportação
- Relatórios de movimentações e cotações

### Recursos Adicionais
- **Modo Escuro/Claro**: Alternância entre temas
- **Design Responsivo**: Funciona em desktop e mobile
- **Interface Moderna**: Design limpo e profissional
- **Dados Mock**: Sistema funcional com dados de exemplo

## 🛠️ Tecnologias Utilizadas

- **React 18** - Biblioteca para interfaces de usuário
- **TypeScript** - Tipagem estática para JavaScript
- **Vite** - Build tool moderna e rápida
- **Tailwind CSS** - Framework CSS utilitário
- **Recharts** - Biblioteca de gráficos para React
- **Lucide React** - Ícones modernos
- **Context API** - Gerenciamento de estado para temas

## 📦 Instalação e Execução

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn

### Passos para execução

1. **Clone o repositório**
   ```bash
   git clone <repository-url>
   cd iddas-app
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Execute o projeto**
   ```bash
   npm run dev
   ```

4. **Acesse no navegador**
   ```
   http://localhost:5173
   ```

### Scripts disponíveis

- `npm run dev` - Executa em modo de desenvolvimento
- `npm run build` - Gera build de produção
- `npm run preview` - Visualiza o build de produção
- `npm run lint` - Executa o linter

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── Badge.tsx       # Badge para tipos de operação
│   ├── Button.tsx      # Botão customizado
│   ├── CardKPI.tsx     # Card para KPIs
│   ├── DataTable.tsx   # Tabela de dados
│   ├── FiltersBar.tsx  # Barra de filtros
│   ├── Layout.tsx      # Layout principal
│   ├── Sidebar.tsx     # Menu lateral
│   └── Topbar.tsx      # Barra superior
├── contexts/           # Contextos React
│   └── ThemeContext.tsx # Contexto para temas
├── lib/               # Bibliotecas e utilitários
│   ├── sharepoint-mapper.ts # Mapeamento SharePoint
│   └── utils.ts       # Utilitários gerais
├── screens/           # Telas da aplicação
│   ├── Cadastros.tsx  # Tela de cadastros
│   ├── Cotacoes.tsx   # Tela de cotações
│   ├── Dashboard.tsx  # Dashboard principal
│   ├── Metas.tsx      # Tela de metas
│   ├── Movimentacoes.tsx # Tela de movimentações
│   └── Relatorios.tsx # Tela de relatórios
├── services/          # Serviços de dados (mock)
│   ├── BaseService.ts # Serviço base
│   ├── CotacaoService.ts
│   ├── LojasService.ts
│   ├── MetasService.ts
│   ├── MovimentacoesService.ts
│   ├── ProdutosService.ts
│   └── ProgramasService.ts
├── types/             # Definições de tipos TypeScript
│   ├── Cotacao.ts
│   ├── Loja.ts
│   ├── Meta.ts
│   ├── Movimentacao.ts
│   ├── Produto.ts
│   └── Program.ts
├── utils/             # Utilitários
│   └── csvExport.ts   # Exportação CSV
├── App.tsx            # Componente principal
├── index.css          # Estilos globais
└── main.tsx           # Ponto de entrada
```

## 🔗 Integração com SharePoint

O projeto foi estruturado para facilitar a futura integração com SharePoint Online. O arquivo `src/lib/sharepoint-mapper.ts` contém:

- **Mapeamento de Colunas**: Correspondência entre campos da aplicação e colunas do SharePoint
- **Classe SharePointService**: Métodos para interação com a API REST do SharePoint
- **Transformadores**: Funções para converter dados entre formatos
- **Instruções de Integração**: Guia passo a passo para implementação

### Listas SharePoint Necessárias

1. **Programas** - Programas de milhas/pontos
2. **Produtos** - Catálogo de produtos
3. **Lojas** - Cadastro de lojas parceiras
4. **Metas** - Metas de acúmulo
5. **Movimentacoes** - Histórico de movimentações
6. **Cotacao** - Cotações de passagens

## 🎨 Personalização

### Temas
O sistema suporta modo claro e escuro. Para personalizar:

1. Edite as classes CSS em `src/index.css`
2. Modifique as cores no `tailwind.config.js`
3. Ajuste o `ThemeContext` conforme necessário

### Dados Mock
Para alterar os dados de exemplo:

1. Edite os arquivos em `src/services/`
2. Modifique os dados iniciais em cada serviço
3. Ajuste os tipos em `src/types/` se necessário

## 🚀 Deploy

### Build de Produção
```bash
npm run build
```

### Deploy em Servidores Web
O projeto gera arquivos estáticos na pasta `dist/` que podem ser servidos por qualquer servidor web (Apache, Nginx, IIS, etc.).

### Variáveis de Ambiente
Para produção, configure:
- URLs de API do SharePoint
- Tokens de autenticação
- Configurações específicas do ambiente

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Para dúvidas ou suporte:
- Abra uma issue no GitHub
- Entre em contato com a equipe de desenvolvimento
- Consulte a documentação técnica

---

**Desenvolvido com ❤️ para gestão eficiente de programas de milhas e pontos**
