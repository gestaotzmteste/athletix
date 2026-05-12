-- ============================================
-- MIGRATION: Adicionar campo de tamanho aos produtos
-- Versão: 1.3.0
-- ============================================

-- 1. Adicionar campo de tamanho na tabela products
ALTER TABLE products ADD COLUMN IF NOT EXISTS size TEXT;

-- 2. Adicionar constraint para validar tamanhos permitidos
ALTER TABLE products ADD CONSTRAINT valid_size 
  CHECK (size IS NULL OR size IN ('PP', 'P', 'M', 'G', 'GG', 'XG', 'XGG', 'Único'));

-- 3. Criar índice para busca por tamanho
CREATE INDEX IF NOT EXISTS idx_products_size ON products(size);

-- 4. Atualizar produtos existentes com tamanho padrão (opcional)
-- Descomente a linha abaixo se quiser definir um tamanho padrão
-- UPDATE products SET size = 'Único' WHERE size IS NULL;

-- ============================================
-- FIM DA MIGRATION
-- ============================================
