-- Adicionar tabela de metas e objetivos
CREATE TABLE IF NOT EXISTS goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  target_value DECIMAL(10, 2),
  current_value DECIMAL(10, 2) DEFAULT 0,
  unit TEXT, -- ex: 'membros', 'reais', 'eventos', '%'
  deadline DATE,
  status TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('not_started', 'in_progress', 'completed', 'cancelled')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  category TEXT NOT NULL, -- ex: 'financeiro', 'membros', 'eventos', 'marketing'
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_goals_status ON goals(status);
CREATE INDEX idx_goals_category ON goals(category);
CREATE INDEX idx_goals_deadline ON goals(deadline);

-- Trigger para updated_at
CREATE TRIGGER update_goals_updated_at BEFORE UPDATE ON goals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Goals are viewable by authenticated users" ON goals
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Goals can be inserted by authenticated users" ON goals
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Goals can be updated by authenticated users" ON goals
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Goals can be deleted by authenticated users" ON goals
  FOR DELETE USING (auth.role() = 'authenticated');

-- Dados de exemplo
INSERT INTO goals (title, description, target_value, current_value, unit, deadline, status, priority, category) VALUES
  ('Alcançar 100 membros ativos', 'Meta de crescimento para o semestre', 100, 45, 'membros', '2026-12-31', 'in_progress', 'high', 'membros'),
  ('Arrecadar R$ 50.000', 'Meta financeira para eventos do ano', 50000, 8500, 'reais', '2026-12-31', 'in_progress', 'high', 'financeiro'),
  ('Realizar 10 eventos', 'Organizar eventos esportivos e sociais', 10, 4, 'eventos', '2026-12-31', 'in_progress', 'medium', 'eventos'),
  ('Aumentar engajamento em 50%', 'Melhorar participação nas redes sociais', 50, 20, '%', '2026-08-31', 'in_progress', 'medium', 'marketing'),
  ('Vender 200 produtos', 'Meta de vendas da loja oficial', 200, 85, 'produtos', '2026-12-31', 'in_progress', 'low', 'loja');
