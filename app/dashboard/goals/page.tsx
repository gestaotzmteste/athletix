'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { CheckSquare, Plus, Trash2, Check, Square, Calendar } from 'lucide-react'

type Task = {
  id: string
  title: string
  description: string | null
  completed: boolean
  deadline: string | null
  priority: 'low' | 'medium' | 'high'
  created_at: string
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const supabase = createClient()

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    deadline: '',
    priority: 'medium' as 'low' | 'medium' | 'high'
  })

  useEffect(() => {
    loadTasks()
  }, [])

  const loadTasks = async () => {
    const { data } = await supabase
      .from('goals')
      .select('id, title, description, deadline, priority, created_at, status')
      .order('priority', { ascending: false })
      .order('created_at', { ascending: false })

    if (data) {
      // Converter para formato de tarefas
      const tasksData = data.map(item => ({
        id: item.id,
        title: item.title,
        description: item.description,
        completed: item.status === 'completed',
        deadline: item.deadline,
        priority: item.priority,
        created_at: item.created_at
      }))
      setTasks(tasksData)
    }
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const payload = {
      title: formData.title,
      description: formData.description || null,
      deadline: formData.deadline || null,
      priority: formData.priority,
      status: 'not_started',
      // Campos obrigatórios do schema antigo (valores padrão)
      target_value: 1,
      current_value: 0,
      unit: null,
      category: 'tarefa'
    }

    if (editingTask) {
      const { error } = await supabase
        .from('goals')
        .update(payload)
        .eq('id', editingTask.id)
      
      if (error) {
        console.error('Erro ao atualizar:', error)
        alert('Erro ao atualizar tarefa: ' + error.message)
        return
      }
    } else {
      const { error } = await supabase.from('goals').insert([payload])
      
      if (error) {
        console.error('Erro ao criar:', error)
        alert('Erro ao criar tarefa: ' + error.message)
        return
      }
    }

    setShowModal(false)
    setEditingTask(null)
    resetForm()
    loadTasks()
  }

  const toggleComplete = async (task: Task) => {
    const newStatus = task.completed ? 'not_started' : 'completed'
    const newCurrentValue = task.completed ? 0 : 1
    
    await supabase
      .from('goals')
      .update({ 
        status: newStatus,
        current_value: newCurrentValue
      })
      .eq('id', task.id)
    
    loadTasks()
  }

  const handleEdit = (task: Task) => {
    setEditingTask(task)
    setFormData({
      title: task.title,
      description: task.description || '',
      deadline: task.deadline || '',
      priority: task.priority
    })
    setShowModal(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
      await supabase.from('goals').delete().eq('id', id)
      loadTasks()
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      deadline: '',
      priority: 'medium'
    })
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500'
      case 'medium': return 'border-l-yellow-500'
      case 'low': return 'border-l-green-500'
      default: return 'border-l-slate-500'
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500/10 text-red-400 border-red-500/20'
      case 'medium': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
      case 'low': return 'bg-green-500/10 text-green-400 border-green-500/20'
      default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20'
    }
  }

  const completedTasks = tasks.filter(t => t.completed).length
  const pendingTasks = tasks.filter(t => !t.completed).length

  if (loading) {
    return <div className="text-white">Carregando...</div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl border border-blue-500/20">
            <CheckSquare className="w-8 h-8 text-blue-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Tarefas e Anotações</h1>
            <p className="text-slate-400 mt-1">Organize o que precisa ser feito</p>
          </div>
        </div>
        <button
          onClick={() => {
            setEditingTask(null)
            resetForm()
            setShowModal(true)
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <Plus size={20} />
          Nova Tarefa
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Total</p>
              <p className="text-3xl font-bold text-white mt-2">{tasks.length}</p>
            </div>
            <CheckSquare className="w-10 h-10 text-slate-400 opacity-20" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Pendentes</p>
              <p className="text-3xl font-bold text-white mt-2">{pendingTasks}</p>
            </div>
            <Square className="w-10 h-10 text-yellow-400 opacity-20" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Concluídas</p>
              <p className="text-3xl font-bold text-white mt-2">{completedTasks}</p>
            </div>
            <Check className="w-10 h-10 text-green-400 opacity-20" />
          </div>
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-3">
        {tasks.length === 0 ? (
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-xl p-12 text-center">
            <CheckSquare className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 text-lg">Nenhuma tarefa cadastrada</p>
            <p className="text-slate-500 text-sm mt-2">Clique em "Nova Tarefa" para começar</p>
          </div>
        ) : (
          <>
            {/* Tarefas Pendentes */}
            {pendingTasks > 0 && (
              <div className="space-y-3">
                <h2 className="text-lg font-semibold text-slate-300 flex items-center gap-2">
                  <Square className="w-5 h-5" />
                  Pendentes ({pendingTasks})
                </h2>
                {tasks.filter(t => !t.completed).map((task) => (
                  <div
                    key={task.id}
                    className={`bg-gradient-to-br from-slate-900 to-slate-800 border-l-4 ${getPriorityColor(task.priority)} border-t border-r border-b border-slate-700 rounded-lg p-4 hover:border-slate-600 transition-all group`}
                  >
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => toggleComplete(task)}
                        className="mt-0.5 p-1 hover:bg-slate-700 rounded transition-colors flex-shrink-0"
                      >
                        <Square className="w-5 h-5 text-slate-400 group-hover:text-blue-400 transition-colors" />
                      </button>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <h3 className="text-white font-medium">{task.title}</h3>
                            {task.description && (
                              <p className="text-sm text-slate-400 mt-1">{task.description}</p>
                            )}
                            <div className="flex items-center gap-3 mt-2">
                              <span className={`px-2 py-0.5 text-xs font-medium rounded border ${getPriorityBadge(task.priority)}`}>
                                {task.priority === 'high' ? '🔴 Alta' : task.priority === 'medium' ? '🟡 Média' : '🟢 Baixa'}
                              </span>
                              {task.deadline && (
                                <span className="text-xs text-slate-400 flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {new Date(task.deadline).toLocaleDateString('pt-BR')}
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleEdit(task)}
                              className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                              title="Editar"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDelete(task.id)}
                              className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                              title="Excluir"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Tarefas Concluídas */}
            {completedTasks > 0 && (
              <div className="space-y-3 mt-8">
                <h2 className="text-lg font-semibold text-slate-300 flex items-center gap-2">
                  <Check className="w-5 h-5" />
                  Concluídas ({completedTasks})
                </h2>
                {tasks.filter(t => t.completed).map((task) => (
                  <div
                    key={task.id}
                    className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 border border-slate-700/50 rounded-lg p-4 opacity-60 hover:opacity-100 transition-all group"
                  >
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => toggleComplete(task)}
                        className="mt-0.5 p-1 hover:bg-slate-700 rounded transition-colors flex-shrink-0"
                      >
                        <Check className="w-5 h-5 text-green-400" />
                      </button>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <h3 className="text-slate-400 font-medium line-through">{task.title}</h3>
                            {task.description && (
                              <p className="text-sm text-slate-500 mt-1 line-through">{task.description}</p>
                            )}
                          </div>
                          
                          <button
                            onClick={() => handleDelete(task.id)}
                            className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                            title="Excluir"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 w-full max-w-lg">
            <h2 className="text-xl font-bold text-white mb-4">
              {editingTask ? 'Editar Tarefa' : 'Nova Tarefa'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  O que precisa ser feito? *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: Organizar evento de integração"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Detalhes (opcional)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Adicione mais informações se necessário..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Prioridade
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as 'low' | 'medium' | 'high' })}
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="low">🟢 Baixa</option>
                    <option value="medium">🟡 Média</option>
                    <option value="high">🔴 Alta</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Prazo (opcional)
                  </label>
                  <input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false)
                    setEditingTask(null)
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
                  {editingTask ? 'Salvar' : 'Criar Tarefa'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
