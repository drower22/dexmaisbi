import React from 'react';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import type { MarketplaceFilter, CriticalityLevel, BIFilters } from '../types';

type BIFiltersPanelProps = {
  isOpen: boolean;
  onToggle: () => void;
  filters: Partial<BIFilters>;
  onFiltersChange: (filters: Partial<BIFilters>) => void;
};

const MARKETPLACE_OPTIONS: { value: MarketplaceFilter; label: string }[] = [
  { value: 'all', label: 'Todos' },
  { value: 'ifood', label: 'iFood' },
  { value: '99food', label: '99Food' },
  { value: 'keeta', label: 'Keeta' },
  { value: 'proprio', label: 'Próprio' },
];

const PERFORMANCE_OPTIONS: { value: CriticalityLevel; label: string }[] = [
  { value: 'excellent', label: 'Excelente' },
  { value: 'good', label: 'Bom' },
  { value: 'attention', label: 'Atenção' },
  { value: 'warning', label: 'Alerta' },
  { value: 'critical', label: 'Crítico' },
];

const CATEGORY_OPTIONS = [
  { value: 'Restaurante', label: 'Restaurante' },
  { value: 'Hamburgueria', label: 'Hamburgueria' },
  { value: 'Pizzaria', label: 'Pizzaria' },
  { value: 'Japonesa', label: 'Japonesa' },
  { value: 'Sorveteria', label: 'Sorveteria' },
  { value: 'Churrascaria', label: 'Churrascaria' },
  { value: 'Confeitaria', label: 'Confeitaria' },
  { value: 'Cafeteria', label: 'Cafeteria' },
  { value: 'Marmitaria', label: 'Marmitaria' },
  { value: 'Lanchonete', label: 'Lanchonete' },
  { value: 'Italiana', label: 'Italiana' },
  { value: 'Mexicana', label: 'Mexicana' },
  { value: 'Rotisseria', label: 'Rotisseria' },
  { value: 'Saudável', label: 'Saudável' },
  { value: 'Árabe', label: 'Árabe' },
  { value: 'Havaiana', label: 'Havaiana' },
  { value: 'Salgados', label: 'Salgados' },
  { value: 'Regional', label: 'Regional' },
  { value: 'Chinesa', label: 'Chinesa' },
];

export const BIFiltersPanel: React.FC<BIFiltersPanelProps> = ({
  isOpen,
  onToggle,
  filters,
  onFiltersChange,
}) => {
  const handleMarketplaceToggle = (marketplace: MarketplaceFilter) => {
    const current = filters.marketplaces || [];
    const newMarketplaces = current.includes(marketplace)
      ? current.filter(m => m !== marketplace)
      : [...current, marketplace];
    onFiltersChange({ ...filters, marketplaces: newMarketplaces });
  };

  const handlePerformanceToggle = (level: CriticalityLevel) => {
    const current = filters.performanceLevels || [];
    const updated = current.includes(level)
      ? current.filter((l) => l !== level)
      : [...current, level];
    onFiltersChange({ ...filters, performanceLevels: updated });
  };

  const handleCategoryToggle = (category: string) => {
    const current = filters.categories || [];
    const updated = current.includes(category)
      ? current.filter((c) => c !== category)
      : [...current, category];
    onFiltersChange({ ...filters, categories: updated });
  };

  return (
    <>
      {/* Botão de Toggle (sempre visível) */}
      <button
        type="button"
        onClick={onToggle}
        className="fixed left-0 top-32 z-20 bg-brand-purple-dark text-white p-2 rounded-r-lg shadow-lg hover:bg-brand-purple-700 transition-colors"
        aria-label={isOpen ? 'Fechar filtros' : 'Abrir filtros'}
      >
        {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
      </button>

      {/* Sidebar de Filtros */}
      <aside
        className={`fixed left-0 top-20 h-[calc(100vh-5rem)] bg-white border-r border-gray-200 shadow-lg transition-transform duration-300 z-10 overflow-y-auto ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ width: '280px' }}
      >
        <div className="p-6 space-y-6">
          {/* Período */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Período
            </label>
            <div className="space-y-2">
              <div>
                <label className="block text-xs text-gray-600 mb-1">De</label>
                <input
                  type="date"
                  value={filters.dateRange?.from ? new Date(filters.dateRange.from).toISOString().split('T')[0] : ''}
                  onChange={(e) => {
                    const newFrom = e.target.value ? new Date(e.target.value) : undefined;
                    onFiltersChange({
                      ...filters,
                      dateRange: {
                        from: newFrom || new Date(),
                        to: filters.dateRange?.to || new Date(),
                      },
                    });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-purple-500 focus:border-transparent text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Até</label>
                <input
                  type="date"
                  value={filters.dateRange?.to ? new Date(filters.dateRange.to).toISOString().split('T')[0] : ''}
                  onChange={(e) => {
                    const newTo = e.target.value ? new Date(e.target.value) : undefined;
                    onFiltersChange({
                      ...filters,
                      dateRange: {
                        from: filters.dateRange?.from || new Date(),
                        to: newTo || new Date(),
                      },
                    });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-purple-500 focus:border-transparent text-sm"
                />
              </div>
            </div>
          </div>

          {/* Atalhos de Período */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Atalhos
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  const today = new Date();
                  const lastWeek = new Date(today);
                  lastWeek.setDate(today.getDate() - 7);
                  onFiltersChange({
                    ...filters,
                    dateRange: { from: lastWeek, to: today },
                  });
                }}
                className="px-3 py-2 text-xs border border-gray-300 rounded-lg hover:bg-brand-purple-50 hover:border-brand-purple-300 transition-colors"
              >
                Últimos 7 dias
              </button>
              <button
                type="button"
                onClick={() => {
                  const today = new Date();
                  const lastMonth = new Date(today);
                  lastMonth.setDate(today.getDate() - 30);
                  onFiltersChange({
                    ...filters,
                    dateRange: { from: lastMonth, to: today },
                  });
                }}
                className="px-3 py-2 text-xs border border-gray-300 rounded-lg hover:bg-brand-purple-50 hover:border-brand-purple-300 transition-colors"
              >
                Últimos 30 dias
              </button>
              <button
                type="button"
                onClick={() => {
                  const today = new Date();
                  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
                  onFiltersChange({
                    ...filters,
                    dateRange: { from: firstDay, to: today },
                  });
                }}
                className="px-3 py-2 text-xs border border-gray-300 rounded-lg hover:bg-brand-purple-50 hover:border-brand-purple-300 transition-colors"
              >
                Mês atual
              </button>
              <button
                type="button"
                onClick={() => {
                  const today = new Date();
                  const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);
                  const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
                  onFiltersChange({
                    ...filters,
                    dateRange: { from: lastMonthStart, to: lastMonthEnd },
                  });
                }}
                className="px-3 py-2 text-xs border border-gray-300 rounded-lg hover:bg-brand-purple-50 hover:border-brand-purple-300 transition-colors"
              >
                Mês passado
              </button>
            </div>
          </div>

          {/* Busca */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buscar Loja
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Nome da loja..."
                value={filters.searchTerm || ''}
                onChange={(e) => onFiltersChange({ ...filters, searchTerm: e.target.value })}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-purple-500 focus:border-transparent text-sm"
              />
            </div>
          </div>

          {/* Marketplace */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Marketplace
            </label>
            <div className="space-y-2">
              {MARKETPLACE_OPTIONS.map((option) => {
                const isSelected = filters.marketplaces?.includes(option.value) || false;
                return (
                  <label
                    key={option.value}
                    className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleMarketplaceToggle(option.value)}
                      className="w-4 h-4 text-brand-purple-600 border-gray-300 rounded focus:ring-brand-purple-500"
                    />
                    <span className="text-sm text-gray-700">{option.label}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Categoria */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categoria
            </label>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {CATEGORY_OPTIONS.map((option) => {
                const isSelected = filters.categories?.includes(option.value) || false;
                return (
                  <label
                    key={option.value}
                    className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleCategoryToggle(option.value)}
                      className="w-4 h-4 text-brand-purple-600 border-gray-300 rounded focus:ring-brand-purple-500"
                    />
                    <span className="text-sm text-gray-700">{option.label}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Performance */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nível de Performance
            </label>
            <div className="space-y-2">
              {PERFORMANCE_OPTIONS.map((option) => {
                const isSelected = filters.performanceLevels?.includes(option.value) || false;
                return (
                  <label
                    key={option.value}
                    className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handlePerformanceToggle(option.value)}
                      className="w-4 h-4 text-brand-purple-600 border-gray-300 rounded focus:ring-brand-purple-500"
                    />
                    <span className="text-sm text-gray-700">{option.label}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Ordenação */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ordenar por
            </label>
            <select
              value={filters.sortBy || 'score'}
              onChange={(e) => onFiltersChange({ ...filters, sortBy: e.target.value as BIFilters['sortBy'] })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-purple-500 focus:border-transparent text-sm"
            >
              <option value="score">Score de Performance</option>
              <option value="sales">Vendas</option>
              <option value="orders">Pedidos</option>
              <option value="ticket">Ticket Médio</option>
              <option value="name">Nome</option>
            </select>
          </div>

          {/* Limpar Filtros */}
          <button
            type="button"
            onClick={() => {
              const today = new Date();
              const lastWeek = new Date(today);
              lastWeek.setDate(today.getDate() - 7);
              onFiltersChange({
                searchTerm: '',
                marketplaces: [],
                categories: [],
                performanceLevels: [],
                sortBy: 'score',
                sortOrder: 'desc',
                dateRange: { from: lastWeek, to: today },
              });
            }}
            className="w-full px-4 py-2 text-sm text-brand-purple-700 border border-brand-purple-300 rounded-lg hover:bg-brand-purple-50 transition-colors"
          >
            Limpar Filtros
          </button>
        </div>
      </aside>

      {/* Overlay (mobile) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-0 lg:hidden"
          onClick={onToggle}
        />
      )}
    </>
  );
};
