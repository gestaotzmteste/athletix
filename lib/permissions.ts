// Sistema de Permissões baseado em Cargos

// Cargos com permissões de Admin
export const ADMIN_ROLES = [
  'admin',
  'presidente',
  'vice presidente',
  'vice-presidente',
  'secretario geral',
  'secretário geral',
  'secretario',
  'secretário',
  'diretor geral',
  'diretor-geral'
]

// Cargos do sistema que não podem ser deletados
export const SYSTEM_ROLES = [
  'admin',
  'diretor',
  'membro'
]

// Verificar se um cargo tem permissões de admin
export function isAdminRole(roleName: string): boolean {
  if (!roleName) return false
  const normalizedRole = roleName.toLowerCase().trim()
  return ADMIN_ROLES.includes(normalizedRole)
}

// Verificar se é um cargo do sistema
export function isSystemRole(roleName: string): boolean {
  if (!roleName) return false
  const normalizedRole = roleName.toLowerCase().trim()
  return SYSTEM_ROLES.includes(normalizedRole)
}

// Verificar se um cargo pode ser deletado
export function canDeleteRole(roleName: string): boolean {
  return !isSystemRole(roleName)
}

// Obter nível de permissão (maior = mais permissões)
export function getPermissionLevel(roleName: string): number {
  if (!roleName) return 0
  
  const normalizedRole = roleName.toLowerCase().trim()
  
  // Admin e cargos equivalentes
  if (isAdminRole(normalizedRole)) return 100
  
  // Diretor
  if (normalizedRole === 'diretor') return 50
  
  // Membro
  if (normalizedRole === 'membro') return 10
  
  // Outros cargos personalizados
  return 25
}

// Verificar se pode gerenciar outro usuário
export function canManageUser(currentUserRole: string, targetUserRole: string): boolean {
  const currentLevel = getPermissionLevel(currentUserRole)
  const targetLevel = getPermissionLevel(targetUserRole)
  
  // Só pode gerenciar usuários com nível menor ou igual
  return currentLevel >= targetLevel
}

// Obter cor do cargo para UI
export function getRoleColor(roleName: string): string {
  if (!roleName) return 'bg-slate-500/10 text-slate-400 border-slate-500/20'
  
  const normalizedRole = roleName.toLowerCase().trim()
  
  if (isAdminRole(normalizedRole)) {
    return 'bg-red-500/10 text-red-400 border-red-500/20'
  }
  
  switch (normalizedRole) {
    case 'diretor':
      return 'bg-blue-500/10 text-blue-400 border-blue-500/20'
    case 'membro':
      return 'bg-green-500/10 text-green-400 border-green-500/20'
    default:
      return 'bg-purple-500/10 text-purple-400 border-purple-500/20'
  }
}

// Obter ícone do cargo
export function getRoleIcon(roleName: string): string {
  if (!roleName) return '👤'
  
  const normalizedRole = roleName.toLowerCase().trim()
  
  if (isAdminRole(normalizedRole)) return '👑'
  if (normalizedRole === 'diretor') return '⭐'
  if (normalizedRole === 'membro') return '👤'
  
  return '🎯'
}

// Obter descrição do nível de permissão
export function getPermissionDescription(roleName: string): string {
  if (!roleName) return 'Sem permissões'
  
  const normalizedRole = roleName.toLowerCase().trim()
  
  if (isAdminRole(normalizedRole)) {
    return 'Acesso total ao sistema'
  }
  
  if (normalizedRole === 'diretor') {
    return 'Acesso a gestão e relatórios'
  }
  
  if (normalizedRole === 'membro') {
    return 'Acesso básico'
  }
  
  return 'Acesso personalizado'
}
