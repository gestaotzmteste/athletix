# 🔐 Sistema de Permissões

Este documento explica como funciona o sistema de permissões do Atlética SaaS.

## 📊 Níveis de Acesso

O sistema possui 3 níveis de permissão:

### 1. 👑 Admin (Administrador)
**Acesso Total** - Pode fazer tudo no sistema

**Permissões:**
- ✅ Gerenciar todos os membros (criar, editar, excluir)
- ✅ Gerenciar finanças (receitas e despesas)
- ✅ Gerenciar eventos (criar, editar, excluir)
- ✅ Gerenciar produtos da loja
- ✅ Visualizar dashboard completo
- ✅ Alterar permissões de outros usuários
- ✅ Acesso a todas as funcionalidades

**Casos de Uso:**
- Presidente da atlética
- Vice-presidente
- Tesoureiro geral

### 2. 📋 Diretor
**Acesso Gerencial** - Pode gerenciar áreas específicas

**Permissões:**
- ✅ Visualizar todos os membros
- ✅ Editar membros (não pode excluir)
- ✅ Gerenciar eventos
- ✅ Gerenciar produtos
- ✅ Visualizar finanças (somente leitura)
- ✅ Visualizar dashboard
- ❌ Não pode alterar permissões
- ❌ Não pode excluir membros
- ❌ Não pode criar/editar transações financeiras

**Casos de Uso:**
- Diretor de eventos
- Diretor de marketing
- Diretor de esportes
- Coordenador de loja

### 3. 👤 Membro
**Acesso Básico** - Visualização limitada

**Permissões:**
- ✅ Visualizar eventos
- ✅ Visualizar produtos da loja
- ✅ Ver informações básicas do dashboard
- ❌ Não pode gerenciar membros
- ❌ Não pode acessar finanças
- ❌ Não pode criar/editar eventos
- ❌ Não pode gerenciar produtos

**Casos de Uso:**
- Membros regulares da atlética
- Atletas
- Colaboradores

## 🔧 Implementação Técnica

### Banco de Dados

```sql
-- Tabela de roles
CREATE TABLE roles (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL UNIQUE -- 'admin', 'diretor', 'membro'
);

-- Tabela de membros com role
CREATE TABLE members (
  id UUID PRIMARY KEY,
  role_id UUID REFERENCES roles(id),
  -- outros campos...
);
```

### Row Level Security (RLS)

Atualmente, todas as políticas RLS permitem acesso para usuários autenticados:

```sql
-- Exemplo de política atual
CREATE POLICY "Members are viewable by authenticated users" 
ON members FOR SELECT 
USING (auth.role() = 'authenticated');
```

### Próximas Implementações

Para implementar controle granular de permissões, você pode:

#### 1. Adicionar Função Helper no Supabase

```sql
-- Função para verificar role do usuário
CREATE OR REPLACE FUNCTION get_user_role(user_id UUID)
RETURNS TEXT AS $$
  SELECT r.name 
  FROM members m
  JOIN roles r ON m.role_id = r.id
  WHERE m.user_id = user_id
  LIMIT 1;
$$ LANGUAGE SQL SECURITY DEFINER;
```

#### 2. Atualizar Políticas RLS

```sql
-- Exemplo: Apenas admins podem deletar membros
CREATE POLICY "Only admins can delete members"
ON members FOR DELETE
USING (get_user_role(auth.uid()) = 'admin');

-- Exemplo: Diretores e admins podem editar eventos
CREATE POLICY "Admins and directors can edit events"
ON events FOR UPDATE
USING (
  get_user_role(auth.uid()) IN ('admin', 'diretor')
);

-- Exemplo: Apenas admins podem gerenciar finanças
CREATE POLICY "Only admins can manage finances"
ON finances FOR ALL
USING (get_user_role(auth.uid()) = 'admin');
```

#### 3. Implementar no Frontend

```typescript
// hooks/useUserRole.ts
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export function useUserRole() {
  const [role, setRole] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function loadRole() {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        const { data } = await supabase
          .from('members')
          .select('roles(name)')
          .eq('user_id', user.id)
          .single()
        
        setRole(data?.roles?.name || null)
      }
      
      setLoading(false)
    }
    
    loadRole()
  }, [])

  return { 
    role, 
    loading,
    isAdmin: role === 'admin',
    isDiretor: role === 'diretor',
    isMembro: role === 'membro'
  }
}
```

#### 4. Proteger Componentes

```typescript
// components/ProtectedButton.tsx
import { useUserRole } from '@/hooks/useUserRole'

export function DeleteButton({ onDelete }: { onDelete: () => void }) {
  const { isAdmin } = useUserRole()
  
  if (!isAdmin) return null
  
  return (
    <button onClick={onDelete}>
      Excluir
    </button>
  )
}
```

## 🎯 Casos de Uso Práticos

### Cenário 1: Gestão de Eventos
```
Admin: Pode criar, editar e excluir qualquer evento
Diretor: Pode criar e editar eventos, mas não excluir
Membro: Apenas visualiza eventos
```

### Cenário 2: Controle Financeiro
```
Admin: Acesso total (criar receitas/despesas, ver relatórios)
Diretor: Apenas visualização (ver saldo e transações)
Membro: Sem acesso
```

### Cenário 3: Gestão de Membros
```
Admin: Pode adicionar, editar, excluir e alterar permissões
Diretor: Pode visualizar e editar informações básicas
Membro: Apenas visualiza lista de membros
```

### Cenário 4: Loja de Produtos
```
Admin: Gestão completa (adicionar, editar, excluir produtos)
Diretor: Pode gerenciar produtos (adicionar, editar)
Membro: Apenas visualiza produtos
```

## 🔄 Fluxo de Atribuição de Permissões

1. **Novo Usuário se Cadastra**
   - Cria conta no sistema
   - Por padrão, não tem role atribuída

2. **Admin Cria Membro**
   - Admin acessa "Membros"
   - Cria novo membro
   - Seleciona role (admin/diretor/membro)
   - Associa ao user_id do usuário

3. **Usuário Ganha Acesso**
   - Ao fazer login, sistema verifica role
   - Libera funcionalidades conforme permissão
   - Esconde/mostra botões e menus

## 🛡️ Boas Práticas de Segurança

### 1. Validação em Múltiplas Camadas
```
Frontend (UX) → Middleware (Routing) → RLS (Database)
```

### 2. Princípio do Menor Privilégio
- Sempre atribua a menor permissão necessária
- Promova usuários apenas quando necessário
- Revise permissões periodicamente

### 3. Auditoria
```sql
-- Adicionar campos de auditoria
ALTER TABLE members ADD COLUMN updated_by UUID REFERENCES auth.users(id);
ALTER TABLE finances ADD COLUMN created_by UUID REFERENCES auth.users(id);
```

### 4. Logs de Ações Sensíveis
```typescript
// Registrar ações importantes
await supabase.from('audit_logs').insert({
  user_id: user.id,
  action: 'delete_member',
  target_id: memberId,
  timestamp: new Date()
})
```

## 📝 Checklist de Implementação

Para implementar controle completo de permissões:

- [ ] Criar função `get_user_role()` no Supabase
- [ ] Atualizar políticas RLS por tabela
- [ ] Criar hook `useUserRole()` no frontend
- [ ] Proteger rotas com middleware
- [ ] Esconder/mostrar botões conforme role
- [ ] Adicionar mensagens de erro apropriadas
- [ ] Testar cada nível de permissão
- [ ] Documentar mudanças

## 🧪 Testando Permissões

### Criar Usuários de Teste

```sql
-- No Supabase SQL Editor
-- Após criar usuários via signup, associe roles:

-- Usuário Admin
INSERT INTO members (user_id, name, email, role_id)
VALUES (
  'user-uuid-aqui',
  'Admin Teste',
  'admin@teste.com',
  (SELECT id FROM roles WHERE name = 'admin')
);

-- Usuário Diretor
INSERT INTO members (user_id, name, email, role_id)
VALUES (
  'user-uuid-aqui',
  'Diretor Teste',
  'diretor@teste.com',
  (SELECT id FROM roles WHERE name = 'diretor')
);

-- Usuário Membro
INSERT INTO members (user_id, name, email, role_id)
VALUES (
  'user-uuid-aqui',
  'Membro Teste',
  'membro@teste.com',
  (SELECT id FROM roles WHERE name = 'membro')
);
```

### Matriz de Testes

| Ação | Admin | Diretor | Membro |
|------|-------|---------|--------|
| Ver Dashboard | ✅ | ✅ | ✅ |
| Ver Membros | ✅ | ✅ | ❌ |
| Criar Membro | ✅ | ❌ | ❌ |
| Editar Membro | ✅ | ✅ | ❌ |
| Excluir Membro | ✅ | ❌ | ❌ |
| Ver Finanças | ✅ | ✅ (read) | ❌ |
| Criar Transação | ✅ | ❌ | ❌ |
| Ver Eventos | ✅ | ✅ | ✅ |
| Criar Evento | ✅ | ✅ | ❌ |
| Editar Evento | ✅ | ✅ | ❌ |
| Excluir Evento | ✅ | ❌ | ❌ |
| Ver Produtos | ✅ | ✅ | ✅ |
| Criar Produto | ✅ | ✅ | ❌ |
| Editar Produto | ✅ | ✅ | ❌ |
| Excluir Produto | ✅ | ❌ | ❌ |

## 🚀 Evolução Futura

### Permissões Granulares
- Permissões por módulo
- Permissões customizadas
- Grupos de permissões

### Recursos Avançados
- Aprovação de ações (workflow)
- Delegação temporária de permissões
- Histórico de mudanças de permissões
- Notificações de ações sensíveis

---

**Nota**: O MVP atual implementa autenticação básica. As permissões granulares podem ser implementadas conforme a necessidade da sua atlética.
