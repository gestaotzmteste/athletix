'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Pencil, Trash2, Calendar, MapPin, Users } from 'lucide-react'

type Event = {
  id: string
  name: string
  description: string | null
  date: string
  location: string | null
  max_participants: number | null
  current_participants: number
  created_at: string
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const supabase = createClient()

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    date: '',
    location: '',
    max_participants: ''
  })

  useEffect(() => {
    loadEvents()
  }, [])

  const loadEvents = async () => {
    const { data } = await supabase
      .from('events')
      .select('*')
      .order('date', { ascending: true })

    if (data) setEvents(data)
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const payload = {
      name: formData.name,
      description: formData.description || null,
      date: formData.date,
      location: formData.location || null,
      max_participants: formData.max_participants ? parseInt(formData.max_participants) : null
    }

    if (editingEvent) {
      await supabase
        .from('events')
        .update(payload)
        .eq('id', editingEvent.id)
    } else {
      await supabase.from('events').insert([payload])
    }

    setShowModal(false)
    setEditingEvent(null)
    resetForm()
    loadEvents()
  }

  const handleEdit = (event: Event) => {
    setEditingEvent(event)
    setFormData({
      name: event.name,
      description: event.description || '',
      date: event.date.slice(0, 16),
      location: event.location || '',
      max_participants: event.max_participants?.toString() || ''
    })
    setShowModal(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este evento?')) {
      await supabase.from('events').delete().eq('id', id)
      loadEvents()
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      date: '',
      location: '',
      max_participants: ''
    })
  }

  const isEventPast = (date: string) => {
    return new Date(date) < new Date()
  }

  if (loading) {
    return <div className="text-white">Carregando...</div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Eventos</h1>
          <p className="text-slate-400 mt-2">Gerencie os eventos da atlética</p>
        </div>
        <button
          onClick={() => {
            setEditingEvent(null)
            resetForm()
            setShowModal(true)
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <Plus size={20} />
          Novo Evento
        </button>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => {
          const isPast = isEventPast(event.date)
          const participationPercentage = event.max_participants 
            ? (event.current_participants / event.max_participants) * 100 
            : 0

          return (
            <div
              key={event.id}
              className={`bg-slate-900 border rounded-xl p-6 hover:border-slate-600 transition-colors ${
                isPast ? 'border-slate-800 opacity-60' : 'border-slate-700'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-white">{event.name}</h3>
                {isPast && (
                  <span className="px-2 py-1 bg-slate-800 text-slate-400 text-xs rounded">
                    Finalizado
                  </span>
                )}
              </div>

              {event.description && (
                <p className="text-sm text-slate-400 mb-4 line-clamp-2">
                  {event.description}
                </p>
              )}

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <Calendar size={16} className="text-slate-400" />
                  {new Date(event.date).toLocaleString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>

                {event.location && (
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <MapPin size={16} className="text-slate-400" />
                    {event.location}
                  </div>
                )}

                {event.max_participants && (
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <Users size={16} className="text-slate-400" />
                    {event.current_participants} / {event.max_participants} participantes
                  </div>
                )}
              </div>

              {event.max_participants && (
                <div className="mb-4">
                  <div className="w-full bg-slate-800 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all"
                      style={{ width: `${Math.min(participationPercentage, 100)}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-4 border-t border-slate-800">
                <button
                  onClick={() => handleEdit(event)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm text-blue-400 hover:bg-blue-950/50 rounded-lg transition-colors"
                >
                  <Pencil size={16} />
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(event.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-950/50 rounded-lg transition-colors"
                >
                  <Trash2 size={16} />
                  Excluir
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {events.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400">Nenhum evento cadastrado</p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-white mb-4">
              {editingEvent ? 'Editar Evento' : 'Novo Evento'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Nome</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Descrição</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Data e Hora</label>
                <input
                  type="datetime-local"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Local</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Limite de Participantes
                </label>
                <input
                  type="number"
                  value={formData.max_participants}
                  onChange={(e) => setFormData({ ...formData, max_participants: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false)
                    setEditingEvent(null)
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
                  {editingEvent ? 'Salvar' : 'Criar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
