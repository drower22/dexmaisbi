import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { StoreDetailedAnalysis } from '../types';
import { CriticalityBadge } from '../components/CriticalityBadge';
import { getStoreDetailedAnalysis } from '../services/mock.service';

type TabType = 'overview' | 'marketplace' | 'hourly' | 'promotions' | 'delivery';

export const StoreDetailPage: React.FC = () => {
  const { storeId } = useParams<{ storeId: string }>();
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState<StoreDetailedAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('overview');

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

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('pt-BR').format(value);
  };

  if (loading || !analysis) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando análise...</p>
        </div>
      </div>
    );
  }

  const { store, performanceScore, marketplaceConnections, kpis, hourlyPerformance, promotionAnalysis, deliveryAnalysis } = analysis;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Botão Voltar */}
      <button
        onClick={() => navigate('/bi')}
        className="mb-4 px-4 py-2 bg-white border-2 border-gray-300 rounded-lg hover:border-brand-purple-600 transition-colors"
      >
        ← Voltar ao Dashboard
      </button>

      {/* Cabeçalho da Loja */}
      <div className="bg-gradient-to-r from-brand-purple-600 to-brand-purple-800 rounded-xl shadow-lg p-8 mb-6 text-white">
        <h1 className="text-3xl font-bold mb-2">🏪 {store.name}</h1>
        <div className="flex flex-wrap gap-4 items-center mb-4">
          {store.groupName && <span className="px-3 py-1 bg-white/20 rounded-lg text-sm">📁 {store.groupName}</span>}
          {store.category && <span className="px-3 py-1 bg-white/20 rounded-lg text-sm">🏷️ {store.category}</span>}
        </div>
        
        <div className="mb-4">
          <CriticalityBadge level={performanceScore.criticalityLevel} score={performanceScore.overallScore} size="lg" />
        </div>

        {/* Marketplaces Ativos */}
        <div className="mt-4">
          <div className="text-sm mb-2 opacity-90">📊 Marketplaces:</div>
          <div className="flex flex-wrap gap-2">
            {marketplaceConnections.map((conn) => (
              <span
                key={conn.marketplace}
                className={`px-3 py-1 rounded-lg text-sm font-medium ${
                  conn.isConnected ? 'bg-green-500/30 border-2 border-green-300' : 'bg-gray-500/30 border-2 border-gray-400'
                }`}
              >
                {conn.marketplace} {conn.isConnected ? '✓' : '✗'}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Metas do Período */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">🎯 Metas do Período</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {performanceScore.goals.map((goal) => (
            <div key={goal.metric} className="border-2 border-gray-200 rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-2">{goal.label}</div>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-2xl font-bold text-brand-purple-800">
                  {goal.unit === 'currency' ? formatCurrency(goal.actual) : formatNumber(goal.actual)}
                </span>
                <span className="text-sm text-gray-500">
                  / {goal.unit === 'currency' ? formatCurrency(goal.target) : formatNumber(goal.target)}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                <div
                  className={`h-3 rounded-full ${
                    goal.completionPct >= 90 ? 'bg-green-500' :
                    goal.completionPct >= 70 ? 'bg-blue-500' :
                    goal.completionPct >= 50 ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`}
                  style={{ width: `${Math.min(goal.completionPct, 100)}%` }}
                />
              </div>
              <div className="text-sm font-semibold text-gray-700">{goal.completionPct.toFixed(1)}% atingido</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs de Análise */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
        <div className="border-b border-gray-200">
          <div className="flex flex-wrap">
            {[
              { id: 'overview', label: '📊 Visão Geral' },
              { id: 'marketplace', label: '🏪 Marketplaces' },
              { id: 'hourly', label: '⏰ Por Horário' },
              { id: 'promotions', label: '🎁 Promoções' },
              { id: 'delivery', label: '🚚 Entregas' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`px-6 py-4 font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'border-b-4 border-brand-purple-600 text-brand-purple-600'
                    : 'text-gray-600 hover:text-brand-purple-600'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {/* Tab: Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-gray-800">KPIs Consolidados</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="border-2 border-gray-200 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-1">Vendas Totais</div>
                  <div className="text-2xl font-bold text-brand-purple-800">{formatCurrency(kpis.totalSales)}</div>
                </div>
                <div className="border-2 border-gray-200 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-1">Total de Pedidos</div>
                  <div className="text-2xl font-bold text-blue-800">{formatNumber(kpis.totalOrders)}</div>
                </div>
                <div className="border-2 border-gray-200 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-1">Ticket Médio</div>
                  <div className="text-2xl font-bold text-green-800">{formatCurrency(kpis.avgTicket)}</div>
                </div>
                <div className="border-2 border-gray-200 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-1">Margem Líquida</div>
                  <div className="text-2xl font-bold text-orange-800">{kpis.netMargin.toFixed(1)}%</div>
                </div>
              </div>
            </div>
          )}

          {/* Tab: Marketplace */}
          {activeTab === 'marketplace' && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-gray-800">Comparação entre Marketplaces</h3>
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
                        <td className="px-4 py-3 text-right text-green-600 font-semibold">{formatCurrency(mp.net)}</td>
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
              <h3 className="text-lg font-bold text-gray-800">Performance por Horário</h3>
              <div className="grid grid-cols-12 gap-2">
                {hourlyPerformance.map((hour) => {
                  const intensity = hour.totalOrders > 100 ? 'bg-green-600' :
                                   hour.totalOrders > 50 ? 'bg-yellow-500' :
                                   hour.totalOrders > 20 ? 'bg-orange-400' : 'bg-gray-300';
                  
                  return (
                    <div key={hour.hour} className="text-center">
                      <div className={`${intensity} rounded-lg p-3 text-white font-bold mb-1`}>
                        {hour.totalOrders}
                      </div>
                      <div className="text-xs text-gray-600">{hour.hour}h</div>
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-600 rounded"></div>
                  Pico (&gt;100)
                </span>
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                  Alto (50-100)
                </span>
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-orange-400 rounded"></div>
                  Médio (20-50)
                </span>
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-300 rounded"></div>
                  Baixo (&lt;20)
                </span>
              </div>
            </div>
          )}

          {/* Tab: Promotions */}
          {activeTab === 'promotions' && promotionAnalysis && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-gray-800">Análise de Promoções</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {promotionAnalysis.map((promo) => (
                  <div key={promo.marketplace} className="border-2 border-gray-200 rounded-lg p-4">
                    <h4 className="font-bold text-gray-800 mb-3 capitalize">{promo.marketplace}</h4>
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
                        <span className="font-semibold text-green-600">{((promo.marketplacePromo.roi + promo.storePromo.roi) / 2).toFixed(1)}x</span>
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
              <h3 className="text-lg font-bold text-gray-800">Análise de Entregas</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {deliveryAnalysis.map((delivery) => (
                  <div key={delivery.marketplace} className="border-2 border-gray-200 rounded-lg p-4">
                    <h4 className="font-bold text-gray-800 mb-3 capitalize">{delivery.marketplace}</h4>
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
                        <span className="font-semibold text-green-600">{delivery.deliveryMargin.toFixed(1)}%</span>
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
  );
};
