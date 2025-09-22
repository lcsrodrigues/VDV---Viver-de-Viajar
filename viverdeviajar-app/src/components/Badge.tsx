import React from 'react';

interface BadgeProps {
  type: 'Compra' | 'Venda' | 'Transferência' | 'Troca' | 'Compra Inteligente' | 'Bônus' | 'Ajuste';
  size?: 'sm' | 'md';
}

const badgeColors = {
  'Compra': 'bg-blue-100 text-blue-800',
  'Venda': 'bg-green-100 text-green-800',
  'Transferência': 'bg-purple-100 text-purple-800',
  'Troca': 'bg-amber-100 text-amber-800',
  'Compra Inteligente': 'bg-cyan-100 text-cyan-800',
  'Bônus': 'bg-indigo-100 text-indigo-800',
  'Ajuste': 'bg-gray-100 text-gray-800',
};

export const Badge: React.FC<BadgeProps> = ({ type, size = 'sm' }) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-1 text-xs' : 'px-3 py-1 text-sm';
  
  return (
    <span 
      className={`inline-flex items-center rounded-full font-medium ${badgeColors[type]} ${sizeClasses}`}
      style={{ fontFamily: 'Segoe UI, sans-serif' }}
    >
      {type}
    </span>
  );
};

