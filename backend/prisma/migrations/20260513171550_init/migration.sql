-- CreateTable
CREATE TABLE "insumos" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "unidade_medida" TEXT NOT NULL,
    "quantidade_estoque" REAL NOT NULL DEFAULT 0,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "pratos" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "preco" REAL NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "prato_insumos" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "prato_id" INTEGER NOT NULL,
    "insumo_id" INTEGER NOT NULL,
    "quantidade_usada" REAL NOT NULL,
    CONSTRAINT "prato_insumos_prato_id_fkey" FOREIGN KEY ("prato_id") REFERENCES "pratos" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "prato_insumos_insumo_id_fkey" FOREIGN KEY ("insumo_id") REFERENCES "insumos" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "vendas" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "prato_id" INTEGER NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "total" REAL NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "vendas_prato_id_fkey" FOREIGN KEY ("prato_id") REFERENCES "pratos" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
