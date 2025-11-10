import React from 'react';
import type { MarketplaceFilter } from '../types';

type MarketplaceSelectorProps = {
  selected: MarketplaceFilter;
  onChange: (marketplace: MarketplaceFilter) => void;
  showCombined?: boolean;
};

const MARKETPLACE_CONFIG = {
  all: { label: 'Todos', color: 'bg-gray-100 text-gray-700 border-gray-300' },
  ifood: { label: 'iFood', color: 'bg-red-50 text-red-700 border-red-300' },
  '99food': { label: '99Food', color: 'bg-orange-50 text-orange-700 border-orange-300' },
  keeta: { label: 'Keeta', color: 'bg-blue-50 text-blue-700 border-blue-300' },
  proprio: { label: 'Próprio', color: 'bg-green-50 text-green-700 border-green-300' },
};

export const MarketplaceSelector: React.FC<MarketplaceSelectorProps> = ({
  selected,
  onChange,
  showCombined = true,
}) => {
  const options: MarketplaceFilter[] = showCombined
    ? ['all', 'ifood', '99food', 'keeta', 'proprio']
    : ['ifood', '99food', 'keeta', 'proprio'];

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((marketplace) => {
        const config = MARKETPLACE_CONFIG[marketplace];
        const isSelected = selected === marketplace;

        return (
          <button
            key={marketplace}
            onClick={() => onChange(marketplace)}
            className={`
              px-4 py-2 rounded-lg border-2 font-medium text-sm transition-all
              ${isSelected ? config.color + ' shadow-md' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'}
            `}
          >
            {config.label}
          </button>
        );
      })}
    </div>
  );
};
