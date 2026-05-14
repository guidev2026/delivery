import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { createClient } from '@libsql/client';
import { PrismaLibSQL } from '@prisma/adapter-libsql'; // Importação corrigida

import insumosRouter from './routes/insumos.js';
import pratosRouter from './routes/pratos.js';
import vendasRouter from './routes/vendas.js';

// --- CONFIGURAÇÃO DO TURSO + PRISMA ---
const libsql = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

// AQUI ESTAVA O ERRO RESTANTE: Agora está instanciando com a nomenclatura correta
const adapter = new PrismaLibSQL(libsql);

// Exporta o prisma usando o adaptador em vez do cliente padrão
export const prisma = new PrismaClient({ adapter });
// --------------------------------------

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  // Lê a URL da Vercel pela variável da Render e permite localhost
  origin: [
    process.env.FRONTEND_URL,
    'http://localhost:5173', // Porta padrão do Vite
    'http://localhost:3000'  // Porta padrão do React/Next
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.use('/insumos', insumosRouter);
app.use('/pratos', pratosRouter);
app.use('/vendas', vendasRouter);

app.listen(PORT, () => {
  console.log(`Backend rodando na porta ${PORT}`);
});