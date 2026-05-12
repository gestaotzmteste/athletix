# 🛍️ Atualização: Produtos, Estoque e Vendas

## ✅ Mudanças Implementadas

### 1. **Reorganização da Estrutura**

**Antes:**
- Loja (produtos com venda simples)

**Depois:**
- ✅ **Produtos** - Cadastro completo com custo e margem
- ✅ **Estoque** - Controle de movimentações
- ✅ **Vendas** - Registro de vendas com lucro

### 2. **Nova Estrutura no Banco de Dados**

#### Tabela `products` (atualizada)
```sql
- cost_price: Preço de custo
- price: Preço de venda
- profit_margin: Margem de lucro (calculada automaticamente)
```

#### Nova Tabela `stock_movements`
```sql
- product_id: Produto
- type: entrada | saida | ajuste
- quantity: Quantidade
- reason: Motivo
- notes: Observações
```

#### Nova Tabela `sales`
```sql
- product_id: Produto vendido
- quantity: Quantidade
- unit_price: Preço unitário
- total_price: Preço total
- customer_name: Nome do cliente
- customer_email: Email do cliente
- payment_method: Forma de pagamento
- notes: Observações
```

---

## 📋 Como Aplicar as Mudanças

### Passo 1: Executar Migration no Supabase

No **Supabase SQL Editor**, execute o arquivo `supabase/products_sales_migration.sql`:

1. Abra [app.supabase.com](https://app.supabase.com)
2. Vá em **SQL Editor**
3. Clique em **+ New query**
4. Copie o conteúdo de `atletica-saas/supabase/products_sales_migration.sql`
5. Cole e clique em **Run**

Isso criará:
- ✅ Campo `cost_price` na tabela products
- ✅ Campo `profit_margin` (calculado automaticamente)
- ✅ Tabela `stock_movements`
- ✅ Tabela `sales`
- ✅ Índices e políticas RLS
- ✅ Dados de exemplo

### Passo 2: Reiniciar o Servidor

```bash
# Pare o servidor (Ctrl+C)
# Inicie novamente
npm run dev
```

---

## 🎯 Novas Funcionalidades

### 📦 Produtos (`/dashboard/products`)

**Funcionalidades:**
- ✅ Cadastro de produtos com custo e venda
- ✅ Cálculo automático de margem de lucro
- ✅ Visualização de margem por produto
- ✅ Estatísticas:
  - Total de produtos
  - Valor em estoque (preço de venda)
  - Custo total
  - Margem média

**Campos:**
- Nome
- Descrição
- **Preço de Custo** (quanto você paga)
- **Preço de Venda** (quanto você cobra)
- **Margem de Lucro** (calculada automaticamente)
- Estoque inicial
- Imagem

**Exemplo:**
```
Produto: Camiseta Oficial
Custo: R$ 30,00
Venda: R$ 45,00
Margem: 50% (R$ 15,00 de lucro)
```

---

### 📊 Estoque (`/dashboard/stock`)

**Funcionalidades:**
- ✅ Controle de entradas e saídas
- ✅ Ajustes de estoque
- ✅ Histórico completo de movimentações
- ✅ Alertas de estoque baixo
- ✅ Estatísticas:
  - Total em estoque
  - Produtos cadastrados
  - Produtos com estoque baixo

**Tipos de Movimentação:**
1. **Entrada** - Adiciona ao estoque
   - Ex: Compra de novos produtos
2. **Saída** - Remove do estoque
   - Ex: Venda, doação, perda
3. **Ajuste** - Define novo valor total
   - Ex: Correção de inventário

**Campos:**
- Produto
- Tipo (entrada/saída/ajuste)
- Quantidade
- Motivo
- Observações

---

### 💰 Vendas (`/dashboard/sales`)

**Funcionalidades:**
- ✅ Registro de vendas
- ✅ Cálculo automático de lucro
- ✅ Atualização automática de estoque
- ✅ Registro de movimentação de estoque
- ✅ Estatísticas:
  - Receita total
  - Lucro total
  - Total de vendas

**Campos:**
- Produto
- Quantidade
- Preço unitário (pode ser diferente do cadastrado)
- Nome do cliente (opcional)
- Email do cliente (opcional)
- Forma de pagamento (PIX, Dinheiro, Cartão)
- Observações

**Cálculos Automáticos:**
- Total da venda
- Lucro da venda (venda - custo)
- Margem de lucro %

**Exemplo:**
```
Produto: Camiseta (Custo: R$ 30)
Quantidade: 5
Preço Unit: R$ 45
Total: R$ 225
Lucro: R$ 75 (50%)
```

---

## 🎨 Interface

### Produtos
- Tabela com todas as informações
- Cores na margem:
  - 🟢 Verde: ≥ 50%
  - 🔵 Azul: 30-49%
  - 🟡 Amarelo: 15-29%
  - 🔴 Vermelho: < 15%

### Estoque
- Cards com estoque atual
- Cores por nível:
  - 🟢 Verde: > 20 unidades
  - 🟡 Amarelo: 10-20 unidades
  - 🟠 Laranja: 1-9 unidades
  - 🔴 Vermelho: 0 unidades
- Histórico com ícones:
  - ⬆️ Entrada (verde)
  - ⬇️ Saída (vermelho)
  - 🔄 Ajuste (azul)

### Vendas
- Tabela com histórico completo
- Mostra lucro e margem por venda
- Filtro por forma de pagamento

---

## 📊 Fluxo de Trabalho

### 1. Cadastrar Produto
```
Produtos → Novo Produto
- Nome: Moletom
- Custo: R$ 80
- Venda: R$ 120
- Estoque: 30
→ Margem: 50%
```

### 2. Registrar Entrada de Estoque
```
Estoque → Nova Movimentação
- Produto: Moletom
- Tipo: Entrada
- Quantidade: 20
- Motivo: Compra fornecedor
→ Estoque: 30 + 20 = 50
```

### 3. Registrar Venda
```
Vendas → Nova Venda
- Produto: Moletom
- Quantidade: 3
- Preço: R$ 120
- Cliente: João Silva
- Pagamento: PIX
→ Total: R$ 360
→ Lucro: R$ 120 (50%)
→ Estoque: 50 - 3 = 47
```

---

## 💡 Dicas de Uso

### Produtos
- Sempre cadastre o **preço de custo** correto
- A margem é calculada automaticamente
- Atualize os preços quando necessário

### Estoque
- Use **Entrada** para compras
- Use **Saída** para perdas/doações
- Use **Ajuste** para correções de inventário
- Sempre adicione um motivo claro

### Vendas
- O estoque é atualizado automaticamente
- Você pode alterar o preço na hora da venda
- Registre o cliente para histórico
- Escolha a forma de pagamento correta

---

## 📈 Relatórios e Análises

### No Dashboard Principal
- Saldo financeiro
- Produtos vendidos
- Metas de vendas

### Em Produtos
- Valor total em estoque
- Custo total investido
- Margem média de lucro

### Em Vendas
- Receita total
- Lucro total
- Número de vendas

---

## 🔄 Integração entre Módulos

```
PRODUTOS
   ↓
ESTOQUE ← → VENDAS
   ↓
FINANCEIRO
```

1. **Produto** é cadastrado com custo e venda
2. **Estoque** controla entradas e saídas
3. **Venda** registra a transação e atualiza estoque
4. **Financeiro** pode registrar a receita da venda

---

## ✅ Checklist de Uso

### Configuração Inicial
- [ ] Executar migration no Supabase
- [ ] Reiniciar servidor
- [ ] Acessar /dashboard/products
- [ ] Cadastrar primeiros produtos

### Operação Diária
- [ ] Registrar vendas em /dashboard/sales
- [ ] Verificar estoque em /dashboard/stock
- [ ] Atualizar produtos quando necessário
- [ ] Registrar entradas de mercadoria

### Análise Mensal
- [ ] Verificar receita total
- [ ] Analisar lucro total
- [ ] Identificar produtos mais vendidos
- [ ] Ajustar preços se necessário

---

## 🎯 Próximas Melhorias Sugeridas

1. **Relatórios**
   - Produtos mais vendidos
   - Vendas por período
   - Lucro por produto

2. **Gráficos**
   - Evolução de vendas
   - Margem de lucro ao longo do tempo
   - Estoque mínimo vs atual

3. **Alertas**
   - Estoque baixo
   - Produtos sem venda há X dias
   - Margem de lucro baixa

4. **Exportação**
   - Relatório de vendas em PDF
   - Planilha de estoque
   - Histórico de movimentações

---

**Última atualização**: Maio 2026
**Versão**: 1.2.0
