# 🤝 Guia de Contribuição

Obrigado por considerar contribuir com o Atlética SaaS! Este documento fornece diretrizes para contribuir com o projeto.

## 📋 Índice

- [Código de Conduta](#código-de-conduta)
- [Como Contribuir](#como-contribuir)
- [Padrões de Código](#padrões-de-código)
- [Processo de Pull Request](#processo-de-pull-request)
- [Reportar Bugs](#reportar-bugs)
- [Sugerir Features](#sugerir-features)

## 📜 Código de Conduta

### Nosso Compromisso

Estamos comprometidos em tornar a participação neste projeto uma experiência livre de assédio para todos, independentemente de:
- Idade
- Tamanho corporal
- Deficiência
- Etnia
- Identidade e expressão de gênero
- Nível de experiência
- Nacionalidade
- Aparência pessoal
- Raça
- Religião
- Identidade e orientação sexual

### Comportamento Esperado

- Use linguagem acolhedora e inclusiva
- Respeite pontos de vista e experiências diferentes
- Aceite críticas construtivas graciosamente
- Foque no que é melhor para a comunidade
- Mostre empatia com outros membros

### Comportamento Inaceitável

- Uso de linguagem ou imagens sexualizadas
- Trolling, comentários insultuosos/depreciativos
- Assédio público ou privado
- Publicar informações privadas de outros
- Outras condutas consideradas inapropriadas

## 🚀 Como Contribuir

### 1. Fork o Projeto

```bash
# Clique em "Fork" no GitHub
# Clone seu fork
git clone https://github.com/SEU-USUARIO/atletica-saas.git
cd atletica-saas
```

### 2. Configure o Ambiente

```bash
# Instale dependências
npm install

# Configure variáveis de ambiente
cp .env.example .env.local
# Edite .env.local com suas credenciais
```

### 3. Crie uma Branch

```bash
# Para nova feature
git checkout -b feature/nome-da-feature

# Para bug fix
git checkout -b fix/nome-do-bug

# Para documentação
git checkout -b docs/nome-da-doc
```

### 4. Faça suas Mudanças

- Escreva código limpo e legível
- Siga os padrões do projeto
- Adicione comentários quando necessário
- Teste suas mudanças

### 5. Commit suas Mudanças

```bash
git add .
git commit -m "tipo: descrição curta

Descrição mais detalhada do que foi feito e por quê.

Closes #123"
```

### 6. Push para o GitHub

```bash
git push origin feature/nome-da-feature
```

### 7. Abra um Pull Request

1. Vá para o repositório original no GitHub
2. Clique em "Pull Requests"
3. Clique em "New Pull Request"
4. Selecione sua branch
5. Preencha o template de PR
6. Clique em "Create Pull Request"

## 💻 Padrões de Código

### TypeScript

```typescript
// ✅ BOM
interface User {
  id: string
  name: string
  email: string
}

function getUser(id: string): Promise<User> {
  // ...
}

// ❌ RUIM
function getUser(id) {
  // sem tipos
}
```

### React Components

```typescript
// ✅ BOM - Componente funcional com tipos
interface ButtonProps {
  onClick: () => void
  children: React.ReactNode
  variant?: 'primary' | 'secondary'
}

export function Button({ onClick, children, variant = 'primary' }: ButtonProps) {
  return (
    <button onClick={onClick} className={`btn-${variant}`}>
      {children}
    </button>
  )
}

// ❌ RUIM - Sem tipos
export function Button({ onClick, children }) {
  return <button onClick={onClick}>{children}</button>
}
```

### Naming Conventions

```typescript
// Componentes: PascalCase
export function UserCard() {}

// Funções: camelCase
function getUserData() {}

// Constantes: UPPER_SNAKE_CASE
const MAX_USERS = 100

// Interfaces/Types: PascalCase
interface UserData {}
type UserRole = 'admin' | 'member'

// Arquivos de componentes: PascalCase
// UserCard.tsx, Dashboard.tsx

// Arquivos utilitários: camelCase
// formatDate.ts, validateEmail.ts
```

### Estrutura de Arquivos

```
app/
├── dashboard/
│   ├── members/
│   │   └── page.tsx          # Página de membros
│   └── layout.tsx            # Layout do dashboard
components/
├── ui/                       # Componentes shadcn/ui
│   ├── button.tsx
│   └── card.tsx
├── UserCard.tsx              # Componentes específicos
└── Sidebar.tsx
lib/
├── supabase/                 # Clientes Supabase
│   ├── client.ts
│   └── server.ts
└── utils.ts                  # Utilitários gerais
```

### Imports

```typescript
// ✅ BOM - Ordem organizada
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { UserCard } from '@/components/UserCard'
import type { User } from '@/types/database'

// ❌ RUIM - Desorganizado
import { UserCard } from '@/components/UserCard'
import { useState } from 'react'
import type { User } from '@/types/database'
import { createClient } from '@/lib/supabase/client'
```

### Tailwind CSS

```typescript
// ✅ BOM - Classes organizadas
<div className="flex items-center justify-between p-4 bg-slate-900 border border-slate-800 rounded-lg hover:border-slate-700 transition-colors">

// ❌ RUIM - Classes desorganizadas
<div className="p-4 flex rounded-lg bg-slate-900 items-center border-slate-800 border justify-between">
```

### Comentários

```typescript
// ✅ BOM - Comentários úteis
// Calcula o saldo total subtraindo despesas das receitas
const saldo = totalReceitas - totalDespesas

// Busca apenas eventos futuros ordenados por data
const upcomingEvents = await supabase
  .from('events')
  .select('*')
  .gte('date', new Date().toISOString())
  .order('date', { ascending: true })

// ❌ RUIM - Comentários óbvios
// Define a variável saldo
const saldo = totalReceitas - totalDespesas

// Busca eventos
const events = await supabase.from('events').select('*')
```

## 🔄 Processo de Pull Request

### Template de PR

```markdown
## Descrição
Breve descrição do que foi feito

## Tipo de Mudança
- [ ] Bug fix
- [ ] Nova feature
- [ ] Breaking change
- [ ] Documentação

## Como Testar
1. Passo 1
2. Passo 2
3. Passo 3

## Checklist
- [ ] Código segue os padrões do projeto
- [ ] Testei localmente
- [ ] Adicionei comentários onde necessário
- [ ] Atualizei a documentação
- [ ] Sem warnings no console
- [ ] Build passa sem erros

## Screenshots (se aplicável)
[Adicione screenshots]

## Issues Relacionadas
Closes #123
```

### Revisão de Código

Seu PR será revisado considerando:

1. **Funcionalidade**: O código faz o que deveria?
2. **Qualidade**: O código é limpo e legível?
3. **Testes**: As mudanças foram testadas?
4. **Documentação**: A documentação foi atualizada?
5. **Performance**: Há impacto na performance?
6. **Segurança**: Há vulnerabilidades?

### Aprovação

- PRs precisam de pelo menos 1 aprovação
- Todos os checks devem passar
- Conflitos devem ser resolvidos
- Comentários devem ser endereçados

## 🐛 Reportar Bugs

### Antes de Reportar

1. Verifique se o bug já foi reportado
2. Teste na última versão
3. Colete informações sobre o bug

### Template de Bug Report

```markdown
## Descrição do Bug
Descrição clara e concisa do bug

## Como Reproduzir
1. Vá para '...'
2. Clique em '...'
3. Veja o erro

## Comportamento Esperado
O que deveria acontecer

## Comportamento Atual
O que está acontecendo

## Screenshots
[Adicione screenshots se aplicável]

## Ambiente
- OS: [ex: Windows 10]
- Browser: [ex: Chrome 120]
- Versão do Node: [ex: 18.17.0]

## Informações Adicionais
Qualquer outra informação relevante

## Logs
```
[Cole logs relevantes]
```
```

## 💡 Sugerir Features

### Template de Feature Request

```markdown
## Descrição da Feature
Descrição clara da feature proposta

## Problema que Resolve
Qual problema esta feature resolve?

## Solução Proposta
Como você imagina que funcione?

## Alternativas Consideradas
Outras soluções que você considerou?

## Impacto
- Quem se beneficia?
- Qual a prioridade?
- Há breaking changes?

## Mockups/Exemplos
[Adicione mockups ou exemplos se tiver]
```

## 🎯 Áreas para Contribuir

### 🐛 Bugs Conhecidos

Veja issues com label `bug`

### ✨ Features Planejadas

Veja issues com label `enhancement`

### 📚 Documentação

- Melhorar README
- Adicionar tutoriais
- Traduzir documentação
- Adicionar exemplos

### 🎨 Design

- Melhorar UI/UX
- Adicionar animações
- Melhorar responsividade
- Criar temas

### 🧪 Testes

- Adicionar testes unitários
- Adicionar testes E2E
- Melhorar cobertura

### ⚡ Performance

- Otimizar queries
- Reduzir bundle size
- Melhorar loading times
- Otimizar imagens

## 🏆 Reconhecimento

Contribuidores serão:
- Listados no README
- Mencionados nos releases
- Reconhecidos na comunidade

## 📞 Contato

- **Issues**: Para bugs e features
- **Discussions**: Para perguntas e ideias
- **Email**: [seu-email@example.com]

## 📚 Recursos Úteis

### Documentação
- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [TypeScript Docs](https://www.typescriptlang.org/docs)

### Tutoriais
- [React Patterns](https://reactpatterns.com)
- [TypeScript Best Practices](https://typescript-eslint.io)
- [Git Best Practices](https://git-scm.com/book/en/v2)

### Comunidades
- [Next.js Discord](https://nextjs.org/discord)
- [Supabase Discord](https://discord.supabase.com)
- [React Brasil](https://react.dev/community)

## 🎓 Primeiros Passos

### Para Iniciantes

1. Comece com issues marcadas como `good first issue`
2. Leia toda a documentação
3. Configure o ambiente local
4. Faça pequenas mudanças primeiro
5. Peça ajuda quando necessário

### Para Experientes

1. Veja issues complexas
2. Proponha arquiteturas
3. Revise PRs de outros
4. Ajude iniciantes
5. Melhore a infraestrutura

## ✅ Checklist do Contribuidor

Antes de submeter um PR:

- [ ] Li o guia de contribuição
- [ ] Segui os padrões de código
- [ ] Testei minhas mudanças
- [ ] Atualizei a documentação
- [ ] Adicionei comentários úteis
- [ ] Resolvi conflitos
- [ ] Build passa sem erros
- [ ] Sem warnings no console
- [ ] Preenchi o template de PR

## 🙏 Agradecimentos

Obrigado por contribuir com o Atlética SaaS!

Sua contribuição ajuda atléticas universitárias a se organizarem melhor e focarem no que realmente importa: os atletas e a comunidade.

---

**Dúvidas?** Abra uma issue ou discussion!

**Quer conversar?** Entre em contato!

**Gostou do projeto?** Dê uma ⭐ no GitHub!
