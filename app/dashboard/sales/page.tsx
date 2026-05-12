'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ShoppingCart, Plus, DollarSign, TrendingUp, Package } from 'lucide-react'

type Product = {
  id: string
  name: string
  price: number
  cost_price: number
  stock: number
  size: string | null
}

type Sale = {
  id: string
  product_id: string
  quantity: number
  unit_price: number
  total_price: number
  customer_name: string | null
  customer_phone: string | null
  payment_method: string | null
  notes: string | null
  created_at: string
  products: {
    name: string
    cost_price: number
  }
}

export default function SalesPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [sales, setSales] = useState<Sale[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const supabase = createClient()

  const [formData, setFormData] = useState({
    product_id: '',
    quantity: '',
    unit_price: '',
    customer_name: '',
    customer_phone: '',
    payment_method: 'pix',
    notes: ''
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    const [{ data: productsData }, { data: salesData }] = await Promise.all([
      supabase.from('products').select('*').order('name'),
      supabase.from('sales').select('*, products(name, cost_price)').order('created_at', { ascending: false }).limit(100)
    ])

    if (productsData) setProducts(productsData)
    if (salesData) setSales(salesData as any)
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const quantity = parseInt(formData.quantity)
    const unitPrice = parseFloat(formData.unit_price)
    const product = products.find(p => p.id === formData.product_id)
    
    if (!product) return

    // Validar estoque
    if (product.stock < quantity) {
      alert('Estoque insuficiente!')
      return
    }

    const totalPrice = quantity * unitPrice

    // Registrar venda
    const { error: saleError } = await supabase.from('sales').insert([{
      product_id: formData.product_id,
      quantity: quantity,
      unit_price: unitPrice,
      total_price: totalPrice,
      customer_name: formData.customer_name || null,
      customer_phone: formData.customer_phone || null,
      payment_method: formData.payment_method,
      notes: formData.notes || null
    }])

    if (saleError) {
      alert('Erro ao registrar venda: ' + saleError.message)
      return
    }

    // Atualizar estoque
    const { error: stockError } = await supabase
      .from('products')
      .update({ stock: product.stock - quantity })
      .eq('id', formData.product_id)

    if (stockError) {
      alert('Erro ao atualizar estoque: ' + stockError.message)
      return
    }

    // Registrar movimentação de estoque
    await supabase.from('stock_movements').insert([{
      product_id: formData.product_id,
      type: 'saida',
      quantity: quantity,
      reason: 'Venda',
      notes: `Venda para ${formData.customer_name || 'Cliente'}`
    }])

    setShowModal(false)
    resetForm()
    loadData()
  }

  const resetForm = () => {
    setFormData({
      product_id: '',
      quantity: '',
      unit_price: '',
      customer_name: '',
      customer_phone: '',
      payment_method: 'pix',
      notes: ''
    })
  }

  const handleProductChange = (productId: string) => {
    const product = products.find(p => p.id === productId)
    if (product) {
      setFormData({
        ...formData,
        product_id: productId,
        unit_price: product.price.toString()
      })
    }
  }

  const calculateTotal = () => {
    const quantity = parseInt(formData.quantity) || 0
    const unitPrice = parseFloat(formData.unit_price) || 0
    return (quantity * unitPrice).toFixed(2)
  }

  const totalRevenue = sales.reduce((acc, s) => acc + Number(s.total_price), 0)
  const totalProfit = sales.reduce((acc, s) => {
    const cost = Number(s.products.cost_price) * s.quantity
    return acc + (Number(s.total_price) - cost)
  }, 0)
  const totalSales = sales.length

  const getPaymentMethodLabel = (method: string | null) => {
    switch (method) {
      case 'dinheiro': return 'Dinheiro'
      case 'pix': return 'PIX'
      case 'cartao_credito': return 'Cartão de Crédito'
      case 'cartao_debito': return 'Cartão de Débito'
      default: return method || 'N/A'
    }
  }

  if (loading) {
    return <div className="text-white">Carregando...</div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl border border-green-500/20">
            <ShoppingCart className="w-8 h-8 text-green-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Controle de Vendas</h1>
            <p className="text-slate-400 mt-1">Registre e acompanhe as vendas</p>
          </div>
        </div>
        <button
          onClick={() => {
            resetForm()
            setShowModal(true)
          }}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
        >
          <Plus size={20} />
          Nova Venda
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Receita Total</p>
              <p className="text-3xl font-bold text-white mt-2">
                R$ {totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <DollarSign className="w-10 h-10 text-green-400 opacity-20" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Lucro Total</p>
              <p className="text-3xl font-bold text-white mt-2">
                R$ {totalProfit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <TrendingUp className="w-10 h-10 text-blue-400 opacity-20" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Total de Vendas</p>
              <p className="text-3xl font-bold text-white mt-2">{totalSales}</p>
            </div>
            <ShoppingCart className="w-10 h-10 text-purple-400 opacity-20" />
          </div>
        </div>
      </div>

      {/* Sales History */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-slate-700">
          <h2 className="text-xl font-semibold text-white">Histórico de Vendas</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-800/50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Data</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Produto</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-slate-300">Qtd</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-slate-300">Preço Unit.</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-slate-300">Total</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-slate-300">Lucro</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Cliente</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Pagamento</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {sales.map((sale) => {
                const cost = Number(sale.products.cost_price) * sale.quantity
                const profit = Number(sale.total_price) - cost
                const profitMargin = cost > 0 ? (profit / cost * 100) : 0

                return (
                  <tr key={sale.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 text-sm text-slate-300">
                      {new Date(sale.created_at).toLocaleString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 text-sm text-white">{sale.products.name}</td>
                    <td className="px-6 py-4 text-right text-sm text-slate-300">{sale.quantity}</td>
                    <td className="px-6 py-4 text-right text-sm text-slate-300">
                      R$ {Number(sale.unit_price).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium text-white">
                      R$ {Number(sale.total_price).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex flex-col items-end">
                        <span className="text-sm font-medium text-green-400">
                          R$ {profit.toFixed(2)}
                        </span>
                        <span className="text-xs text-slate-400">
                          {profitMargin.toFixed(1)}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-300">
                      {sale.customer_name || '-'}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-2 py-1 text-xs font-medium rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        {getPaymentMethodLabel(sale.payment_method)}
                      </span>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 w-full max-w-2xl my-8">
            <h2 className="text-xl font-bold text-white mb-4">Nova Venda</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-300 mb-2">Produto *</label>
                  <select
                    required
                    value={formData.product_id}
                    onChange={(e) => handleProductChange(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Selecione um produto</option>
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name}
                        {product.size ? ` (${product.size})` : ''} - R$ {product.price.toFixed(2)} - Estoque: {product.stock}
                      </option>
                    ))}
                  </select>
                  
                  {formData.product_id && (() => {
                    const selectedProduct = products.find(p => p.id === formData.product_id)
                    if (selectedProduct) {
                      return (
                        <div className="mt-2 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                          <div className="flex items-center justify-between text-sm">
                            <div>
                              <span className="text-slate-400">Produto: </span>
                              <span className="text-white font-medium">{selectedProduct.name}</span>
                              {selectedProduct.size && (
                                <span className="ml-2 px-2 py-0.5 text-xs bg-slate-700 text-slate-300 rounded">
                                  {selectedProduct.size}
                                </span>
                              )}
                            </div>
                            <div>
                              <span className="text-slate-400">Estoque: </span>
                              <span className={`font-medium ${
                                selectedProduct.stock > 10 ? 'text-green-400' :
                                selectedProduct.stock > 0 ? 'text-yellow-400' :
                                'text-red-400'
                              }`}>
                                {selectedProduct.stock} un
                              </span>
                            </div>
                          </div>
                        </div>
                      )
                    }
                    return null
                  })()}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Quantidade *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Preço Unitário (R$) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.unit_price}
                    onChange={(e) => setFormData({ ...formData, unit_price: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                {formData.quantity && formData.unit_price && (
                  <div className="md:col-span-2">
                    <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                      <p className="text-sm text-slate-300">
                        Total da Venda: <span className="text-2xl font-bold text-green-400">R$ {calculateTotal()}</span>
                      </p>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Nome do Cliente</label>
                  <input
                    type="text"
                    value={formData.customer_name}
                    onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Ex: João Silva"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Telefone do Cliente</label>
                  <input
                    type="tel"
                    value={formData.customer_phone}
                    onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Ex: (11) 98765-4321"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Forma de Pagamento *</label>
                  <select
                    required
                    value={formData.payment_method}
                    onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="pix">PIX</option>
                    <option value="dinheiro">Dinheiro</option>
                    <option value="cartao_credito">Cartão de Crédito</option>
                    <option value="cartao_debito">Cartão de Débito</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-300 mb-2">Observações</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={2}
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
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
                  className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  Registrar Venda
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
