#!/bin/bash

# Script para executar migration automaticamente via Supabase CLI
# Requer: supabase CLI instalado e configurado

echo "🚀 Executando migration de Produtos, Estoque e Vendas..."

# Verificar se Supabase CLI está instalado
if ! command -v supabase &> /dev/null
then
    echo "❌ Supabase CLI não encontrado!"
    echo "📦 Instale com: npm install -g supabase"
    echo "🔗 Ou veja: https://supabase.com/docs/guides/cli"
    exit 1
fi

# Verificar se está linkado ao projeto
if [ ! -f ".supabase/config.toml" ]; then
    echo "⚠️  Projeto não está linkado ao Supabase"
    echo "🔗 Execute: supabase link --project-ref xajsybcyuujtvyoxdykd"
    exit 1
fi

# Executar migration
echo "📊 Executando SQL..."
supabase db push --db-url "postgresql://postgres:[YOUR-PASSWORD]@db.xajsybcyuujtvyoxdykd.supabase.co:5432/postgres" < supabase/products_sales_migration.sql

if [ $? -eq 0 ]; then
    echo "✅ Migration executada com sucesso!"
    echo "🔄 Reinicie o servidor: npm run dev"
else
    echo "❌ Erro ao executar migration"
    echo "💡 Tente executar manualmente no SQL Editor"
fi
