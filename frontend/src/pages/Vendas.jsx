import { useState, useEffect } from 'react';

const API_PRATOS = 'http://localhost:3001/pratos';
const API_VENDAS = 'http://localhost:3001/vendas';

export default function Vendas() {
  const [pratos, setPratos] = useState([]);
  const [vendas, setVendas] = useState([]);
  const [pratoId, setPratoId] = useState('');
  const [quantidade, setQuantidade] = useState(1);
  const [filtroData, setFiltroData] = useState('');
  const [erro, setErro] = useState('');

  useEffect(() => { listarPratos(); listarVendas(); }, []);

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
    setErro('');
    try {
      const res = await fetch(API_VENDAS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prato_id: Number(pratoId), quantidade: Number(quantidade) }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErro(data.error);
        return;
      }
      setPratoId('');
      setQuantidade(1);
      listarVendas();
    } catch {
      setErro('Erro ao registrar venda');
    }
  }

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Registrar Venda</h2>

      <form onSubmit={registrar} className="bg-white p-4 rounded-lg shadow mb-6 flex gap-3 flex-wrap items-end">
        <div>
          <label className="block text-sm text-gray-600">Prato</label>
          <select className="border rounded px-3 py-2 w-48" value={pratoId} onChange={(e) => setPratoId(e.target.value)} required>
            <option value="">Selecione...</option>
            {pratos.map((p) => (
              <option key={p.id} value={p.id}>{p.nome} — R$ {p.preco.toFixed(2)}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm text-gray-600">Quantidade</label>
          <input className="border rounded px-3 py-2 w-20" type="number" min="1" value={quantidade} onChange={(e) => setQuantidade(e.target.value)} required />
        </div>
        <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Vender</button>
        {erro && <p className="text-red-600 text-sm w-full">{erro}</p>}
      </form>

      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Histórico de Vendas</h3>
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Filtrar por data:</label>
          <input className="border rounded px-3 py-1.5 text-sm" type="date" value={filtroData} onChange={(e) => setFiltroData(e.target.value)} />
          {filtroData && (
            <button className="text-sm text-gray-500 hover:underline" onClick={() => setFiltroData('')}>Limpar</button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-sm text-gray-600">
            <tr>
              <th className="p-3">Prato</th>
              <th className="p-3">Qtd</th>
              <th className="p-3">Total</th>
              <th className="p-3">Data</th>
            </tr>
          </thead>
          <tbody>
            {vendas.map((v) => (
              <tr key={v.id} className="border-t">
                <td className="p-3">{v.prato.nome}</td>
                <td className="p-3">{v.quantidade}</td>
                <td className="p-3 font-medium">R$ {v.total.toFixed(2)}</td>
                <td className="p-3 text-sm text-gray-500">{new Date(v.createdAt).toLocaleString('pt-BR')}</td>
              </tr>
            ))}
            {vendas.length === 0 && (
              <tr><td colSpan="4" className="p-3 text-center text-gray-400">Nenhuma venda registrada</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}