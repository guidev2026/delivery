import { useState, useEffect } from 'react';
import ToastMessage from '../components/ToastMessage';

const API = 'http://localhost:3001/insumos';

export default function Insumos() {
  const [insumos, setInsumos] = useState([]);
  const [form, setForm] = useState({ nome: '', unidadeMedida: '', quantidadeEstoque: '' });
  const [editando, setEditando] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => { listar(); }, []);

  function showToast(message, type = 'success') {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }

  async function listar() {
    const res = await fetch(API);
    setInsumos(await res.json());
  }

  async function salvar(e) {
    e.preventDefault();
    setToast(null);
    setLoading(true);
    try {
      const body = { ...form, quantidadeEstoque: Number(form.quantidadeEstoque) };
      const url = editando ? `${API}/${editando}` : API;
      const method = editando ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      if (!res.ok) throw new Error('Erro ao salvar insumo');
      setForm({ nome: '', unidadeMedida: '', quantidadeEstoque: '' });
      setEditando(null);
      showToast(editando ? 'Insumo atualizado com sucesso!' : 'Insumo salvo com sucesso!');
      listar();
    } catch {
      showToast('Erro ao salvar insumo', 'error');
    } finally {
      setLoading(false);
    }
  }

  async function deletar(id) {
    if (!confirm('Deletar este insumo?')) return;
    setToast(null);
    try {
      const res = await fetch(`${API}/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Erro ao deletar insumo');
      showToast('Insumo deletado com sucesso!');
      listar();
    } catch {
      showToast('Erro ao deletar insumo', 'error');
    }
  }

  function editar(i) {
    setForm({ nome: i.nome, unidadeMedida: i.unidadeMedida, quantidadeEstoque: i.quantidadeEstoque.toString() });
    setEditando(i.id);
  }

  return (
    <>
      <form onSubmit={salvar} className="bg-surface-800 border border-surface-700 rounded-xl p-6 mb-6">
        <div className="flex gap-4 flex-wrap items-end">
          <div className="flex-1 min-w-[140px]">
            <label className="text-xs uppercase tracking-widest text-surface-500 font-medium block mb-1.5">Nome</label>
            <input
              className="w-full bg-surface-900 border border-surface-600 rounded-lg px-3 py-2.5 text-surface-200 text-sm placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-amber-accent/40 focus:border-amber-accent transition-all duration-200"
              value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
              required
              placeholder="ex.: Tomate"
            />
          </div>
          <div className="w-28">
            <label className="text-xs uppercase tracking-widest text-surface-500 font-medium block mb-1.5">Unidade</label>
            <input
              className="w-full bg-surface-900 border border-surface-600 rounded-lg px-3 py-2.5 text-surface-200 text-sm placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-amber-accent/40 focus:border-amber-accent transition-all duration-200"
              value={form.unidadeMedida}
              onChange={(e) => setForm({ ...form, unidadeMedida: e.target.value })}
              required
              placeholder="kg"
            />
          </div>
          <div className="w-28">
            <label className="text-xs uppercase tracking-widest text-surface-500 font-medium block mb-1.5">Estoque</label>
            <input
              className="w-full bg-surface-900 border border-surface-600 rounded-lg px-3 py-2.5 text-surface-200 text-sm placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-amber-accent/40 focus:border-amber-accent transition-all duration-200"
              type="number"
              step="0.01"
              value={form.quantidadeEstoque}
              onChange={(e) => setForm({ ...form, quantidadeEstoque: e.target.value })}
              required
              placeholder="0"
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
                onClick={() => { setEditando(null); setForm({ nome: '', unidadeMedida: '', quantidadeEstoque: '' }); }}
              >
                Cancelar
              </button>
            )}
          </div>
        </div>
      </form>

      <div className="bg-surface-800 border border-surface-700 rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-surface-700/60">
              <th className="px-5 py-3.5 text-xs uppercase tracking-widest text-surface-400 font-semibold">Nome</th>
              <th className="px-5 py-3.5 text-xs uppercase tracking-widest text-surface-400 font-semibold">Unidade</th>
              <th className="px-5 py-3.5 text-xs uppercase tracking-widest text-surface-400 font-semibold">Estoque</th>
              <th className="px-5 py-3.5 text-xs uppercase tracking-widest text-surface-400 font-semibold text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {insumos.map((i, idx) => (
              <tr key={i.id} className="border-t border-surface-700 hover:bg-surface-700/40 transition-colors duration-150">
                <td className="px-5 py-3.5 text-surface-200 text-sm">{i.nome}</td>
                <td className="px-5 py-3.5 text-surface-400 text-sm">{i.unidadeMedida}</td>
                <td className="px-5 py-3.5 text-surface-200 text-sm font-medium">{i.quantidadeEstoque}</td>
                <td className="px-5 py-3.5 text-right">
                  <button onClick={() => editar(i)} className="text-amber-accent hover:text-amber-accent-light text-sm font-medium transition-colors duration-200 mr-3">
                    Editar
                  </button>
                  <button onClick={() => deletar(i.id)} className="text-destructive hover:text-destructive-hover text-sm font-medium transition-colors duration-200">
                    Deletar
                  </button>
                </td>
              </tr>
            ))}
            {insumos.length === 0 && (
              <tr>
                <td colSpan="4" className="px-5 py-10 text-center text-surface-500 text-sm">Nenhum insumo cadastrado</td>
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