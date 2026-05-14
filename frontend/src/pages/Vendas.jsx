import { useState, useEffect } from 'react';
import ToastMessage from '../components/ToastMessage';

// Pega a URL da Vercel ou usa o localhost se estiver rodando no seu PC
//const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';

//const API_PRATOS = `${API_BASE}/pratos`;
//const API_VENDAS = `${API_BASE}/vendas`;
const API_BASE = 'https://delivery-09hd.onrender.com/pratos';
const API_BASE = 'https://delivery-09hd.onrender.com/vendas';

export default function Vendas() {
  const [pratos, setPratos] = useState([]);
  const [vendas, setVendas] = useState([]);
  const [pratoId, setPratoId] = useState('');
  const [quantidade, setQuantidade] = useState(1);
  const [filtroData, setFiltroData] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => { listarPratos(); listarVendas(); }, []);

  function showToast(message, type = 'success') {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }

  async function listarPratos() {
    const res = await fetch(API_PRATOS);
    setPratos(await res.json());
  }

  async function listarVendas() {
    const url = filtroData ? `${API_VENDAS}?data=${filtroData}` : API_VENDAS;
    const res = await fetch(url);
    setVendas(await res.json());
  }

  useEffect(() => { listarVendas(); }, [filtroData]);

  async function registrar(e) {
    e.preventDefault();
    setToast(null);
    setLoading(true);
    try {
      const res = await fetch(API_VENDAS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prato_id: Number(pratoId), quantidade: Number(quantidade) }),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error, 'error');
        return;
      }
      setPratoId('');
      setQuantidade(1);
      showToast('Venda registrada!');
      listarVendas();
    } catch {
      showToast('Erro ao registrar venda', 'error');
    } finally {
      setLoading(false);
    }
  }

  const totalDia = vendas.reduce((acc, v) => acc + v.total, 0);

  return (
    <>
      {/* Total do dia card - Destaque visual */}
      <div className="relative bg-gradient-to-br from-surface-800 to-surface-750 border border-surface-700 rounded-xl p-6 mb-6 overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-accent/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-amber-accent text-lg">💰</span>
            <p className="text-xs uppercase tracking-widest text-surface-400 font-semibold">Total do Dia</p>
          </div>
          <p className="text-4xl font-heading font-bold text-amber-accent mt-1">
            R$ {totalDia.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Formulário - Registrar Venda */}
      <form onSubmit={registrar} className="bg-surface-800 border border-surface-700 rounded-xl p-6 mb-6">
        <h3 className="text-sm font-heading font-semibold text-surface-200 mb-4 flex items-center gap-2">
          <span className="w-1 h-4 bg-amber-accent rounded-full" />
          Registrar Nova Venda
        </h3>
        <div className="flex gap-4 flex-wrap items-end">
          <div className="flex-1 min-w-[220px]">
            <label className="text-xs uppercase tracking-widest text-surface-400 font-semibold block mb-1.5">Prato</label>
            <select
              className="w-full bg-surface-900 border border-surface-600 rounded-lg px-3 py-2.5 text-surface-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-accent/40 focus:border-amber-accent transition-all duration-200"
              value={pratoId}
              onChange={(e) => setPratoId(e.target.value)}
              required
            >
              <option value="" className="bg-surface-900">Selecione um prato...</option>
              {pratos.map((p) => (
                <option key={p.id} value={p.id} className="bg-surface-900">🍽️ {p.nome} — R$ {p.preco.toFixed(2)}</option>
              ))}
            </select>
          </div>
          <div className="w-24">
            <label className="text-xs uppercase tracking-widest text-surface-400 font-semibold block mb-1.5">Quantidade</label>
            <input
              className="w-full bg-surface-900 border border-surface-600 rounded-lg px-3 py-2.5 text-surface-200 text-sm placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-amber-accent/40 focus:border-amber-accent transition-all duration-200"
              type="number"
              min="1"
              value={quantidade}
              onChange={(e) => setQuantidade(e.target.value)}
              required
            />
          </div>
          <div className="pb-0.5">
            <button
              className="bg-amber-accent hover:bg-amber-accent-hover text-surface-900 font-semibold px-6 py-2.5 rounded-lg text-sm transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-amber-accent/20"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Vendendo...
                </span>
              ) : 'Vender'}
            </button>
          </div>
        </div>
      </form>

      {/* Filtro e Histórico */}
      <div className="bg-surface-800 border border-surface-700 rounded-xl p-5 mb-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h3 className="text-sm font-heading font-semibold text-surface-200 flex items-center gap-2">
            <span className="w-1 h-4 bg-amber-accent rounded-full" />
            Histórico de Vendas
          </h3>
          <div className="flex items-center gap-2 flex-wrap">
            <label className="text-xs uppercase tracking-widest text-surface-400 font-semibold">Filtrar:</label>
            <input
              className="bg-surface-900 border border-surface-600 rounded-lg px-3 py-1.5 text-surface-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-accent/40 focus:border-amber-accent transition-all duration-200"
              type="date"
              value={filtroData}
              onChange={(e) => setFiltroData(e.target.value)}
            />
            {filtroData && (
              <button
                className="text-xs text-surface-400 hover:text-surface-200 font-medium transition-colors duration-200 bg-surface-750 hover:bg-surface-700 px-2.5 py-1.5 rounded-lg border border-surface-600"
                onClick={() => setFiltroData('')}
              >
                Limpar
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tabela de Vendas */}
      <div className="bg-surface-800 border border-surface-700 rounded-xl overflow-hidden">
        {vendas.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-5">
            <span className="text-4xl mb-3 opacity-50">📭</span>
            <p className="text-surface-400 text-sm">Nenhuma venda registrada</p>
            <p className="text-surface-500 text-xs mt-1">As vendas aparecerão aqui após o registro</p>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface-750/80">
                <th className="px-5 py-4 text-xs uppercase tracking-widest text-surface-400 font-semibold">Prato</th>
                <th className="px-5 py-4 text-xs uppercase tracking-widest text-surface-400 font-semibold">Qtd</th>
                <th className="px-5 py-4 text-xs uppercase tracking-widest text-surface-400 font-semibold">Total</th>
                <th className="px-5 py-4 text-xs uppercase tracking-widest text-surface-400 font-semibold">Data</th>
              </tr>
            </thead>
            <tbody>
              {vendas.map((v, idx) => (
                <tr
                  key={v.id}
                  className="border-t border-surface-700 hover:bg-amber-accent-subtle/40 transition-colors duration-150 animate-fade-in-up"
                  style={{ animationDelay: `${idx * 30}ms` }}
                >
                  <td className="px-5 py-4 text-surface-200 text-sm font-medium">{v.prato.nome}</td>
                  <td className="px-5 py-4 text-surface-300 text-sm">{v.quantidade}x</td>
                  <td className="px-5 py-4 text-amber-accent font-semibold text-sm">R$ {v.total.toFixed(2)}</td>
                  <td className="px-5 py-4 text-surface-400 text-sm">{new Date(v.createdAt).toLocaleString('pt-BR')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <ToastMessage
        message={toast?.message}
        type={toast?.type}
        onClose={() => setToast(null)}
      />
    </>
  );
}