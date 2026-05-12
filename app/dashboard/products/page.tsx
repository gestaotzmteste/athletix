'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Pencil, Trash2, Package, TrendingUp, DollarSign } from 'lucide-react'

type Product = {
  id: string
  name: string
  description: string | null
  cost_price: number
  price: number
  stock: number
  size: string | null
  image_url: string | null
  profit_margin: number
  created_at: string
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const supabase = createClient()

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    cost_price: '',
    price: '',
    stock: '',
    size: '',
    image_url: ''
  })

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    const { data } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })

    if (data) setProducts(data)
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const payload = {
      name: formData.name,
      description: formData.description || null,
      cost_price: parseFloat(formData.cost_price),
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      size: formData.size || null,
      image_url: formData.image_url || null
    }

    if (editingProduct) {
      await supabase
        .from('products')
        .update(payload)
        .eq('id', editingProduct.id)
    } else {
      await supabase.from('products').insert([payload])
    }

    setShowModal(false)
    setEditingProduct(null)
    resetForm()
    loadProducts()
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      description: product.description || '',
      cost_price: product.cost_price.toString(),
      price: product.price.toString(),
      stock: product.stock.toString(),
      size: product.size || '',
      image_url: product.image_url || ''
    })
    setShowModal(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      await supabase.from('products').delete().eq('id', id)
      loadProducts()
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      cost_price: '',
      price: '',
      stock: '',
      size: '',
      image_url: ''
    })
  }

  const calculateMargin = () => {
    const cost = parseFloat(formData.cost_price) || 0
    const price = parseFloat(formData.price) || 0
    if (cost > 0) {
      return ((price - cost) / cost * 100).toFixed(2)
    }
    return '0.00'
  }

  const totalValue = products.reduce((acc, p) => acc + (Number(p.price) * p.stock), 0)
  const totalCost = products.reduce((acc, p) => acc + (Number(p.cost_price) * p.stock), 0)
  const avgMargin = products.length > 0 
    ? products.reduce((acc, p) => acc + Number(p.profit_margin), 0) / products.length 
    : 0

  if (loading) {
    return <div className="text-white">Carregando...</div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl border border-blue-500/20">
            <Package className="w-8 h-8 text-blue-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Produtos</h1>
            <p className="text-slate-400 mt-1">Gerencie o catálogo de produtos</p>
          </div>
        </div>
        <button
          onClick={() => {
            setEditingProduct(null)
            resetForm()
            setShowModal(true)
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <Plus size={20} />
          Novo Produto
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Total de Produtos</p>
              <p className="text-3xl font-bold text-white mt-2">{products.length}</p>
            </div>
            <Package className="w-10 h-10 text-blue-400 opacity-20" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Valor em Estoque</p>
              <p className="text-3xl font-bold text-white mt-2">
                R$ {totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <DollarSign className="w-10 h-10 text-green-400 opacity-20" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Custo Total</p>
              <p className="text-3xl font-bold text-white mt-2">
                R$ {totalCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <DollarSign className="w-10 h-10 text-purple-400 opacity-20" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500/10 to-amber-500/10 border border-orange-500/20 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Margem Média</p>
              <p className="text-3xl font-bold text-white mt-2">{avgMargin.toFixed(1)}%</p>
            </div>
            <TrendingUp className="w-10 h-10 text-orange-400 opacity-20" />
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-800/50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Produto</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-slate-300">Tamanho</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-slate-300">Custo</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-slate-300">Venda</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-slate-300">Margem</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-slate-300">Estoque</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-slate-300">Valor Total</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-slate-300">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {products.map((product) => {
                const totalProductValue = Number(product.price) * product.stock
                return (
                  <tr key={product.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-white">{product.name}</p>
                        {product.description && (
                          <p className="text-xs text-slate-400 mt-1 line-clamp-1">{product.description}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {product.size ? (
                        <span className="inline-flex px-2 py-1 text-xs font-medium rounded bg-slate-700 text-slate-300">
                          {product.size}
                        </span>
                      ) : (
                        <span className="text-xs text-slate-500">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right text-sm text-slate-300">
                      R$ {Number(product.cost_price).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium text-white">
                      R$ {Number(product.price).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded ${
                        Number(product.profit_margin) >= 50 ? 'bg-green-500/10 text-green-400' :
                        Number(product.profit_margin) >= 30 ? 'bg-blue-500/10 text-blue-400' :
                        Number(product.profit_margin) >= 15 ? 'bg-yellow-500/10 text-yellow-400' :
                        'bg-red-500/10 text-red-400'
                      }`}>
                        {Number(product.profit_margin).toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded ${
                        product.stock > 20 ? 'bg-green-500/10 text-green-400' :
                        product.stock > 10 ? 'bg-yellow-500/10 text-yellow-400' :
                        product.stock > 0 ? 'bg-orange-500/10 text-orange-400' :
                        'bg-red-500/10 text-red-400'
                      }`}>
                        {product.stock} un
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium text-white">
                      R$ {totalProductValue.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="p-2 text-blue-400 hover:bg-blue-950/50 rounded-lg transition-colors"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-2 text-red-400 hover:bg-red-950/50 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-white mb-4">
              {editingProduct ? 'Editar Produto' : 'Novo Produto'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-300 mb-2">Nome *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-300 mb-2">Descrição</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Tamanho</label>
                  <select
                    value={formData.size}
                    onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Selecione (opcional)</option>
                    <option value="PP">PP</option>
                    <option value="P">P</option>
                    <option value="M">M</option>
                    <option value="G">G</option>
                    <option value="GG">GG</option>
                    <option value="XG">XG</option>
                    <option value="XGG">XGG</option>
                    <option value="Único">Único</option>
                  </select>
                </div>

                <div className="md:col-span-1">
                  {/* Espaço vazio para manter o grid */}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Preço de Custo (R$) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.cost_price}
                    onChange={(e) => setFormData({ ...formData, cost_price: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Preço de Venda (R$) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {formData.cost_price && formData.price && (
                  <div className="md:col-span-2">
                    <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                      <p className="text-sm text-slate-300">
                        Margem de Lucro: <span className="text-xl font-bold text-blue-400">{calculateMargin()}%</span>
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        Lucro por unidade: R$ {(parseFloat(formData.price || '0') - parseFloat(formData.cost_price || '0')).toFixed(2)}
                      </p>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Estoque Inicial *</label>
                  <input
                    type="number"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">URL da Imagem</label>
                  <input
                    type="url"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://exemplo.com/imagem.jpg"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false)
                    setEditingProduct(null)
                    resetForm()
                  }}
                  className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  {editingProduct ? 'Salvar' : 'Criar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
