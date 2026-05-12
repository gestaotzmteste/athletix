# 🔧 Correção: Erro ao Criar Cargos

## ❌ Erro
```
Erro ao criar cargo: new row violates row-level security policy for table "roles"
```

## 🔍 Causa
A tabela `roles` tem Row Level Security (RLS) habilitado, mas **não tem políticas configuradas**. Isso impede qualquer operação de INSERT, UPDATE ou DELETE.

## ✅ Solução

### Opção 1: Executar SQL no Supabase (RECOMENDADO)

1. **Acesse o Supabase**
   - URL: https://supabase.com/dashboard/project/xajsybcyuujtvyoxdykd

2. **Vá para SQL Editor**
   - Menu lateral → SQL Editor
   - Clique em "+ New query"

3. **Execute o SQL de Correção**
   - Copie o conteúdo de: `atletica-saas/supabase/fix_roles_rls.sql`
   - Cole no editor
   - Clique em "Run" ou Ctrl+Enter

4. **Verifique**
   - Deve aparecer: "Success. No rows returned"
   - Tente criar um cargo novamente

### Opção 2: SQL Direto (Copie e Cole)

```sql
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
-- Apenas cargos personalizados podem ser deletados
CREATE POLICY "Roles can be deleted by authenticated users" ON roles
  FOR DELETE USING (
    auth.role() = 'authenticated' 
    AND name NOT IN ('admin', 'diretor', 'membro')
  );
```

---

## 🧪 Teste

Após executar o SQL:

1. **Recarregue a página** do painel Admin
2. **Tente criar um cargo**:
   - Nome: "Tesoureiro"
   - Clique em "Criar Cargo"
3. **Deve funcionar!** ✅

---

## 📊 O que foi corrigido?

### Antes (❌ Erro)
```
roles table
├── RLS: Enabled
└── Policies: NENHUMA ❌
    └── Resultado: Todas operações bloqueadas
```

### Depois (✅ Funcionando)
```
roles table
├── RLS: Enabled
└── Policies: 4 políticas ✅
    ├── SELECT: Usuários autenticados podem ver
    ├── INSERT: Usuários autenticados podem criar
    ├── UPDATE: Usuários autenticados podem atualizar
    └── DELETE: Usuários autenticados podem deletar
                (exceto admin, diretor, membro)
```

---

## 🔐 Segurança

As políticas garantem que:

✅ Apenas usuários **autenticados** podem gerenciar cargos  
✅ Cargos do sistema (**admin**, **diretor**, **membro**) **não podem ser deletados**  
✅ Cargos personalizados podem ser criados e deletados livremente  

---

## 🆘 Se ainda der erro

### Erro: "policy already exists"
**Solução**: Tudo bem! Significa que já foi executado. Pode ignorar.

### Erro: "permission denied"
**Solução**: Certifique-se de estar logado no Supabase com a conta correta.

### Erro: "relation does not exist"
**Solução**: Execute primeiro o schema principal: `supabase/schema.sql`

### Ainda não funciona?
1. Verifique se você está **logado** no sistema
2. Tente fazer **logout e login** novamente
3. Limpe o cache do navegador (Ctrl+Shift+R)
4. Verifique o console do navegador (F12) para mais detalhes

---

## 📝 Nota Técnica

Este erro acontece porque o schema original (`schema.sql`) não incluiu políticas RLS para a tabela `roles`. As outras tabelas (members, finances, events, products) já têm políticas configuradas e funcionam corretamente.

---

## ✅ Checklist

- [ ] Executar `fix_roles_rls.sql` no Supabase
- [ ] Recarregar página do Admin
- [ ] Testar criar cargo
- [ ] Testar deletar cargo personalizado
- [ ] Verificar que cargos do sistema não podem ser deletados

---

**Tempo estimado**: 1 minuto  
**Dificuldade**: Fácil (copiar e colar)

🎉 **Pronto! Agora você pode criar cargos personalizados!**
