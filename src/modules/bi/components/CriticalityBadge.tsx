import React from 'react';
import type { CriticalityLevel } from '../types';

type CriticalityBadgeProps = {
  level: CriticalityLevel;
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
};

const CRITICALITY_CONFIG = {
  excellent: {
    label: 'Excelente',
    color: 'bg-brand-purple-light text-brand-purple-dark border-brand-purple-500',
    bgColor: 'bg-brand-purple-light',
  },
  good: {
    label: 'Bom',
    color: 'bg-brand-purple-100 text-brand-purple-700 border-brand-purple-400',
    bgColor: 'bg-brand-purple-100',
  },
  attention: {
    label: 'Atenção',
    color: 'bg-brand-yellow-light text-brand-yellow-dark border-brand-yellow-500',
    bgColor: 'bg-brand-yellow-light',
  },
  warning: {
    label: 'Alerta',
    color: 'bg-orange-100 text-orange-800 border-orange-400',
    bgColor: 'bg-orange-50',
  },
  critical: {
    label: 'Crítico',
    color: 'bg-red-100 text-red-800 border-red-400',
    bgColor: 'bg-red-50',
  },
};

const SIZE_CONFIG = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-3 py-1.5 text-sm',
  lg: 'px-4 py-2 text-base',
};

export const CriticalityBadge: React.FC<CriticalityBadgeProps> = ({
  level,
  score,
  size = 'md',
  showLabel = true,
}) => {
  const config = CRITICALITY_CONFIG[level];

  return (
    <div className={`inline-flex items-center gap-2 rounded-lg border font-semibold ${config.color} ${SIZE_CONFIG[size]}`}>
      {showLabel && <span>{config.label}</span>}
      <span className="font-bold">{score.toFixed(0)}%</span>
    </div>
  );
};

export const CriticalityCard: React.FC<{ level: CriticalityLevel; score: number; children?: React.ReactNode }> = ({
  level,
  score,
  children,
}) => {
  const config = CRITICALITY_CONFIG[level];

  return (
    <div className={`rounded-xl border p-4 ${config.color}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-lg font-bold">{config.label}</span>
        <span className="text-2xl font-bold">{score.toFixed(0)}%</span>
      </div>
      {children}
    </div>
  );
};
