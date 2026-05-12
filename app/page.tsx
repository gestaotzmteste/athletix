import Link from 'next/link'
import { ArrowRight, Users, DollarSign, Calendar, ShoppingBag } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <nav className="flex justify-between items-center mb-20">
          <h1 className="text-2xl font-bold text-white">Atlética SaaS</h1>
          <div className="flex gap-4">
            <Link
              href="/login"
              className="px-6 py-2 text-white hover:text-blue-400 transition-colors"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Começar Grátis
            </Link>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Gerencie sua Atlética
            <br />
            <span className="text-blue-400">de forma simples</span>
          </h2>
          <p className="text-xl text-slate-400 mb-8 max-w-2xl mx-auto">
            Plataforma completa para gestão de atléticas universitárias. 
            Controle membros, finanças, eventos e loja em um só lugar.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold rounded-lg transition-colors shadow-lg shadow-blue-900/50"
          >
            Começar Agora
            <ArrowRight size={20} />
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {[
            {
              icon: Users,
              title: 'Gestão de Membros',
              description: 'Cadastre e gerencie todos os membros da sua atlética com facilidade'
            },
            {
              icon: DollarSign,
              title: 'Controle Financeiro',
              description: 'Acompanhe receitas e despesas com relatórios detalhados'
            },
            {
              icon: Calendar,
              title: 'Eventos',
              description: 'Organize e gerencie todos os eventos da sua atlética'
            },
            {
              icon: ShoppingBag,
              title: 'Loja Online',
              description: 'Venda produtos e controle o estoque de forma integrada'
            }
          ].map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-colors"
              >
                <div className="bg-blue-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-slate-400">{feature.description}</p>
              </div>
            )
          })}
        </div>

        {/* CTA Section */}
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-12 text-center">
          <h3 className="text-3xl font-bold text-white mb-4">
            Pronto para começar?
          </h3>
          <p className="text-slate-400 mb-8 max-w-xl mx-auto">
            Crie sua conta gratuitamente e comece a gerenciar sua atlética de forma profissional.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold rounded-lg transition-colors"
          >
            Criar Conta Grátis
            <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </div>
  )
}
