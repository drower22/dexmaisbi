// ============================================
// SERVIÇO MOCK DO BI
// Dados simulados para visualização do hub multi-marketplace
// ============================================

import type {
  ConsolidatedKPIs,
  StorePerformanceScore,
  StoreDetailedAnalysis,
  HourlyPerformance,
  PromotionAnalysis,
  DeliveryAnalysis,
  StoreComparison,
  BIFilters,
  Marketplace,
  CriticalityLevel,
  TrendDirection,
} from '../types';

// ============================================
// DADOS MOCK
// ============================================

// Gerar 100 lojas com grupos realistas
const GROUPS_CONFIG = [
  { name: 'Sabor da Casa', count: 4, category: 'Restaurante' },
  { name: 'Burger Master', count: 5, category: 'Hamburgueria' },
  { name: 'Pizza Express', count: 3, category: 'Pizzaria' },
  { name: 'Sushi Premium', count: 4, category: 'Japonesa' },
  { name: 'Açaí Point', count: 3, category: 'Sorveteria' },
  { name: 'Churrasco Grill', count: 4, category: 'Churrascaria' },
  { name: 'Doce Sabor', count: 3, category: 'Confeitaria' },
  { name: 'Café & Cia', count: 4, category: 'Cafeteria' },
  { name: 'Marmita Fit', count: 3, category: 'Marmitaria' },
  { name: 'Lanche Rápido', count: 4, category: 'Lanchonete' },
  { name: 'Pasta & Vino', count: 3, category: 'Italiana' },
  { name: 'Taco Loco', count: 3, category: 'Mexicana' },
  { name: 'Frango Assado', count: 4, category: 'Rotisseria' },
  { name: 'Salada Verde', count: 3, category: 'Saudável' },
  { name: 'Hot Dog Mania', count: 3, category: 'Lanchonete' },
  { name: 'Esfiha da Casa', count: 4, category: 'Árabe' },
  { name: 'Poke Bowl', count: 3, category: 'Havaiana' },
  { name: 'Crepe & Waffle', count: 3, category: 'Confeitaria' },
  { name: 'Temaki House', count: 3, category: 'Japonesa' },
  { name: 'Empada Mineira', count: 4, category: 'Salgados' },
  { name: 'Coxinha do Chefe', count: 3, category: 'Salgados' },
  { name: 'Pastel Gourmet', count: 3, category: 'Lanchonete' },
  { name: 'Tapioca Nordestina', count: 3, category: 'Regional' },
  { name: 'Yakisoba Express', count: 3, category: 'Chinesa' },
  { name: 'Wrap & Roll', count: 3, category: 'Saudável' },
];

const LOCATIONS = [
  'Centro', 'Shopping Norte', 'Shopping Sul', 'Bairro Alto', 'Jardins',
  'Vila Nova', 'Praia', 'Aeroporto', 'Universitário', 'Industrial',
  'Zona Leste', 'Zona Oeste', 'Downtown', 'Outlet', 'Park',
];

const MOCK_STORES = GROUPS_CONFIG.flatMap((group, groupIndex) => {
  return Array.from({ length: group.count }, (_, i) => ({
    id: `${groupIndex * 10 + i + 1}`,
    name: `${group.name} ${LOCATIONS[i % LOCATIONS.length]}`,
    groupName: group.name,
    category: group.category,
  }));
});

const MARKETPLACES: Marketplace[] = ['ifood', '99food', 'keeta', 'proprio'];

// ============================================
// HELPERS
// ============================================

function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getCriticalityLevel(score: number): CriticalityLevel {
  if (score >= 90) return 'excellent';
  if (score >= 70) return 'good';
  if (score >= 50) return 'attention';
  if (score >= 30) return 'warning';
  return 'critical';
}

// ============================================
// API MOCK
// ============================================

export async function getAgencyConsolidatedKPIs(): Promise<ConsolidatedKPIs> {
  // Simular delay de API
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const totalSales = 2500000;
  const totalOrders = 50200;
  const totalStoresCount = MOCK_STORES.length;
  const activeStoresCount = Math.floor(totalStoresCount * 0.85); // 85% ativos
  
  return {
    totalSales,
    totalOrders,
    avgTicket: totalSales / totalOrders,
    netMargin: 68,
    totalFees: 125000,
    
    // Métricas da agência
    activeStores: activeStoresCount,
    totalStores: totalStoresCount,
    roi: 19.0,
    salesGrowth: 17.5,
    ordersGrowth: 8.3,
    
    marketplaceBreakdown: [
      {
        marketplace: 'ifood',
        sales: 1500000,
        orders: 30000,
        avgTicket: 50,
        fees: 90000,
        net: 1410000,
        contribution: 60,
        trend: { direction: 'up' as const, percentChange: 8.5 },
      },
      {
        marketplace: '99food',
        sales: 625000,
        orders: 12500,
        avgTicket: 50,
        fees: 25000,
        net: 600000,
        contribution: 25,
        trend: { direction: 'up' as const, percentChange: 15.2 },
      },
      {
        marketplace: 'keeta',
        sales: 250000,
        orders: 5000,
        avgTicket: 50,
        fees: 7500,
        net: 242500,
        contribution: 10,
        trend: { direction: 'down' as const, percentChange: -3.8 },
      },
      {
        marketplace: 'proprio',
        sales: 125000,
        orders: 2700,
        avgTicket: 46.30,
        fees: 2500,
        net: 122500,
        contribution: 5,
        trend: { direction: 'up' as const, percentChange: 22.4 },
      },
    ],
    
    comparison: {
      salesChange: 12.5,
      ordersChange: 8.3,
      ticketChange: 3.8,
    },
  };
}

export async function getStorePerformanceScores(
  filters?: Partial<BIFilters>
): Promise<StorePerformanceScore[]> {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  const scores: StorePerformanceScore[] = MOCK_STORES.map((store, index) => {
    const salesTarget = randomBetween(100000, 200000);
    const salesActual = randomBetween(50000, salesTarget + 20000);
    const salesCompletion = (salesActual / salesTarget) * 100;
    
    const ordersTarget = randomBetween(2000, 4000);
    const ordersActual = randomBetween(1000, ordersTarget + 500);
    const ordersCompletion = (ordersActual / ordersTarget) * 100;
    
    const ticketTarget = 50;
    const ticketActual = salesActual / ordersActual;
    const ticketCompletion = (ticketActual / ticketTarget) * 100;
    
    const overallScore = (salesCompletion + ordersCompletion + ticketCompletion) / 3;
    
    // Distribuição por marketplace
    const ifoodPct = randomBetween(50, 70) / 100;
    const nineNinePct = randomBetween(15, 30) / 100;
    const keetaPct = randomBetween(5, 15) / 100;
    const proprioPct = 1 - ifoodPct - nineNinePct - keetaPct;
    
    return {
      storeId: store.id,
      storeName: store.name,
      groupName: store.groupName,
      category: store.category,
      
      overallScore,
      criticalityLevel: getCriticalityLevel(overallScore),
      
      goals: [
        {
          metric: 'faturamento_total',
          label: 'Vendas',
          target: salesTarget,
          actual: salesActual,
          completionPct: salesCompletion,
          unit: 'currency',
          direction: 'increase' as const,
        },
        {
          metric: 'comissao_ifood',
          label: 'Comissão iFood',
          target: salesActual * ifoodPct * 0.05, // Meta: reduzir para 5%
          actual: salesActual * ifoodPct * 0.06, // Atual: 6%
          completionPct: (salesActual * ifoodPct * 0.05) / (salesActual * ifoodPct * 0.06) * 100, // Quanto menor, melhor
          unit: 'currency',
          direction: 'decrease' as const,
        },
        {
          metric: 'promocoes_ifood',
          label: 'Promoções iFood',
          target: salesActual * ifoodPct * 0.03, // Meta: reduzir para 3%
          actual: salesActual * ifoodPct * 0.045, // Atual: 4.5%
          completionPct: (salesActual * ifoodPct * 0.03) / (salesActual * ifoodPct * 0.045) * 100, // Quanto menor, melhor
          unit: 'currency',
          direction: 'decrease' as const,
        },
      ],
      
      marketplaceBreakdown: [
        {
          marketplace: 'ifood',
          sales: salesActual * ifoodPct,
          orders: Math.floor(ordersActual * ifoodPct),
          avgTicket: ticketActual,
          fees: salesActual * ifoodPct * 0.06,
          net: salesActual * ifoodPct * 0.94,
          contribution: ifoodPct * 100,
        },
        {
          marketplace: '99food',
          sales: salesActual * nineNinePct,
          orders: Math.floor(ordersActual * nineNinePct),
          avgTicket: ticketActual,
          fees: salesActual * nineNinePct * 0.04,
          net: salesActual * nineNinePct * 0.96,
          contribution: nineNinePct * 100,
        },
        {
          marketplace: 'keeta',
          sales: salesActual * keetaPct,
          orders: Math.floor(ordersActual * keetaPct),
          avgTicket: ticketActual,
          fees: salesActual * keetaPct * 0.03,
          net: salesActual * keetaPct * 0.97,
          contribution: keetaPct * 100,
        },
        {
          marketplace: 'proprio',
          sales: salesActual * proprioPct,
          orders: Math.floor(ordersActual * proprioPct),
          avgTicket: ticketActual,
          fees: salesActual * proprioPct * 0.02,
          net: salesActual * proprioPct * 0.98,
          contribution: proprioPct * 100,
        },
      ],
      
      trend: {
        direction: overallScore > 70 ? 'up' : overallScore > 50 ? 'stable' : 'down',
        percentChange: randomBetween(-15, 20),
      },
      
      agencyImpact: {
        revenueContribution: randomBetween(5, 20),
        rank: index + 1,
        totalStores: MOCK_STORES.length,
      },
    };
  });
  
  // Aplicar filtros
  let filtered = scores;
  
  if (filters?.performanceLevels && filters.performanceLevels.length > 0) {
    filtered = filtered.filter(s => filters.performanceLevels!.includes(s.criticalityLevel));
  }
  
  if (filters?.categories && filters.categories.length > 0) {
    filtered = filtered.filter(s => s.category && filters.categories!.includes(s.category));
  }
  
  if (filters?.searchTerm) {
    const term = filters.searchTerm.toLowerCase();
    filtered = filtered.filter(s => s.storeName.toLowerCase().includes(term));
  }
  
  // Ordenar
  if (filters?.sortBy) {
    filtered.sort((a, b) => {
      let aVal: any, bVal: any;
      
      switch (filters.sortBy) {
        case 'name':
          aVal = a.storeName;
          bVal = b.storeName;
          break;
        case 'score':
          aVal = a.overallScore;
          bVal = b.overallScore;
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
        default:
          aVal = a.overallScore;
          bVal = b.overallScore;
      }
      
      const order = filters.sortOrder === 'asc' ? 1 : -1;
      return aVal > bVal ? order : -order;
    });
  }
  
  return filtered;
}

export async function getStoreDetailedAnalysis(storeId: string): Promise<StoreDetailedAnalysis> {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const scores = await getStorePerformanceScores();
  const score = scores.find(s => s.storeId === storeId) || scores[0];
  
  // Gerar KPIs específicos da loja (não da agência)
  // Calcular totais a partir do breakdown de marketplaces
  const storeTotalSales = score.marketplaceBreakdown.reduce((sum, mp) => sum + mp.sales, 0);
  const storeTotalOrders = score.marketplaceBreakdown.reduce((sum, mp) => sum + mp.orders, 0);
  const storeAvgTicket = storeTotalOrders > 0 ? storeTotalSales / storeTotalOrders : 0;
  
  const kpis: ConsolidatedKPIs = {
    totalSales: storeTotalSales,
    totalOrders: storeTotalOrders,
    avgTicket: storeAvgTicket,
    netMargin: randomBetween(60, 75),
    totalFees: storeTotalSales * 0.06, // 6% de taxas
    
    // Métricas da agência (não aplicáveis para loja individual)
    activeStores: 1,
    totalStores: 1,
    roi: 0,
    salesGrowth: randomBetween(-10, 25),
    ordersGrowth: randomBetween(-5, 20),
    
    marketplaceBreakdown: score.marketplaceBreakdown,
    comparison: {
      salesChange: randomBetween(-10, 25),
      ordersChange: randomBetween(-5, 20),
      ticketChange: randomBetween(-8, 15),
    },
  };
  
  return {
    store: {
      id: score.storeId,
      name: score.storeName,
      groupName: score.groupName,
      category: score.category,
    },
    
    marketplaceConnections: [
      { marketplace: 'ifood', isConnected: true, lastSync: new Date().toISOString() },
      { marketplace: '99food', isConnected: true, lastSync: new Date().toISOString() },
      { marketplace: 'keeta', isConnected: false },
      { marketplace: 'proprio', isConnected: true, lastSync: new Date().toISOString() },
    ],
    
    performanceScore: score,
    kpis,
    
    hourlyPerformance: generateHourlyPerformance(),
    promotionAnalysis: generatePromotionAnalysis(),
    deliveryAnalysis: generateDeliveryAnalysis(),
  };
}

function generateHourlyPerformance(): HourlyPerformance[] {
  return Array.from({ length: 24 }, (_, hour) => {
    const isPeakHour = hour >= 11 && hour <= 14 || hour >= 18 && hour <= 21;
    const baseOrders = isPeakHour ? randomBetween(80, 150) : randomBetween(10, 50);
    
    return {
      hour,
      byMarketplace: MARKETPLACES.map(mp => ({
        marketplace: mp,
        orders: Math.floor(baseOrders * (mp === 'ifood' ? 0.6 : mp === '99food' ? 0.25 : mp === 'keeta' ? 0.1 : 0.05)),
        revenue: baseOrders * 50 * (mp === 'ifood' ? 0.6 : mp === '99food' ? 0.25 : mp === 'keeta' ? 0.1 : 0.05),
        avgTicket: 50,
      })),
      totalOrders: baseOrders,
      totalRevenue: baseOrders * 50,
      avgTicket: 50,
      cancellationRate: randomBetween(2, 8),
    };
  });
}

function generatePromotionAnalysis(): PromotionAnalysis[] {
  return MARKETPLACES.map(mp => ({
    marketplace: mp,
    marketplacePromo: {
      totalDiscount: randomBetween(5000, 15000),
      ordersImpacted: randomBetween(200, 500),
      avgDiscountPerOrder: randomBetween(10, 30),
      revenueGenerated: randomBetween(30000, 80000),
      roi: randomBetween(3, 8),
    },
    storePromo: {
      totalDiscount: randomBetween(2000, 8000),
      ordersImpacted: randomBetween(100, 300),
      avgDiscountPerOrder: randomBetween(15, 35),
      revenueGenerated: randomBetween(15000, 40000),
      roi: randomBetween(2, 6),
    },
    totalPromoImpact: randomBetween(7000, 23000),
    promoOrdersPct: randomBetween(25, 45),
  }));
}

function generateDeliveryAnalysis(): DeliveryAnalysis[] {
  return MARKETPLACES.map(mp => {
    const totalDeliveries = randomBetween(1000, 3000);
    const freeDeliveries = Math.floor(totalDeliveries * randomBetween(20, 40) / 100);
    
    return {
      marketplace: mp,
      totalDeliveries,
      freeDeliveries,
      paidDeliveries: totalDeliveries - freeDeliveries,
      avgDeliveryFee: randomBetween(5, 12),
      totalDeliveryRevenue: randomBetween(15000, 35000),
      totalDeliveryCost: randomBetween(10000, 25000),
      deliveryMargin: randomBetween(20, 45),
      freeDeliveryImpact: freeDeliveries * randomBetween(8, 12),
    };
  });
}

export type GroupPerformance = {
  groupId: string;
  groupName: string;
  storesCount: number;
  totalSales: number;
  totalOrders: number;
  avgTicket: number;
  overallScore: number;
  criticalityLevel: CriticalityLevel;
  stores: StorePerformanceScore[];
  trend: {
    direction: TrendDirection;
    percentChange: number;
  };
};

export async function getGroupsPerformance(): Promise<GroupPerformance[]> {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  const allStores = await getStorePerformanceScores();
  
  // Agrupar lojas por grupo
  const groupsMap = new Map<string, StorePerformanceScore[]>();
  
  allStores.forEach(store => {
    const groupName = store.groupName || 'Sem Grupo';
    if (!groupsMap.has(groupName)) {
      groupsMap.set(groupName, []);
    }
    groupsMap.get(groupName)!.push(store);
  });
  
  // Calcular performance de cada grupo
  const groups: GroupPerformance[] = [];
  let groupIndex = 0;
  
  groupsMap.forEach((stores, groupName) => {
    const totalSales = stores.reduce((sum, s) => sum + (s.goals.find(g => g.metric === 'faturamento_total')?.actual || 0), 0);
    const totalOrders = stores.reduce((sum, s) => sum + (s.goals.find(g => g.metric === 'numero_pedidos')?.actual || 0), 0);
    const avgScore = stores.reduce((sum, s) => sum + s.overallScore, 0) / stores.length;
    const avgTrend = stores.reduce((sum, s) => sum + s.trend.percentChange, 0) / stores.length;
    
    groups.push({
      groupId: `group-${groupIndex++}`,
      groupName,
      storesCount: stores.length,
      totalSales,
      totalOrders,
      avgTicket: totalOrders > 0 ? totalSales / totalOrders : 0,
      overallScore: avgScore,
      criticalityLevel: getCriticalityLevel(avgScore),
      stores: stores.sort((a, b) => b.overallScore - a.overallScore),
      trend: {
        direction: avgTrend > 5 ? 'up' : avgTrend < -5 ? 'down' : 'stable',
        percentChange: avgTrend,
      },
    });
  });
  
  // Ordenar grupos por score
  return groups.sort((a, b) => b.overallScore - a.overallScore);
}

export async function compareStores(storeIds: string[]): Promise<StoreComparison> {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  const allScores = await getStorePerformanceScores();
  const selectedScores = allScores.filter(s => storeIds.includes(s.storeId));
  
  return {
    stores: selectedScores.map((s, index) => ({
      id: s.storeId,
      name: s.storeName,
      groupName: s.groupName,
      sales: s.goals.find(g => g.metric === 'faturamento_total')?.actual || 0,
      orders: s.goals.find(g => g.metric === 'numero_pedidos')?.actual || 0,
      avgTicket: s.goals.find(g => g.metric === 'ticket_medio')?.actual || 0,
      score: s.overallScore,
      rank: index + 1,
      trend: s.trend.direction,
      trendPct: s.trend.percentChange,
    })),
    
    metrics: [
      {
        metric: 'sales',
        label: 'Vendas',
        unit: 'currency',
        values: selectedScores.map(s => ({
          storeId: s.storeId,
          value: s.goals.find(g => g.metric === 'faturamento_total')?.actual || 0,
        })),
      },
      {
        metric: 'orders',
        label: 'Pedidos',
        unit: 'number',
        values: selectedScores.map(s => ({
          storeId: s.storeId,
          value: s.goals.find(g => g.metric === 'numero_pedidos')?.actual || 0,
        })),
      },
      {
        metric: 'avgTicket',
        label: 'Ticket Médio',
        unit: 'currency',
        values: selectedScores.map(s => ({
          storeId: s.storeId,
          value: s.goals.find(g => g.metric === 'ticket_medio')?.actual || 0,
        })),
      },
    ],
  };
}
