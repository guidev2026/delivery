import { useState, useEffect } from 'react';
import ToastMessage from '../components/ToastMessage';

const API_INSUMOS = 'http://localhost:3001/insumos';
const API_PRATOS = 'http://localhost:3001/pratos';

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
      <form onSubmit={salvar} className="bg-surface-800 border border-surface-700 rounded-xl p-6 mb-6">
        <div className="flex gap-4 flex-wrap items-end mb-5">
          <div className="flex-1 min-w-[160px]">
            <label className="text-xs uppercase tracking-widest text-surface-500 font-medium block mb-1.5">Nome</label>
            <input
              className="w-full bg-surface-900 border border-surface-600 rounded-lg px-3 py-2.5 text-surface-200 text-sm placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-amber-accent/40 focus:border-amber-accent transition-all duration-200"
              value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
              required
              placeholder="ex.: Filé ao molho"
            />
          </div>
          <div className="w-32">
            <label className="text-xs uppercase tracking-widest text-surface-500 font-medium block mb-1.5">Preço (R$)</label>
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
              className="bg-amber-accent hover:bg-amber-accent-hover text-surface-900 font-semibold px-5 py-2.5 rounded-lg text-sm transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? 'Salvando...' : (editando ? 'Atualizar' : 'Adicionar')}
            </button>
            {editando && (
              <button
                type="button"
                className="text-surface-500 hover:text-surface-300 text-sm px-3 py-2.5 rounded-lg transition-colors duration-200"
                onClick={() => { setEditando(null); setForm({ nome: '', preco: '', insumos: [] }); }}
              >
                Cancelar
              </button>
            )}
          </div>
        </div>

        <div>
          <p className="text-xs uppercase tracking-widest text-surface-500 font-medium mb-3">Insumos do prato</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
            {insumos.map((ins) => {
              const selecionado = form.insumos.find((i) => i.insumoId === ins.id);
              return (
                <label
                  key={ins.id}
                  className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                    selecionado
                      ? 'border-amber-accent/50 bg-amber-accent/8'
                      : 'border-surface-600 bg-surface-900/50 hover:border-surface-500'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={!!selecionado}
                    onChange={() => toggleInsumo(ins.id)}
                    className="accent-amber-accent"
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
        </div>
      </form>

      <div className="space-y-3">
        {pratos.map((p) => (
          <div key={p.id} className="bg-surface-800 border border-surface-700 rounded-xl p-5 hover:border-surface-600 transition-colors duration-200">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-surface-200 font-heading font-semibold text-lg">{p.nome}</h3>
                <p className="text-amber-accent font-semibold mt-0.5">R$ {p.preco.toFixed(2)}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => editar(p)} className="text-amber-accent hover:text-amber-accent-light text-sm font-medium transition-colors duration-200">
                  Editar
                </button>
                <button onClick={() => deletar(p.id)} className="text-destructive hover:text-destructive-hover text-sm font-medium transition-colors duration-200">
                  Deletar
                </button>
              </div>
            </div>
            {p.insumos.length > 0 && (
              <div className="mt-3 pt-3 border-t border-surface-700">
                <p className="text-xs text-surface-500 mb-1.5">Insumos:</p>
                <div className="flex flex-wrap gap-1.5">
                  {p.insumos.map((pi) => (
                    <span key={pi.id} className="bg-surface-700 text-surface-400 text-xs px-2.5 py-1 rounded-full">
                      {pi.insumo.nome} ({pi.quantidadeUsada} {pi.insumo.unidadeMedida})
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
        {pratos.length === 0 && (
          <p className="text-center text-surface-500 py-10 text-sm">Nenhum prato cadastrado</p>
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