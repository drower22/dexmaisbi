import React, { type ReactNode } from 'react';
import { MonitorSmartphone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import dexLogo from '../../../assets/dex-logo.png';

type BILayoutProps = {
  children: ReactNode;
  title: string;
  subtitle?: string;
};

export const BILayout: React.FC<BILayoutProps> = ({ children, title, subtitle }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-brand-gray-lilac">
      {/* Bloco para mobile */}
      <div className="md:hidden min-h-screen flex flex-col items-center justify-center px-6 text-center bg-brand-gray-lilac">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-lg px-6 py-10 max-w-sm">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 rounded-full bg-brand-purple-light text-brand-purple-dark">
            <MonitorSmartphone size={32} />
          </div>
          <h2 className="text-xl font-semibold text-brand-purple-dark mb-3">Experiência otimizada</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            O módulo BI foi pensado para telas maiores. Para uma navegação mais confortável e completa, acesse este conteúdo em um computador.
          </p>
        </div>
      </div>

      {/* Conteúdo desktop */}
      <div className="hidden md:block">
        {/* Topbar roxa (fixa no topo) */}
        <header className="bg-brand-purple-dark sticky top-0 z-30 shadow-sm">
          <div className="flex items-center justify-between h-20 px-6">
            <img src={dexLogo} alt="Dex Parceiros" className="h-12 md:h-14 w-auto cursor-pointer" onClick={() => navigate('/bi')} />
            <button
              type="button"
              className="px-3 py-2 text-sm rounded-md bg-brand-purple-light text-brand-purple-dark hover:bg-brand-purple-light/90"
              onClick={() => navigate('/bi')}
            >
              Dashboard
            </button>
          </div>
        </header>

        {/* Título */}
        <div className="mx-auto max-w-7xl px-6 py-6">
          <h1 className="text-3xl font-bold font-sora text-foreground">{title}</h1>
          {subtitle && <p className="text-muted-foreground mt-1">{subtitle}</p>}
        </div>

        {/* Conteúdo */}
        <main className="px-6 pb-6">
          {children}
        </main>
      </div>
    </div>
  );
};
