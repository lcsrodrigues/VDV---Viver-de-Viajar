import React from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
  activeMenuItem: string;
  onMenuItemClick: (item: string) => void;
  selectedPeriod?: string;
  onPeriodChange?: (period: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  title, 
  activeMenuItem, 
  onMenuItemClick,
  selectedPeriod,
  onPeriodChange
}) => {
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar activeItem={activeMenuItem} onItemClick={onMenuItemClick} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar 
          title={title} 
          selectedPeriod={selectedPeriod}
          onPeriodChange={onPeriodChange}
        />
        
        <main className="flex-1 overflow-auto p-6 bg-gray-50 dark:bg-gray-900">
          {children}
        </main>
      </div>
    </div>
  );
};

