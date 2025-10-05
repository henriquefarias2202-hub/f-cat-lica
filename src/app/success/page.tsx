"use client"

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Crown, Check, ArrowRight, Star, Gift, Loader2 } from 'lucide-react'

interface SessionData {
  sessionId: string
  customerEmail: string
  planName: string
  paymentStatus: string
  subscriptionId: string
  amountTotal: number
  currency: string
}

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [sessionData, setSessionData] = useState<SessionData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (sessionId) {
      fetchSessionData(sessionId)
    } else {
      setError('ID da sessão não encontrado')
      setLoading(false)
    }
  }, [sessionId])

  const fetchSessionData = async (sessionId: string) => {
    try {
      const response = await fetch(`/api/verify-session?session_id=${sessionId}`)
      
      if (!response.ok) {
        throw new Error('Erro ao verificar sessão')
      }

      const data = await response.json()
      setSessionData(data)
    } catch (error) {
      console.error('Erro ao buscar dados da sessão:', error)
      setError('Erro ao carregar informações do pagamento')
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (amount: number, currency: string) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: currency.toUpperCase()
    }).format(amount / 100)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-green-600 animate-spin mx-auto mb-4" />
          <p className="text-xl font-bold text-gray-800">Verificando seu pagamento...</p>
          <p className="text-gray-600">Aguarde um momento</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-red-50 to-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Erro ao Verificar Pagamento</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => window.location.href = '/'}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300"
          >
            Voltar ao Início
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Header de Sucesso */}
      <section className="relative bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 text-white py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
        
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="bg-white/20 backdrop-blur-sm p-6 rounded-full">
                <Crown className="w-20 h-20 text-yellow-300 animate-bounce" />
              </div>
              <div className="absolute -top-2 -right-2 bg-yellow-400 text-green-800 text-xs px-3 py-1 rounded-full font-bold animate-pulse">
                ATIVO
              </div>
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
            🎉 <span className="text-yellow-300">PARABÉNS!</span><br />
            SUA <span className="text-yellow-300">TRANSFORMAÇÃO</span> COMEÇOU!
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed">
            Você agora faz parte da <strong className="text-yellow-300">elite espiritual</strong> que possui acesso 
            aos segredos sagrados que moldaram impérios e transformaram milhões de vidas!
          </p>
          
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20 max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Check className="w-8 h-8 text-green-300" />
              <span className="text-2xl font-bold">Pagamento Confirmado</span>
            </div>
            {sessionData && (
              <>
                <p className="text-lg mb-2">
                  Plano <strong className="text-yellow-300">{sessionData.planName}</strong> ativado com sucesso!
                </p>
                <p className="text-lg mb-2">
                  Valor: <strong className="text-yellow-300">{formatPrice(sessionData.amountTotal, sessionData.currency)}</strong>
                </p>
                <p className="text-sm text-green-200">
                  E-mail: {sessionData.customerEmail}
                </p>
                <p className="text-sm text-green-200 mt-2">
                  ID da Transação: {sessionData.sessionId.slice(0, 20)}...
                </p>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Próximos Passos */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-gray-800 mb-4">
              SEUS <span className="text-green-600">PRÓXIMOS PASSOS</span>
            </h2>
            <p className="text-xl text-gray-600">
              Siga estas etapas para começar sua jornada espiritual imperial
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white p-8 rounded-2xl shadow-xl border-2 border-green-200 text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-black text-green-600">1</span>
              </div>
              <h3 className="text-xl font-black text-gray-800 mb-4">Verifique seu E-mail</h3>
              <p className="text-gray-600 mb-6">
                Enviamos suas credenciais de acesso e o guia de boas-vindas para seu e-mail
              </p>
              <div className="bg-green-50 text-green-800 px-4 py-2 rounded-lg text-sm font-bold">
                📧 Chegará em até 5 minutos
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-xl border-2 border-green-200 text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-black text-green-600">2</span>
              </div>
              <h3 className="text-xl font-black text-gray-800 mb-4">Acesse a Plataforma</h3>
              <p className="text-gray-600 mb-6">
                Use suas credenciais para acessar mais de 500 orações sagradas exclusivas
              </p>
              <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300">
                ACESSAR AGORA
              </button>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-xl border-2 border-green-200 text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-black text-green-600">3</span>
              </div>
              <h3 className="text-xl font-black text-gray-800 mb-4">Junte-se à Comunidade</h3>
              <p className="text-gray-600 mb-6">
                Entre no grupo VIP exclusivo para membros no WhatsApp e Telegram
              </p>
              <div className="bg-green-50 text-green-800 px-4 py-2 rounded-lg text-sm font-bold">
                👑 Acesso VIP Liberado
              </div>
            </div>
          </div>

          {/* Benefícios Desbloqueados */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-8 rounded-2xl border-2 border-green-200">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-black text-gray-800 mb-4">
                🔓 BENEFÍCIOS DESBLOQUEADOS
              </h3>
              <p className="text-gray-600">
                Tudo isso está disponível para você AGORA MESMO:
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Check className="w-6 h-6 text-green-600" />
                  <span className="font-bold text-gray-800">500+ Orações Sagradas Exclusivas</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-6 h-6 text-green-600" />
                  <span className="font-bold text-gray-800">Manuscritos em Latim e Aramaico</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-6 h-6 text-green-600" />
                  <span className="font-bold text-gray-800">Consultoria Espiritual Personalizada</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-6 h-6 text-green-600" />
                  <span className="font-bold text-gray-800">Comunidade VIP Exclusiva</span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Check className="w-6 h-6 text-green-600" />
                  <span className="font-bold text-gray-800">Suporte Espiritual 24/7</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-6 h-6 text-green-600" />
                  <span className="font-bold text-gray-800">Certificado de Membro Oficial</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-6 h-6 text-green-600" />
                  <span className="font-bold text-gray-800">Acesso Prioritário a Novos Conteúdos</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-6 h-6 text-green-600" />
                  <span className="font-bold text-gray-800">Garantia Total de 30 Dias</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testemunho de Boas-Vindas */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-amber-50 to-red-50 p-12 rounded-3xl border-2 border-amber-200">
            <div className="mb-8">
              <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Crown className="w-10 h-10 text-amber-600" />
              </div>
              <h3 className="text-2xl font-black text-gray-800 mb-4">
                MENSAGEM DO FUNDADOR
              </h3>
            </div>
            
            <blockquote className="text-xl text-gray-700 italic leading-relaxed mb-6">
              "Bem-vindo à nossa irmandade sagrada! Você acaba de dar o passo mais importante 
              de sua vida espiritual. As orações que agora estão em suas mãos transformaram 
              imperadores, santos e milhões de almas ao longo da história. Use-as com fé, 
              disciplina e reverência, e testemunhe o poder divino transformar cada aspecto 
              de sua existência."
            </blockquote>
            
            <div className="flex items-center justify-center gap-4">
              <div className="text-right">
                <p className="font-black text-gray-800">Padre Miguel Santos</p>
                <p className="text-sm text-gray-600">Fundador da Fé Imperial</p>
              </div>
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-2xl">👨‍💼</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 px-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-black mb-6">
            SUA JORNADA <span className="text-yellow-300">IMPERIAL</span> COMEÇA AGORA!
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Não perca tempo! Acesse imediatamente sua conta e comece a transformar sua vida 
            com o poder das orações sagradas.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-yellow-400 hover:bg-yellow-500 text-green-800 font-black py-4 px-8 rounded-xl text-lg transition-all duration-300 hover:scale-105">
              <span className="flex items-center gap-3">
                <Crown className="w-6 h-6" />
                ACESSAR MINHA CONTA
                <ArrowRight className="w-6 h-6" />
              </span>
            </button>
            
            <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-bold py-4 px-8 rounded-xl text-lg transition-all duration-300 border border-white/30">
              <span className="flex items-center gap-3">
                <Gift className="w-6 h-6" />
                BAIXAR APP MOBILE
              </span>
            </button>
          </div>
          
          <div className="mt-8 flex items-center justify-center gap-4 text-green-200">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-current text-yellow-300" />
              ))}
            </div>
            <span className="font-bold">Avaliação 4.9/5 • 50.000+ membros ativos</span>
          </div>
        </div>
      </section>
    </div>
  )
}