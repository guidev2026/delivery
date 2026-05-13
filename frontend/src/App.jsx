import { useState } from 'react';
import Insumos from './pages/Insumos';
import Pratos from './pages/Pratos';
import Vendas from './pages/Vendas';

export default function App() {
  const [aba, setAba] = useState('vendas');

  const abas = [
    { id: 'insumos', label: 'Insumos' },
    { id: 'pratos', label: 'Pratos' },
    { id: 'vendas', label: 'Vendas' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-800">Delivery</h1>
          <nav className="flex gap-2">
            {abas.map((item) => (
              <button
                key={item.id}
                onClick={() => setAba(item.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  aba === item.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6">
        {aba === 'insumos' && <Insumos />}
        {aba === 'pratos' && <Pratos />}
        {aba === 'vendas' && <Vendas />}
      </main>
    </div>
  );
}