# 🚀 Guia de Deploy

Este guia mostra como fazer deploy do Atlética SaaS na Vercel.

## 📋 Pré-requisitos

- [ ] Projeto funcionando localmente
- [ ] Conta no GitHub
- [ ] Conta na Vercel (gratuita)
- [ ] Supabase configurado e funcionando

## 🔄 Passo 1: Preparar o Repositório

### 1.1. Inicializar Git (se ainda não fez)

```bash
cd atletica-saas
git init
git add .
git commit -m "Initial commit - Atlética SaaS MVP"
```

### 1.2. Criar Repositório no GitHub

1. Acesse [github.com](https://github.com)
2. Clique em "New repository"
3. Nome: `atletica-saas` (ou outro nome)
4. Deixe como **Private** (recomendado)
5. **NÃO** inicialize com README (já temos)
6. Clique em "Create repository"

### 1.3. Fazer Push para o GitHub

```bash
# Adicione o remote (substitua SEU-USUARIO pelo seu username)
git remote add origin https://github.com/SEU-USUARIO/atletica-saas.git

# Faça o push
git branch -M main
git push -u origin main
```

## 🌐 Passo 2: Deploy na Vercel

### 2.1. Criar Conta na Vercel

1. Acesse [vercel.com](https://vercel.com)
2. Clique em "Sign Up"
3. Escolha "Continue with GitHub"
4. Autorize a Vercel a acessar seus repositórios

### 2.2. Importar Projeto

1. No dashboard da Vercel, clique em "Add New..."
2. Selecione "Project"
3. Encontre o repositório `atletica-saas`
4. Clique em "Import"

### 2.3. Configurar Projeto

**Framework Preset**: Next.js (detectado automaticamente)

**Root Directory**: `./` (deixe como está)

**Build Command**: `npm run build` (padrão)

**Output Directory**: `.next` (padrão)

### 2.4. Adicionar Variáveis de Ambiente

⚠️ **IMPORTANTE**: Adicione as variáveis de ambiente antes de fazer deploy!

1. Clique em "Environment Variables"
2. Adicione as seguintes variáveis:

```
NEXT_PUBLIC_SUPABASE_URL
```
Valor: Sua URL do Supabase (ex: `https://xxxxx.supabase.co`)

```
NEXT_PUBLIC_SUPABASE_ANON_KEY
```
Valor: Sua chave anon do Supabase

3. Certifique-se de que estão marcadas para:
   - ✅ Production
   - ✅ Preview
   - ✅ Development

### 2.5. Deploy!

1. Clique em "Deploy"
2. Aguarde 2-3 minutos
3. 🎉 Seu site está no ar!

## 🔧 Passo 3: Configurar Supabase para Produção

### 3.1. Adicionar URL de Produção

1. Acesse seu projeto no Supabase
2. Vá em **Authentication** > **URL Configuration**
3. Em **Site URL**, adicione sua URL da Vercel:
   ```
   https://seu-projeto.vercel.app
   ```

4. Em **Redirect URLs**, adicione:
   ```
   https://seu-projeto.vercel.app/**
   ```

### 3.2. Configurar Email Templates

1. Vá em **Authentication** > **Email Templates**
2. Atualize os links nos templates para sua URL de produção
3. Personalize os emails conforme sua atlética

### 3.3. Habilitar Confirmação de Email

1. Vá em **Authentication** > **Providers** > **Email**
2. ✅ Ative "Confirm email"
3. Salve as alterações

## ✅ Passo 4: Testar em Produção

### 4.1. Acessar o Site

1. Acesse a URL fornecida pela Vercel
2. Exemplo: `https://atletica-saas.vercel.app`

### 4.2. Criar Conta de Teste

1. Clique em "Começar Grátis"
2. Cadastre-se com um email real
3. Confirme o email (verifique sua caixa de entrada)
4. Faça login

### 4.3. Testar Funcionalidades

- [ ] Login/Logout funciona
- [ ] Dashboard carrega corretamente
- [ ] Criar membro funciona
- [ ] Criar transação financeira funciona
- [ ] Criar evento funciona
- [ ] Criar produto funciona
- [ ] Navegação entre páginas funciona
- [ ] Responsividade mobile funciona

## 🎨 Passo 5: Personalização (Opcional)

### 5.1. Domínio Personalizado

1. Na Vercel, vá em **Settings** > **Domains**
2. Clique em "Add"
3. Digite seu domínio (ex: `atletica.suauniversidade.com.br`)
4. Siga as instruções para configurar DNS

### 5.2. Adicionar Logo

1. Adicione o logo em `public/logo.png`
2. Atualize o componente Sidebar:

```typescript
// components/sidebar.tsx
<div className="flex items-center h-16 px-6 border-b border-slate-800">
  <img src="/logo.png" alt="Logo" className="h-8 w-8 mr-3" />
  <h1 className="text-xl font-bold text-white">Sua Atlética</h1>
</div>
```

3. Commit e push:

```bash
git add .
git commit -m "Add logo"
git push
```

A Vercel fará deploy automático!

### 5.3. Personalizar Cores

Edite `app/globals.css` para mudar as cores do tema:

```css
:root {
  --primary: oklch(0.488 0.243 264.376); /* Azul padrão */
  /* Mude para as cores da sua atlética */
}
```

## 🔄 Passo 6: Atualizações Futuras

### Deploy Automático

Toda vez que você fizer push para o GitHub, a Vercel fará deploy automático!

```bash
# Fazer mudanças no código
git add .
git commit -m "Descrição das mudanças"
git push

# Deploy automático acontece!
```

### Rollback

Se algo der errado:

1. Vá no dashboard da Vercel
2. Clique em "Deployments"
3. Encontre um deploy anterior que funcionava
4. Clique nos três pontos (...)
5. Selecione "Promote to Production"

## 📊 Passo 7: Monitoramento

### 7.1. Analytics da Vercel

1. No dashboard da Vercel, vá em **Analytics**
2. Veja:
   - Visitantes
   - Pageviews
   - Performance

### 7.2. Logs

1. Vá em **Deployments**
2. Clique em um deploy
3. Vá em **Functions**
4. Veja os logs em tempo real

### 7.3. Supabase Monitoring

1. No Supabase, vá em **Logs**
2. Monitore:
   - Auth Logs (logins, signups)
   - Postgres Logs (queries)
   - API Logs (requisições)

## 🔒 Passo 8: Segurança em Produção

### 8.1. Checklist de Segurança

- [ ] Confirmação de email habilitada
- [ ] URLs de redirect configuradas
- [ ] RLS habilitado em todas as tabelas
- [ ] Variáveis de ambiente seguras
- [ ] HTTPS habilitado (automático na Vercel)
- [ ] Senhas fortes obrigatórias

### 8.2. Backup do Banco

1. No Supabase, vá em **Database** > **Backups**
2. Configure backups automáticos
3. Faça backup manual antes de mudanças grandes

### 8.3. Rate Limiting

Configure rate limiting no Supabase:

1. Vá em **Settings** > **API**
2. Configure limites de requisições
3. Proteja contra ataques

## 💰 Custos

### Vercel (Hobby Plan - Gratuito)
- ✅ 100 GB bandwidth/mês
- ✅ Domínio .vercel.app gratuito
- ✅ Deploy automático
- ✅ SSL gratuito
- ✅ Analytics básico

### Supabase (Free Plan)
- ✅ 500 MB database
- ✅ 1 GB file storage
- ✅ 50,000 monthly active users
- ✅ 2 GB bandwidth

**Total: R$ 0,00/mês** 🎉

### Quando Escalar?

Considere planos pagos quando:
- Mais de 500 MB de dados
- Mais de 50k usuários ativos/mês
- Precisa de mais bandwidth
- Quer analytics avançado
- Precisa de suporte prioritário

## 🐛 Troubleshooting

### Erro: "Application error"
- Verifique os logs na Vercel
- Verifique se as variáveis de ambiente estão corretas
- Tente fazer redeploy

### Erro: "Failed to fetch"
- Verifique se a URL do Supabase está correta
- Verifique se as URLs de redirect estão configuradas
- Verifique os CORS no Supabase

### Erro: "Invalid API key"
- Verifique se copiou a chave correta (anon public)
- Verifique se não há espaços extras
- Regenere a chave se necessário

### Build falha
- Verifique erros de TypeScript localmente
- Execute `npm run build` localmente
- Verifique os logs de build na Vercel

## 📱 Passo 9: PWA (Opcional)

Para transformar em Progressive Web App:

### 9.1. Adicionar Manifest

Crie `public/manifest.json`:

```json
{
  "name": "Atlética SaaS",
  "short_name": "Atlética",
  "description": "Sistema de gestão para atléticas",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0f172a",
  "theme_color": "#2563eb",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

### 9.2. Adicionar ao Layout

Em `app/layout.tsx`:

```typescript
export const metadata = {
  manifest: '/manifest.json',
}
```

## 🎯 Checklist Final

Antes de considerar o deploy completo:

- [ ] Site acessível via HTTPS
- [ ] Login/Signup funcionando
- [ ] Todas as páginas carregam
- [ ] CRUD de membros funciona
- [ ] CRUD de finanças funciona
- [ ] CRUD de eventos funciona
- [ ] CRUD de produtos funciona
- [ ] Responsivo em mobile
- [ ] Emails sendo enviados
- [ ] Backup configurado
- [ ] Monitoramento ativo
- [ ] Domínio personalizado (opcional)
- [ ] Logo adicionado (opcional)

## 🚀 Próximos Passos

1. ✅ Compartilhe com sua equipe
2. ✅ Treine os diretores
3. ✅ Migre dados existentes
4. ✅ Configure integrações (se necessário)
5. ✅ Monitore uso e performance
6. ✅ Colete feedback
7. ✅ Itere e melhore

## 📞 Suporte

- **Vercel**: [vercel.com/support](https://vercel.com/support)
- **Supabase**: [supabase.com/support](https://supabase.com/support)
- **Next.js**: [nextjs.org/docs](https://nextjs.org/docs)

---

**Parabéns! Seu sistema está no ar! 🎉**

Agora é só usar e melhorar continuamente!
