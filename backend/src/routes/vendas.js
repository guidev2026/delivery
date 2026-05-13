import { Router } from 'express';
import { prisma } from '../index.js';

const router = Router();

// Histórico de vendas (com filtro opcional por data)
router.get('/', async (req, res) => {
  try {
    const { data } = req.query;
    const where = data
      ? {
          createdAt: {
            gte: new Date(`${data}T00:00:00.000Z`),
            lt: new Date(`${data}T23:59:59.999Z`),
          },
        }
      : {};

    const vendas = await prisma.venda.findMany({
      where,
      include: { prato: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json(vendas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Registrar venda (com transação que debita estoque)
router.post('/', async (req, res) => {
  try {
    const { prato_id, quantidade } = req.body;

    const venda = await prisma.$transaction(async (tx) => {
      // 1. Busca os insumos do prato
      const pratoInsumos = await tx.pratoInsumo.findMany({
        where: { pratoId: prato_id },
        include: { insumo: true },
      });

      if (pratoInsumos.length === 0) {
        throw new Error('Prato não possui insumos cadastrados');
      }

      // 2. Verifica e debita cada insumo
      for (const pi of pratoInsumos) {
        const necessario = pi.quantidadeUsada * quantidade;
        if (pi.insumo.quantidadeEstoque < necessario) {
          throw new Error(
            `Estoque insuficiente para: ${pi.insumo.nome} (necessário: ${necessario}, disponível: ${pi.insumo.quantidadeEstoque})`
          );
        }
        await tx.insumo.update({
          where: { id: pi.insumoId },
          data: { quantidadeEstoque: { decrement: necessario } },
        });
      }

      // 3. Busca o prato para calcular o total
      const prato = await tx.prato.findUnique({ where: { id: prato_id } });

      // 4. Registra a venda
      return tx.venda.create({
        data: {
          pratoId: prato_id,
          quantidade,
          total: prato.preco * quantidade,
        },
        include: { prato: true },
      });
    });

    res.status(201).json(venda);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;