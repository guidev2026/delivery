import { Router } from 'express';
import { prisma } from '../index.js';

const router = Router();

// Listar todos os pratos (com insumos)
router.get('/', async (req, res) => {
  try {
    const pratos = await prisma.prato.findMany({
      include: {
        insumos: {
          include: { insumo: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(pratos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Buscar prato por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const prato = await prisma.prato.findUnique({
      where: { id: Number(id) },
      include: {
        insumos: {
          include: { insumo: true },
        },
      },
    });
    if (!prato) return res.status(404).json({ error: 'Prato não encontrado' });
    res.json(prato);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Criar prato com insumos
router.post('/', async (req, res) => {
  try {
    const { nome, preco, insumos } = req.body;
    const prato = await prisma.prato.create({
      data: {
        nome,
        preco,
        insumos: {
          create: insumos.map((item) => ({
            insumoId: item.insumoId,
            quantidadeUsada: item.quantidadeUsada,
          })),
        },
      },
      include: {
        insumos: {
          include: { insumo: true },
        },
      },
    });
    res.status(201).json(prato);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Atualizar prato
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, preco, insumos } = req.body;

    // Remove associações antigas e recria
    await prisma.pratoInsumo.deleteMany({ where: { pratoId: Number(id) } });

    const prato = await prisma.prato.update({
      where: { id: Number(id) },
      data: {
        nome,
        preco,
        insumos: {
          create: insumos.map((item) => ({
            insumoId: item.insumoId,
            quantidadeUsada: item.quantidadeUsada,
          })),
        },
      },
      include: {
        insumos: {
          include: { insumo: true },
        },
      },
    });
    res.json(prato);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Deletar prato
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.prato.delete({ where: { id: Number(id) } });
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;