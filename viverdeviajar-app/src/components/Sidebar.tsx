import React from 'react';
import { 
  BarChart3, 
  ArrowUpDown, 
  Calculator, 
  Target, 
  Settings, 
  FileText 
} from 'lucide-react';

interface SidebarProps {
  activeItem: string;
  onItemClick: (item: string) => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
  { id: 'movimentacoes', label: 'Movimentações', icon: ArrowUpDown },
  { id: 'cotacoes', label: 'Cotações', icon: Calculator },
  { id: 'metas', label: 'Metas', icon: Target },
  { id: 'cadastros', label: 'Cadastros', icon: Settings },
  { id: 'relatorios', label: 'Relatórios', icon: FileText },
];

export const Sidebar: React.FC<SidebarProps> = ({ activeItem, onItemClick }) => {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 w-64 h-full">
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white" style={{ fontFamily: 'Segoe UI, sans-serif' }}>
          IDDAS
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Sistema de Gestão de Milhas</p>
      </div>
      
      <nav className="mt-6">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onItemClick(item.id)}
              className={`w-full flex items-center px-6 py-3 text-left transition-colors ${
                isActive 
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-r-2 border-blue-700 dark:border-blue-300' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
              style={{ fontFamily: 'Segoe UI, sans-serif' }}
            >
              <Icon className={`h-5 w-5 mr-3 ${isActive ? 'text-blue-700 dark:text-blue-300' : 'text-gray-500 dark:text-gray-400'}`} />
              {item.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

