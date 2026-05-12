# Guia de Configuração do Supabase

Este guia detalha como configurar o Supabase para o projeto Atlética SaaS.

## 1. Criar Conta e Projeto

1. Acesse [supabase.com](https://supabase.com)
2. Clique em "Start your project"
3. Faça login com GitHub (recomendado)
4. Clique em "New Project"
5. Preencha:
   - **Name**: atletica-saas (ou nome de sua preferência)
   - **Database Password**: Crie uma senha forte (guarde-a!)
   - **Region**: Escolha a região mais próxima (ex: South America - São Paulo)
   - **Pricing Plan**: Free (suficiente para MVP)
6. Clique em "Create new project"
7. Aguarde 2-3 minutos enquanto o projeto é criado

## 2. Configurar o Banco de Dados

### 2.1. Executar o Schema

1. No painel do Supabase, vá em **SQL Editor** (ícone de banco de dados na sidebar)
2. Clique em "+ New query"
3. Copie todo o conteúdo do arquivo `supabase/schema.sql`
4. Cole no editor SQL
5. Clique em "Run" (ou pressione Ctrl/Cmd + Enter)
6. Você verá "Success. No rows returned" - isso é normal!

### 2.2. (Opcional) Inserir Dados de Exemplo

1. Ainda no SQL Editor, clique em "+ New query"
2. Copie todo o conteúdo do arquivo `supabase/seed.sql`
3. Cole no editor SQL
4. Clique em "Run"
5. Você verá mensagens de sucesso para cada inserção

## 3. Configurar Autenticação

### 3.1. Configurações de Email

1. Vá em **Authentication** > **Providers** > **Email**
2. Certifique-se que "Enable Email provider" está ativado
3. Em **Email Templates**, você pode personalizar os emails de:
   - Confirmação de cadastro
   - Recuperação de senha
   - Mudança de email

### 3.2. Configurações de URL (Importante para produção)

1. Vá em **Authentication** > **URL Configuration**
2. Configure:
   - **Site URL**: `http://localhost:3000` (desenvolvimento) ou sua URL de produção
   - **Redirect URLs**: Adicione:
     - `http://localhost:3000/**` (desenvolvimento)
     - `https://seu-dominio.com/**` (produção)

## 4. Obter Credenciais

1. Vá em **Project Settings** (ícone de engrenagem na sidebar)
2. Clique em **API**
3. Você verá:
   - **Project URL**: Sua URL do Supabase
   - **Project API keys**:
     - `anon` `public`: Chave pública (pode ser exposta no frontend)
     - `service_role` `secret`: Chave secreta (NUNCA exponha!)

### 4.1. Copiar para o Projeto

1. Copie a **Project URL**
2. Copie a chave **anon public**
3. No seu projeto, edite o arquivo `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=sua-project-url-aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key-aqui
```

## 5. Verificar Tabelas

1. Vá em **Table Editor** (ícone de tabela na sidebar)
2. Você deve ver as seguintes tabelas:
   - `roles`
   - `members`
   - `finances`
   - `events`
   - `products`

3. Clique em cada tabela para verificar:
   - Colunas criadas corretamente
   - Dados de exemplo (se executou o seed)

## 6. Verificar RLS (Row Level Security)

1. Vá em **Authentication** > **Policies**
2. Selecione cada tabela e verifique que as políticas foram criadas:
   - SELECT policy
   - INSERT policy
   - UPDATE policy
   - DELETE policy

## 7. Testar Autenticação

1. Inicie o projeto: `npm run dev`
2. Acesse `http://localhost:3000`
3. Clique em "Começar Grátis" ou "Cadastre-se"
4. Crie uma conta com seu email
5. Verifique no Supabase:
   - Vá em **Authentication** > **Users**
   - Você deve ver seu usuário criado

## 8. Configurações Adicionais (Opcional)

### 8.1. Desabilitar Confirmação de Email (Desenvolvimento)

Para facilitar o desenvolvimento, você pode desabilitar a confirmação de email:

1. Vá em **Authentication** > **Providers** > **Email**
2. Desative "Confirm email"
3. Salve

**IMPORTANTE**: Reative isso em produção!

### 8.2. Configurar Storage (Para upload de imagens)

Se quiser adicionar upload de imagens de produtos:

1. Vá em **Storage**
2. Clique em "Create a new bucket"
3. Nome: `products`
4. Deixe público se quiser que as imagens sejam acessíveis
5. Configure políticas de acesso conforme necessário

## 9. Monitoramento

### 9.1. Logs

- **Logs** > **Postgres Logs**: Logs do banco de dados
- **Logs** > **Auth Logs**: Logs de autenticação

### 9.2. Uso

- **Project Settings** > **Usage**: Monitore o uso do seu plano gratuito
  - Database size
  - Bandwidth
  - Monthly Active Users

## 10. Backup (Recomendado)

1. Vá em **Database** > **Backups**
2. O plano gratuito tem backups automáticos por 7 dias
3. Você pode fazer backup manual:
   - Clique em "Create backup"
   - Ou exporte via SQL Editor

## Troubleshooting

### Erro: "Invalid API key"
- Verifique se copiou a chave correta (anon public)
- Verifique se não há espaços extras no .env.local
- Reinicie o servidor de desenvolvimento

### Erro: "Failed to fetch"
- Verifique se a URL do Supabase está correta
- Verifique sua conexão com a internet
- Verifique se o projeto Supabase está ativo

### Erro: "Row Level Security"
- Verifique se as políticas RLS foram criadas corretamente
- Execute novamente o schema.sql se necessário

### Usuário não consegue fazer login
- Verifique se o email foi confirmado (ou se a confirmação está desabilitada)
- Verifique os Auth Logs no Supabase
- Tente resetar a senha

## Recursos Úteis

- [Documentação do Supabase](https://supabase.com/docs)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase + Next.js](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)

## Suporte

Se tiver problemas:
1. Verifique a [documentação oficial](https://supabase.com/docs)
2. Acesse o [Discord do Supabase](https://discord.supabase.com)
3. Verifique os [exemplos no GitHub](https://github.com/supabase/supabase/tree/master/examples)
