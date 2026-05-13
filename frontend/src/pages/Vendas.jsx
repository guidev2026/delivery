import { useState, useEffect } from 'react';
import ToastMessage from '../components/ToastMessage';

const API_PRATOS = 'http://localhost:3001/pratos';
const API_VENDAS = 'http://localhost:3001/vendas';

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
      {/* Total do dia card */}
      <div className="bg-surface-800 border border-surface-700 border-l-4 border-l-amber-accent rounded-xl p-6 mb-6">
        <p className="text-xs uppercase tracking-widest text-surface-500 font-medium">Total do Dia</p>
        <p className="text-4xl font-heading font-bold text-amber-accent mt-1">
          R$ {totalDia.toFixed(2)}
        </p>
      </div>

      <form onSubmit={registrar} className="bg-surface-800 border border-surface-700 rounded-xl p-6 mb-6">
        <h3 className="text-sm font-heading font-semibold text-surface-300 mb-4">Registrar Nova Venda</h3>
        <div className="flex gap-4 flex-wrap items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="text-xs uppercase tracking-widest text-surface-500 font-medium block mb-1.5">Prato</label>
            <select
              className="w-full bg-surface-900 border border-surface-600 rounded-lg px-3 py-2.5 text-surface-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-accent/40 focus:border-amber-accent transition-all duration-200"
              value={pratoId}
              onChange={(e) => setPratoId(e.target.value)}
              required
            >
              <option value="" className="bg-surface-900">Selecione...</option>
              {pratos.map((p) => (
                <option key={p.id} value={p.id} className="bg-surface-900">🍽️ {p.nome} — R$ {p.preco.toFixed(2)}</option>
              ))}
            </select>
          </div>
          <div className="w-24">
            <label className="text-xs uppercase tracking-widest text-surface-500 font-medium block mb-1.5">Quantidade</label>
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
              className="bg-amber-accent hover:bg-amber-accent-hover text-surface-900 font-semibold px-6 py-2.5 rounded-lg text-sm transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? 'Vendendo...' : 'Vender'}
            </button>
          </div>
        </div>
      </form>

      <div className="bg-surface-800 border border-surface-700 rounded-xl p-5 mb-6">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-heading font-semibold text-surface-300">Histórico de Vendas</h3>
          <div className="flex items-center gap-2">
            <label className="text-xs uppercase tracking-widest text-surface-500 font-medium">Filtrar data:</label>
            <input
              className="bg-surface-900 border border-surface-600 rounded-lg px-3 py-1.5 text-surface-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-accent/40 focus:border-amber-accent transition-all duration-200"
              type="date"
              value={filtroData}
              onChange={(e) => setFiltroData(e.target.value)}
            />
            {filtroData && (
              <button className="text-xs text-surface-500 hover:text-surface-300 font-medium transition-colors duration-200" onClick={() => setFiltroData('')}>
                Limpar
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="bg-surface-800 border border-surface-700 rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-surface-700/60">
              <th className="px-5 py-3.5 text-xs uppercase tracking-widest text-surface-400 font-semibold">Prato</th>
              <th className="px-5 py-3.5 text-xs uppercase tracking-widest text-surface-400 font-semibold">Qtd</th>
              <th className="px-5 py-3.5 text-xs uppercase tracking-widest text-surface-400 font-semibold">Total</th>
              <th className="px-5 py-3.5 text-xs uppercase tracking-widest text-surface-400 font-semibold">Data</th>
            </tr>
          </thead>
          <tbody>
            {vendas.map((v) => (
              <tr key={v.id} className="border-t border-surface-700 hover:bg-surface-700/40 transition-colors duration-150">
                <td className="px-5 py-3.5 text-surface-200 text-sm">{v.prato.nome}</td>
                <td className="px-5 py-3.5 text-surface-400 text-sm">{v.quantidade}</td>
                <td className="px-5 py-3.5 text-amber-accent font-semibold text-sm">R$ {v.total.toFixed(2)}</td>
                <td className="px-5 py-3.5 text-surface-500 text-sm">{new Date(v.createdAt).toLocaleString('pt-BR')}</td>
              </tr>
            ))}
            {vendas.length === 0 && (
              <tr>
                <td colSpan="4" className="px-5 py-10 text-center text-surface-500 text-sm">Nenhuma venda registrada</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <ToastMessage
        message={toast?.message}
        type={toast?.type}
        onClose={() => setToast(null)}
      />
    </>
  );
}