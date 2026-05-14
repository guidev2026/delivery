import { useState, useEffect } from 'react';
import ToastMessage from '../components/ToastMessage';

// Pega a URL base da variável de ambiente (Vercel) ou usa o localhost como fallback
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const API_INSUMOS = `${API_BASE}/insumos`;
const API_PRATOS = `${API_BASE}/pratos`;

export default function Pratos() {
  const [pratos, setPratos] = useState([]);
  const [insumos, setInsumos] = useState([]);
  const [form, setForm] = useState({ nome: '', preco: '', insumos: [] });
  const [editando, setEditando] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => { listarPratos(); listarInsumos(); }, []);

  function showToast(message, type = 'success') {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }

  async function listarPratos() {
    const res = await fetch(API_PRATOS);
    setPratos(await res.json());
  }

  async function listarInsumos() {
    const res = await fetch(API_INSUMOS);
    setInsumos(await res.json());
  }

  function toggleInsumo(insumoId) {
    setForm((prev) => {
      const exists = prev.insumos.find((i) => i.insumoId === insumoId);
      if (exists) {
        return { ...prev, insumos: prev.insumos.filter((i) => i.insumoId !== insumoId) };
      }
      return { ...prev, insumos: [...prev.insumos, { insumoId, quantidadeUsada: 0 }] };
    });
  }

  function setQuantidade(insumoId, valor) {
    setForm((prev) => ({
      ...prev,
      insumos: prev.insumos.map((i) =>
        i.insumoId === insumoId ? { ...i, quantidadeUsada: Number(valor) } : i
      ),
    }));
  }

  async function salvar(e) {
    e.preventDefault();
    setToast(null);
    setLoading(true);
    try {
      const body = {
        nome: form.nome,
        preco: Number(form.preco),
        insumos: form.insumos.filter((i) => i.quantidadeUsada > 0),
      };
      const url = editando ? `${API_PRATOS}/${editando}` : API_PRATOS;
      const method = editando ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error('Erro ao salvar prato');
      setForm({ nome: '', preco: '', insumos: [] });
      setEditando(null);
      showToast(editando ? 'Prato atualizado com sucesso!' : 'Prato salvo com sucesso!');
      listarPratos();
    } catch {
      showToast('Erro ao salvar prato', 'error');
    } finally {
      setLoading(false);
    }
  }

  async function deletar(id) {
    if (!confirm('Deletar este prato?')) return;
    setToast(null);
    try {
      const res = await fetch(`${API_PRATOS}/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Erro ao deletar prato');
      showToast('Prato deletado com sucesso!');
      listarPratos();
    } catch {
      showToast('Erro ao deletar prato', 'error');
    }
  }

  function editar(p) {
    setForm({
      nome: p.nome,
      preco: p.preco.toString(),
      insumos: p.insumos.map((pi) => ({ insumoId: pi.insumo.id, quantidadeUsada: pi.quantidadeUsada })),
    });
    setEditando(p.id);
  }

  return (
    <>
      {/* Formulário */}
      <form onSubmit={salvar} className="bg-surface-800 border border-surface-700 rounded-xl p-6 mb-6">
        <h3 className="text-sm font-heading font-semibold text-surface-200 mb-4 flex items-center gap-2">
          <span className="w-1 h-4 bg-amber-accent rounded-full" />
          {editando ? 'Editar Prato' : 'Novo Prato'}
        </h3>
        <div className="flex gap-4 flex-wrap items-end mb-5">
          <div className="flex-1 min-w-[180px]">
            <label className="text-xs uppercase tracking-widest text-surface-400 font-semibold block mb-1.5">Nome</label>
            <input
              className="w-full bg-surface-900 border border-surface-600 rounded-lg px-3 py-2.5 text-surface-200 text-sm placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-amber-accent/40 focus:border-amber-accent transition-all duration-200"
              value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
              required
              placeholder="ex.: Filé ao molho"
            />
          </div>
          <div className="w-32">
            <label className="text-xs uppercase tracking-widest text-surface-400 font-semibold block mb-1.5">Preço (R$)</label>
            <input
              className="w-full bg-surface-900 border border-surface-600 rounded-lg px-3 py-2.5 text-surface-200 text-sm placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-amber-accent/40 focus:border-amber-accent transition-all duration-200"
              type="number"
              step="0.01"
              value={form.preco}
              onChange={(e) => setForm({ ...form, preco: e.target.value })}
              required
              placeholder="0,00"
            />
          </div>
          <div className="flex items-center gap-2 pb-0.5">
            <button
              className="bg-amber-accent hover:bg-amber-accent-hover text-surface-900 font-semibold px-5 py-2.5 rounded-lg text-sm transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-amber-accent/20"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Salvando...
                </span>
              ) : (editando ? 'Atualizar' : 'Adicionar')}
            </button>
            {editando && (
              <button
                type="button"
                className="text-surface-400 hover:text-surface-200 text-sm px-3 py-2.5 rounded-lg transition-colors duration-200 bg-surface-750 hover:bg-surface-700 border border-surface-600"
                onClick={() => { setEditando(null); setForm({ nome: '', preco: '', insumos: [] }); }}
              >
                Cancelar
              </button>
            )}
          </div>
        </div>

        <div>
          <p className="text-xs uppercase tracking-widest text-surface-400 font-semibold mb-3 flex items-center gap-2">
            <span className="w-1 h-3 bg-amber-accent/60 rounded-full" />
            Insumos do prato
          </p>
          {insumos.length === 0 ? (
            <div className="bg-surface-900/50 border border-dashed border-surface-600 rounded-lg p-6 text-center">
              <p className="text-surface-400 text-sm">Nenhum insumo disponível</p>
              <p className="text-surface-500 text-xs mt-1">Cadastre insumos primeiro para associá-los aos pratos</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
              {insumos.map((ins) => {
                const selecionado = form.insumos.find((i) => i.insumoId === ins.id);
                return (
                  <label
                    key={ins.id}
                    className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                      selecionado
                        ? 'border-amber-accent/40 bg-amber-accent-subtle/80 shadow-sm'
                        : 'border-surface-600 bg-surface-900/50 hover:border-surface-500 hover:bg-surface-750/50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={!!selecionado}
                      onChange={() => toggleInsumo(ins.id)}
                      className="accent-amber-accent w-4 h-4"
                    />
                    <span className="text-sm text-surface-300 flex-1">{ins.nome}</span>
                    {selecionado && (
                      <input
                        type="number"
                        step="0.01"
                        className="w-16 bg-surface-900 border border-surface-600 rounded px-2 py-1 text-surface-200 text-xs text-center focus:outline-none focus:ring-1 focus:ring-amber-accent/40 focus:border-amber-accent transition-all duration-200"
                        placeholder="Qtd"
                        value={selecionado.quantidadeUsada || ''}
                        onChange={(e) => setQuantidade(ins.id, e.target.value)}
                      />
                    )}
                  </label>
                );
              })}
            </div>
          )}
        </div>
      </form>

      {/* Lista de Pratos */}
      {pratos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-5 bg-surface-800 border border-surface-700 rounded-xl">
          <span className="text-4xl mb-3 opacity-50">🍽️</span>
          <p className="text-surface-400 text-sm">Nenhum prato cadastrado</p>
          <p className="text-surface-500 text-xs mt-1">Adicione pratos ao cardápio usando o formulário acima</p>
        </div>
      ) : (
        <div className="space-y-3">
          {pratos.map((p, idx) => (
            <div
              key={p.id}
              className="bg-surface-800 border border-surface-700 rounded-xl p-5 hover:border-surface-600 transition-all duration-200 hover:shadow-lg hover:shadow-black/10 animate-fade-in-up"
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-start gap-3">
                  <span className="text-2xl mt-0.5">🍽️</span>
                  <div>
                    <h3 className="text-surface-200 font-heading font-semibold text-lg">{p.nome}</h3>
                    <p className="text-amber-accent font-semibold mt-0.5">R$ {p.preco.toFixed(2)}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => editar(p)} className="text-amber-accent hover:text-amber-accent-light text-sm font-medium transition-colors duration-200 bg-amber-accent-subtle px-3 py-1 rounded-lg hover:bg-amber-accent/20">
                    Editar
                  </button>
                  <button onClick={() => deletar(p.id)} className="text-destructive hover:text-destructive-hover text-sm font-medium transition-colors duration-200 bg-destructive-subtle px-3 py-1 rounded-lg hover:bg-destructive/20">
                    Deletar
                  </button>
                </div>
              </div>
              {p.insumos.length > 0 && (
                <div className="mt-4 pt-4 border-t border-surface-700">
                  <p className="text-xs text-surface-500 mb-2 font-medium uppercase tracking-wider">Insumos utilizados</p>
                  <div className="flex flex-wrap gap-1.5">
                    {p.insumos.map((pi) => (
                      <span key={pi.id} className="bg-surface-750 text-surface-300 text-xs px-3 py-1 rounded-full border border-surface-600/50">
                        {pi.insumo.nome} ({pi.quantidadeUsada} {pi.insumo.unidadeMedida})
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <ToastMessage
        message={toast?.message}
        type={toast?.type}
        onClose={() => setToast(null)}
      />
    </>
  );
}