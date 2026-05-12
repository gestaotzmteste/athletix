# 🚀 Guia Rápido - Atlética SaaS

## ⚡ Início Rápido

### 1️⃣ Executar Migration (OBRIGATÓRIO)
```
1. Acesse: https://supabase.com/dashboard/project/xajsybcyuujtvyoxdykd
2. SQL Editor → + New query
3. Copie: supabase/products_sales_migration.sql
4. Cole e clique em "Run"
5. Reinicie: npm run dev
```

### 2️⃣ Acessar o Sistema
```
http://localhost:3000
Login: mateusrr2006@gmail.com
```

---

## 📍 Navegação Rápida

| Página | URL | Função |
|--------|-----|--------|
| Dashboard | `/dashboard` | Visão geral + KPIs |
| Admin | `/dashboard/admin` | Criar cargos e atribuir |
| Membros | `/dashboard/members` | Gerenciar membros |
| Financeiro | `/dashboard/finances` | Receitas e despesas |
| Eventos | `/dashboard/events` | Gerenciar eventos |
| Metas | `/dashboard/goals` | Objetivos e KPIs |
| **Produtos** | `/dashboard/products` | **Cadastro com custo/venda** |
| **Estoque** | `/dashboard/stock` | **Controle de movimentações** |
| **Vendas** | `/dashboard/sales` | **Registro de vendas** |

---

## 🎯 Fluxos Principais

### Cadastrar Produto
```
1. Produtos → Novo Produto
2. Preencher:
   - Nome: "Camiseta"
   - Custo: R$ 30
   - Venda: R$ 45
   - Estoque: 50
3. Salvar
→ Margem calculada: 50%
```

### Registrar Entrada de Estoque
```
1. Estoque → Nova Movimentação
2. Selecionar produto
3. Tipo: Entrada
4. Quantidade: 20
5. Motivo: "Compra fornecedor"
→ Estoque atualizado automaticamente
```

### Registrar Venda
```
1. Vendas → Nova Venda
2. Selecionar produto
3. Quantidade: 5
4. Preço: R$ 45 (pode alterar)
5. Cliente (opcional)
6. Forma de pagamento
→ Estoque atualizado
→ Lucro calculado
→ Movimentação registrada
```

### Criar Meta
```
1. Metas → Nova Meta
2. Preencher:
   - Título: "Vender 100 camisetas"
   - Valor alvo: 100
   - Valor atual: 0
   - Prazo: 31/12/2026
   - Prioridade: Alta
3. Salvar
→ Aparece no dashboard com progresso
```

### Criar Cargo Personalizado
```
1. Admin → Criar Cargo
2. Nome: "Tesoureiro"
3. Salvar
→ Disponível para atribuir aos membros
```

---

## 📊 Estatísticas Disponíveis

### Dashboard
- Total de membros
- Saldo financeiro
- Próximos eventos
- Produtos vendidos
- Progresso das metas (visual)

### Produtos
- Total de produtos
- Valor em estoque (venda)
- Custo total investido
- Margem média de lucro

### Estoque
- Total em estoque (unidades)
- Produtos cadastrados
- Produtos com estoque baixo

### Vendas
- Receita total
- Lucro total
- Total de vendas

---

## 🎨 Indicadores Visuais

### Margem de Lucro (Produtos)
- 🟢 Verde: ≥ 50%
- 🔵 Azul: 30-49%
- 🟡 Amarelo: 15-29%
- 🔴 Vermelho: < 15%

### Estoque
- 🟢 Verde: > 20 unidades
- 🟡 Amarelo: 10-20 unidades
- 🟠 Laranja: 1-9 unidades
- 🔴 Vermelho: 0 unidades

### Status de Metas
- 🔵 Azul: Não iniciada
- 🟡 Amarelo: Em progresso
- 🟢 Verde: Concluída
- 🔴 Vermelho: Cancelada

### Prioridade de Metas
- 🔴 Vermelho: Alta
- 🟡 Amarelo: Média
- 🟢 Verde: Baixa

---

## 🔑 Atalhos de Teclado

| Ação | Atalho |
|------|--------|
| Abrir modal | Botão "+" em cada página |
| Fechar modal | ESC ou "Cancelar" |
| Salvar formulário | Enter (quando em input) |
| Logout | Botão no sidebar |

---

## 💡 Dicas Rápidas

### Produtos
✅ Sempre cadastre o preço de custo correto  
✅ A margem é calculada automaticamente  
✅ Atualize preços quando necessário  

### Estoque
✅ Use "Entrada" para compras  
✅ Use "Saída" para perdas/doações  
✅ Use "Ajuste" para correções  
✅ Sempre adicione um motivo  

### Vendas
✅ Estoque atualiza automaticamente  
✅ Pode alterar preço na venda  
✅ Registre cliente para histórico  
✅ Escolha forma de pagamento  

### Metas
✅ Atualize progresso regularmente  
✅ Use categorias para organizar  
✅ Defina prazos realistas  
✅ Marque como concluída quando atingir  

---

## 🔧 Comandos Úteis

```bash
# Instalar dependências
npm install

# Iniciar desenvolvimento
npm run dev

# Build produção
npm run build

# Verificar erros
npm run lint

# Limpar cache
rm -rf .next
npm run dev
```

---

## 📱 Responsividade

O sistema é totalmente responsivo:
- 📱 Mobile: Menu hambúrguer
- 💻 Desktop: Sidebar fixa
- 📊 Tabelas: Scroll horizontal em mobile
- 🎨 Cards: Adaptam ao tamanho da tela

---

## 🆘 Solução de Problemas

### Erro ao carregar página
```
1. Verifique se migration foi executada
2. Reinicie o servidor
3. Limpe o cache: rm -rf .next
```

### Estoque não atualiza
```
1. Verifique se a venda foi registrada
2. Veja o histórico em Estoque
3. Faça um ajuste manual se necessário
```

### Margem não aparece
```
1. Verifique se cost_price foi preenchido
2. Execute a migration novamente
3. Atualize o produto
```

### Não consigo criar cargo
```
1. Verifique se está na página Admin
2. Certifique-se de estar logado
3. Tente recarregar a página
```

---

## 📞 Arquivos de Ajuda

| Arquivo | Conteúdo |
|---------|----------|
| `STATUS.md` | Status completo do projeto |
| `PRODUCTS_SALES_UPDATE.md` | Detalhes dos novos módulos |
| `QUICK_START.md` | Guia de início |
| `SUPABASE_SETUP.md` | Configuração do banco |
| `ARCHITECTURE.md` | Arquitetura do sistema |

---

## ✅ Checklist Diário

### Manhã
- [ ] Verificar estoque baixo
- [ ] Revisar metas do dia
- [ ] Conferir saldo financeiro

### Durante o Dia
- [ ] Registrar vendas
- [ ] Atualizar progresso das metas
- [ ] Registrar receitas/despesas

### Noite
- [ ] Conferir vendas do dia
- [ ] Verificar lucro do dia
- [ ] Planejar reposição de estoque

---

## 🎯 Metas Sugeridas

### Vendas
- Vender X produtos por mês
- Atingir R$ X em receita
- Alcançar X% de margem média

### Membros
- Recrutar X novos membros
- Atingir X membros ativos
- Ter X% de participação em eventos

### Financeiro
- Economizar R$ X
- Reduzir despesas em X%
- Aumentar receita em X%

### Eventos
- Realizar X eventos por semestre
- Ter X participantes por evento
- Atingir X% de satisfação

---

## 🚀 Próximos Passos

1. ✅ Executar migration SQL
2. ✅ Cadastrar produtos
3. ✅ Registrar estoque inicial
4. ✅ Criar cargos personalizados
5. ✅ Cadastrar membros
6. ✅ Definir metas
7. ✅ Começar a registrar vendas!

---

**Dúvidas?** Consulte `STATUS.md` ou `PRODUCTS_SALES_UPDATE.md`

**Pronto para começar!** 🎉
