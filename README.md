# Atlética SaaS - Sistema de Gestão para Atléticas Universitárias

MVP de SaaS moderno e funcional para gerenciamento completo de atléticas universitárias.

## 🚀 Stack Tecnológica

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Supabase (PostgreSQL + Auth)
- **Deploy**: Vercel

## ✨ Funcionalidades

### 1. Autenticação
- Login e cadastro de usuários
- Recuperação de senha
- Sessão persistente com Supabase Auth

### 2. Dashboard Administrativo
- Visão geral com métricas principais
- Total de membros
- Saldo financeiro
- Próximos eventos
- Produtos vendidos

### 3. Gestão de Membros
- CRUD completo de membros
- Campos: nome, email, telefone, curso, cargo, status
- Sistema de permissões (admin, diretor, membro)
- Busca e filtros

### 4. Controle Financeiro
- Registro de receitas e despesas
- Categorização de transações
- Visualização de saldo total
- Relatórios de entradas e saídas

### 5. Gestão de Eventos
- CRUD de eventos
- Informações: nome, descrição, data, local, limite de participantes
- Visualização de eventos passados e futuros
- Controle de participantes

### 6. Loja de Produtos
- CRUD de produtos
- Campos: nome, descrição, preço, estoque, imagem
- Controle de estoque
- Grid visual de produtos

## 📦 Instalação

### Pré-requisitos
- Node.js 18+ instalado
- Conta no Supabase (gratuita)

### Passo 1: Clone e instale dependências

```bash
cd atletica-saas
npm install
```

### Passo 2: Configure o Supabase

1. Crie um projeto no [Supabase](https://supabase.com)
2. No SQL Editor do Supabase, execute o arquivo `supabase/schema.sql`
3. (Opcional) Execute o arquivo `supabase/seed.sql` para dados de exemplo

### Passo 3: Configure as variáveis de ambiente

Copie o arquivo `.env.example` para `.env.local`:

```bash
cp .env.example .env.local
```

Edite `.env.local` e adicione suas credenciais do Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=sua-url-do-supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anonima-do-supabase
```

Você encontra essas informações em: **Project Settings > API** no painel do Supabase.

### Passo 4: Execute o projeto

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

## 🗄️ Estrutura do Banco de Dados

### Tabelas

- **roles**: Cargos/permissões (admin, diretor, membro)
- **members**: Membros da atlética
- **finances**: Receitas e despesas
- **events**: Eventos da atlética
- **products**: Produtos da loja

### Relacionamentos

- `members.role_id` → `roles.id`
- `members.user_id` → `auth.users.id`
- Todas as tabelas têm `created_by` referenciando `auth.users.id`

## 📁 Estrutura do Projeto

```
atletica-saas/
├── app/
│   ├── dashboard/
│   │   ├── members/          # Gestão de membros
│   │   ├── finances/         # Controle financeiro
│   │   ├── events/           # Gestão de eventos
│   │   ├── products/         # Loja de produtos
│   │   ├── layout.tsx        # Layout do dashboard
│   │   └── page.tsx          # Dashboard principal
│   ├── login/                # Página de login
│   ├── signup/               # Página de cadastro
│   └── page.tsx              # Landing page
├── components/
│   ├── ui/                   # Componentes shadcn/ui
│   └── sidebar.tsx           # Sidebar de navegação
├── lib/
│   └── supabase/
│       ├── client.ts         # Cliente Supabase (browser)
│       ├── server.ts         # Cliente Supabase (server)
│       └── middleware.ts     # Middleware de autenticação
├── supabase/
│   ├── schema.sql            # Schema do banco de dados
│   └── seed.sql              # Dados de exemplo
├── types/
│   └── database.ts           # Tipos TypeScript do banco
└── middleware.ts             # Middleware Next.js
```

## 🎨 Design

Interface moderna inspirada em:
- Stripe
- Linear
- Notion

Características:
- Dark mode por padrão
- Sidebar responsiva
- Cards e tabelas modernas
- Totalmente responsivo para mobile

## 🚀 Deploy na Vercel

1. Faça push do código para o GitHub
2. Importe o projeto na [Vercel](https://vercel.com)
3. Configure as variáveis de ambiente:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy automático!

## 🔐 Segurança

- Row Level Security (RLS) habilitado em todas as tabelas
- Autenticação via Supabase Auth
- Middleware protegendo rotas privadas
- Validação de dados no frontend e backend

## 📝 Próximos Passos (Pós-MVP)

- [ ] Sistema de notificações
- [ ] Upload de imagens para produtos
- [ ] Relatórios financeiros avançados
- [ ] Sistema de inscrição em eventos
- [ ] Carrinho de compras para loja
- [ ] Dashboard com gráficos
- [ ] Exportação de dados (PDF, Excel)
- [ ] Sistema de pagamentos integrado

## 🤝 Contribuindo

Este é um MVP focado em simplicidade e funcionalidade. Contribuições são bem-vindas!

## 📄 Licença

MIT

---

Desenvolvido com ❤️ para atléticas universitárias
