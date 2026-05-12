-- ============================================
-- MIGRATION: Substituir email por telefone na tabela sales
-- Versão: 1.3.1
-- ============================================

-- 1. Adicionar campo de telefone
ALTER TABLE sales ADD COLUMN IF NOT EXISTS customer_phone TEXT;

-- 2. Remover campo de email (opcional - descomente se quiser remover)
-- ALTER TABLE sales DROP COLUMN IF EXISTS customer_email;

-- 3. Criar índice para busca por telefone
CREATE INDEX IF NOT EXISTS idx_sales_customer_phone ON sales(customer_phone);

-- ============================================
-- FIM DA MIGRATION
-- ============================================
