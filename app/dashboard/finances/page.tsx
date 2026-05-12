'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Pencil, Trash2, TrendingUp, TrendingDown, DollarSign } from 'lucide-react'

type Finance = {
  id: string
  type: 'receita' | 'despesa'
  category: string
  description: string | null
  amount: number
  date: string
  created_at: string
}

export default function FinancesPage() {
  const [finances, setFinances] = useState<Finance[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingFinance, setEditingFinance] = useState<Finance | null>(null)
  const supabase = createClient()

  const [formData, setFormData] = useState({
    type: 'receita' as 'receita' | 'despesa',
    category: '',
    description: '',
    amount: '',
    date: new Date().toISOString().split('T')[0]
  })

  useEffect(() => {
    loadFinances()
  }, [])

  const loadFinances = async () => {
    const { data } = await supabase
      .from('finances')
      .select('*')
      .order('date', { ascending: false })

    if (data) setFinances(data)
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const payload = {
      ...formData,
      amount: parseFloat(formData.amount)
    }

    if (editingFinance) {
      await supabase
        .from('finances')
        .update(payload)
        .eq('id', editingFinance.id)
    } else {
      await supabase.from('finances').insert([payload])
    }

    setShowModal(false)
    setEditingFinance(null)
    resetForm()
    loadFinances()
  }

  const handleEdit = (finance: Finance) => {
    setEditingFinance(finance)
    setFormData({
      type: finance.type,
      category: finance.category,
      description: finance.description || '',
      amount: finance.amount.toString(),
      date: finance.date
    })
    setShowModal(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este registro?')) {
      await supabase.from('finances').delete().eq('id', id)
      loadFinances()
    }
  }

  const resetForm = () => {
    setFormData({
      type: 'receita',
      category: '',
      description: '',
      amount: '',
      date: new Date().toISOString().split('T')[0]
    })
  }

  const totalReceitas = finances
    .filter(f => f.type === 'receita')
    .reduce((acc, f) => acc + Number(f.amount), 0)

  const totalDespesas = finances
    .filter(f => f.type === 'despesa')
    .reduce((acc, f) => acc + Number(f.amount), 0)

  const saldo = totalReceitas - totalDespesas

  if (loading) {
    return <div className="text-white">Carregando...</div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Financeiro</h1>
          <p className="text-slate-400 mt-2">Gerencie receitas e despesas</p>
        </div>
        <button
          onClick={() => {
            setEditingFinance(null)
            resetForm()
            setShowModal(true)
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <Plus size={20} />
          Nova Transação
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Saldo Total</p>
              <p className={`text-2xl font-bold mt-2 ${saldo >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                R$ {saldo.toFixed(2)}
              </p>
            </div>
            <div className={`${saldo >= 0 ? 'bg-green-500' : 'bg-red-500'} p-3 rounded-lg`}>
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Total Receitas</p>
              <p className="text-2xl font-bold text-green-400 mt-2">
                R$ {totalReceitas.toFixed(2)}
              </p>
            </div>
            <div className="bg-green-500 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Total Despesas</p>
              <p className="text-2xl font-bold text-red-400 mt-2">
                R$ {totalDespesas.toFixed(2)}
              </p>
            </div>
            <div className="bg-red-500 p-3 rounded-lg">
              <TrendingDown className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-800/50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Data</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Tipo</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Categoria</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Descrição</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-slate-300">Valor</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-slate-300">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {finances.map((finance) => (
                <tr key={finance.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4 text-sm text-white">
                    {new Date(finance.date).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      finance.type === 'receita'
                        ? 'bg-green-950/50 text-green-400'
                        : 'bg-red-950/50 text-red-400'
                    }`}>
                      {finance.type === 'receita' ? 'Receita' : 'Despesa'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-300">{finance.category}</td>
                  <td className="px-6 py-4 text-sm text-slate-300">{finance.description || '-'}</td>
                  <td className={`px-6 py-4 text-sm text-right font-semibold ${
                    finance.type === 'receita' ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {finance.type === 'receita' ? '+' : '-'} R$ {Number(finance.amount).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-sm text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleEdit(finance)}
                        className="p-2 text-blue-400 hover:bg-blue-950/50 rounded-lg transition-colors"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(finance.id)}
                        className="p-2 text-red-400 hover:bg-red-950/50 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-white mb-4">
              {editingFinance ? 'Editar Transação' : 'Nova Transação'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Tipo</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as 'receita' | 'despesa' })}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="receita">Receita</option>
                  <option value="despesa">Despesa</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Categoria</label>
                <input
                  type="text"
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: Mensalidade, Material, Evento"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Descrição</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Valor (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Data</label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false)
                    setEditingFinance(null)
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
                  {editingFinance ? 'Salvar' : 'Criar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
