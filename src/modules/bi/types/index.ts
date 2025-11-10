// ============================================
// TIPOS DO BI MULTI-MARKETPLACE
// ============================================

export type Marketplace = 'ifood' | '99food' | 'keeta' | 'proprio';
export type MarketplaceFilter = 'all' | Marketplace;

export type CriticalityLevel = 'critical' | 'warning' | 'attention' | 'good' | 'excellent';
export type TrendDirection = 'up' | 'down' | 'stable';

// ============================================
// KPIs CONSOLIDADOS
// ============================================

export type ConsolidatedKPIs = {
  totalSales: number;
  totalOrders: number;
  avgTicket: number;
  netMargin: number;
  totalFees: number;
  
  // Métricas da agência
  activeStores: number;
  totalStores: number;
  roi: number;
  salesGrowth: number;
  ordersGrowth: number;
  
  // Breakdown por marketplace
  marketplaceBreakdown: MarketplaceKPI[];
  
  // Comparação com período anterior
  comparison?: {
    salesChange: number;
    ordersChange: number;
    ticketChange: number;
  };
};

export type MarketplaceKPI = {
  marketplace: Marketplace;
  sales: number;
  orders: number;
  avgTicket: number;
  fees: number;
  net: number;
  contribution: number; // % do total
  trend?: {
    direction: TrendDirection;
    percentChange: number;
  };
};

// ============================================
// PERFORMANCE E CRITICIDADE
// ============================================

export type StoreGoal = {
  metric: 'desconto_ifood' | 'promocoes_loja' | 'anuncios_ifood' | 'frete_gratis' | 'faturamento_total' | 'faturamento_liquido' | 'ticket_medio' | 'numero_pedidos' | 'comissao_ifood' | 'promocoes_ifood';
  label: string;
  target: number;
  actual: number;
  completionPct: number;
  unit: 'percent' | 'currency' | 'number';
  direction: 'increase' | 'decrease'; // Indica se o objetivo é aumentar ou diminuir
};

export type StorePerformanceScore = {
  storeId: string;
  storeName: string;
  groupName: string | null;
  category: string | null;
  
  // Score de criticidade
  overallScore: number; // 0-100
  criticalityLevel: CriticalityLevel;
  
  // Metas
  goals: StoreGoal[];
  
  // Breakdown por marketplace
  marketplaceBreakdown: MarketplaceKPI[];
  
  // Tendência
  trend: {
    direction: TrendDirection;
    percentChange: number;
  };
  
  // Impacto na agência
  agencyImpact: {
    revenueContribution: number; // % do total da agência
    rank: number;
    totalStores: number;
  };
};

// ============================================
// ANÁLISE DETALHADA DE LOJA
// ============================================

export type StoreDetailedAnalysis = {
  store: {
    id: string;
    name: string;
    groupName: string | null;
    category: string | null;
  };
  
  // Conexões de marketplace
  marketplaceConnections: {
    marketplace: Marketplace;
    isConnected: boolean;
    lastSync?: string;
  }[];
  
  // Score e metas
  performanceScore: StorePerformanceScore;
  
  // KPIs consolidados
  kpis: ConsolidatedKPIs;
  
  // Análises específicas
  hourlyPerformance?: HourlyPerformance[];
  promotionAnalysis?: PromotionAnalysis[];
  deliveryAnalysis?: DeliveryAnalysis[];
};

// ============================================
// ANÁLISE POR HORÁRIO
// ============================================

export type HourlyPerformance = {
  hour: number; // 0-23
  
  // Por marketplace
  byMarketplace: {
    marketplace: Marketplace;
    orders: number;
    revenue: number;
    avgTicket: number;
  }[];
  
  // Consolidado
  totalOrders: number;
  totalRevenue: number;
  avgTicket: number;
  cancellationRate: number;
};

// ============================================
// ANÁLISE DE PROMOÇÕES
// ============================================

export type PromotionAnalysis = {
  marketplace: Marketplace;
  
  // Promoções do marketplace
  marketplacePromo: {
    totalDiscount: number;
    ordersImpacted: number;
    avgDiscountPerOrder: number;
    revenueGenerated: number;
    roi: number;
  };
  
  // Promoções da loja
  storePromo: {
    totalDiscount: number;
    ordersImpacted: number;
    avgDiscountPerOrder: number;
    revenueGenerated: number;
    roi: number;
  };
  
  // Totais
  totalPromoImpact: number;
  promoOrdersPct: number;
};

// ============================================
// ANÁLISE DE ENTREGAS
// ============================================

export type DeliveryAnalysis = {
  marketplace: Marketplace;
  
  totalDeliveries: number;
  freeDeliveries: number;
  paidDeliveries: number;
  
  avgDeliveryFee: number;
  totalDeliveryRevenue: number;
  totalDeliveryCost: number;
  
  deliveryMargin: number;
  freeDeliveryImpact: number;
};

// ============================================
// COMPARAÇÃO DE LOJAS
// ============================================

export type StoreComparison = {
  stores: {
    id: string;
    name: string;
    groupName: string | null;
    sales: number;
    orders: number;
    avgTicket: number;
    score: number;
    rank: number;
    trend: TrendDirection;
    trendPct: number;
  }[];
  
  metrics: {
    metric: string;
    label: string;
    unit: 'currency' | 'number' | 'percent';
    values: { storeId: string; value: number }[];
  }[];
};

// ============================================
// FILTROS DO BI
// ============================================

export type BIFilters = {
  searchTerm: string;
  marketplaces: Marketplace[];
  categories: string[];
  performanceLevels: CriticalityLevel[];
  sortBy: 'name' | 'score' | 'sales' | 'orders' | 'ticket';
  sortOrder: 'asc' | 'desc';
  dateRange?: {
    from: Date;
    to: Date;
  };
};
