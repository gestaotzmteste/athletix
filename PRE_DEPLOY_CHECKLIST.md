# ✅ Checklist Pré-Deploy

Use este checklist antes de fazer deploy para produção.

## 🔧 Configuração Local

### Ambiente de Desenvolvimento
- [ ] Node.js 18+ instalado
- [ ] Dependências instaladas (`npm install`)
- [ ] Projeto roda localmente sem erros (`npm run dev`)
- [ ] Build funciona sem erros (`npm run build`)
- [ ] Sem erros de TypeScript (`npx tsc --noEmit`)
- [ ] Sem erros de ESLint (`npm run lint`)

### Variáveis de Ambiente
- [ ] Arquivo `.env.local` configurado
- [ ] `NEXT_PUBLIC_SUPABASE_URL` definida
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` definida
- [ ] Valores corretos (testados localmente)
- [ ] `.env.local` está no `.gitignore`

## 🗄️ Supabase

### Projeto
- [ ] Projeto criado no Supabase
- [ ] Região escolhida (mais próxima dos usuários)
- [ ] Senha do banco salva em local seguro

### Banco de Dados
- [ ] Schema executado (`supabase/schema.sql`)
- [ ] Tabelas criadas corretamente:
  - [ ] `roles`
  - [ ] `members`
  - [ ] `finances`
  - [ ] `events`
  - [ ] `products`
- [ ] Relacionamentos funcionando
- [ ] Índices criados
- [ ] Triggers funcionando (`updated_at`)

### Row Level Security (RLS)
- [ ] RLS habilitado em todas as tabelas
- [ ] Políticas criadas para:
  - [ ] `members`
  - [ ] `finances`
  - [ ] `events`
  - [ ] `products`
- [ ] Políticas testadas (criar/ler/atualizar/deletar)

### Autenticação
- [ ] Email provider habilitado
- [ ] Confirmação de email configurada
- [ ] Templates de email personalizados (opcional)
- [ ] URLs de redirect configuradas
- [ ] Site URL configurada

### Dados
- [ ] Seed executado (opcional, para testes)
- [ ] Dados de teste criados
- [ ] Backup inicial feito

## 🔐 Segurança

### Credenciais
- [ ] Usando chave `anon public` (não `service_role`)
- [ ] Credenciais não commitadas no Git
- [ ] `.env.local` no `.gitignore`
- [ ] Senhas fortes configuradas

### Configurações
- [ ] HTTPS habilitado (automático na Vercel)
- [ ] CORS configurado no Supabase
- [ ] Rate limiting considerado
- [ ] Políticas RLS testadas

## 🧪 Testes Funcionais

### Autenticação
- [ ] Cadastro funciona
- [ ] Login funciona
- [ ] Logout funciona
- [ ] Recuperação de senha funciona
- [ ] Sessão persiste após reload
- [ ] Redirect para login quando não autenticado

### Dashboard
- [ ] Dashboard carrega
- [ ] Métricas aparecem corretamente
- [ ] Cards mostram dados corretos
- [ ] Sem erros no console

### Membros
- [ ] Listar membros funciona
- [ ] Criar membro funciona
- [ ] Editar membro funciona
- [ ] Excluir membro funciona
- [ ] Busca funciona
- [ ] Filtros funcionam

### Finanças
- [ ] Listar transações funciona
- [ ] Criar receita funciona
- [ ] Criar despesa funciona
- [ ] Editar transação funciona
- [ ] Excluir transação funciona
- [ ] Cálculos de saldo corretos

### Eventos
- [ ] Listar eventos funciona
- [ ] Criar evento funciona
- [ ] Editar evento funciona
- [ ] Excluir evento funciona
- [ ] Datas formatadas corretamente
- [ ] Eventos passados/futuros separados

### Produtos
- [ ] Listar produtos funciona
- [ ] Criar produto funciona
- [ ] Editar produto funciona
- [ ] Excluir produto funciona
- [ ] Imagens aparecem (se URL fornecida)
- [ ] Controle de estoque funciona

## 📱 Responsividade

### Mobile (375px)
- [ ] Sidebar funciona (menu hamburguer)
- [ ] Tabelas scrollam horizontalmente
- [ ] Formulários são usáveis
- [ ] Botões têm tamanho adequado
- [ ] Texto legível

### Tablet (768px)
- [ ] Layout se adapta
- [ ] Sidebar funciona
- [ ] Cards se reorganizam
- [ ] Tabelas legíveis

### Desktop (1920px)
- [ ] Layout não quebra
- [ ] Sidebar fixa funciona
- [ ] Conteúdo não fica muito largo
- [ ] Espaçamento adequado

## 🎨 Interface

### Visual
- [ ] Cores consistentes
- [ ] Fontes carregam corretamente
- [ ] Ícones aparecem
- [ ] Imagens carregam
- [ ] Dark mode funciona

### UX
- [ ] Navegação intuitiva
- [ ] Feedback visual em ações
- [ ] Loading states onde necessário
- [ ] Mensagens de erro claras
- [ ] Confirmações para ações destrutivas

## 🚀 Performance

### Build
- [ ] Build completa sem erros
- [ ] Sem warnings críticos
- [ ] Bundle size razoável (< 500KB)
- [ ] Imagens otimizadas

### Runtime
- [ ] Páginas carregam rápido (< 3s)
- [ ] Sem memory leaks
- [ ] Sem re-renders desnecessários
- [ ] Queries otimizadas

## 📝 Documentação

### Arquivos
- [ ] README.md completo
- [ ] QUICK_START.md criado
- [ ] SUPABASE_SETUP.md criado
- [ ] .env.example atualizado
- [ ] Comentários no código (onde necessário)

### Instruções
- [ ] Passos de instalação claros
- [ ] Configuração do Supabase documentada
- [ ] Troubleshooting incluído
- [ ] Comandos úteis listados

## 🔄 Git e GitHub

### Repositório
- [ ] Repositório criado no GitHub
- [ ] `.gitignore` configurado
- [ ] Código commitado
- [ ] Push feito para `main`
- [ ] README visível no GitHub

### Commits
- [ ] Mensagens de commit descritivas
- [ ] Sem arquivos sensíveis commitados
- [ ] Histórico limpo

## 🌐 Vercel

### Configuração
- [ ] Conta criada na Vercel
- [ ] Repositório importado
- [ ] Framework detectado (Next.js)
- [ ] Build settings corretos

### Variáveis de Ambiente
- [ ] `NEXT_PUBLIC_SUPABASE_URL` adicionada
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` adicionada
- [ ] Variáveis marcadas para Production
- [ ] Variáveis marcadas para Preview (opcional)

### Deploy
- [ ] Primeiro deploy bem-sucedido
- [ ] Site acessível via URL da Vercel
- [ ] Sem erros no log de deploy
- [ ] Todas as páginas carregam

## 🔗 Integração Supabase ↔ Vercel

### URLs
- [ ] URL da Vercel adicionada no Supabase (Site URL)
- [ ] Redirect URLs configuradas no Supabase
- [ ] CORS configurado (se necessário)

### Testes em Produção
- [ ] Cadastro funciona em produção
- [ ] Login funciona em produção
- [ ] Emails são enviados
- [ ] Dados são salvos corretamente
- [ ] Todas as funcionalidades testadas

## 📊 Monitoramento

### Vercel
- [ ] Analytics habilitado (opcional)
- [ ] Logs acessíveis
- [ ] Alertas configurados (opcional)

### Supabase
- [ ] Logs habilitados
- [ ] Uso monitorado
- [ ] Backup automático configurado

## 🎯 Pós-Deploy

### Validação
- [ ] Site acessível publicamente
- [ ] HTTPS funcionando
- [ ] Todas as páginas carregam
- [ ] Funcionalidades testadas em produção
- [ ] Performance aceitável

### Comunicação
- [ ] Equipe notificada
- [ ] URL compartilhada
- [ ] Credenciais de admin criadas
- [ ] Treinamento agendado (se necessário)

### Backup
- [ ] Backup do banco feito
- [ ] Código versionado no Git
- [ ] Documentação atualizada

## 🐛 Troubleshooting Preparado

### Conhecimento
- [ ] Sabe acessar logs da Vercel
- [ ] Sabe acessar logs do Supabase
- [ ] Sabe fazer rollback na Vercel
- [ ] Sabe restaurar backup do Supabase

### Contatos
- [ ] Suporte da Vercel conhecido
- [ ] Suporte do Supabase conhecido
- [ ] Documentação salva
- [ ] Comunidades conhecidas

## 📱 Opcional: PWA

Se quiser transformar em PWA:
- [ ] `manifest.json` criado
- [ ] Ícones adicionados (192x192, 512x512)
- [ ] Service Worker configurado (opcional)
- [ ] Testado em mobile

## 🎨 Opcional: Personalização

- [ ] Logo da atlética adicionado
- [ ] Cores personalizadas
- [ ] Favicon customizado
- [ ] Nome da atlética nos títulos
- [ ] Meta tags para SEO

## 🔐 Opcional: Segurança Avançada

- [ ] 2FA habilitado (Supabase)
- [ ] Rate limiting configurado
- [ ] Auditoria de ações implementada
- [ ] Logs de segurança ativos

## 📈 Opcional: Analytics

- [ ] Google Analytics configurado
- [ ] Vercel Analytics habilitado
- [ ] Eventos customizados rastreados
- [ ] Conversões definidas

## 💰 Custos Verificados

- [ ] Plano Vercel adequado (Free/Hobby)
- [ ] Plano Supabase adequado (Free)
- [ ] Limites conhecidos
- [ ] Plano de upgrade definido (se necessário)

---

## ✅ Aprovação Final

- [ ] **Todos os itens críticos verificados**
- [ ] **Testes em produção realizados**
- [ ] **Equipe treinada**
- [ ] **Documentação completa**
- [ ] **Backup realizado**

### Assinaturas

**Desenvolvedor**: _________________ Data: _______

**Responsável Técnico**: _________________ Data: _______

**Presidente da Atlética**: _________________ Data: _______

---

## 🎉 Deploy Aprovado!

Parabéns! Seu sistema está pronto para produção.

**Próximos passos:**
1. Monitorar uso nas primeiras 24h
2. Coletar feedback dos usuários
3. Corrigir bugs críticos imediatamente
4. Planejar próximas features

**Lembre-se:**
- Monitore os logs regularmente
- Faça backups periódicos
- Mantenha a documentação atualizada
- Ouça o feedback dos usuários

Boa sorte! 🚀
