# 🚀 Guia Rápido de Início

Siga estes passos para ter o projeto rodando em menos de 10 minutos!

## ✅ Checklist Rápida

- [ ] Node.js 18+ instalado
- [ ] Conta no Supabase criada
- [ ] Projeto Supabase configurado
- [ ] Variáveis de ambiente configuradas
- [ ] Dependências instaladas
- [ ] Projeto rodando!

## 📋 Passo a Passo

### 1. Instalar Dependências (2 min)

```bash
cd atletica-saas
npm install
```

### 2. Configurar Supabase (5 min)

#### 2.1. Criar Projeto
1. Acesse [supabase.com](https://supabase.com)
2. Crie um novo projeto
3. Aguarde a criação (2-3 min)

#### 2.2. Executar Schema
1. Vá em **SQL Editor**
2. Copie e cole o conteúdo de `supabase/schema.sql`
3. Clique em "Run"

#### 2.3. (Opcional) Dados de Exemplo
1. No SQL Editor, nova query
2. Copie e cole o conteúdo de `supabase/seed.sql`
3. Clique em "Run"

### 3. Configurar Variáveis de Ambiente (1 min)

```bash
# Copie o arquivo de exemplo
cp .env.example .env.local
```

Edite `.env.local` e adicione suas credenciais:

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-aqui
```

**Onde encontrar:**
- Supabase → Project Settings → API
- Copie "Project URL" e "anon public key"

### 4. Rodar o Projeto (1 min)

```bash
npm run dev
```

Acesse: [http://localhost:3000](http://localhost:3000)

## 🎉 Pronto!

Agora você pode:

1. **Criar uma conta**: Clique em "Começar Grátis"
2. **Fazer login**: Use o email e senha cadastrados
3. **Explorar o dashboard**: Veja as métricas principais
4. **Adicionar membros**: Vá em "Membros" e clique em "Novo Membro"
5. **Registrar finanças**: Acesse "Financeiro" e adicione receitas/despesas
6. **Criar eventos**: Em "Eventos", cadastre seus eventos
7. **Adicionar produtos**: Na "Loja", cadastre produtos

## 🔧 Comandos Úteis

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Rodar produção localmente
npm run start

# Lint
npm run lint
```

## 📱 Testando Funcionalidades

### Criar Primeiro Membro
1. Login no sistema
2. Vá em "Membros"
3. Clique em "Novo Membro"
4. Preencha os dados
5. Selecione um cargo (admin/diretor/membro)
6. Salve

### Registrar Primeira Transação
1. Vá em "Financeiro"
2. Clique em "Nova Transação"
3. Escolha tipo (Receita/Despesa)
4. Preencha categoria, valor e data
5. Salve

### Criar Primeiro Evento
1. Vá em "Eventos"
2. Clique em "Novo Evento"
3. Preencha nome, data, local
4. Defina limite de participantes (opcional)
5. Salve

### Adicionar Primeiro Produto
1. Vá em "Loja"
2. Clique em "Novo Produto"
3. Preencha nome, preço, estoque
4. Adicione URL de imagem (opcional)
5. Salve

## 🐛 Problemas Comuns

### Erro ao conectar com Supabase
- ✅ Verifique se as credenciais estão corretas no `.env.local`
- ✅ Reinicie o servidor (`Ctrl+C` e `npm run dev` novamente)
- ✅ Verifique se o projeto Supabase está ativo

### Página em branco após login
- ✅ Verifique se executou o `schema.sql` no Supabase
- ✅ Verifique o console do navegador (F12) para erros
- ✅ Verifique se as políticas RLS foram criadas

### Não consigo criar registros
- ✅ Verifique se está logado
- ✅ Verifique as políticas RLS no Supabase
- ✅ Verifique os logs no Supabase (Logs → Postgres Logs)

## 📚 Próximos Passos

1. ✅ Leia o [README.md](README.md) completo
2. ✅ Veja o [SUPABASE_SETUP.md](SUPABASE_SETUP.md) para configurações avançadas
3. ✅ Personalize o design conforme sua atlética
4. ✅ Adicione o logo da sua atlética
5. ✅ Configure o domínio personalizado
6. ✅ Faça deploy na Vercel

## 🚀 Deploy Rápido na Vercel

1. Faça push do código para o GitHub
2. Acesse [vercel.com](https://vercel.com)
3. Importe o repositório
4. Adicione as variáveis de ambiente
5. Deploy!

## 💡 Dicas

- Use dados de exemplo (seed.sql) para testar
- Explore todas as funcionalidades antes de usar em produção
- Personalize as cores no Tailwind conforme sua atlética
- Adicione o logo da sua atlética na sidebar
- Configure emails personalizados no Supabase

## 🆘 Precisa de Ajuda?

- 📖 Leia a [documentação completa](README.md)
- 🔧 Veja o [guia do Supabase](SUPABASE_SETUP.md)
- 💬 Abra uma issue no GitHub
- 📧 Entre em contato com o suporte

---

**Tempo total estimado: 10 minutos** ⏱️

Boa sorte com sua atlética! 🎓⚽
