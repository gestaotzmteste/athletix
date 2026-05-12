# 🆕 Atualização: Campo de Tamanho nos Produtos

## 📋 O que foi adicionado?

### 1. **Campo de Tamanho** nos Produtos
- Tamanhos disponíveis: PP, P, M, G, GG, XG, XGG, Único
- Campo opcional (pode deixar em branco)
- Aparece na listagem de produtos
- Aparece na seleção de vendas

### 2. **Auto-preenchimento** na Venda
- Ao selecionar um produto, o **preço de venda é preenchido automaticamente**
- Mostra informações do produto selecionado:
  - Nome
  - Tamanho (se tiver)
  - Estoque disponível (com cores)
- Você ainda pode alterar o preço se quiser

---

## 🚀 Como Aplicar

### Passo 1: Executar Migration no Supabase

1. **Acesse o Supabase**
   - URL: https://supabase.com/dashboard/project/xajsybcyuujtvyoxdykd

2. **SQL Editor → + New query**

3. **Copie e Cole este SQL:**
   ```sql
   -- Adicionar campo de tamanho
   ALTER TABLE products ADD COLUMN IF NOT EXISTS size TEXT;

   -- Validar tamanhos permitidos
   ALTER TABLE products ADD CONSTRAINT valid_size 
     CHECK (size IS NULL OR size IN ('PP', 'P', 'M', 'G', 'GG', 'XG', 'XGG', 'Único'));

   -- Criar índice
   CREATE INDEX IF NOT EXISTS idx_products_size ON products(size);
   ```

4. **Clique em "Run"**

5. **Reinicie o servidor**
   ```bash
   npm run dev
   ```

---

## ✨ Novidades na Interface

### Página de Produtos (`/dashboard/products`)

**Antes:**
```
| Produto | Custo | Venda | Margem | Estoque | Ações |
```

**Depois:**
```
| Produto | Tamanho | Custo | Venda | Margem | Estoque | Ações |
```

**Formulário de Produto:**
- ✅ Novo campo: **Tamanho** (dropdown)
- ✅ Opções: PP, P, M, G, GG, XG, XGG, Único
- ✅ Campo opcional

---

### Página de Vendas (`/dashboard/sales`)

**Melhorias:**

1. **Seleção de Produto Melhorada**
   ```
   Antes: Camiseta - R$ 45.00 (Estoque: 20)
   Depois: Camiseta (M) - R$ 45.00 - Estoque: 20
   ```

2. **Card de Informações do Produto** (NOVO)
   - Aparece automaticamente ao selecionar produto
   - Mostra:
     - Nome do produto
     - Tamanho (badge)
     - Estoque disponível (com cores)
   - Cores do estoque:
     - 🟢 Verde: > 10 unidades
     - 🟡 Amarelo: 1-10 unidades
     - 🔴 Vermelho: 0 unidades

3. **Auto-preenchimento do Preço**
   - ✅ Preço de venda é preenchido automaticamente
   - ✅ Você pode alterar se quiser vender por outro valor
   - ✅ Cálculo do total é atualizado automaticamente

---

## 🎯 Exemplos de Uso

### Cadastrar Produto com Tamanho

```
1. Produtos → Novo Produto
2. Preencher:
   - Nome: Camiseta Oficial
   - Tamanho: M
   - Custo: R$ 30
   - Venda: R$ 45
   - Estoque: 50
3. Salvar
```

### Registrar Venda (Novo Fluxo)

```
1. Vendas → Nova Venda
2. Selecionar produto: "Camiseta Oficial (M)"
   → Preço é preenchido automaticamente: R$ 45
   → Card mostra: Camiseta Oficial [M] - Estoque: 50 un
3. Quantidade: 5
4. Total calculado: R$ 225
5. Cliente (opcional)
6. Forma de pagamento
7. Registrar Venda
```

---

## 📊 Visualização

### Produtos

```
┌─────────────────────────────────────────────────────────┐
│ Produto          │ Tamanho │ Custo  │ Venda  │ Margem  │
├─────────────────────────────────────────────────────────┤
│ Camiseta Oficial │   M     │ 30.00  │ 45.00  │  50%    │
│ Camiseta Oficial │   G     │ 30.00  │ 45.00  │  50%    │
│ Moletom          │   GG    │ 80.00  │ 120.00 │  50%    │
│ Boné             │  Único  │ 15.00  │ 25.00  │  67%    │
└─────────────────────────────────────────────────────────┘
```

### Vendas - Seleção de Produto

```
┌─────────────────────────────────────────────────────────┐
│ Produto: [Camiseta Oficial (M) - R$ 45.00 - Estoque: 50▼]│
├─────────────────────────────────────────────────────────┤
│ ℹ️  Produto: Camiseta Oficial [M]    Estoque: 50 un 🟢 │
└─────────────────────────────────────────────────────────┘
```

---

## 🔄 Integração entre Módulos

```
PRODUTOS
   ├─ Cadastrar com tamanho
   ├─ Visualizar tamanho na lista
   │
   ▼
VENDAS
   ├─ Selecionar produto (mostra tamanho)
   ├─ Preço preenchido automaticamente
   ├─ Ver estoque disponível
   └─ Registrar venda
```

---

## 💡 Dicas de Uso

### Produtos com Tamanho
✅ Use para roupas (camisetas, moletons, etc)  
✅ Cadastre cada tamanho como produto separado  
✅ Exemplo: "Camiseta Oficial M", "Camiseta Oficial G"  

### Produtos sem Tamanho
✅ Deixe o campo vazio para produtos únicos  
✅ Exemplo: Bonés, canecas, adesivos  
✅ Aparecerá como "-" na listagem  

### Vendas
✅ O preço é preenchido automaticamente  
✅ Você pode alterar o preço na hora da venda  
✅ Útil para promoções ou descontos  
✅ Verifique o estoque antes de vender  

---

## 🆘 Solução de Problemas

### Campo de tamanho não aparece
**Solução**: Execute a migration SQL no Supabase

### Erro ao salvar produto
**Solução**: Verifique se o tamanho está na lista permitida (PP, P, M, G, GG, XG, XGG, Único)

### Preço não preenche automaticamente
**Solução**: 
1. Verifique se o produto tem preço cadastrado
2. Recarregue a página
3. Limpe o cache (Ctrl+Shift+R)

---

## ✅ Checklist

- [ ] Executar migration SQL
- [ ] Reiniciar servidor
- [ ] Testar cadastro de produto com tamanho
- [ ] Testar cadastro de produto sem tamanho
- [ ] Testar seleção de produto na venda
- [ ] Verificar auto-preenchimento do preço
- [ ] Verificar card de informações do produto
- [ ] Registrar uma venda de teste

---

## 📈 Benefícios

### Para o Usuário
✅ Mais rápido registrar vendas (preço automático)  
✅ Menos erros (vê o estoque antes de vender)  
✅ Melhor organização (produtos por tamanho)  
✅ Informações claras (card com detalhes)  

### Para a Gestão
✅ Controle de estoque por tamanho  
✅ Análise de vendas por tamanho  
✅ Melhor planejamento de compras  
✅ Redução de erros de digitação  

---

## 🎉 Pronto!

Agora você pode:
- ✅ Cadastrar produtos com tamanho
- ✅ Ver o tamanho na listagem
- ✅ Selecionar produto na venda com preço automático
- ✅ Ver informações do produto antes de vender

---

**Versão**: 1.3.0  
**Data**: Maio 2026  
**Tempo de aplicação**: 2 minutos
