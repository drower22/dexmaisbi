import type { BIFilters, ConsolidatedKPIs, StorePerformanceScore } from '../types';
import * as Mock from './mock.service';

export interface BIDataSource {
  getAgencyConsolidatedKPIs(): Promise<ConsolidatedKPIs>;
  getStorePerformanceScores(filters: BIFilters): Promise<StorePerformanceScore[]>;
}

export function isDemoEnv(): boolean {
  try {
    // Prioridade: env var explícita
    const byEnv = (import.meta as any)?.env?.VITE_BI_DEMO;
    if (typeof byEnv !== 'undefined') return String(byEnv) === '1' || String(byEnv).toLowerCase() === 'true';
  } catch {}
  // Fallback por hostname (subdomínio demo)
  if (typeof window !== 'undefined' && window.location && window.location.hostname) {
    const host = window.location.hostname.toLowerCase();
    return host.startsWith('demo.') || host === 'demo.usa-dex.com.br';
  }
  return false;
}

export function createBIDataSource(): BIDataSource {
  // Por enquanto, apenas mock em modo demo. Em produção, trocaremos por serviço real.
  if (isDemoEnv()) {
    return {
      getAgencyConsolidatedKPIs: () => Mock.getAgencyConsolidatedKPIs(),
      getStorePerformanceScores: (filters: BIFilters) => Mock.getStorePerformanceScores(filters),
    } satisfies BIDataSource;
  }
  // Em produção (não-demo) ainda usamos os mocks, mas centralizado aqui para facilitar switch futuro
  return {
    getAgencyConsolidatedKPIs: () => Mock.getAgencyConsolidatedKPIs(),
    getStorePerformanceScores: (filters: BIFilters) => Mock.getStorePerformanceScores(filters),
  } satisfies BIDataSource;
}
