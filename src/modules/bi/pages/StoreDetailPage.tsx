import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, X, Download } from 'lucide-react';
import type { StoreDetailedAnalysis, BIFilters, StoreGoal } from '../types';
import { BILayout } from '../components/BILayout';
import { BIFiltersPanel } from '../components/BIFiltersPanel';
import { CriticalityBadge } from '../components/CriticalityBadge';
import { getStoreDetailedAnalysis } from '../services/mock.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

type TabType = 'overview' | 'marketplace' | 'hourly' | 'promotions' | 'delivery';

export const StoreDetailPage: React.FC = () => {
  const { storeId } = useParams<{ storeId: string }>();
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState<StoreDetailedAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const [filters, setFilters] = useState<Partial<BIFilters>>({
    searchTerm: '',
    marketplaces: [],
    categories: [],
    performanceLevels: [],
    sortBy: 'score',
    sortOrder: 'desc',
  });

  useEffect(() => {
    if (storeId) {
      loadData();
    }
  }, [storeId]);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getStoreDetailedAnalysis(storeId!);
      setAnalysis(data);
    } catch (error) {
      console.error('Erro ao carregar análise da loja:', error);
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = async () => {
    setGeneratingPDF(true);
    try {
      const element = document.getElementById('report-content');
      if (!element) return;

      // Capturar o elemento como imagem
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      
      // Criar PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 0;

      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      
      // Baixar PDF
      pdf.save(`relatorio-${store.name.replace(/\s+/g, '-').toLowerCase()}.pdf`);
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      alert('Erro ao gerar PDF. Tente novamente.');
    } finally {
      setGeneratingPDF(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('pt-BR').format(value);
  };

  const getGoalDirection = (metric: StoreGoal['metric']) => {
    switch (metric) {
      case 'faturamento_total':
      case 'faturamento_liquido':
      case 'numero_pedidos':
      case 'ticket_medio':
        return 'increase';
      default:
        return 'decrease';
    }
  };

  // Dados mockados para os gráficos de evolução das metas
  const salesChartData = useMemo(() => {
    if (!analysis) return [];
    const salesGoal = analysis.performanceScore.goals.find(g => g.metric === 'faturamento_total');
    const targetValue = salesGoal?.target || 156505;
    const currentValue = salesGoal?.actual || 51251;
    
    // Gerar 30 dias de dados
    const data = [];
    const today = new Date();
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}`;
      
      // Simular crescimento progressivo com variação
      const progress = (29 - i) / 29;
      const variation = Math.sin(i * 0.5) * 0.1; // Variação de ±10%
      const realValue = currentValue * progress * (1 + variation);
      
      data.push({
        date: dateStr,
        real: Math.round(realValue),
        meta: targetValue
      });
    }
    return data;
  }, [analysis]);

  const ticketChartData = useMemo(() => {
    if (!analysis) return [];
    const ticketGoal = analysis.performanceScore.goals.find(g => g.metric === 'ticket_medio');
    const targetValue = ticketGoal?.target || 45;
    const currentValue = ticketGoal?.actual || 38.5;
    
    const data = [];
    const today = new Date();
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}`;
      
      const progress = (29 - i) / 29;
      const variation = Math.sin(i * 0.3) * 0.08;
      const realValue = currentValue * progress * (1 + variation);
      
      data.push({
        date: dateStr,
        real: Math.round(realValue * 100) / 100,
        meta: targetValue
      });
    }
    return data;
  }, [analysis]);

  const netRevenueChartData = useMemo(() => {
    if (!analysis) return [];
    const netGoal = analysis.performanceScore.goals.find(g => g.metric === 'faturamento_liquido');
    const targetValue = netGoal?.target || 120000;
    const currentValue = netGoal?.actual || 42000;
    
    const data = [];
    const today = new Date();
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}`;
      
      const progress = (29 - i) / 29;
      const variation = Math.sin(i * 0.4) * 0.12;
      const realValue = currentValue * progress * (1 + variation);
      
      data.push({
        date: dateStr,
        real: Math.round(realValue),
        meta: targetValue
      });
    }
    return data;
  }, [analysis]);

  if (loading || !analysis) {
    return (
      <BILayout title="Análise de Loja" subtitle="Carregando...">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando análise...</p>
          </div>
        </div>
      </BILayout>
    );
  }

  const { store, performanceScore, marketplaceConnections, kpis, hourlyPerformance, promotionAnalysis, deliveryAnalysis } = analysis;

  return (
    <BILayout title={store.name} subtitle={`${store.groupName || ''} ${store.category || ''}`.trim()}>
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
          {/* Botão Voltar */}
          <button
            type="button"
            onClick={() => navigate('/bi')}
            className="mb-4 inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-brand-purple-400 transition-colors font-medium text-gray-700"
          >
            <ArrowLeft size={18} />
            Voltar para Todos os Clientes
          </button>
        {/* Cabeçalho da Loja */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <CriticalityBadge level={performanceScore.criticalityLevel} score={performanceScore.overallScore} />
              </div>
              <div className="text-sm text-gray-600">
                {store.groupName && <span className="mr-3">Grupo: {store.groupName}</span>}
                {store.category && <span>Categoria: {store.category}</span>}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setReportModalOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-brand-purple-dark text-brand-purple-dark hover:bg-brand-purple-50 rounded-lg transition-colors font-semibold text-sm shadow-md"
            >
              <FileText size={20} />
              Gerar Relatório PDF
            </button>
          </div>

          {/* Marketplaces Conectados */}
          <div className="flex flex-wrap gap-2">
            {marketplaceConnections.map((conn) => (
              <span
                key={conn.marketplace}
                className={`px-3 py-1 rounded-lg text-sm font-medium ${
                  conn.isConnected 
                    ? 'bg-brand-purple-light text-brand-purple-dark border border-brand-purple-300' 
                    : 'bg-gray-100 text-gray-500 border border-gray-300'
                }`}
              >
                {conn.marketplace} {conn.isConnected ? '✓' : '✗'}
              </span>
            ))}
          </div>
        </div>

        {/* Metas do Período */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold text-brand-purple-dark mb-4">Metas do Período</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {performanceScore.goals.map((goal) => {
              const getCompletionColor = (pct: number) => {
                if (pct >= 90) return 'text-green-700';
                if (pct >= 70) return 'text-yellow-700';
                return 'text-red-700';
              };
              const goalDirection = getGoalDirection(goal.metric);
              const directionBadgeClass = goalDirection === 'increase'
                ? 'bg-brand-purple-50 text-brand-purple-dark border border-brand-purple-200'
                : 'bg-gray-100 text-gray-600 border border-gray-300';
              const directionText = goalDirection === 'increase' ? 'Objetivo: aumentar este indicador' : 'Objetivo: reduzir este indicador';
              const directionIcon = goalDirection === 'increase' ? '↑' : '↓';
              
              return (
                <div key={goal.metric} className="border border-gray-200 rounded-lg p-4">
                  <div className="mb-3">
                    <div className="text-sm font-semibold text-gray-700">{goal.label}</div>
                    <div className={`mt-1 inline-flex items-center gap-2 text-xs font-medium px-2 py-1 rounded-full ${directionBadgeClass}`}>
                      <span className="text-base leading-none">{directionIcon}</span>
                      <span>{directionText}</span>
                    </div>
                  </div>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-2xl font-bold text-brand-purple-800">
                      {goal.unit === 'currency' ? formatCurrency(goal.actual) : 
                       goal.unit === 'percent' ? `${goal.actual.toFixed(1)}%` : 
                       formatNumber(goal.actual)}
                    </span>
                    <span className="text-sm text-gray-500">
                      / {goal.unit === 'currency' ? formatCurrency(goal.target) : 
                         goal.unit === 'percent' ? `${goal.target.toFixed(1)}%` : 
                         formatNumber(goal.target)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div
                      className="h-2 rounded-full bg-brand-purple-600"
                      style={{ width: `${Math.min(goal.completionPct, 100)}%` }}
                    />
                  </div>
                  <div className={`text-sm font-semibold ${getCompletionColor(goal.completionPct)}`}>
                    {goal.completionPct.toFixed(1)}% atingido
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tabs de Análise */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="border-b border-gray-200">
            <div className="flex flex-wrap px-6">
              {[
                { id: 'overview', label: 'Análise' },
                { id: 'marketplace', label: 'Marketplaces' },
                { id: 'hourly', label: 'Por Horário' },
                { id: 'promotions', label: 'Promoções' },
                { id: 'delivery', label: 'Entregas' },
              ].map((tab) => (
                <button
                  type="button"
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`pb-2 -mb-px px-4 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-brand-purple-500 text-brand-purple-700'
                      : 'border-transparent text-gray-600 hover:text-gray-800'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">
            {/* Tab: Overview - Gráficos de Evolução das Metas */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Cards de KPIs Principais */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  {/* Faturamento Total */}
                  <div className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm">
                    <div className="text-sm font-medium text-gray-600 mb-2">Faturamento Total</div>
                    <div className="text-2xl font-bold text-brand-purple-700">
                      {kpis.totalSales.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </div>
                    {kpis.comparison && (
                      <div className={`text-sm mt-2 ${kpis.comparison.salesChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {kpis.comparison.salesChange >= 0 ? '↑' : '↓'} {Math.abs(kpis.comparison.salesChange).toFixed(1)}% vs anterior
                      </div>
                    )}
                  </div>

                  {/* Pedidos */}
                  <div className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm">
                    <div className="text-sm font-medium text-gray-600 mb-2">Pedidos</div>
                    <div className="text-2xl font-bold text-brand-purple-700">
                      {kpis.totalOrders.toLocaleString('pt-BR')}
                    </div>
                    {kpis.comparison && (
                      <div className={`text-sm mt-2 ${kpis.comparison.ordersChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {kpis.comparison.ordersChange >= 0 ? '↑' : '↓'} {Math.abs(kpis.comparison.ordersChange).toFixed(1)}% vs anterior
                      </div>
                    )}
                  </div>

                  {/* Ticket Médio */}
                  <div className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm">
                    <div className="text-sm font-medium text-gray-600 mb-2">Ticket Médio</div>
                    <div className="text-2xl font-bold text-brand-purple-700">
                      {kpis.avgTicket.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </div>
                    {kpis.comparison && (
                      <div className={`text-sm mt-2 ${kpis.comparison.ticketChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {kpis.comparison.ticketChange >= 0 ? '↑' : '↓'} {Math.abs(kpis.comparison.ticketChange).toFixed(1)}% vs anterior
                      </div>
                    )}
                  </div>

                  {/* Faturamento Líquido/Margem */}
                  <div className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm">
                    <div className="text-sm font-medium text-gray-600 mb-2">Faturamento Líquido</div>
                    <div className="text-2xl font-bold text-brand-purple-700">
                      {(kpis.totalSales - kpis.totalFees).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                      Margem: {kpis.netMargin.toFixed(1)}%
                    </div>
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-brand-purple-dark">Evolução das Metas ao Longo do Tempo</h3>
                
                {/* Gráfico 1: Vendas Totais */}
                <div className="border border-gray-200 rounded-lg p-6 bg-white">
                  <div className="mb-4">
                    <h4 className="text-base font-semibold text-gray-800 mb-1">Vendas Totais</h4>
                    <p className="text-sm text-gray-600">Objetivo: aumentar este indicador</p>
                  </div>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={salesChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis 
                        dataKey="date" 
                        tick={{ fontSize: 12 }}
                        stroke="#6b7280"
                      />
                      <YAxis 
                        tick={{ fontSize: 12 }}
                        stroke="#6b7280"
                        tickFormatter={(value: number) => `R$ ${(value / 1000).toFixed(0)}k`}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          fontSize: '12px'
                        }}
                        formatter={(value: any) => [`R$ ${Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, '']}
                      />
                      <Legend wrapperStyle={{ fontSize: '12px' }} />
                      <Line 
                        type="monotone" 
                        dataKey="real" 
                        stroke="#2b0148" 
                        strokeWidth={2}
                        name="Realizado"
                        dot={{ fill: '#2b0148', r: 4 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="meta" 
                        stroke="#10b981" 
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        name="Meta"
                        dot={{ fill: '#10b981', r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Gráfico 2: Ticket Médio */}
                <div className="border border-gray-200 rounded-lg p-6 bg-white">
                  <div className="mb-4">
                    <h4 className="text-base font-semibold text-gray-800 mb-1">Ticket Médio</h4>
                    <p className="text-sm text-gray-600">Objetivo: aumentar este indicador</p>
                  </div>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={ticketChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis 
                        dataKey="date" 
                        tick={{ fontSize: 12 }}
                        stroke="#6b7280"
                      />
                      <YAxis 
                        tick={{ fontSize: 12 }}
                        stroke="#6b7280"
                        tickFormatter={(value: number) => `R$ ${value.toFixed(0)}`}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          fontSize: '12px'
                        }}
                        formatter={(value: any) => [`R$ ${Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, '']}
                      />
                      <Legend wrapperStyle={{ fontSize: '12px' }} />
                      <Line 
                        type="monotone" 
                        dataKey="real" 
                        stroke="#2b0148" 
                        strokeWidth={2}
                        name="Realizado"
                        dot={{ fill: '#2b0148', r: 4 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="meta" 
                        stroke="#10b981" 
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        name="Meta"
                        dot={{ fill: '#10b981', r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Gráfico 3: Faturamento Líquido */}
                <div className="border border-gray-200 rounded-lg p-6 bg-white">
                  <div className="mb-4">
                    <h4 className="text-base font-semibold text-gray-800 mb-1">Faturamento Líquido</h4>
                    <p className="text-sm text-gray-600">Objetivo: aumentar este indicador</p>
                  </div>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={netRevenueChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis 
                        dataKey="date" 
                        tick={{ fontSize: 12 }}
                        stroke="#6b7280"
                      />
                      <YAxis 
                        tick={{ fontSize: 12 }}
                        stroke="#6b7280"
                        tickFormatter={(value: number) => `R$ ${(value / 1000).toFixed(0)}k`}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          fontSize: '12px'
                        }}
                        formatter={(value: any) => [`R$ ${Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, '']}
                      />
                      <Legend wrapperStyle={{ fontSize: '12px' }} />
                      <Line 
                        type="monotone" 
                        dataKey="real" 
                        stroke="#2b0148" 
                        strokeWidth={2}
                        name="Realizado"
                        dot={{ fill: '#2b0148', r: 4 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="meta" 
                        stroke="#10b981" 
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        name="Meta"
                        dot={{ fill: '#10b981', r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Tab: Marketplace */}
            {activeTab === 'marketplace' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-brand-purple-dark">Comparação entre Marketplaces</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Marketplace</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Vendas</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Pedidos</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Ticket Médio</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Taxas</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Líquido</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">% Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {performanceScore.marketplaceBreakdown.map((mp) => (
                        <tr key={mp.marketplace} className="hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium capitalize">{mp.marketplace}</td>
                          <td className="px-4 py-3 text-right">{formatCurrency(mp.sales)}</td>
                          <td className="px-4 py-3 text-right">{formatNumber(mp.orders)}</td>
                          <td className="px-4 py-3 text-right">{formatCurrency(mp.avgTicket)}</td>
                          <td className="px-4 py-3 text-right text-red-600">{formatCurrency(mp.fees)}</td>
                          <td className="px-4 py-3 text-right text-brand-purple-700 font-semibold">{formatCurrency(mp.net)}</td>
                          <td className="px-4 py-3 text-right font-semibold">{mp.contribution.toFixed(1)}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Tab: Hourly */}
            {activeTab === 'hourly' && hourlyPerformance && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-brand-purple-dark">Performance por Horário</h3>
                <div className="grid grid-cols-12 gap-2">
                  {hourlyPerformance.map((hour) => {
                    const intensity = hour.totalOrders > 100 ? 'bg-brand-purple-600' :
                                     hour.totalOrders > 50 ? 'bg-brand-purple-400' :
                                     hour.totalOrders > 20 ? 'bg-brand-purple-200' : 'bg-gray-200';
                    
                    return (
                      <div key={hour.hour} className="text-center">
                        <div className={`${intensity} rounded-lg p-3 text-white mb-1`}>
                          <div className="font-bold text-sm">{hour.totalOrders}</div>
                          <div className="text-xs mt-1">{formatCurrency(hour.totalRevenue)}</div>
                        </div>
                        <div className="text-xs text-gray-600">{hour.hour}h</div>
                      </div>
                    );
                  })}
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-brand-purple-600 rounded"></div>
                    Pico (&gt;100)
                  </span>
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-brand-purple-400 rounded"></div>
                    Alto (50-100)
                  </span>
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-brand-purple-200 rounded"></div>
                    Médio (20-50)
                  </span>
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-200 rounded"></div>
                    Baixo (&lt;20)
                  </span>
                </div>
              </div>
            )}

            {/* Tab: Promotions */}
            {activeTab === 'promotions' && promotionAnalysis && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-brand-purple-dark">Análise de Promoções</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {promotionAnalysis.map((promo) => (
                    <div key={promo.marketplace} className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-800 mb-3 capitalize">{promo.marketplace}</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Desconto Total:</span>
                          <span className="font-semibold text-red-600">{formatCurrency(promo.marketplacePromo.totalDiscount + promo.storePromo.totalDiscount)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Pedidos com Promo:</span>
                          <span className="font-semibold">{promo.promoOrdersPct.toFixed(0)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">ROI Médio:</span>
                          <span className="font-semibold text-brand-purple-700">{((promo.marketplacePromo.roi + promo.storePromo.roi) / 2).toFixed(1)}x</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab: Delivery */}
            {activeTab === 'delivery' && deliveryAnalysis && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-brand-purple-dark">Análise de Entregas</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {deliveryAnalysis.map((delivery) => (
                    <div key={delivery.marketplace} className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-800 mb-3 capitalize">{delivery.marketplace}</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total de Entregas:</span>
                          <span className="font-semibold">{formatNumber(delivery.totalDeliveries)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Entregas Grátis:</span>
                          <span className="font-semibold">{formatNumber(delivery.freeDeliveries)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Taxa Média:</span>
                          <span className="font-semibold">{formatCurrency(delivery.avgDeliveryFee)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Margem:</span>
                          <span className="font-semibold text-brand-purple-700">{delivery.deliveryMargin.toFixed(1)}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        </div>
      </div>

      {/* Modal de Pré-visualização do Relatório */}
      {reportModalOpen && (
        <div className="print-report fixed inset-0 bg-gray-900/95 z-50 flex items-center justify-center p-4 print:relative print:bg-white print:p-0">
          <div className="w-full max-w-5xl h-[95vh] flex flex-col print:max-w-none print:h-auto">
            {/* Toolbar do PDF */}
            <div className="bg-gray-800 text-white px-6 py-4 flex items-center justify-between rounded-t-lg print:hidden">
              <div className="flex items-center gap-4">
                <FileText size={24} />
                <div>
                  <h2 className="font-semibold">Relatório de Desempenho - {store.name}</h2>
                  <p className="text-xs text-gray-300">Pré-visualização do PDF</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={generatePDF}
                  disabled={generatingPDF}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-brand-purple-600 hover:bg-brand-purple-700 text-white rounded-lg transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {generatingPDF ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      Gerando PDF...
                    </>
                  ) : (
                    <>
                      <Download size={18} />
                      Baixar PDF
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setReportModalOpen(false)}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            {/* Visualizador do PDF */}
            <div className="flex-1 bg-gray-700 overflow-y-auto p-8 print:bg-white print:p-0 print:overflow-visible">
              {/* Página do PDF */}
              <div id="report-content" className="bg-white shadow-2xl mx-auto max-w-[210mm] min-h-[297mm] px-6 py-8 print:shadow-none print:px-4 print:py-6">
                <div className="space-y-4">

                {/* Cabeçalho do Relatório com Logo */}
                <div className="flex items-start justify-between border-b border-gray-300 pb-5">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="border border-brand-purple-200 px-6 py-3 rounded bg-brand-purple-50">
                        <div className="text-xs font-semibold text-brand-purple-dark tracking-widest">SEU LOGO</div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <h1 className="text-2xl font-bold text-brand-purple-dark mb-1">Relatório de Desempenho</h1>
                    <p className="text-base text-gray-700 font-semibold">{store.name}</p>
                    <div className="mt-2 text-xs text-gray-600 space-y-1">
                      <p>Período: {(() => {
                        const endDate = new Date();
                        const startDate = new Date();
                        startDate.setDate(endDate.getDate() - 7);
                        return `${startDate.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })} a ${endDate.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })}`;
                      })()}</p>
                      <p>Gerado em: {new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })}</p>
                    </div>
                  </div>
                </div>

                {/* Indicadores Principais - iFood */}
                <div className="border border-gray-200 rounded-lg p-4 shadow-sm">
                  <h2 className="text-lg font-semibold text-brand-purple-dark mb-4 border-l-4 border-brand-purple-300 pl-3">Desempenho iFood</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Faturamento */}
                    <div className="border border-gray-200 rounded-md p-3 bg-gray-50">
                      <div className="text-xs font-semibold text-brand-purple-dark mb-1 uppercase tracking-wide">Faturamento</div>
                      <div className="text-xl font-bold text-gray-900">
                        {formatCurrency(performanceScore.marketplaceBreakdown.find(m => m.marketplace === 'ifood')?.sales || 0)}
                      </div>
                      {kpis.comparison && (
                        <div className="text-xs text-gray-600 mt-2">
                          {kpis.comparison.salesChange >= 0 ? '↑' : '↓'} {Math.abs(kpis.comparison.salesChange).toFixed(1)}% vs período anterior
                        </div>
                      )}
                    </div>

                    {/* Pedidos */}
                    <div className="border border-gray-200 rounded-md p-3 bg-gray-50">
                      <div className="text-xs font-semibold text-brand-purple-dark mb-1 uppercase tracking-wide">Pedidos</div>
                      <div className="text-xl font-bold text-gray-900">
                        {formatNumber(performanceScore.marketplaceBreakdown.find(m => m.marketplace === 'ifood')?.orders || 0)}
                      </div>
                      {kpis.comparison && (
                        <div className="text-xs text-gray-600 mt-2">
                          {kpis.comparison.ordersChange >= 0 ? '↑' : '↓'} {Math.abs(kpis.comparison.ordersChange).toFixed(1)}% vs período anterior
                        </div>
                      )}
                    </div>

                    {/* Ticket Médio */}
                    <div className="border border-gray-200 rounded-md p-3 bg-gray-50">
                      <div className="text-xs font-semibold text-brand-purple-dark mb-1 uppercase tracking-wide">Ticket Médio</div>
                      <div className="text-xl font-bold text-gray-900">
                        {formatCurrency(performanceScore.marketplaceBreakdown.find(m => m.marketplace === 'ifood')?.avgTicket || 0)}
                      </div>
                      {kpis.comparison && (
                        <div className="text-xs text-gray-600 mt-2">
                          {kpis.comparison.ticketChange >= 0 ? '↑' : '↓'} {Math.abs(kpis.comparison.ticketChange).toFixed(1)}% vs período anterior
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Faturamento Líquido */}
                <div className="border border-gray-200 rounded-lg p-4 shadow-sm">
                  <h3 className="text-lg font-semibold text-brand-purple-dark mb-3 border-l-4 border-brand-purple-300 pl-3">Faturamento Líquido</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-gray-900">
                        {formatCurrency(performanceScore.marketplaceBreakdown.find(m => m.marketplace === 'ifood')?.net || 0)}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">Após descontar taxas e comissões</div>
                    </div>
                    {kpis.comparison && (
                      <div className="text-right text-brand-purple-dark">
                        <div className="text-xl font-semibold">
                          {kpis.comparison.salesChange >= 0 ? '+' : ''}{kpis.comparison.salesChange.toFixed(1)}%
                        </div>
                        <div className="text-xs text-gray-500">vs período anterior</div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Metas do Período */}
                <div className="border border-gray-200 rounded-lg p-4 shadow-sm">
                  <h3 className="text-lg font-semibold text-brand-purple-dark mb-3 border-l-4 border-brand-purple-300 pl-3">Metas do Período</h3>
                  <div className="space-y-4">
                    {performanceScore.goals.map((goal, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4 bg-white">
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-semibold text-gray-800">{goal.label}</div>
                          <div className="text-xs font-semibold px-3 py-1 rounded-full bg-brand-purple-50 text-brand-purple-dark border border-brand-purple-200">
                            {getGoalDirection(goal.metric) === 'increase' ? '↑ Aumentar' : '↓ Diminuir'}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4 mb-3">
                          <div>
                            <div className="text-xs text-gray-600">Meta</div>
                            <div className="font-bold text-gray-900">
                              {goal.unit === 'currency' ? formatCurrency(goal.target) : formatNumber(goal.target)}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-600">Realizado</div>
                            <div className="font-bold text-brand-purple-dark">
                              {goal.unit === 'currency' ? formatCurrency(goal.actual) : formatNumber(goal.actual)}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-600">Atingido</div>
                            <div className="font-bold text-gray-800">
                              {goal.completionPct.toFixed(1)}%
                            </div>
                          </div>
                        </div>

                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className="h-3 rounded-full bg-gray-300"
                            style={{ width: `${Math.min(goal.completionPct, 100)}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Resultado Final - Economia/Ganho */}
                <div className="border-2 border-gray-300 rounded p-4 bg-gray-50">
                  <h3 className="text-lg font-bold text-gray-800 mb-3">RESULTADO DO PERÍODO</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-lg p-4">
                      <div className="text-sm text-gray-600 mb-2">Economia em Comissões</div>
                      <div className="text-2xl font-bold text-gray-800">
                        {formatCurrency(
                          (performanceScore.goals.find(g => g.label === 'Comissão iFood')?.actual || 0) -
                          (performanceScore.goals.find(g => g.label === 'Comissão iFood')?.target || 0)
                        )}
                      </div>
                      <div className="text-xs text-gray-600 mt-1">Potencial de economia identificado</div>
                    </div>
                    
                    <div className="bg-white rounded-lg p-4">
                      <div className="text-sm text-gray-600 mb-2">Ganho Total Estimado</div>
                      <div className="text-2xl font-bold text-gray-800">
                        {formatCurrency(
                          ((performanceScore.goals.find(g => g.label === 'Vendas')?.target || 0) -
                          (performanceScore.goals.find(g => g.label === 'Vendas')?.actual || 0)) +
                          ((performanceScore.goals.find(g => g.label === 'Comissão iFood')?.actual || 0) -
                          (performanceScore.goals.find(g => g.label === 'Comissão iFood')?.target || 0))
                        )}
                      </div>
                      <div className="text-xs text-gray-600 mt-1">Crescimento + Economia</div>
                    </div>
                  </div>
                </div>

                {/* Rodapé */}
                <div className="text-center text-xs text-gray-500 pt-6 border-t border-gray-200">
                  <p>Powered by Dex+</p>
                </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </BILayout>
  );
};

