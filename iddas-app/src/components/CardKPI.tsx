import React from 'react';
import { LucideIcon } from 'lucide-react';

interface CardKPIProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export const CardKPI: React.FC<CardKPIProps> = ({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend 
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1" style={{ fontFamily: 'Segoe UI, sans-serif' }}>
            {title}
          </p>
          <p className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Segoe UI, sans-serif' }}>
            {typeof value === 'number' ? value.toLocaleString('pt-BR') : value}
          </p>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1" style={{ fontFamily: 'Segoe UI, sans-serif' }}>
              {subtitle}
            </p>
          )}
          {trend && (
            <div className={`flex items-center mt-2 text-sm ${
              trend.isPositive ? 'text-green-600' : 'text-red-600'
            }`}>
              <span>{trend.isPositive ? '+' : ''}{trend.value}%</span>
            </div>
          )}
        </div>
        {Icon && (
          <div className="ml-4">
            <Icon className="h-8 w-8 text-blue-600" />
          </div>
        )}
      </div>
    </div>
  );
};

