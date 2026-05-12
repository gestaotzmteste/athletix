# ⚡ EXECUTE ESTE SQL NO SUPABASE

## 🎯 Instruções

1. Acesse: https://supabase.com/dashboard/project/xajsybcyuujtvyoxdykd
2. Clique em **SQL Editor** no menu lateral
3. Clique em **+ New query**
4. Copie **TODO** o SQL abaixo
5. Cole no editor
6. Clique em **Run** (ou Ctrl+Enter)
7. Aguarde a mensagem: "Success. No rows returned"
8. Reinicie seu servidor: `npm run dev`

---

## 📋 SQL para Executar

```sql
-- ============================================
-- MIGRATION: Produtos, Estoque e Vendas
-- Versão: 1.2.0
-- Data: Maio 2026
-- ============================================

-- 1. Adicionar campos de custo e margem na tabela products
ALTER TABLE products ADD COLUMN IF NOT EXISTS cost_price DECIMAL(10, 2) DEFAULT 0;
ALTER TABLE products ADD COLUMN IF NOT EXISTS profit_margin DECIMAL(5, 2) GENERATED ALWAYS AS (
  CASE 
    WHEN cost_price > 0 THEN ((price - cost_price) / cost_price * 100)
    ELSE 0
  END
) STORED;

-- 2. Criar tabela de movimentações de estoque
CREATE TABLE IF NOT EXISTS stock_movements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('entrada', 'saida', 'ajuste')),
  quantity INTEGER NOT NULL,
  reason TEXT,
  notes TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Criar tabela de vendas
CREATE TABLE IF NOT EXISTS sales (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  customer_name TEXT,
  customer_email TEXT,
  payment_method TEXT, -- 'dinheiro', 'pix', 'cartao_credito', 'cartao_debito'
  notes TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_stock_movements_product_id ON stock_movements(product_id);
CREATE INDEX IF NOT EXISTS idx_stock_movements_type ON stock_movements(type);
CREATE INDEX IF NOT EXISTS idx_stock_movements_created_at ON stock_movements(created_at);
CREATE INDEX IF NOT EXISTS idx_sales_product_id ON sales(product_id);
CREATE INDEX IF NOT EXISTS idx_sales_created_at ON sales(created_at);

-- 5. Habilitar RLS para stock_movements
ALTER TABLE stock_movements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Stock movements are viewable by authenticated users" ON stock_movements
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Stock movements can be inserted by authenticated users" ON stock_movements
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Stock movements can be updated by authenticated users" ON stock_movements
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Stock movements can be deleted by authenticated users" ON stock_movements
  FOR DELETE USING (auth.role() = 'authenticated');

-- 6. Habilitar RLS para sales
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Sales are viewable by authenticated users" ON sales
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Sales can be inserted by authenticated users" ON sales
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Sales can be updated by authenticated users" ON sales
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Sales can be deleted by authenticated users" ON sales
  FOR DELETE USING (auth.role() = 'authenticated');

-- 7. Atualizar produtos existentes com preço de custo (60% do preço de venda)
UPDATE products SET cost_price = price * 0.6 WHERE cost_price = 0;

-- 8. Inserir dados de exemplo para movimentações de estoque
INSERT INTO stock_movements (product_id, type, quantity, reason, notes)
SELECT id, 'entrada', 50, 'Estoque inicial', 'Primeira entrada de estoque'
FROM products
LIMIT 3;

-- 9. Inserir dados de exemplo para vendas
INSERT INTO sales (product_id, quantity, unit_price, total_price, customer_name, payment_method)
SELECT 
  id, 
  5, 
  price, 
  price * 5,
  'Cliente Exemplo',
  'pix'
FROM products
LIMIT 2;

-- ============================================
-- FIM DA MIGRATION
-- ============================================
```

---

## ✅ Verificação

Após executar, verifique se foi criado:

### 1. Novos Campos em Products
```
Table Editor → products → Columns
- cost_price (decimal)
- profit_margin (decimal, generated)
```

### 2. Nova Tabela: stock_movements
```
Table Editor → stock_movements
Deve ter colunas:
- id
- product_id
- type
- quantity
- reason
- notes
- created_by
- created_at
```

### 3. Nova Tabela: sales
```
Table Editor → sales
Deve ter colunas:
- id
- product_id
- quantity
- unit_price
- total_price
- customer_name
- customer_email
- payment_method
- notes
- created_by
- created_at
```

---

## 🎉 Pronto!

Após executar o SQL:

1. ✅ Reinicie o servidor: `npm run dev`
2. ✅ Acesse: http://localhost:3000/dashboard/products
3. ✅ Cadastre um produto com custo e venda
4. ✅ Veja a margem calculada automaticamente
5. ✅ Teste Estoque e Vendas

---

## 🆘 Se der erro

### Erro: "relation already exists"
**Solução**: Tudo bem! Significa que já foi executado antes. Pode ignorar.

### Erro: "column already exists"
**Solução**: Tudo bem! O campo já existe. Pode ignorar.

### Erro: "permission denied"
**Solução**: Verifique se está logado no Supabase com a conta correta.

### Erro: "syntax error"
**Solução**: Certifique-se de copiar TODO o SQL, incluindo os comentários.

---

## 📞 Próximos Passos

Depois de executar o SQL, consulte:
- `QUICK_REFERENCE.md` - Guia rápido de uso
- `STATUS.md` - Status completo do projeto
- `PRODUCTS_SALES_UPDATE.md` - Detalhes dos novos módulos

---

**Boa sorte! 🚀**
