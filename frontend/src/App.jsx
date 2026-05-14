import { useState } from 'react';
import Insumos from './pages/Insumos';
import Pratos from './pages/Pratos';
import Vendas from './pages/Vendas';

const abas = [
  { id: 'vendas', label: 'Vendas', icon: '📋' },
  { id: 'pratos', label: 'Pratos', icon: '🍽️' },
  { id: 'insumos', label: 'Insumos', icon: '📦' },
];

export default function App() {
  const [aba, setAba] = useState('vendas');

  return (
    <div className="min-h-screen font-sans flex">
      {/* Sidebar */}
      <aside className="w-64 bg-surface-900 border-r border-surface-750 flex flex-col flex-shrink-0">
        {/* Brand */}
        <div className="px-6 py-8 border-b border-surface-750">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🍳</span>
            <h1 className="text-2xl font-heading font-bold text-amber-accent tracking-tight">
              Delivery
            </h1>
          </div>
          <p className="text-xs text-surface-400 uppercase tracking-widest mt-1.5 ml-1 font-medium">
            Gestão de Cozinha
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-5 space-y-1">
          {abas.map((item) => {
            const isActive = aba === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setAba(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-amber-accent-subtle text-amber-accent shadow-sm border border-amber-accent/20'
                    : 'text-surface-400 hover:text-surface-200 hover:bg-surface-750/50 border border-transparent'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-amber-accent" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-6 py-5 border-t border-surface-750">
          <p className="text-xs text-surface-500">
            v1.0 — Sistema de Delivery
          </p>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto h-screen">
        <div className="max-w-6xl mx-auto px-8 py-8">
          <div className="mb-8">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{abas.find((a) => a.id === aba)?.icon}</span>
              <div>
                <h2 className="text-2xl font-heading font-bold text-surface-100">
                  {abas.find((a) => a.id === aba)?.label}
                </h2>
                <p className="text-surface-400 text-sm mt-0.5">
                  {aba === 'vendas' && 'Registre e acompanhe as vendas do dia'}
                  {aba === 'pratos' && 'Cadastre e gerencie os pratos do cardápio'}
                  {aba === 'insumos' && 'Controle o estoque de ingredientes e insumos'}
                </p>
              </div>
            </div>
          </div>

          {aba === 'insumos' && <Insumos />}
          {aba === 'pratos' && <Pratos />}
          {aba === 'vendas' && <Vendas />}
        </div>
      </main>
    </div>
  );
}