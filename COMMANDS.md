# 🛠️ Comandos Úteis

Referência rápida de comandos para desenvolvimento e manutenção do projeto.

## 📦 Instalação e Setup

```bash
# Instalar dependências
npm install

# Copiar arquivo de ambiente
cp .env.example .env.local

# Editar variáveis de ambiente
# Windows: notepad .env.local
# Mac/Linux: nano .env.local
```

## 🚀 Desenvolvimento

```bash
# Iniciar servidor de desenvolvimento
npm run dev

# Acessar em: http://localhost:3000
```

## 🏗️ Build e Produção

```bash
# Criar build de produção
npm run build

# Rodar build localmente
npm run start

# Build + Start
npm run build && npm run start
```

## 🧹 Linting e Formatação

```bash
# Rodar ESLint
npm run lint

# Fix automático de problemas
npm run lint -- --fix
```

## 📊 Supabase

### SQL Scripts

```bash
# Executar schema (copie e cole no SQL Editor do Supabase)
# Arquivo: supabase/schema.sql

# Executar seed (copie e cole no SQL Editor do Supabase)
# Arquivo: supabase/seed.sql
```

### Queries Úteis

```sql
-- Ver todos os usuários
SELECT * FROM auth.users;

-- Ver todos os membros
SELECT m.*, r.name as role_name 
FROM members m 
JOIN roles r ON m.role_id = r.id;

-- Ver saldo financeiro
SELECT 
  SUM(CASE WHEN type = 'receita' THEN amount ELSE 0 END) as receitas,
  SUM(CASE WHEN type = 'despesa' THEN amount ELSE 0 END) as despesas,
  SUM(CASE WHEN type = 'receita' THEN amount ELSE -amount END) as saldo
FROM finances;

-- Ver próximos eventos
SELECT * FROM events 
WHERE date >= NOW() 
ORDER BY date ASC;

-- Ver produtos com baixo estoque
SELECT * FROM products 
WHERE stock < 10 
ORDER BY stock ASC;

-- Limpar todos os dados (CUIDADO!)
TRUNCATE members, finances, events, products CASCADE;

-- Resetar sequências
ALTER SEQUENCE members_id_seq RESTART WITH 1;
```

## 🔄 Git

```bash
# Verificar status
git status

# Adicionar arquivos
git add .

# Commit
git commit -m "Descrição das mudanças"

# Push para GitHub
git push origin main

# Ver histórico
git log --oneline

# Criar nova branch
git checkout -b feature/nova-funcionalidade

# Voltar para main
git checkout main

# Merge de branch
git merge feature/nova-funcionalidade

# Desfazer último commit (mantém mudanças)
git reset --soft HEAD~1

# Desfazer mudanças não commitadas
git checkout -- .
```

## 🌐 Vercel

```bash
# Instalar Vercel CLI (opcional)
npm i -g vercel

# Login
vercel login

# Deploy manual
vercel

# Deploy para produção
vercel --prod

# Ver logs
vercel logs

# Ver deployments
vercel ls
```

## 🔍 Debug

```bash
# Ver logs do Next.js
npm run dev -- --debug

# Limpar cache do Next.js
rm -rf .next

# Limpar node_modules e reinstalar
rm -rf node_modules package-lock.json
npm install

# Verificar versões
node --version
npm --version
```

## 📱 Testes Manuais

### Testar Autenticação

```bash
# 1. Abrir navegador em modo anônimo
# 2. Acessar http://localhost:3000
# 3. Criar conta
# 4. Fazer login
# 5. Fazer logout
# 6. Tentar acessar /dashboard (deve redirecionar para login)
```

### Testar CRUD de Membros

```bash
# 1. Login no sistema
# 2. Ir para /dashboard/members
# 3. Criar novo membro
# 4. Editar membro
# 5. Buscar membro
# 6. Excluir membro
```

### Testar Responsividade

```bash
# 1. Abrir DevTools (F12)
# 2. Toggle device toolbar (Ctrl+Shift+M)
# 3. Testar em diferentes tamanhos:
#    - Mobile (375px)
#    - Tablet (768px)
#    - Desktop (1920px)
```

## 🔧 Manutenção

### Atualizar Dependências

```bash
# Ver dependências desatualizadas
npm outdated

# Atualizar todas (cuidado!)
npm update

# Atualizar específica
npm update next

# Atualizar para latest
npm install next@latest
```

### Limpar Projeto

```bash
# Limpar cache e builds
rm -rf .next node_modules .vercel

# Reinstalar tudo
npm install
```

### Backup do Banco

```sql
-- No Supabase SQL Editor

-- Backup de members
COPY (SELECT * FROM members) TO '/tmp/members_backup.csv' CSV HEADER;

-- Backup de finances
COPY (SELECT * FROM finances) TO '/tmp/finances_backup.csv' CSV HEADER;

-- Ou use o backup automático do Supabase:
-- Database > Backups > Create backup
```

## 📊 Análise de Código

```bash
# Contar linhas de código
find . -name '*.tsx' -o -name '*.ts' | xargs wc -l

# Encontrar TODOs
grep -r "TODO" --include="*.tsx" --include="*.ts"

# Encontrar FIXMEs
grep -r "FIXME" --include="*.tsx" --include="*.ts"

# Ver tamanho do build
du -sh .next

# Analisar bundle
npm run build -- --analyze
```

## 🐛 Troubleshooting

### Erro: "Module not found"

```bash
# Limpar e reinstalar
rm -rf node_modules package-lock.json
npm install
```

### Erro: "Port 3000 already in use"

```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3000 | xargs kill -9

# Ou use outra porta
npm run dev -- -p 3001
```

### Erro: "Supabase connection failed"

```bash
# Verificar variáveis de ambiente
cat .env.local

# Testar conexão
curl https://seu-projeto.supabase.co/rest/v1/

# Verificar se o projeto está ativo no Supabase
```

### Erro: "Build failed"

```bash
# Verificar erros de TypeScript
npx tsc --noEmit

# Verificar erros de ESLint
npm run lint

# Build com mais detalhes
npm run build -- --debug
```

## 📝 Scripts Personalizados

Adicione ao `package.json`:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint",
    "clean": "rm -rf .next node_modules",
    "fresh": "npm run clean && npm install",
    "type-check": "tsc --noEmit",
    "format": "prettier --write ."
  }
}
```

## 🔐 Segurança

```bash
# Verificar vulnerabilidades
npm audit

# Fix automático
npm audit fix

# Ver relatório detalhado
npm audit --json

# Ignorar vulnerabilidades específicas
npm audit fix --force
```

## 📦 Adicionar Novas Dependências

```bash
# Produção
npm install nome-do-pacote

# Desenvolvimento
npm install -D nome-do-pacote

# Versão específica
npm install nome-do-pacote@1.2.3

# Remover
npm uninstall nome-do-pacote
```

## 🎨 Adicionar Componentes shadcn/ui

```bash
# Adicionar componente específico
npx shadcn@latest add button

# Adicionar múltiplos
npx shadcn@latest add button input card

# Ver componentes disponíveis
npx shadcn@latest add
```

## 📊 Performance

```bash
# Analisar bundle size
npm run build
# Veja o output para tamanhos

# Lighthouse (Chrome DevTools)
# 1. Abrir DevTools (F12)
# 2. Ir para Lighthouse
# 3. Generate report

# Web Vitals
# Já incluído no Next.js
# Veja no console do navegador
```

## 🔄 CI/CD

```bash
# GitHub Actions (criar .github/workflows/ci.yml)
name: CI
on: [push]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: npm install
      - run: npm run build
      - run: npm run lint
```

## 📱 Mobile

```bash
# Testar em dispositivo real
# 1. Encontrar IP local
ipconfig  # Windows
ifconfig  # Mac/Linux

# 2. Acessar de outro dispositivo
# http://SEU-IP:3000

# 3. Ou usar ngrok
npx ngrok http 3000
```

## 🎯 Atalhos Úteis

```bash
# Abrir VS Code
code .

# Abrir no navegador
start http://localhost:3000  # Windows
open http://localhost:3000   # Mac
xdg-open http://localhost:3000  # Linux

# Abrir Supabase
start https://app.supabase.com

# Abrir Vercel
start https://vercel.com/dashboard
```

## 📚 Recursos

```bash
# Documentação
start https://nextjs.org/docs
start https://supabase.com/docs
start https://tailwindcss.com/docs
start https://ui.shadcn.com

# Comunidades
start https://github.com/vercel/next.js/discussions
start https://discord.supabase.com
```

---

**Dica**: Salve este arquivo nos favoritos para referência rápida! 🔖
