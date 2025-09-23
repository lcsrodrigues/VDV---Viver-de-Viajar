import {
  ArrowUpDown,
  BarChart3,
  Calculator,
  FileText,
  Settings,
  Target,
  User
} from 'lucide-react';
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SidebarProps {
  activeItem: string;
  onItemClick: (item: string) => void;
  isCollapsed: boolean;
  toggleSidebar: () => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ElementType;
  subItems?: MenuItem[];
}

const menuItems: MenuItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
  { id: 'movimentacoes', label: 'Movimentações', icon: ArrowUpDown },
  { id: 'cotacoes', label: 'Cotações', icon: Calculator },
  { id: 'metas', label: 'Metas', icon: Target },
  { id: 'cadastros', label: 'Cadastros', icon: Settings, subItems: [
    { id: 'clients', label: 'Clientes/Contratos', icon: User },
  ] },
  { id: 'relatorios', label: 'Relatórios', icon: FileText },
];

export const Sidebar: React.FC<SidebarProps> = ({ activeItem, onItemClick, isCollapsed, toggleSidebar }) => {
  return (
    <div className={`bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 ${isCollapsed ? 'w-20' : 'w-64'} h-full transition-all duration-300 ease-in-out relative`}>
      <button
        onClick={toggleSidebar}
        className="absolute top-1/2 -right-3 -translate-y-1/2 bg-blue-500 text-white rounded-full p-1 shadow-md z-10"
      >
        {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
      </button>
      <div className={`p-6 ${isCollapsed ? 'hidden' : ''}`}>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white" style={{ fontFamily: 'Segoe UI, sans-serif' }}>
          VDV - Viver de Viajar
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Sistema de Gestão de Milhas</p>
      </div>

      <nav className="mt-6">
        {menuItems.map((item) => (
          <div key={item.id}>
            <button
              onClick={() => onItemClick(item.id)}
              className={`w-full flex items-center px-6 py-3 text-left transition-colors ${activeItem === item.id
                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-r-2 border-blue-700 dark:border-blue-300'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              style={{ fontFamily: 'Segoe UI, sans-serif' }}
            >
              <item.icon className={`h-5 w-5 ${isCollapsed ? '' : 'mr-3'} ${activeItem === item.id ? 'text-blue-700 dark:text-blue-300' : 'text-gray-500 dark:text-gray-400'}`} />
              {!isCollapsed && item.label}
            </button>
            {item.subItems && !isCollapsed && (
              <div className="ml-8">
                {item.subItems.map((subItem) => (
                  <button
                    key={subItem.id}
                    onClick={() => onItemClick(subItem.id)}
                    className={`w-full flex items-center px-6 py-2 text-left text-sm transition-colors ${activeItem === subItem.id
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-r-2 border-blue-700 dark:border-blue-300'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    style={{ fontFamily: 'Segoe UI, sans-serif' }}
                  >
                    <subItem.icon className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                    {subItem.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
};

