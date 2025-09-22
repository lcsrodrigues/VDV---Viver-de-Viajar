import { useState } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './screens/Dashboard';
import { Movimentacoes } from './screens/Movimentacoes';
import { Cotacoes } from './screens/Cotacoes';
import { Metas } from './screens/Metas';
import { Cadastros } from './screens/Cadastros';
import { Relatorios } from './screens/Relatorios';
import { ThemeProvider } from './contexts/ThemeContext';
import './index.css';

function App() {
  const [activeMenuItem, setActiveMenuItem] = useState('dashboard');
  const [selectedPeriod, setSelectedPeriod] = useState('2025-09');

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
        return <Dashboard />;
      case 'movimentacoes':
        return <Movimentacoes />;
      case 'cotacoes':
        return <Cotacoes />;
      case 'metas':
        return <Metas />;
      case 'cadastros':
        return <Cadastros />;
      case 'relatorios':
        return <Relatorios />;
      default:
        return <Dashboard />;
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
      >
        {renderContent()}
      </Layout>
    </ThemeProvider>
  );
}

export default App;
