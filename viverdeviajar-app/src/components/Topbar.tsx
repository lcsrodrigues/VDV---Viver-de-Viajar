import React from 'react';
import { Calendar, Moon, Sun } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface TopbarProps {
  title: string;
  selectedPeriod?: string;
  onPeriodChange?: (period: string) => void;
}

export const Topbar: React.FC<TopbarProps> = ({ 
  title, 
  selectedPeriod = '2025-09', 
  onPeriodChange 
}) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white" style={{ fontFamily: 'Segoe UI, sans-serif' }}>
        {title}
      </h1>
      
      <div className="flex items-center space-x-4">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          title={theme === 'light' ? 'Ativar modo escuro' : 'Ativar modo claro'}
        >
          {theme === 'light' ? (
            <Moon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          ) : (
            <Sun className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          )}
        </button>
        
        <div className="flex items-center space-x-2">
          <Calendar className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          <select 
            value={selectedPeriod}
            onChange={(e) => onPeriodChange?.(e.target.value)}
            className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            style={{ fontFamily: 'Segoe UI, sans-serif' }}
          >
            <option value="2025-09">Setembro 2025</option>
            <option value="2025-08">Agosto 2025</option>
            <option value="2025-07">Julho 2025</option>
            <option value="2025-06">Junho 2025</option>
            <option value="2025-05">Maio 2025</option>
          </select>
        </div>
      </div>
    </div>
  );
};

