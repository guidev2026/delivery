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
    <div className="min-h-screen bg-surface-900 font-sans flex">
      {/* Sidebar */}
      <aside className="w-64 bg-surface-800 border-r border-surface-700 flex flex-col flex-shrink-0">
        {/* Brand */}
        <div className="px-6 py-8 border-b border-surface-700">
          <h1 className="text-2xl font-heading font-bold text-amber-accent tracking-tight">
            🍳 Delivery
          </h1>
          <p className="text-xs text-surface-500 uppercase tracking-widest mt-1 font-medium">
            Gestão de Cozinha
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {abas.map((item) => {
            const isActive = aba === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setAba(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-amber-accent/15 text-amber-accent shadow-sm'
                    : 'text-surface-500 hover:text-surface-200 hover:bg-surface-700/50'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-surface-700">
          <p className="text-xs text-surface-600">
            v1.0 — Sistema de Delivery
          </p>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto h-screen">
        <div className="max-w-6xl mx-auto px-8 py-8">
          <div className="mb-8">
            <h2 className="text-3xl font-heading font-bold text-surface-200">
              {abas.find((a) => a.id === aba)?.label}
            </h2>
            <p className="text-surface-500 text-sm mt-1">
              {aba === 'vendas' && 'Registre e acompanhe as vendas do dia'}
              {aba === 'pratos' && 'Cadastre e gerencie os pratos do cardápio'}
              {aba === 'insumos' && 'Controle o estoque de ingredientes e insumos'}
            </p>
          </div>

          {aba === 'insumos' && <Insumos />}
          {aba === 'pratos' && <Pratos />}
          {aba === 'vendas' && <Vendas />}
        </div>
      </main>
    </div>
  );
}