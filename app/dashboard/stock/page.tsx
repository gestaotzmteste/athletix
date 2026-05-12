'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Warehouse, Plus, TrendingUp, TrendingDown, RefreshCw, Package } from 'lucide-react'

type Product = {
  id: string
  name: string
  stock: number
}

type StockMovement = {
  id: string
  product_id: string
  type: 'entrada' | 'saida' | 'ajuste'
  quantity: number
  reason: string | null
  notes: string | null
  created_at: string
  products: {
    name: string
  }
}

export default function StockPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [movements, setMovements] = useState<StockMovement[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const supabase = createClient()

  const [formData, setFormData] = useState({
    product_id: '',
    type: 'entrada' as 'entrada' | 'saida' | 'ajuste',
    quantity: '',
    reason: '',
    notes: ''
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    const [{ data: productsData }, { data: movementsData }] = await Promise.all([
      supabase.from('products').select('id, name, stock').order('name'),
      supabase.from('stock_movements').select('*, products(name)').order('created_at', { ascending: false }).limit(50)
    ])

    if (productsData) setProducts(productsData)
    if (movementsData) setMovements(movementsData as any)
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const quantity = parseInt(formData.quantity)
    const product = products.find(p => p.id === formData.product_id)
    
    if (!product) return

    // Validar se há estoque suficiente para saída
    if (formData.type === 'saida' && product.stock < quantity) {
      alert('Estoque insuficiente!')
      return
    }

    // Registrar movimentação
    const { error: movError } = await supabase.from('stock_movements').insert([{
      product_id: formData.product_id,
      type: formData.type,
      quantity: quantity,
      reason: formData.reason || null,
      notes: formData.notes || null
    }])

    if (movError) {
      alert('Erro ao registrar movimentação: ' + movError.message)
      return
    }

    // Atualizar estoque do produto
    let newStock = product.stock
    if (formData.type === 'entrada') {
      newStock += quantity
    } else if (formData.type === 'saida') {
      newStock -= quantity
    } else if (formData.type === 'ajuste') {
      newStock = quantity
    }

    const { error: updateError } = await supabase
      .from('products')
      .update({ stock: newStock })
      .eq('id', formData.product_id)

    if (updateError) {
      alert('Erro ao atualizar estoque: ' + updateError.message)
      return
    }

    setShowModal(false)
    resetForm()
    loadData()
  }

  const resetForm = () => {
    setFormData({
      product_id: '',
      type: 'entrada',
      quantity: '',
      reason: '',
      notes: ''
    })
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'entrada': return <TrendingUp className="w-5 h-5 text-green-400" />
      case 'saida': return <TrendingDown className="w-5 h-5 text-red-400" />
      case 'ajuste': return <RefreshCw className="w-5 h-5 text-blue-400" />
      default: return null
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'entrada': return 'bg-green-500/10 text-green-400 border-green-500/20'
      case 'saida': return 'bg-red-500/10 text-red-400 border-red-500/20'
      case 'ajuste': return 'bg-blue-500/10 text-blue-400 border-blue-500/20'
      default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20'
    }
  }

  const totalStock = products.reduce((acc, p) => acc + p.stock, 0)
  const lowStockProducts = products.filter(p => p.stock < 10).length

  if (loading) {
    return <div className="text-white">Carregando...</div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-orange-500/20 to-amber-500/20 rounded-xl border border-orange-500/20">
            <Warehouse className="w-8 h-8 text-orange-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Controle de Estoque</h1>
            <p className="text-slate-400 mt-1">Gerencie entradas e saídas</p>
          </div>
        </div>
        <button
          onClick={() => {
            resetForm()
            setShowModal(true)
          }}
          className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
        >
          <Plus size={20} />
          Nova Movimentação
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Total em Estoque</p>
              <p className="text-3xl font-bold text-white mt-2">{totalStock} un</p>
            </div>
            <Package className="w-10 h-10 text-blue-400 opacity-20" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500/10 to-amber-500/10 border border-orange-500/20 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Produtos Cadastrados</p>
              <p className="text-3xl font-bold text-white mt-2">{products.length}</p>
            </div>
            <Warehouse className="w-10 h-10 text-orange-400 opacity-20" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-500/10 to-rose-500/10 border border-red-500/20 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Estoque Baixo</p>
              <p className="text-3xl font-bold text-white mt-2">{lowStockProducts}</p>
            </div>
            <TrendingDown className="w-10 h-10 text-red-400 opacity-20" />
          </div>
        </div>
      </div>

      {/* Current Stock */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Estoque Atual</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <div
              key={product.id}
              className={`p-4 rounded-lg border ${
                product.stock === 0 ? 'bg-red-500/5 border-red-500/20' :
                product.stock < 10 ? 'bg-yellow-500/5 border-yellow-500/20' :
                'bg-slate-800/50 border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-white">{product.name}</h3>
                <span className={`px-2 py-1 text-sm font-medium rounded ${
                  product.stock === 0 ? 'bg-red-500/10 text-red-400' :
                  product.stock < 10 ? 'bg-yellow-500/10 text-yellow-400' :
                  'bg-green-500/10 text-green-400'
                }`}>
                  {product.stock} un
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Movements History */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-slate-700">
          <h2 className="text-xl font-semibold text-white">Histórico de Movimentações</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-800/50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Data</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Produto</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Tipo</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-slate-300">Quantidade</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Motivo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {movements.map((movement) => (
                <tr key={movement.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4 text-sm text-slate-300">
                    {new Date(movement.created_at).toLocaleString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 text-sm text-white">{movement.products.name}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-2 px-2 py-1 text-xs font-medium rounded border ${getTypeColor(movement.type)}`}>
                      {getTypeIcon(movement.type)}
                      {movement.type.charAt(0).toUpperCase() + movement.type.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium text-white">
                    {movement.type === 'entrada' ? '+' : movement.type === 'saida' ? '-' : ''}{movement.quantity}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-400">{movement.reason || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-white mb-4">Nova Movimentação</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Produto *</label>
                <select
                  required
                  value={formData.product_id}
                  onChange={(e) => setFormData({ ...formData, product_id: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">Selecione um produto</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name} (Estoque: {product.stock})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Tipo *</label>
                <select
                  required
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="entrada">Entrada</option>
                  <option value="saida">Saída</option>
                  <option value="ajuste">Ajuste</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Quantidade * {formData.type === 'ajuste' && '(Novo valor total)'}
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Motivo</label>
                <input
                  type="text"
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Ex: Compra, Venda, Correção..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Observações</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false)
                    resetForm()
                  }}
                  className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
                >
                  Registrar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
