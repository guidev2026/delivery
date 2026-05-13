import { useState, useEffect } from 'react';

const API_INSUMOS = 'http://localhost:3001/insumos';
const API_PRATOS = 'http://localhost:3001/pratos';

export default function Pratos() {
  const [pratos, setPratos] = useState([]);
  const [insumos, setInsumos] = useState([]);
  const [form, setForm] = useState({ nome: '', preco: '', insumos: [] });
  const [editando, setEditando] = useState(null);

  useEffect(() => { listarPratos(); listarInsumos(); }, []);

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
    const body = {
      nome: form.nome,
      preco: Number(form.preco),
      insumos: form.insumos.filter((i) => i.quantidadeUsada > 0),
    };
    const url = editando ? `${API_PRATOS}/${editando}` : API_PRATOS;
    const method = editando ? 'PUT' : 'POST';
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    setForm({ nome: '', preco: '', insumos: [] });
    setEditando(null);
    listarPratos();
  }

  async function deletar(id) {
    if (!confirm('Deletar este prato?')) return;
    await fetch(`${API_PRATOS}/${id}`, { method: 'DELETE' });
    listarPratos();
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
    <div>
      <h2 className="text-lg font-semibold mb-4">Gerenciar Pratos</h2>

      <form onSubmit={salvar} className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex gap-3 flex-wrap items-end mb-4">
          <div>
            <label className="block text-sm text-gray-600">Nome</label>
            <input className="border rounded px-3 py-2 w-48" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} required />
          </div>
          <div>
            <label className="block text-sm text-gray-600">Preço (R$)</label>
            <input className="border rounded px-3 py-2 w-24" type="number" step="0.01" value={form.preco} onChange={(e) => setForm({ ...form, preco: e.target.value })} required />
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            {editando ? 'Atualizar' : 'Adicionar'}
          </button>
          {editando && (
            <button type="button" className="text-gray-500 text-sm" onClick={() => { setEditando(null); setForm({ nome: '', preco: '', insumos: [] }); }}>
              Cancelar
            </button>
          )}
        </div>

        <div>
          <p className="text-sm font-medium text-gray-600 mb-2">Insumos do prato:</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {insumos.map((ins) => {
              const selecionado = form.insumos.find((i) => i.insumoId === ins.id);
              return (
                <label key={ins.id} className={`flex items-center gap-2 p-2 rounded border cursor-pointer ${selecionado ? 'border-blue-400 bg-blue-50' : 'border-gray-200'}`}>
                  <input type="checkbox" checked={!!selecionado} onChange={() => toggleInsumo(ins.id)} />
                  <span className="text-sm flex-1">{ins.nome}</span>
                  {selecionado && (
                    <input
                      type="number"
                      step="0.01"
                      className="border rounded px-2 py-1 w-20 text-sm"
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
          <div key={p.id} className="bg-white rounded-lg shadow p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{p.nome}</h3>
                <p className="text-sm text-gray-500">R$ {p.preco.toFixed(2)}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => editar(p)} className="text-blue-600 hover:underline text-sm">Editar</button>
                <button onClick={() => deletar(p.id)} className="text-red-600 hover:underline text-sm">Deletar</button>
              </div>
            </div>
            {p.insumos.length > 0 && (
              <div className="mt-2 text-sm text-gray-500">
                Insumos: {p.insumos.map((pi) => `${pi.insumo.nome} (${pi.quantidadeUsada} ${pi.insumo.unidadeMedida})`).join(', ')}
              </div>
            )}
          </div>
        ))}
        {pratos.length === 0 && (
          <p className="text-center text-gray-400 py-8">Nenhum prato cadastrado</p>
        )}
      </div>
    </div>
  );
}