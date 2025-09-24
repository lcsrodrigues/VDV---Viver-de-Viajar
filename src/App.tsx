import { useState } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './screens/Dashboard';
import { MovimentacoesCRUD } from './screens/MovimentacoesCRUD';
import { CotacoesCRUD } from './screens/CotacoesCRUD';
import { Metas } from './screens/Metas';
import { Cadastros } from './screens/Cadastros';
import { Clients } from './screens/Clients';
import { ContractsCRUD } from './screens/ContractsCRUD';
import { Relatorios } from './screens/Relatorios';
import { ThemeProvider } from './contexts/ThemeContext';
import './index.css';

function App() {
  const [activeMenuItem, setActiveMenuItem] = useState("dashboard");
  const [selectedPeriod, setSelectedPeriod] = useState("2025-09");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const getPageTitle = () => {
    switch (activeMenuItem) {
      case 'dashboard':
        return 'Dashboard';
      case 'movimentacoes':
        return 'Movimentações';
      case 'cotacoes':
        return 'Cotações';
      case 'metas':
        return 'Metas';
      case 'cadastros':
        return 'Cadastros';
      case 'relatorios':
        return 'Relatórios';
      default:
        return 'Dashboard';
    }
  };

  const renderContent = () => {
    switch (activeMenuItem) {
      case 'dashboard':
        return <Dashboard onMenuItemClick={setActiveMenuItem} />;
      case 'movimentacoes':
        return <MovimentacoesCRUD />;
      case 'cotacoes':
        return <CotacoesCRUD />;
      case 'metas':
        return <Metas />;
      case 'cadastros':
        return <Cadastros />;
      case 'clients':
        return <Clients />;
      case 'contracts':
        return <ContractsCRUD />;
      case 'relatorios':
        return <Relatorios />;
      default:
        return <Dashboard onMenuItemClick={setActiveMenuItem} />;
    }
  };

  return (
    <ThemeProvider>
      <Layout
        title={getPageTitle()}
        activeMenuItem={activeMenuItem}
        onMenuItemClick={setActiveMenuItem}
        selectedPeriod={selectedPeriod}
        onPeriodChange={setSelectedPeriod}
        isSidebarCollapsed={isSidebarCollapsed}
        setIsSidebarCollapsed={setIsSidebarCollapsed}
      >
        {renderContent()}
      </Layout>
    </ThemeProvider>
  );
}

export default App;
