# 🏗️ Arquitetura do Projeto

Este documento descreve a arquitetura técnica do Atlética SaaS.

## 📊 Visão Geral

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (Next.js)                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Pages      │  │  Components  │  │    Hooks     │  │
│  │  (App Dir)   │  │   (React)    │  │   (React)    │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│                          │                               │
│                          ▼                               │
│  ┌─────────────────────────────────────────────────┐   │
│  │         Supabase Client (Browser/Server)        │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                  BACKEND (Supabase)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  PostgreSQL  │  │     Auth     │  │     RLS      │  │
│  │  (Database)  │  │ (Autenticação)│  │  (Segurança) │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
```

## 📁 Estrutura de Diretórios

```
atletica-saas/
│
├── app/                          # Next.js App Router
│   ├── dashboard/               # Área autenticada
│   │   ├── members/            # Módulo de membros
│   │   │   └── page.tsx        # Página de membros
│   │   ├── finances/           # Módulo financeiro
│   │   │   └── page.tsx        # Página de finanças
│   │   ├── events/             # Módulo de eventos
│   │   │   └── page.tsx        # Página de eventos
│   │   ├── products/           # Módulo de produtos
│   │   │   └── page.tsx        # Página de produtos
│   │   ├── layout.tsx          # Layout do dashboard
│   │   └── page.tsx            # Dashboard principal
│   ├── login/                   # Autenticação
│   │   └── page.tsx            # Página de login
│   ├── signup/                  # Cadastro
│   │   └── page.tsx            # Página de signup
│   ├── globals.css             # Estilos globais
│   ├── layout.tsx              # Layout raiz
│   └── page.tsx                # Landing page
│
├── components/                  # Componentes React
│   ├── ui/                     # Componentes shadcn/ui
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── ...
│   └── sidebar.tsx             # Sidebar de navegação
│
├── lib/                         # Bibliotecas e utilitários
│   ├── supabase/               # Configuração Supabase
│   │   ├── client.ts           # Cliente browser
│   │   ├── server.ts           # Cliente server
│   │   └── middleware.ts       # Middleware auth
│   └── utils.ts                # Utilitários gerais
│
├── supabase/                    # SQL Scripts
│   ├── schema.sql              # Schema do banco
│   └── seed.sql                # Dados de exemplo
│
├── types/                       # Tipos TypeScript
│   └── database.ts             # Tipos do banco
│
├── public/                      # Arquivos estáticos
│   └── ...
│
├── middleware.ts                # Middleware Next.js
├── next.config.js              # Config Next.js
├── tailwind.config.ts          # Config Tailwind
├── tsconfig.json               # Config TypeScript
├── package.json                # Dependências
├── .env.local                  # Variáveis de ambiente (local)
├── .env.example                # Exemplo de .env
└── .gitignore                  # Git ignore
```

## 🔄 Fluxo de Dados

### 1. Autenticação

```
┌─────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│ Usuário │────▶│  Login   │────▶│ Supabase │────▶│   JWT    │
│         │     │  Page    │     │   Auth   │     │  Token   │
└─────────┘     └──────────┘     └──────────┘     └──────────┘
                                        │
                                        ▼
                                  ┌──────────┐
                                  │ Cookies  │
                                  │ (Session)│
                                  └──────────┘
```

### 2. Requisição Autenticada

```
┌─────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│ Usuário │────▶│   Page   │────▶│Middleware│────▶│ Supabase │
│         │     │          │     │  (Auth)  │     │   API    │
└─────────┘     └──────────┘     └──────────┘     └──────────┘
                                        │
                                        ▼
                                  ┌──────────┐
                                  │   RLS    │
                                  │  Check   │
                                  └──────────┘
                                        │
                                        ▼
                                  ┌──────────┐
                                  │   Data   │
                                  │ Response │
                                  └──────────┘
```

### 3. CRUD Operation

```
┌─────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│ Usuário │────▶│Component │────▶│ Supabase │────▶│PostgreSQL│
│ Action  │     │ Handler  │     │  Client  │     │ Database │
└─────────┘     └──────────┘     └──────────┘     └──────────┘
                                        │
                                        ▼
                                  ┌──────────┐
                                  │   RLS    │
                                  │Validation│
                                  └──────────┘
                                        │
                                        ▼
                                  ┌──────────┐
                                  │  Update  │
                                  │   UI     │
                                  └──────────┘
```

## 🎨 Camadas da Aplicação

### 1. Camada de Apresentação (UI)

**Responsabilidade**: Interface do usuário

**Tecnologias**:
- React 19
- Tailwind CSS
- shadcn/ui
- Lucide React

**Componentes**:
- Pages (app/)
- Components (components/)
- Layouts

### 2. Camada de Lógica (Business Logic)

**Responsabilidade**: Regras de negócio

**Localização**:
- Handlers em componentes
- Hooks customizados
- Utilitários (lib/)

**Exemplos**:
- Validação de formulários
- Cálculos financeiros
- Formatação de dados

### 3. Camada de Dados (Data Layer)

**Responsabilidade**: Acesso a dados

**Tecnologias**:
- Supabase Client
- PostgreSQL

**Operações**:
- CRUD operations
- Queries
- Mutations

### 4. Camada de Segurança

**Responsabilidade**: Autenticação e autorização

**Componentes**:
- Middleware Next.js
- Supabase Auth
- Row Level Security

## 🔐 Segurança

### Autenticação

```typescript
// Fluxo de autenticação
User Input → Supabase Auth → JWT Token → Cookies → Session
```

### Autorização (RLS)

```sql
-- Exemplo de política RLS
CREATE POLICY "Users can only see their data"
ON members FOR SELECT
USING (auth.uid() = user_id);
```

### Middleware

```typescript
// middleware.ts
export async function middleware(request: NextRequest) {
  // Verifica autenticação
  // Redireciona se não autenticado
  // Atualiza sessão
}
```

## 📊 Banco de Dados

### Schema

```
┌─────────────┐
│    roles    │
│─────────────│
│ id (PK)     │
│ name        │
└─────────────┘
       │
       │ 1:N
       ▼
┌─────────────┐
│   members   │
│─────────────│
│ id (PK)     │
│ user_id (FK)│
│ role_id (FK)│
│ name        │
│ email       │
│ ...         │
└─────────────┘

┌─────────────┐
│  finances   │
│─────────────│
│ id (PK)     │
│ type        │
│ amount      │
│ ...         │
└─────────────┘

┌─────────────┐
│   events    │
│─────────────│
│ id (PK)     │
│ name        │
│ date        │
│ ...         │
└─────────────┘

┌─────────────┐
│  products   │
│─────────────│
│ id (PK)     │
│ name        │
│ price       │
│ ...         │
└─────────────┘
```

### Relacionamentos

- `members.role_id` → `roles.id` (N:1)
- `members.user_id` → `auth.users.id` (1:1)
- Todas as tabelas têm `created_by` → `auth.users.id` (N:1)

## 🚀 Renderização

### Server Components (Padrão)

```typescript
// app/dashboard/page.tsx
export default async function DashboardPage() {
  // Busca dados no servidor
  const data = await getDashboardData()
  
  // Renderiza no servidor
  return <Dashboard data={data} />
}
```

**Vantagens**:
- SEO melhor
- Performance inicial
- Menos JavaScript no cliente

### Client Components

```typescript
// app/dashboard/members/page.tsx
'use client'

export default function MembersPage() {
  // Interatividade no cliente
  const [members, setMembers] = useState([])
  
  return <MembersList members={members} />
}
```

**Quando usar**:
- Interatividade (useState, useEffect)
- Event handlers
- Browser APIs

## 🔄 Estado

### Estado Local

```typescript
// Componente específico
const [isOpen, setIsOpen] = useState(false)
```

### Estado do Servidor

```typescript
// Supabase como fonte da verdade
const { data } = await supabase.from('members').select('*')
```

### Sincronização

```typescript
// Atualizar UI após mutação
await supabase.from('members').insert(newMember)
loadMembers() // Recarrega dados
```

## 📡 API Routes

### Supabase como Backend

Não usamos API Routes do Next.js. Toda comunicação é direta com Supabase:

```typescript
// Cliente
const supabase = createClient()
const { data } = await supabase.from('members').select('*')
```

### Vantagens

- Menos código
- Menos latência
- RLS automático
- Real-time capabilities

## 🎯 Padrões de Design

### 1. Container/Presenter

```typescript
// Container (lógica)
function MembersContainer() {
  const [members, setMembers] = useState([])
  // ... lógica
  return <MembersList members={members} />
}

// Presenter (UI)
function MembersList({ members }) {
  return <div>{/* UI */}</div>
}
```

### 2. Hooks Customizados

```typescript
// hooks/useMembers.ts
export function useMembers() {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  
  // ... lógica
  
  return { members, loading, refresh }
}
```

### 3. Composition

```typescript
// Componentes compostos
<Card>
  <CardHeader>
    <CardTitle>Título</CardTitle>
  </CardHeader>
  <CardContent>
    Conteúdo
  </CardContent>
</Card>
```

## 🔧 Configuração

### Next.js

```javascript
// next.config.js
module.exports = {
  reactStrictMode: true,
  // ... outras configs
}
```

### Tailwind

```javascript
// tailwind.config.ts
export default {
  content: ['./app/**/*.{ts,tsx}'],
  // ... outras configs
}
```

### TypeScript

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

## 📦 Build e Deploy

### Build Process

```
Source Code → TypeScript Compiler → Next.js Build → Static Assets
```

### Deploy na Vercel

```
Git Push → Vercel CI → Build → Deploy → Live
```

### Variáveis de Ambiente

```
Development: .env.local
Production: Vercel Dashboard
```

## 🔍 Monitoramento

### Logs

- **Vercel**: Logs de build e runtime
- **Supabase**: Logs de queries e auth

### Métricas

- **Vercel Analytics**: Pageviews, performance
- **Supabase Dashboard**: Database usage, API calls

## 🚀 Performance

### Otimizações

1. **Server Components**: Renderização no servidor
2. **Code Splitting**: Automático pelo Next.js
3. **Image Optimization**: Next.js Image component
4. **Database Indexes**: Queries otimizadas
5. **Caching**: Headers de cache apropriados

### Métricas Alvo

- **FCP**: < 1.5s
- **LCP**: < 2.5s
- **TTI**: < 3.5s
- **CLS**: < 0.1

## 🔄 Escalabilidade

### Horizontal

- **Vercel**: Escala automaticamente
- **Supabase**: Upgrade de plano conforme necessário

### Vertical

- **Database**: Otimização de queries
- **Frontend**: Code splitting, lazy loading

## 📚 Referências

- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [React Docs](https://react.dev)
- [TypeScript Docs](https://www.typescriptlang.org/docs)

---

**Última atualização**: Maio 2026
