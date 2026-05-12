'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Users, Shield, Plus, Pencil, Trash2, Crown, Info } from 'lucide-react'
import { 
  isAdminRole, 
  isSystemRole, 
  canDeleteRole, 
  getRoleColor, 
  getRoleIcon, 
  getPermissionDescription 
} from '@/lib/permissions'

type Role = {
  id: string
  name: string
  created_at: string
}

type Member = {
  id: string
  name: string
  email: string
  role_id: string
  user_id: string | null
}

export default function AdminPage() {
  const [roles, setRoles] = useState<Role[]>([])
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [showRoleModal, setShowRoleModal] = useState(false)
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [newRoleName, setNewRoleName] = useState('')
  const [selectedMember, setSelectedMember] = useState<Member | null>(null)
  const [selectedRole, setSelectedRole] = useState('')
  const supabase = createClient()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    const [
      { data: rolesData },
      { data: membersData }
    ] = await Promise.all([
      supabase.from('roles').select('*').order('name'),
      supabase.from('members').select('*').order('name')
    ])

    if (rolesData) setRoles(rolesData)
    if (membersData) setMembers(membersData)
    setLoading(false)
  }

  const createRole = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newRoleName.trim()) return

    const { error } = await supabase.from('roles').insert([{ name: newRoleName.toLowerCase().trim() }])
    
    if (error) {
      alert('Erro ao criar cargo: ' + error.message)
      return
    }

    setNewRoleName('')
    setShowRoleModal(false)
    loadData()
  }

  const deleteRole = async (id: string, roleName: string) => {
    // Verificar se pode deletar usando o sistema de permissões
    if (!canDeleteRole(roleName)) {
      alert('Não é possível excluir cargos do sistema')
      return
    }

    // Verificar se há membros com este cargo
    const membersWithRole = members.filter(m => m.role_id === id)
    if (membersWithRole.length > 0) {
      alert(`Não é possível excluir este cargo pois ${membersWithRole.length} membro(s) ainda o possuem`)
      return
    }

    if (confirm('Tem certeza que deseja excluir este cargo?')) {
      const { error } = await supabase.from('roles').delete().eq('id', id)
      
      if (error) {
        alert('Erro ao excluir cargo: ' + error.message)
        return
      }
      
      loadData()
    }
  }

  const assignRole = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedMember || !selectedRole) return

    const { error } = await supabase
      .from('members')
      .update({ role_id: selectedRole })
      .eq('id', selectedMember.id)

    if (error) {
      alert('Erro ao atribuir cargo: ' + error.message)
      return
    }

    setShowAssignModal(false)
    setSelectedMember(null)
    setSelectedRole('')
    loadData()
  }

  const getRoleName = (roleId: string) => {
    return roles.find(r => r.id === roleId)?.name || 'N/A'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white text-lg">Carregando...</div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="p-3 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl border border-purple-500/20">
          <Crown className="w-8 h-8 text-purple-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">Painel Administrativo</h1>
          <p className="text-slate-400 mt-1">Gerencie cargos e permissões</p>
        </div>
      </div>

      {/* Info sobre Permissões Admin */}
      <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <Crown className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Cargos com Permissões de Admin</h3>
            <p className="text-sm text-slate-300 mb-3">
              Os seguintes cargos têm acesso total ao sistema automaticamente:
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-red-500/20 text-red-300 rounded-lg text-sm font-medium">Admin</span>
              <span className="px-3 py-1 bg-red-500/20 text-red-300 rounded-lg text-sm font-medium">Presidente</span>
              <span className="px-3 py-1 bg-red-500/20 text-red-300 rounded-lg text-sm font-medium">Vice Presidente</span>
              <span className="px-3 py-1 bg-red-500/20 text-red-300 rounded-lg text-sm font-medium">Secretário Geral</span>
              <span className="px-3 py-1 bg-red-500/20 text-red-300 rounded-lg text-sm font-medium">Secretário</span>
              <span className="px-3 py-1 bg-red-500/20 text-red-300 rounded-lg text-sm font-medium">Diretor Geral</span>
            </div>
            <p className="text-xs text-slate-400 mt-3">
              💡 Estes cargos podem gerenciar todos os módulos do sistema, incluindo membros, finanças, produtos, vendas e configurações.
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Total de Cargos</p>
              <p className="text-3xl font-bold text-white mt-2">{roles.length}</p>
            </div>
            <Shield className="w-12 h-12 text-purple-400 opacity-20" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Membros Cadastrados</p>
              <p className="text-3xl font-bold text-white mt-2">{members.length}</p>
            </div>
            <Users className="w-12 h-12 text-blue-400 opacity-20" />
          </div>
        </div>
      </div>

      {/* Cargos Section */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-purple-400" />
            Cargos Disponíveis
          </h2>
          <button
            onClick={() => setShowRoleModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            <Plus size={20} />
            Novo Cargo
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {roles.map((role) => {
            const hasAdminPermissions = isAdminRole(role.name)
            const isSystem = isSystemRole(role.name)
            const icon = getRoleIcon(role.name)
            const description = getPermissionDescription(role.name)
            
            return (
              <div
                key={role.id}
                className={`p-4 rounded-lg border ${getRoleColor(role.name)} backdrop-blur-sm relative`}
              >
                {hasAdminPermissions && (
                  <div className="absolute top-2 right-2">
                    <Crown className="w-4 h-4 text-yellow-400" title="Permissões de Admin" />
                  </div>
                )}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{icon}</span>
                      <h3 className="font-semibold capitalize">{role.name}</h3>
                    </div>
                    <p className="text-xs opacity-60 mt-1">
                      {members.filter(m => m.role_id === role.id).length} membros
                    </p>
                    <p className="text-xs opacity-70 mt-2 flex items-center gap-1">
                      <Info size={12} />
                      {description}
                    </p>
                    {isSystem && (
                      <span className="inline-block text-xs opacity-50 mt-2 px-2 py-0.5 bg-slate-700/50 rounded">
                        Sistema
                      </span>
                    )}
                    {hasAdminPermissions && !isSystem && (
                      <span className="inline-block text-xs mt-2 px-2 py-0.5 bg-yellow-500/20 text-yellow-400 rounded">
                        Admin
                      </span>
                    )}
                  </div>
                  {!isSystem && (
                    <button
                      onClick={() => deleteRole(role.id, role.name)}
                      className="p-2 hover:bg-red-500/20 rounded-lg transition-colors ml-2"
                      title="Excluir cargo"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Membros Section */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-400" />
          Atribuir Cargos aos Membros
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-slate-700">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">Nome</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">Email</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">Cargo Atual</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-slate-300">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {members.map((member) => (
                <tr key={member.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="px-4 py-3 text-sm text-white">{member.name}</td>
                  <td className="px-4 py-3 text-sm text-slate-400">{member.email}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded border ${getRoleColor(getRoleName(member.role_id))}`}>
                      {getRoleName(member.role_id)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => {
                        setSelectedMember(member)
                        setSelectedRole(member.role_id)
                        setShowAssignModal(true)
                      }}
                      className="inline-flex items-center gap-2 px-3 py-1.5 text-sm text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                    >
                      <Pencil size={14} />
                      Alterar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Criar Cargo */}
      {showRoleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-white mb-4">Criar Novo Cargo</h2>
            <form onSubmit={createRole} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Nome do Cargo
                </label>
                <input
                  type="text"
                  required
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Ex: coordenador, tesoureiro..."
                />
                <p className="text-xs text-slate-500 mt-2">
                  O nome será convertido para minúsculas automaticamente
                </p>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowRoleModal(false)
                    setNewRoleName('')
                  }}
                  className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                >
                  Criar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Atribuir Cargo */}
      {showAssignModal && selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-white mb-4">Alterar Cargo</h2>
            <p className="text-slate-400 mb-4">
              Membro: <span className="text-white font-medium">{selectedMember.name}</span>
            </p>
            <form onSubmit={assignRole} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Selecione o Cargo
                </label>
                <select
                  required
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAssignModal(false)
                    setSelectedMember(null)
                    setSelectedRole('')
                  }}
                  className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
