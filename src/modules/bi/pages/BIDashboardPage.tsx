import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronUp } from 'lucide-react';
import type { ConsolidatedKPIs, StorePerformanceScore, BIFilters } from '../types';
import { BILayout } from '../components/BILayout';
import { BIFiltersPanel } from '../components/BIFiltersPanel';
import { createBIDataSource } from '../services/datasource';

export const BIDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const dataSource = React.useMemo(() => createBIDataSource(), []);
  const [kpis, setKpis] = useState<ConsolidatedKPIs | null>(null);
  const [stores, setStores] = useState<StorePerformanceScore[]>([]);
  const [loading, setLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);
  const [sortColumn, setSortColumn] = useState<'name' | 'group' | 'category' | 'sales' | 'orders' | 'ticket' | 'score'>('score');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const [filtersOpen, setFiltersOpen] = useState(true);
  const [filters, setFilters] = useState<Partial<BIFilters>>(() => {
    const today = new Date();
    const lastWeek = new Date(today);
    lastWeek.setDate(today.getDate() - 7);
    
    return {
      searchTerm: '',
      marketplaces: [],
      categories: [],
      performanceLevels: [],
      sortBy: 'score',
      sortOrder: 'desc',
      dateRange: { from: lastWeek, to: today },
    };
  });

  useEffect(() => {
    loadData();
  }, [filters]);

  const loadData = async () => {
    // Só mostra loading na primeira carga
    if (initialLoad) {
      setLoading(true);
    }
    try {
      const [kpisData, storesData] = await Promise.all([
        dataSource.getAgencyConsolidatedKPIs(),
        dataSource.getStorePerformanceScores(filters as BIFilters),
      ]);
      setKpis(kpisData);
      setStores(storesData);
    } catch (error) {
      console.error('Erro ao carregar dados do BI:', error);
    } finally {
      if (initialLoad) {
        setLoading(false);
        setInitialLoad(false);
      }
    }
  };

  const handleSort = (column: typeof sortColumn) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('desc');
    }
  };

  const sortedStores = [...stores].sort((a, b) => {
    let aVal: any, bVal: any;

    switch (sortColumn) {
      case 'name':
        aVal = a.storeName;
        bVal = b.storeName;
        break;
      case 'group':
        aVal = a.groupName || '';
        bVal = b.groupName || '';
        break;
      case 'category':
        aVal = a.category || '';
        bVal = b.category || '';
        break;
      case 'sales':
        aVal = a.goals.find(g => g.metric === 'faturamento_total')?.actual || 0;
        bVal = b.goals.find(g => g.metric === 'faturamento_total')?.actual || 0;
        break;
      case 'orders':
        aVal = a.goals.find(g => g.metric === 'numero_pedidos')?.actual || 0;
        bVal = b.goals.find(g => g.metric === 'numero_pedidos')?.actual || 0;
        break;
      case 'ticket':
        aVal = a.goals.find(g => g.metric === 'ticket_medio')?.actual || 0;
        bVal = b.goals.find(g => g.metric === 'ticket_medio')?.actual || 0;
        break;
      case 'score':
        aVal = a.overallScore;
        bVal = b.overallScore;
        break;
      default:
        aVal = a.overallScore;
        bVal = b.overallScore;
    }

    if (typeof aVal === 'string') {
      return sortDirection === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    }
    return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
  });

  // Paginação
  const totalPages = Math.ceil(sortedStores.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedStores = sortedStores.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getScoreBadgeColor = (score: number) => {
    if (score >= 90) return 'bg-green-100 text-green-800 border-green-300';
    if (score >= 70) return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    return 'bg-red-100 text-red-800 border-red-300';
  };

  const getMetaBadgeColor = (pct: number) => {
    if (pct >= 90) return 'text-green-700';
    if (pct >= 70) return 'text-yellow-700';
    return 'text-red-700';
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('pt-BR').format(value);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(date);
  };

  if (loading || !kpis) {
    return (
      <BILayout title="Visão Geral" subtitle="Acompanhe o desempenho de todos os seus clientes">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando dados...</p>
          </div>
        </div>
      </BILayout>
    );
  }

  return (
    <BILayout title="Visão Geral" subtitle="Acompanhe o desempenho de todos os seus clientes">
      {/* Sidebar de Filtros */}
      <BIFiltersPanel
        isOpen={filtersOpen}
        onToggle={() => setFiltersOpen(!filtersOpen)}
        filters={filters}
        onFiltersChange={setFilters}
      />

      {/* Conteúdo Principal */}
      <div
        className={`transition-all duration-300 ${filtersOpen ? 'ml-[280px]' : 'ml-0'}`}
        style={{ maxWidth: filtersOpen ? 'calc(100% - 280px)' : '100%' }}
      >
        <div className="max-w-7xl mx-auto">
          {/* Indicador de Período */}
          {filters.dateRange && (
            <div className="bg-brand-purple-light border border-brand-purple-300 rounded-lg p-3 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-brand-purple-dark">Período:</span>
                  <span className="text-sm text-brand-purple-700">
                    {formatDate(filters.dateRange.from)} até {formatDate(filters.dateRange.to)}
                  </span>
                </div>
                <span className="text-xs text-brand-purple-600">
                  {Math.ceil((filters.dateRange.to.getTime() - filters.dateRange.from.getTime()) / (1000 * 60 * 60 * 24))} dias
                </span>
              </div>
            </div>
          )}

          {/* Indicadores Gerais */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h2 className="text-lg font-semibold text-brand-purple-dark mb-4">Indicadores Gerais</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="border border-gray-200 rounded-lg p-4 min-h-[120px] flex flex-col justify-between">
                <div className="text-sm text-gray-600 mb-1">Vendas Totais</div>
                <div className="text-2xl font-bold text-brand-purple-800 break-words">{formatCurrency(kpis.totalSales)}</div>
                <div className="text-xs text-gray-500 mt-1">+{kpis.salesGrowth.toFixed(1)}%</div>
              </div>
              <div className="border border-gray-200 rounded-lg p-4 min-h-[120px] flex flex-col justify-between">
                <div className="text-sm text-gray-600 mb-1">Total de Pedidos</div>
                <div className="text-3xl font-bold text-brand-purple-700">{formatNumber(kpis.totalOrders)}</div>
                <div className="text-xs text-gray-500 mt-1">+{kpis.ordersGrowth.toFixed(1)}%</div>
              </div>
              <div className="border border-gray-200 rounded-lg p-4 min-h-[120px] flex flex-col justify-between">
                <div className="text-sm text-gray-600 mb-1">Quantidade de Lojas</div>
                <div className="text-3xl font-bold text-brand-purple-700">{kpis.activeStores}</div>
                <div className="text-xs text-gray-500 mt-1">{((kpis.activeStores / kpis.totalStores) * 100).toFixed(0)}% clientes no total</div>
              </div>
              <div className="border border-gray-200 rounded-lg p-4 min-h-[120px] flex flex-col justify-between">
                <div className="text-sm text-gray-600 mb-1">Clientes Ativos</div>
                <div className="text-3xl font-bold text-brand-purple-700">{kpis.activeStores}</div>
                <div className="text-xs text-gray-500 mt-1">clientes da agência</div>
              </div>
              <div className="border border-gray-200 rounded-lg p-4 min-h-[120px] flex flex-col justify-between">
                <div className="text-sm text-gray-600 mb-1">ROI</div>
                <div className="text-3xl font-bold text-brand-yellow-dark">{kpis.roi.toFixed(1)}x</div>
                <div className="text-xs text-gray-500 mt-1">retorno sobre investimento</div>
              </div>
            </div>
          </div>

          {/* Breakdown por Marketplace */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h2 className="text-lg font-semibold text-brand-purple-dark mb-4">Distribuição por Canal</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {kpis.marketplaceBreakdown.map((mp) => (
                <div key={mp.marketplace} className="border border-gray-200 rounded-lg p-4 hover:border-brand-purple-300 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-semibold text-gray-700 capitalize">{mp.marketplace}</div>
                    {mp.trend && (
                      <div className={`text-xs font-semibold ${mp.trend.direction === 'up' ? 'text-brand-purple-600' : 'text-red-600'}`}>
                        {mp.trend.direction === 'up' ? '+' : ''}{mp.trend.percentChange.toFixed(1)}%
                      </div>
                    )}
                  </div>
                  <div className="text-2xl font-bold text-brand-purple-800 mb-1">{mp.contribution.toFixed(0)}%</div>
                  <div className="text-xs text-gray-600 space-y-1">
                    <div>Vendas: {formatCurrency(mp.sales)}</div>
                    <div>Pedidos: {formatNumber(mp.orders)}</div>
                    <div>Margem: {formatCurrency(mp.net)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tabela de Clientes */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-brand-purple-dark">Todos os Clientes</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Mostrando {startIndex + 1}-{Math.min(endIndex, sortedStores.length)} de {sortedStores.length} clientes
                </p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th 
                      onClick={() => handleSort('name')}
                      className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        Loja
                        {sortColumn === 'name' && (sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                      </div>
                    </th>
                    <th 
                      onClick={() => handleSort('category')}
                      className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        Categoria
                        {sortColumn === 'category' && (sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                      </div>
                    </th>
                    <th 
                      onClick={() => handleSort('group')}
                      className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        Grupo
                        {sortColumn === 'group' && (sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                      </div>
                    </th>
                    <th 
                      onClick={() => handleSort('sales')}
                      className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center justify-end gap-2">
                        Vendas
                        {sortColumn === 'sales' && (sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                      </div>
                    </th>
                    <th 
                      onClick={() => handleSort('orders')}
                      className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center justify-end gap-2">
                        Pedidos
                        {sortColumn === 'orders' && (sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                      </div>
                    </th>
                    <th 
                      onClick={() => handleSort('ticket')}
                      className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center justify-end gap-2">
                        Ticket Médio
                        {sortColumn === 'ticket' && (sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                      </div>
                    </th>
                    <th 
                      onClick={() => handleSort('score')}
                      className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center justify-center gap-2">
                        Score
                        {sortColumn === 'score' && (sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                      </div>
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedStores.map((store) => {
                    const salesGoal = store.goals.find(g => g.metric === 'faturamento_total');
                    const ordersGoal = store.goals.find(g => g.metric === 'numero_pedidos');
                    const ticketGoal = store.goals.find(g => g.metric === 'ticket_medio');

                    return (
                      <tr key={store.storeId} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">{store.storeName}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600">{store.category || '-'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600">{store.groupName || '-'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="text-sm font-semibold text-brand-purple-800">{formatCurrency(salesGoal?.actual || 0)}</div>
                          <div className={`text-xs font-semibold ${getMetaBadgeColor(salesGoal?.completionPct || 0)}`}>
                            {salesGoal?.completionPct.toFixed(0)}% da meta
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="text-sm font-semibold text-gray-700">{formatNumber(ordersGoal?.actual || 0)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="text-sm font-semibold text-gray-700">{formatCurrency(ticketGoal?.actual || 0)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span className={`inline-flex items-center px-3 py-1 rounded-lg border font-semibold text-sm ${getScoreBadgeColor(store.overallScore)}`}>
                            {store.overallScore.toFixed(0)}%
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <button
                            type="button"
                            onClick={() => navigate(`/bi/loja/${store.storeId}`)}
                            className="text-brand-purple-600 hover:text-brand-purple-800 font-medium text-sm"
                          >
                            Ver detalhes
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            
            {/* Paginação */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Página {currentPage} de {totalPages}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Anterior
                  </button>
                  
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      
                      return (
                        <button
                          type="button"
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                            currentPage === pageNum
                              ? 'bg-brand-purple-600 text-white'
                              : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Próxima
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Estatísticas Rápidas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <button
              type="button"
              onClick={() => setFilters({ ...filters, performanceLevels: ['excellent'] })}
              className="bg-brand-purple-light border border-brand-purple-300 rounded-lg p-4 hover:shadow-lg transition-all text-left"
            >
              <div className="text-sm text-brand-purple-700 mb-1">Clientes Excelentes</div>
              <div className="text-3xl font-bold text-brand-purple-dark">
                {stores.filter(s => s.criticalityLevel === 'excellent').length}
              </div>
            </button>
            <button
              type="button"
              onClick={() => setFilters({ ...filters, performanceLevels: ['attention'] })}
              className="bg-brand-yellow-light border border-brand-yellow-300 rounded-lg p-4 hover:shadow-lg transition-all text-left"
            >
              <div className="text-sm text-brand-yellow-700 mb-1">Clientes em Atenção</div>
              <div className="text-3xl font-bold text-brand-yellow-dark">
                {stores.filter(s => s.criticalityLevel === 'attention').length}
              </div>
            </button>
            <button
              type="button"
              onClick={() => setFilters({ ...filters, performanceLevels: ['warning'] })}
              className="bg-orange-50 border border-orange-300 rounded-lg p-4 hover:shadow-lg transition-all text-left"
            >
              <div className="text-sm text-orange-700 mb-1">Clientes em Alerta</div>
              <div className="text-3xl font-bold text-orange-800">
                {stores.filter(s => s.criticalityLevel === 'warning').length}
              </div>
            </button>
            <button
              type="button"
              onClick={() => setFilters({ ...filters, performanceLevels: ['critical'] })}
              className="bg-red-50 border border-red-300 rounded-lg p-4 hover:shadow-lg transition-all text-left"
            >
              <div className="text-sm text-red-700 mb-1">Clientes Críticos</div>
              <div className="text-3xl font-bold text-red-800">
                {stores.filter(s => s.criticalityLevel === 'critical').length}
              </div>
            </button>
          </div>
        </div>
      </div>
    </BILayout>
  );
};
