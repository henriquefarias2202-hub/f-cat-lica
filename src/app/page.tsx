"use client"

import { useState, useEffect } from 'react'
import { Crown, Cross, Heart, Users, Star, Lock, Check, ArrowRight, BookOpen, Shield, Clock, Zap, Trophy, Eye, AlertTriangle, Gift } from 'lucide-react'
import { createCheckoutSession, SUBSCRIPTION_PLANS } from '@/lib/stripe'

export default function Home() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [timeLeft, setTimeLeft] = useState(3600) // 1 hora em segundos
  const [viewersCount, setViewersCount] = useState(847)
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)

  // Timer de urgência
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => prev > 0 ? prev - 1 : 3600)
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Contador de visualizações dinâmico
  useEffect(() => {
    const viewerTimer = setInterval(() => {
      setViewersCount(prev => prev + Math.floor(Math.random() * 3) - 1)
    }, 5000)
    return () => clearInterval(viewerTimer)
  }, [])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Função para processar pagamento com validação
  const handleSubscribe = async (planKey: keyof typeof SUBSCRIPTION_PLANS) => {
    setIsProcessingPayment(true)
    try {
      const plan = SUBSCRIPTION_PLANS[planKey]
      
      // Verificar se as variáveis de ambiente estão configuradas
      if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
        alert('Sistema de pagamento não configurado. Entre em contato com o suporte.')
        return
      }
      
      // Tracking de conversão
      if (typeof window !== 'undefined') {
        // Google Analytics
        if (window.gtag) {
          window.gtag('event', 'begin_checkout', {
            currency: 'BRL',
            value: plan.price / 100,
            items: [{
              item_id: planKey,
              item_name: plan.name,
              category: 'Subscription',
              quantity: 1,
              price: plan.price / 100
            }]
          })
        }

        // Facebook Pixel
        if (window.fbq) {
          window.fbq('track', 'InitiateCheckout', {
            value: plan.price / 100,
            currency: 'BRL',
            content_name: plan.name,
            content_category: 'Subscription'
          })
        }

        // TikTok Pixel
        if (window.ttq) {
          window.ttq.track('InitiateCheckout', {
            value: plan.price / 100,
            currency: 'BRL',
            content_name: plan.name
          })
        }
      }

      await createCheckoutSession(plan.priceId)
    } catch (error) {
      console.error('Erro ao processar pagamento:', error)
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
      
      if (errorMessage.includes('não configurada')) {
        alert('Sistema de pagamento não configurado. Entre em contato com o suporte.')
      } else {
        alert(`Erro ao processar pagamento: ${errorMessage}`)
      }
    } finally {
      setIsProcessingPayment(false)
    }
  }

  const freeOrações = [
    {
      title: "Oração da Manhã dos Imperadores",
      preview: "Senhor, como os grandes líderes da antiguidade, coloco minha vida em Vossas mãos...",
      category: "Individual",
      power: "Despertar Interior"
    },
    {
      title: "Oração da Proteção Familiar",
      preview: "Deus Pai, como protegestes as famílias dos justos, abençoai nossa casa...",
      category: "Família",
      power: "Escudo Divino"
    },
    {
      title: "Oração da Abundância Sagrada",
      preview: "Pai Celestial, assim como multiplicastes os pães, multiplica minhas bênçãos...",
      category: "Prosperidade",
      power: "Multiplicação"
    }
  ]

  const premiumOrações = [
    "Orações Secretas dos Papas Medievais",
    "Manuscritos de São Bento em Latim Original",
    "Rituais de Prosperidade dos Templários",
    "Orações de Proteção dos Cruzados",
    "Salmos de Poder em Aramaico Antigo",
    "Bênçãos Imperiais de Constantino",
    "Orações de Cura dos Santos Padres",
    "Rituais Sagrados dos Mosteiros Secretos"
  ]

  const plans = [
    {
      name: "Discípulo",
      price: "R$ 29,90",
      originalPrice: "R$ 59,90",
      period: "/mês",
      description: "Para quem busca despertar seu poder interior",
      features: [
        "50+ Orações Exclusivas dos Santos",
        "Textos Sagrados Traduzidos do Latim",
        "Orações Diárias Personalizadas",
        "Suporte Espiritual 24h",
        "Acesso ao App Mobile"
      ],
      popular: false,
      badge: "MAIS PROCURADO",
      savings: "50% OFF",
      planKey: "DISCIPULO" as keyof typeof SUBSCRIPTION_PLANS
    },
    {
      name: "Apóstolo",
      price: "R$ 49,90",
      originalPrice: "R$ 149,90",
      period: "/mês",
      description: "O caminho dos verdadeiros conquistadores",
      features: [
        "200+ Orações dos Grandes Líderes",
        "Manuscritos Secretos em Latim e Aramaico",
        "Rituais de Proteção e Prosperidade",
        "Consultoria Espiritual Semanal",
        "Comunidade VIP Exclusiva",
        "Certificado de Membro Apostólico",
        "Acesso Prioritário a Novos Conteúdos"
      ],
      popular: true,
      badge: "RECOMENDADO",
      savings: "67% OFF",
      planKey: "APOSTOLO" as keyof typeof SUBSCRIPTION_PLANS
    },
    {
      name: "Santo Padre",
      price: "R$ 99,90",
      originalPrice: "R$ 299,90",
      period: "/mês",
      description: "Para os escolhidos que lideram pelo exemplo divino",
      features: [
        "500+ Orações dos Papas e Santos",
        "Manuscritos Originais dos Mosteiros",
        "Rituais Secretos dos Templários",
        "Orações Personalizadas Exclusivas",
        "Consultoria Espiritual Diária",
        "Acesso VIP Total à Comunidade",
        "Certificado Papal Honorário",
        "Linha Direta com Mentores Espirituais"
      ],
      popular: false,
      badge: "ELITE ESPIRITUAL",
      savings: "70% OFF",
      planKey: "SANTO_PADRE" as keyof typeof SUBSCRIPTION_PLANS
    }
  ]

  const socialProof = [
    "✅ Padre Miguel (SP) adquiriu o plano Santo Padre há 2 minutos",
    "✅ Maria Silva (RJ) renovou sua assinatura Apóstolo há 5 minutos",
    "✅ João Santos (MG) se tornou membro Discípulo há 8 minutos",
    "✅ Ana Costa (RS) upgrade para Santo Padre há 12 minutos"
  ]

  const [currentProof, setCurrentProof] = useState(0)

  useEffect(() => {
    const proofTimer = setInterval(() => {
      setCurrentProof(prev => (prev + 1) % socialProof.length)
    }, 4000)
    return () => clearInterval(proofTimer)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      {/* Barra de Urgência */}
      <div className="bg-red-600 text-white py-2 px-4 text-center font-bold animate-pulse">
        <div className="flex items-center justify-center gap-4 text-sm">
          <AlertTriangle className="w-4 h-4" />
          <span>OFERTA LIMITADA: {formatTime(timeLeft)} restantes</span>
          <Eye className="w-4 h-4" />
          <span>{viewersCount} pessoas visualizando agora</span>
        </div>
      </div>

      {/* Prova Social Flutuante */}
      <div className="fixed bottom-4 left-4 z-50 bg-green-600 text-white p-3 rounded-lg shadow-2xl max-w-xs animate-bounce">
        <div className="text-xs font-semibold">
          {socialProof[currentProof]}
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-red-900 via-red-800 to-amber-900 text-white py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
        
        <div className="relative max-w-6xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <Crown className="w-20 h-20 text-amber-300 animate-pulse" />
              <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                NOVO
              </div>
            </div>
          </div>
          
          <div className="mb-4 inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 px-4 py-2 rounded-full text-sm font-bold">
            <Zap className="w-4 h-4" />
            MAIS DE 50.000 VIDAS TRANSFORMADAS
          </div>
          
          <h1 className="text-5xl md:text-8xl font-black mb-6 leading-tight">
            <span className="text-amber-300 drop-shadow-2xl">DESPERTE</span> O PODER<br />
            <span className="bg-gradient-to-r from-amber-300 to-yellow-400 bg-clip-text text-transparent">IMPERIAL</span> DA SUA <span className="text-amber-300">FÉ</span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto leading-relaxed font-medium">
            Descubra os <strong className="text-amber-300">segredos espirituais milenares</strong> que grandes líderes da história utilizaram para 
            <strong className="text-amber-300"> conquistar impérios, acumular riquezas e alcançar a imortalidade espiritual</strong>. 
            Transforme sua vida com as orações sagradas que moldaram civilizações.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8">
            <button 
              onClick={() => document.getElementById('planos')?.scrollIntoView({ behavior: 'smooth' })}
              className="group bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-black font-black py-6 px-12 rounded-xl text-xl transition-all duration-300 hover:scale-110 shadow-2xl hover:shadow-amber-500/50"
            >
              <span className="flex items-center gap-3">
                <Trophy className="w-6 h-6" />
                INICIAR ASCENSÃO ESPIRITUAL
                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </span>
            </button>
            
            <div className="flex items-center gap-3 text-amber-200 bg-black/20 px-6 py-3 rounded-full">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current text-amber-400" />
                ))}
              </div>
              <span className="font-bold">4.9/5 • 12.847 avaliações</span>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto text-center">
            <div>
              <div className="text-3xl font-black text-amber-300">50K+</div>
              <div className="text-sm text-amber-200">Membros Ativos</div>
            </div>
            <div>
              <div className="text-3xl font-black text-amber-300">500+</div>
              <div className="text-sm text-amber-200">Orações Sagradas</div>
            </div>
            <div>
              <div className="text-3xl font-black text-amber-300">98%</div>
              <div className="text-sm text-amber-200">Taxa de Sucesso</div>
            </div>
          </div>
        </div>
      </section>

      {/* Seção de Escassez */}
      <section className="py-8 px-4 bg-gradient-to-r from-red-600 to-red-700 text-white">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-4 mb-4">
            <Clock className="w-8 h-8 text-yellow-300 animate-spin" />
            <h3 className="text-2xl font-bold">ATENÇÃO: OFERTA EXPIRA EM {formatTime(timeLeft)}</h3>
            <Clock className="w-8 h-8 text-yellow-300 animate-spin" />
          </div>
          <p className="text-lg">
            Apenas <strong className="text-yellow-300">47 vagas restantes</strong> para novos membros hoje. 
            Não perca esta oportunidade única de transformar sua vida espiritual!
          </p>
        </div>
      </section>

      {/* Orações Gratuitas com Mais Persuasão */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-bold mb-4">
              <Gift className="w-4 h-4" />
              AMOSTRA GRÁTIS EXCLUSIVA
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-gray-800 mb-4">
              Experimente o <span className="text-red-700">PODER TRANSFORMADOR</span><br />
              das Orações Imperiais
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Estas são apenas <strong>3 das mais de 500 orações sagradas</strong> que mudaram o destino de imperadores, 
              santos e líderes ao longo da história. Sinta na pele o poder que elas possuem.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {freeOrações.map((oracao, index) => (
              <div key={index} className="group bg-gradient-to-br from-amber-50 to-red-50 p-8 rounded-2xl shadow-xl border-2 border-amber-200 hover:border-amber-400 hover:shadow-2xl transition-all duration-500 hover:scale-105">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Cross className="w-7 h-7 text-red-700" />
                    <span className="text-sm font-black text-red-700 uppercase tracking-wide">
                      {oracao.category}
                    </span>
                  </div>
                  <div className="bg-amber-500 text-black text-xs px-3 py-1 rounded-full font-bold">
                    {oracao.power}
                  </div>
                </div>
                <h3 className="text-xl font-black text-gray-800 mb-4">{oracao.title}</h3>
                <p className="text-gray-600 mb-6 italic text-lg leading-relaxed">"{oracao.preview}"</p>
                <button className="w-full bg-gradient-to-r from-red-700 to-red-800 hover:from-red-800 hover:to-red-900 text-white font-black py-4 px-6 rounded-xl transition-all duration-300 group-hover:scale-105 shadow-lg">
                  EXPERIMENTAR PODER AGORA
                </button>
              </div>
            ))}
          </div>

          <div className="text-center">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-amber-100 to-red-100 text-red-800 px-8 py-4 rounded-2xl font-black text-lg border-2 border-red-200">
              <Lock className="w-6 h-6" />
              Estas são apenas 0,6% das orações sagradas disponíveis para membros
              <Shield className="w-6 h-6" />
            </div>
          </div>
        </div>
      </section>

      {/* Conteúdo Premium com Mais Impacto */}
      <section className="py-20 px-4 bg-gradient-to-r from-red-900 via-black to-amber-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%22100%22%20height%3D%22100%22%20viewBox%3D%220%200%20100%20100%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M50%205L61.8%2038.2L95%2038.2L68.1%2061.8L79.9%2095L50%2071.8L20.1%2095L31.9%2061.8L5%2038.2L38.2%2038.2L50%205Z%22%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.03%22/%3E%3C/svg%3E')] opacity-10"></div>
        
        <div className="relative max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 px-6 py-3 rounded-full text-sm font-bold mb-6">
              <Crown className="w-5 h-5" />
              CONTEÚDO EXCLUSIVO PARA MEMBROS
            </div>
            <h2 className="text-4xl md:text-6xl font-black mb-8">
              OS <span className="text-amber-300">SEGREDOS SAGRADOS</span><br />
              QUE CONSTRUÍRAM <span className="text-amber-300">IMPÉRIOS</span>
            </h2>
            <p className="text-xl max-w-5xl mx-auto leading-relaxed font-medium">
              Por mais de <strong className="text-amber-300">1.500 anos</strong>, estas orações foram guardadas nos 
              <strong className="text-amber-300"> mosteiros mais secretos da Europa</strong>. Manuscritos originais traduzidos 
              diretamente do <strong className="text-amber-300">Latim Eclesiástico e Aramaico Antigo</strong> por nossos especialistas em línguas mortas.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {premiumOrações.map((oracao, index) => (
              <div key={index} className="group bg-black/40 backdrop-blur-sm p-6 rounded-2xl border-2 border-amber-500/30 hover:border-amber-400 transition-all duration-500 hover:scale-105">
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="w-7 h-7 text-amber-400" />
                  <Lock className="w-5 h-5 text-amber-400" />
                </div>
                <h3 className="font-black text-amber-200 mb-3 text-lg">{oracao}</h3>
                <p className="text-sm text-gray-300 mb-4">Manuscrito original preservado</p>
                <div className="bg-red-600/20 text-red-300 text-xs px-3 py-2 rounded-full font-bold text-center">
                  ACESSO RESTRITO
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <div className="inline-flex items-center gap-4 bg-gradient-to-r from-red-600/20 to-amber-600/20 backdrop-blur-sm px-8 py-4 rounded-2xl border border-amber-500/30">
              <AlertTriangle className="w-6 h-6 text-amber-400" />
              <span className="text-lg font-bold">
                Conteúdo disponível apenas para <span className="text-amber-300">membros verificados</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Planos com Máxima Persuasão */}
      <section id="planos" className="py-24 px-4 bg-gray-50 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-50/30 to-transparent"></div>
        
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-red-100 text-red-800 px-6 py-3 rounded-full text-sm font-bold mb-6">
              <Clock className="w-5 h-5" />
              ÚLTIMAS {formatTime(timeLeft)} DA PROMOÇÃO
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-gray-800 mb-8">
              ESCOLHA SEU <span className="text-red-700">DESTINO ESPIRITUAL</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Assim como <strong>Constantino investiu na fé para construir o maior império da história</strong>, 
              invista em sua jornada espiritual e transforme sua vida para sempre. 
              <strong className="text-red-700"> Mais de 50.000 pessoas já fizeram essa escolha.</strong>
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {plans.map((plan, index) => (
              <div 
                key={index} 
                className={`relative bg-white rounded-3xl shadow-2xl p-8 transition-all duration-500 hover:scale-105 ${
                  plan.popular ? 'ring-4 ring-amber-400 transform scale-110 z-10' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-amber-400 to-amber-600 text-black font-black px-8 py-3 rounded-full text-sm shadow-lg">
                      👑 {plan.badge}
                    </div>
                  </div>
                )}
                
                {!plan.popular && (
                  <div className="absolute -top-4 right-4">
                    <div className="bg-red-600 text-white font-bold px-4 py-2 rounded-full text-xs">
                      {plan.savings}
                    </div>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className="text-3xl font-black text-gray-800 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-6 text-lg">{plan.description}</p>
                  
                  <div className="mb-4">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <span className="text-2xl text-gray-400 line-through">{plan.originalPrice}</span>
                      <span className="bg-red-600 text-white text-sm px-2 py-1 rounded font-bold">
                        {plan.savings}
                      </span>
                    </div>
                    <div className="flex items-baseline justify-center">
                      <span className="text-5xl font-black text-red-700">{plan.price}</span>
                      <span className="text-gray-500 ml-2 text-lg">{plan.period}</span>
                    </div>
                  </div>
                  
                  <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-bold">
                    💰 Economia de {plan.originalPrice.replace('R$ ', 'R$ ')} por mês
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <Check className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button 
                  className={`w-full py-5 px-6 rounded-2xl font-black text-lg transition-all duration-300 hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${
                    plan.popular 
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black hover:from-amber-600 hover:to-amber-700 shadow-amber-500/30' 
                      : 'bg-gradient-to-r from-red-700 to-red-800 hover:from-red-800 hover:to-red-900 text-white'
                  }`}
                  onClick={() => handleSubscribe(plan.planKey)}
                  disabled={isProcessingPayment}
                >
                  {isProcessingPayment ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div>
                      PROCESSANDO...
                    </span>
                  ) : (
                    '🚀 INICIAR TRANSFORMAÇÃO AGORA'
                  )}
                </button>
                
                <p className="text-center text-sm text-gray-500 mt-4">
                  ✅ Garantia incondicional de 30 dias
                </p>
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <div className="inline-flex items-center gap-4 bg-red-600 text-white px-8 py-4 rounded-2xl font-bold text-lg">
              <AlertTriangle className="w-6 h-6" />
              ATENÇÃO: Preços voltam ao normal em {formatTime(timeLeft)}
            </div>
          </div>
        </div>
      </section>

      {/* Testemunhos Mais Impactantes */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-gray-800 mb-6">
              <span className="text-red-700">50.000+ VIDAS</span> TRANSFORMADAS<br />
              RESULTADOS <span className="text-red-700">COMPROVADOS</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Veja como a fé verdadeira mudou completamente a vida de milhares de pessoas em todo o Brasil
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {[
              {
                name: "Maria Santos",
                role: "Empresária • São Paulo",
                image: "👩‍💼",
                text: "Em 90 dias usando as orações imperiais, minha empresa cresceu 400% e consegui comprar minha casa própria. É inexplicável o poder que essas orações têm!",
                result: "Faturamento: R$ 50k → R$ 200k/mês"
              },
              {
                name: "João Silva",
                role: "Pai de Família • Rio de Janeiro",
                image: "👨‍👩‍👧‍👦",
                text: "Minha família estava destruída. Após 30 dias com as orações familiares, meus filhos mudaram completamente e meu casamento foi salvo. Milagre real!",
                result: "Família reunida e próspera"
              },
              {
                name: "Ana Costa",
                role: "Professora • Minas Gerais",
                image: "👩‍🏫",
                text: "Encontrei meu propósito de vida através das escrituras em latim. Hoje tenho uma conexão divina que nunca imaginei ser possível. Minha vida mudou 180°!",
                result: "Paz interior e prosperidade"
              }
            ].map((testemunho, index) => (
              <div key={index} className="bg-gradient-to-br from-amber-50 to-red-50 p-8 rounded-2xl shadow-xl border-2 border-amber-200 hover:shadow-2xl transition-all duration-300">
                <div className="text-center mb-6">
                  <div className="text-4xl mb-3">{testemunho.image}</div>
                  <div className="flex items-center justify-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-amber-500 fill-current" />
                    ))}
                  </div>
                </div>
                
                <p className="text-gray-700 mb-6 italic text-lg leading-relaxed font-medium">
                  "{testemunho.text}"
                </p>
                
                <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg mb-4 font-bold text-center">
                  📈 {testemunho.result}
                </div>
                
                <div className="text-center">
                  <p className="font-black text-gray-800 text-lg">{testemunho.name}</p>
                  <p className="text-sm text-gray-600">{testemunho.role}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <div className="inline-flex items-center gap-4 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 px-8 py-4 rounded-2xl font-bold text-lg">
              <Trophy className="w-6 h-6" />
              98% dos membros relatam transformação completa em 30 dias
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final Mais Persuasivo */}
      <section className="py-24 px-4 bg-gradient-to-r from-red-900 via-black to-amber-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] animate-pulse"></div>
        
        <div className="relative max-w-5xl mx-auto text-center">
          <div className="mb-8">
            <div className="inline-flex items-center gap-3 bg-red-600/30 backdrop-blur-sm text-red-300 px-6 py-3 rounded-full text-lg font-bold mb-6">
              <Clock className="w-6 h-6 animate-spin" />
              ÚLTIMOS {formatTime(timeLeft)} PARA GARANTIR SEU LUGAR
            </div>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight">
            SUA <span className="text-amber-300">TRANSFORMAÇÃO ESPIRITUAL</span><br />
            COMEÇA <span className="text-amber-300">AGORA</span> OU NUNCA
          </h2>
          
          <p className="text-xl md:text-2xl mb-12 leading-relaxed font-medium max-w-4xl mx-auto">
            <strong className="text-amber-300">Mais de 50.000 pessoas</strong> já descobriram o poder transformador 
            das orações que <strong className="text-amber-300">moldaram impérios e mudaram o curso da história</strong>. 
            Não deixe que mais um dia passe sem experimentar essa força divina em sua vida.
          </p>
          
          <div className="mb-8">
            <button 
              onClick={() => document.getElementById('planos')?.scrollIntoView({ behavior: 'smooth' })}
              className="group bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-600 hover:via-yellow-600 hover:to-amber-700 text-black font-black py-8 px-16 rounded-2xl text-2xl transition-all duration-300 hover:scale-110 shadow-2xl hover:shadow-amber-500/50"
            >
              <span className="flex items-center gap-4">
                <Crown className="w-8 h-8" />
                COMEÇAR TRANSFORMAÇÃO IMPERIAL AGORA
                <ArrowRight className="w-8 h-8 group-hover:translate-x-3 transition-transform" />
              </span>
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-green-600/20 backdrop-blur-sm px-6 py-4 rounded-xl border border-green-500/30">
              <div className="text-green-300 font-bold">✅ Garantia Total</div>
              <div className="text-sm text-green-200">30 dias ou dinheiro de volta</div>
            </div>
            <div className="bg-blue-600/20 backdrop-blur-sm px-6 py-4 rounded-xl border border-blue-500/30">
              <div className="text-blue-300 font-bold">🚀 Acesso Imediato</div>
              <div className="text-sm text-blue-200">Comece sua transformação hoje</div>
            </div>
            <div className="bg-purple-600/20 backdrop-blur-sm px-6 py-4 rounded-xl border border-purple-500/30">
              <div className="text-purple-300 font-bold">👑 Suporte VIP</div>
              <div className="text-sm text-purple-200">Mentoria espiritual inclusa</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Crown className="w-10 h-10 text-amber-400" />
                <span className="text-2xl font-black">Fé Imperial</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Conectando almas ao divino através das orações sagradas que transformaram impérios 
                e mudaram o destino de milhões de pessoas ao longo da história.
              </p>
            </div>
            <div>
              <h4 className="font-black mb-6 text-lg">Orações Sagradas</h4>
              <ul className="space-y-3 text-gray-400">
                <li className="hover:text-amber-400 cursor-pointer transition-colors">Individuais</li>
                <li className="hover:text-amber-400 cursor-pointer transition-colors">Familiares</li>
                <li className="hover:text-amber-400 cursor-pointer transition-colors">Prosperidade</li>
                <li className="hover:text-amber-400 cursor-pointer transition-colors">Proteção</li>
              </ul>
            </div>
            <div>
              <h4 className="font-black mb-6 text-lg">Suporte VIP</h4>
              <ul className="space-y-3 text-gray-400">
                <li className="hover:text-amber-400 cursor-pointer transition-colors">Central de Ajuda</li>
                <li className="hover:text-amber-400 cursor-pointer transition-colors">Consultoria Espiritual</li>
                <li className="hover:text-amber-400 cursor-pointer transition-colors">Comunidade Exclusiva</li>
                <li className="hover:text-amber-400 cursor-pointer transition-colors">Contato Direto</li>
              </ul>
            </div>
            <div>
              <h4 className="font-black mb-6 text-lg">Conecte-se</h4>
              <ul className="space-y-3 text-gray-400">
                <li className="hover:text-amber-400 cursor-pointer transition-colors">📱 TikTok</li>
                <li className="hover:text-amber-400 cursor-pointer transition-colors">📷 Instagram</li>
                <li className="hover:text-amber-400 cursor-pointer transition-colors">🎥 YouTube</li>
                <li className="hover:text-amber-400 cursor-pointer transition-colors">💬 WhatsApp VIP</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-400">
                &copy; 2024 Fé Imperial. Todos os direitos reservados. 
                <span className="text-amber-400 font-bold"> Transformando vidas desde 2020.</span>
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <span>🔒 Site 100% Seguro</span>
                <span>•</span>
                <span>✅ SSL Certificado</span>
                <span>•</span>
                <span>🛡️ Dados Protegidos</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

// Declarações de tipos para tracking
declare global {
  interface Window {
    gtag: any
    fbq: any
    ttq: any
  }
}