# 📊 Módulo BI Multi-Marketplace

Business Intelligence para agências com múltiplos clientes e marketplaces.

## 🎯 Visão Geral

Este módulo fornece uma visão consolidada de todas as lojas da agência, permitindo:
- Análise de performance por loja
- Comparação entre marketplaces (iFood, 99Food, Keeta, Cardápio Próprio)
- Score de criticidade baseado em metas
- Drill-down detalhado por loja
- Análises por horário, promoções e entregas

## 🏗️ Estrutura

```
src/modules/bi/
├── components/
│   ├── MarketplaceSelector.tsx      # Seletor de marketplace
│   └── CriticalityBadge.tsx         # Badge de criticidade
├── pages/
│   ├── BIDashboardPage.tsx          # Dashboard principal
│   └── StoreDetailPage.tsx          # Drill-down de loja
├── services/
│   └── mock.service.ts              # Serviço com dados mock
├── types/
│   └── index.ts                     # Tipos TypeScript
├── index.ts                         # Exportações
└── README.md                        # Esta documentação
```

## 🚀 Como Usar

### Acessar o BI

Navegue para `/bi` ou clique em "BI Multi-Marketplace" no menu lateral.

### Dashboard Principal

O dashboard mostra:
- **KPIs Consolidados**: Vendas, pedidos, ticket médio, margem, taxas
- **Breakdown por Marketplace**: Distribuição percentual de cada canal
- **Mapa de Performance**: Grid visual com todas as lojas e seus scores
- **Filtros**: Busca por nome, ordenação por diferentes métricas

### Drill-Down de Loja

Clique em qualquer loja para ver análise detalhada:
- **Overview**: KPIs consolidados
- **Marketplace**: Comparação entre canais
- **Por Horário**: Heatmap de performance por hora
- **Promoções**: Análise de ROI de promoções
- **Entregas**: Análise de entregas e custos

## 📊 Score de Criticidade

O score é calculado com base em 3 metas:
1. **Vendas**: Meta de faturamento
2. **Pedidos**: Meta de volume
3. **Ticket Médio**: Meta de valor médio

### Níveis de Criticidade

- 🟢 **Excelente** (90-100%): Loja superando metas
- 🔵 **Bom** (70-89%): Loja no caminho certo
- 🟡 **Atenção** (50-69%): Precisa de atenção
- 🟠 **Alerta** (30-49%): Situação preocupante
- 🔴 **Crítico** (0-29%): Requer ação imediata

## 🔄 Dados Mock

Atualmente o módulo usa dados 100% simulados via `mock.service.ts`.

### Lojas Mock

- 8 lojas com diferentes perfis
- 3 grupos (Premium, Standard, Budget)
- 4 categorias (Restaurante, Lanchonete, Pizzaria, etc)

### Marketplaces Mock

- **iFood**: 60% das vendas
- **99Food**: 25% das vendas
- **Keeta**: 10% das vendas
- **Cardápio Próprio**: 5% das vendas

## 🔌 Integração Futura

Para conectar dados reais, substitua as chamadas em `mock.service.ts` por:

```typescript
// Exemplo: getAgencyConsolidatedKPIs
export async function getAgencyConsolidatedKPIs(): Promise<ConsolidatedKPIs> {
  const { data, error } = await supabase
    .from('v_consolidated_kpis')
    .select('*')
    .eq('agency_id', agencyId)
    .gte('kpi_date', from)
    .lte('kpi_date', to);
  
  // Processar e retornar dados
}
```

## 📝 Tipos Principais

### `ConsolidatedKPIs`
KPIs consolidados da agência com breakdown por marketplace.

### `StorePerformanceScore`
Score de performance de uma loja com metas, tendência e impacto.

### `StoreDetailedAnalysis`
Análise completa de uma loja incluindo todas as tabs.

### `MarketplaceFilter`
Filtro de marketplace: `'all' | 'ifood' | '99food' | 'keeta' | 'proprio'`

## 🎨 Componentes Reutilizáveis

### `<MarketplaceSelector />`
```tsx
<MarketplaceSelector 
  selected={marketplace}
  onChange={setMarketplace}
  showCombined={true}
/>
```

### `<CriticalityBadge />`
```tsx
<CriticalityBadge 
  level="attention"
  score={75}
  size="md"
  showLabel={true}
/>
```

## 🚧 Próximos Passos

1. ✅ Estrutura completa do frontend
2. ⏳ Criar tabela `unified_transactions`
3. ⏳ Criar views materializadas
4. ⏳ Conectar dados reais do iFood
5. ⏳ Integrar 99Food
6. ⏳ Integrar Keeta
7. ⏳ Integrar Cardápio Próprio
8. ⏳ Página de comparação multi-lojas
9. ⏳ Exportação PDF
10. ⏳ Sistema de alertas

## 📚 Referências

- [Plano Completo do BI](../../docs/bi-plan.md) _(criar este arquivo)_
- [Tipos TypeScript](./types/index.ts)
- [Serviço Mock](./services/mock.service.ts)
