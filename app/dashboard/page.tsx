import { createClient } from '@/lib/supabase/server'
import { Users, DollarSign, Calendar, ShoppingBag, TrendingUp, TrendingDown, Target, CheckCircle2, Circle, AlertCircle } from 'lucide-react'

async function getDashboardData() {
  const supabase = await createClient()

  const [
    { count: membersCount },
    { data: finances },
    { data: upcomingEvents },
    { data: products },
    { data: goals },
    { data: sales }
  ] = await Promise.all([
    supabase.from('members').select('*', { count: 'exact', head: true }),
    supabase.from('finances').select('*'),
    supabase.from('events').select('*').gte('date', new Date().toISOString()).order('date', { ascending: true }).limit(3),
    supabase.from('products').select('*').order('created_at', { ascending: false }).limit(4),
    supabase.from('goals').select('*').order('priority', { ascending: false }).order('deadline', { ascending: true }),
    supabase.from('sales').select('quantity')
  ])

  const totalReceitas = finances?.filter(f => f.type === 'receita').reduce((acc, f) => acc + Number(f.amount), 0) || 0
  const totalDespesas = finances?.filter(f => f.type === 'despesa').reduce((acc, f) => acc + Number(f.amount), 0) || 0
  const saldo = totalReceitas - totalDespesas

  // Calcular produtos vendidos a partir da tabela sales
  const totalProductsSold = sales?.reduce((acc, s) => acc + Number(s.quantity), 0) || 0

  return {
    membersCount: membersCount || 0,
    saldo,
    totalReceitas,
    totalDespesas,
    upcomingEvents: upcomingEvents || [],
    totalProductsSold,
    recentProducts: products || [],
    goals: goals || []
  }
}

export default async function DashboardPage() {
  const data = await getDashboardData()

  const stats = [
    {
      name: 'Total de Membros',
      value: data.membersCount,
      icon: Users,
      gradient: 'from-blue-500/20 to-cyan-500/20',
      iconColor: 'text-blue-400',
      border: 'border-blue-500/20',
    },
    {
      name: 'Saldo Financeiro',
      value: `R$ ${data.saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      icon: DollarSign,
      gradient: data.saldo >= 0 ? 'from-green-500/20 to-emerald-500/20' : 'from-red-500/20 to-rose-500/20',
      iconColor: data.saldo >= 0 ? 'text-green-400' : 'text-red-400',
      border: data.saldo >= 0 ? 'border-green-500/20' : 'border-red-500/20',
    },
    {
      name: 'Próximos Eventos',
      value: data.upcomingEvents.length,
      icon: Calendar,
      gradient: 'from-purple-500/20 to-pink-500/20',
      iconColor: 'text-purple-400',
      border: 'border-purple-500/20',
    },
    {
      name: 'Produtos Vendidos',
      value: data.totalProductsSold,
      icon: ShoppingBag,
      gradient: 'from-orange-500/20 to-amber-500/20',
      iconColor: 'text-orange-400',
      border: 'border-orange-500/20',
    },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="w-5 h-5 text-green-400" />
      case 'in_progress': return <Circle className="w-5 h-5 text-blue-400" />
      case 'not_started': return <Circle className="w-5 h-5 text-slate-500" />
      case 'cancelled': return <AlertCircle className="w-5 h-5 text-red-400" />
      default: return <Circle className="w-5 h-5 text-slate-400" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500/10 text-red-400 border-red-500/20'
      case 'medium': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
      case 'low': return 'bg-green-500/10 text-green-400 border-green-500/20'
      default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20'
    }
  }

  const getProgress = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
          Dashboard
        </h1>
        <p className="text-slate-400 mt-2">Visão geral da sua atlética</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.name}
              className={`bg-gradient-to-br ${stat.gradient} border ${stat.border} rounded-2xl p-6 hover:scale-105 transition-transform duration-200`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400 font-medium">{stat.name}</p>
                  <p className="text-3xl font-bold text-white mt-2">{stat.value}</p>
                </div>
                <div className={`p-3 bg-slate-900/50 rounded-xl`}>
                  <Icon className={`w-7 h-7 ${stat.iconColor}`} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Tarefas e Anotações */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-lg">
              <Target className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Tarefas e Anotações</h2>
              <p className="text-sm text-slate-400">O que precisa ser feito</p>
            </div>
          </div>
          <a
            href="/dashboard/goals"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
          >
            <Target className="w-4 h-4" />
            Ver Todas
          </a>
        </div>

        <div className="space-y-3">
          {data.goals.length === 0 ? (
            <p className="text-slate-400 text-center py-8">Nenhuma tarefa cadastrada</p>
          ) : (
            data.goals.slice(0, 5).map((goal) => {
              const isCompleted = goal.status === 'completed'
              
              return (
                <div
                  key={goal.id}
                  className={`bg-slate-800/50 border border-slate-700 rounded-lg p-4 hover:border-slate-600 transition-colors ${isCompleted ? 'opacity-60' : ''}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-green-400" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-500" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-medium ${isCompleted ? 'text-slate-400 line-through' : 'text-white'}`}>
                        {goal.title}
                      </h3>
                      {goal.description && (
                        <p className="text-sm text-slate-400 mt-1">{goal.description}</p>
                      )}
                      <div className="flex items-center gap-3 mt-2">
                        <span className={`px-2 py-0.5 text-xs font-medium rounded border ${getPriorityColor(goal.priority)}`}>
                          {goal.priority === 'high' ? '🔴 Alta' : goal.priority === 'medium' ? '🟡 Média' : '🟢 Baixa'}
                        </span>
                        {goal.deadline && (
                          <span className="text-xs text-slate-400">
                            {new Date(goal.deadline).toLocaleDateString('pt-BR')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* Financial Summary & Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Financial Summary */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-400" />
            Resumo Financeiro
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                </div>
                <span className="text-slate-300 font-medium">Receitas</span>
              </div>
              <span className="text-xl font-bold text-green-400">
                R$ {data.totalReceitas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-red-500/10 to-rose-500/10 border border-red-500/20 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-500/20 rounded-lg">
                  <TrendingDown className="w-5 h-5 text-red-400" />
                </div>
                <span className="text-slate-300 font-medium">Despesas</span>
              </div>
              <span className="text-xl font-bold text-red-400">
                R$ {data.totalDespesas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-purple-400" />
            Próximos Eventos
          </h2>
          <div className="space-y-3">
            {data.upcomingEvents.length === 0 ? (
              <p className="text-slate-400 text-sm">Nenhum evento próximo</p>
            ) : (
              data.upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="p-4 bg-slate-800/50 border border-slate-700 rounded-xl hover:border-purple-500/30 transition-colors"
                >
                  <h3 className="font-medium text-white mb-2">{event.name}</h3>
                  <div className="flex items-center gap-4 text-sm text-slate-400">
                    <span>{new Date(event.date).toLocaleDateString('pt-BR')}</span>
                    {event.location && <span>• {event.location}</span>}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Recent Products */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-orange-400" />
          Produtos em Destaque
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {data.recentProducts.length === 0 ? (
            <p className="text-slate-400 text-sm col-span-full">Nenhum produto cadastrado</p>
          ) : (
            data.recentProducts.map((product) => (
              <div
                key={product.id}
                className="p-4 bg-slate-800/50 border border-slate-700 rounded-xl hover:border-orange-500/30 transition-colors"
              >
                <h3 className="font-medium text-white text-sm mb-2 line-clamp-1">{product.name}</h3>
                <div className="space-y-2">
                  <p className="text-2xl font-bold text-orange-400">
                    R$ {Number(product.price).toFixed(2)}
                  </p>
                  <p className="text-xs text-slate-400">
                    Estoque: <span className="text-white font-medium">{product.stock}</span>
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
