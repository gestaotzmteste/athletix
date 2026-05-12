-- Adicionar campos de custo e margem na tabela products
ALTER TABLE products ADD COLUMN IF NOT EXISTS cost_price DECIMAL(10, 2) DEFAULT 0;
ALTER TABLE products ADD COLUMN IF NOT EXISTS profit_margin DECIMAL(5, 2) GENERATED ALWAYS AS (
  CASE 
    WHEN cost_price > 0 THEN ((price - cost_price) / cost_price * 100)
    ELSE 0
  END
) STORED;

-- Criar tabela de movimentações de estoque
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

-- Criar tabela de vendas
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

-- Índices
CREATE INDEX IF NOT EXISTS idx_stock_movements_product_id ON stock_movements(product_id);
CREATE INDEX IF NOT EXISTS idx_stock_movements_type ON stock_movements(type);
CREATE INDEX IF NOT EXISTS idx_stock_movements_created_at ON stock_movements(created_at);
CREATE INDEX IF NOT EXISTS idx_sales_product_id ON sales(product_id);
CREATE INDEX IF NOT EXISTS idx_sales_created_at ON sales(created_at);

-- RLS para stock_movements
ALTER TABLE stock_movements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Stock movements are viewable by authenticated users" ON stock_movements
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Stock movements can be inserted by authenticated users" ON stock_movements
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Stock movements can be updated by authenticated users" ON stock_movements
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Stock movements can be deleted by authenticated users" ON stock_movements
  FOR DELETE USING (auth.role() = 'authenticated');

-- RLS para sales
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Sales are viewable by authenticated users" ON sales
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Sales can be inserted by authenticated users" ON sales
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Sales can be updated by authenticated users" ON sales
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Sales can be deleted by authenticated users" ON sales
  FOR DELETE USING (auth.role() = 'authenticated');

-- Atualizar produtos existentes com preço de custo (exemplo)
UPDATE products SET cost_price = price * 0.6 WHERE cost_price = 0;

-- Dados de exemplo para movimentações de estoque
INSERT INTO stock_movements (product_id, type, quantity, reason, notes)
SELECT id, 'entrada', 50, 'Estoque inicial', 'Primeira entrada de estoque'
FROM products
LIMIT 3;

-- Dados de exemplo para vendas
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
