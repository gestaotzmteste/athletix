-- ============================================
-- FIX: Políticas RLS para tabela roles
-- Problema: Erro ao criar cargos devido a RLS
-- ============================================

-- Habilitar RLS na tabela roles
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;

-- Política para SELECT (visualizar cargos)
CREATE POLICY "Roles are viewable by authenticated users" ON roles
  FOR SELECT USING (auth.role() = 'authenticated');

-- Política para INSERT (criar cargos)
CREATE POLICY "Roles can be inserted by authenticated users" ON roles
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Política para UPDATE (atualizar cargos)
CREATE POLICY "Roles can be updated by authenticated users" ON roles
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Política para DELETE (deletar cargos)
-- Apenas cargos personalizados podem ser deletados (não admin, diretor, membro)
CREATE POLICY "Roles can be deleted by authenticated users" ON roles
  FOR DELETE USING (
    auth.role() = 'authenticated' 
    AND name NOT IN ('admin', 'diretor', 'membro')
  );

-- ============================================
-- FIM DO FIX
-- ============================================
