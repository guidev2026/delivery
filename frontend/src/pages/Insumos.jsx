import { useState, useEffect } from 'react';

const API = 'http://localhost:3001/insumos';

export default function Insumos() {
  const [insumos, setInsumos] = useState([]);
  const [form, setForm] = useState({ nome: '', unidadeMedida: '', quantidadeEstoque: '' });
  const [editando, setEditando] = useState(null);

  useEffect(() => { listar(); }, []);

  async function listar() {
    const res = await fetch(API);
    setInsumos(await res.json());
  }

  async function salvar(e) {
    e.preventDefault();
    const body = { ...form, quantidadeEstoque: Number(form.quantidadeEstoque) };
    const url = editando ? `${API}/${editando}` : API;
    const method = editando ? 'PUT' : 'POST';
    await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    setForm({ nome: '', unidadeMedida: '', quantidadeEstoque: '' });
    setEditando(null);
    listar();
  }

  async function deletar(id) {
    if (!confirm('Deletar este insumo?')) return;
    await fetch(`${API}/${id}`, { method: 'DELETE' });
    listar();
  }

  function editar(i) {
    setForm({ nome: i.nome, unidadeMedida: i.unidadeMedida, quantidadeEstoque: i.quantidadeEstoque.toString() });
    setEditando(i.id);
  }

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Gerenciar Insumos</h2>

      <form onSubmit={salvar} className="bg-white p-4 rounded-lg shadow mb-6 flex gap-3 flex-wrap items-end">
        <div>
          <label className="block text-sm text-gray-600">Nome</label>
          <input className="border rounded px-3 py-2 w-40" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} required />
        </div>
        <div>
          <label className="block text-sm text-gray-600">Unidade</label>
          <input className="border rounded px-3 py-2 w-24" value={form.unidadeMedida} onChange={(e) => setForm({ ...form, unidadeMedida: e.target.value })} required />
        </div>
        <div>
          <label className="block text-sm text-gray-600">Estoque</label>
          <input className="border rounded px-3 py-2 w-24" type="number" step="0.01" value={form.quantidadeEstoque} onChange={(e) => setForm({ ...form, quantidadeEstoque: e.target.value })} required />
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          {editando ? 'Atualizar' : 'Adicionar'}
        </button>
        {editando && (
          <button type="button" className="text-gray-500 text-sm" onClick={() => { setEditando(null); setForm({ nome: '', unidadeMedida: '', quantidadeEstoque: '' }); }}>
            Cancelar
          </button>
        )}
      </form>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-sm text-gray-600">
            <tr>
              <th className="p-3">Nome</th>
              <th className="p-3">Unidade</th>
              <th className="p-3">Estoque</th>
              <th className="p-3">Ações</th>
            </tr>
          </thead>
          <tbody>
            {insumos.map((i) => (
              <tr key={i.id} className="border-t">
                <td className="p-3">{i.nome}</td>
                <td className="p-3">{i.unidadeMedida}</td>
                <td className="p-3">{i.quantidadeEstoque}</td>
                <td className="p-3 flex gap-2">
                  <button onClick={() => editar(i)} className="text-blue-600 hover:underline text-sm">Editar</button>
                  <button onClick={() => deletar(i.id)} className="text-red-600 hover:underline text-sm">Deletar</button>
                </td>
              </tr>
            ))}
            {insumos.length === 0 && (
              <tr><td colSpan="4" className="p-3 text-center text-gray-400">Nenhum insumo cadastrado</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}