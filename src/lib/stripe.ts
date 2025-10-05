"use client"

import { loadStripe } from '@stripe/stripe-js'

// Configuração do Stripe com validação
const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

// Validar se a chave existe antes de inicializar o Stripe
export const stripePromise = stripePublishableKey 
  ? loadStripe(stripePublishableKey)
  : Promise.resolve(null)

// Planos de assinatura com price IDs reais
export const SUBSCRIPTION_PLANS = {
  DISCIPULO: {
    name: 'Discípulo',
    price: 2990, // em centavos (R$ 29,90)
    priceId: 'price_1QXdiscipulo2990brl', // Price ID para plano Discípulo
    features: [
      '50+ Orações Exclusivas dos Santos',
      'Textos Sagrados Traduzidos do Latim',
      'Orações Diárias Personalizadas',
      'Suporte Espiritual 24h',
      'Acesso ao App Mobile'
    ]
  },
  APOSTOLO: {
    name: 'Apóstolo',
    price: 4990, // em centavos (R$ 49,90)
    priceId: 'price_1QXapostolo4990brl', // Price ID para plano Apóstolo
    features: [
      '200+ Orações dos Grandes Líderes',
      'Manuscritos Secretos em Latim e Aramaico',
      'Rituais de Proteção e Prosperidade',
      'Consultoria Espiritual Semanal',
      'Comunidade VIP Exclusiva',
      'Certificado de Membro Apostólico',
      'Acesso Prioritário a Novos Conteúdos'
    ]
  },
  SANTO_PADRE: {
    name: 'Santo Padre',
    price: 9990, // em centavos (R$ 99,90)
    priceId: 'price_1QXsantopadre9990brl', // Price ID para plano Santo Padre
    features: [
      '500+ Orações dos Papas e Santos',
      'Manuscritos Originais dos Mosteiros',
      'Rituais Secretos dos Templários',
      'Orações Personalizadas Exclusivas',
      'Consultoria Espiritual Diária',
      'Acesso VIP Total à Comunidade',
      'Certificado Papal Honorário',
      'Linha Direta com Mentores Espirituais'
    ]
  }
}

// Função para criar sessão de checkout com validação
export async function createCheckoutSession(priceId: string) {
  try {
    // Verificar se as variáveis de ambiente estão configuradas
    if (!stripePublishableKey) {
      throw new Error('Chave pública do Stripe não configurada. Configure suas variáveis de ambiente.')
    }

    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ priceId }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Erro ao processar pagamento')
    }

    const session = await response.json()
    
    if (session.error) {
      throw new Error(session.error)
    }

    const stripe = await stripePromise
    if (!stripe) {
      throw new Error('Stripe não pôde ser carregado. Verifique sua conexão com a internet.')
    }

    const { error } = await stripe.redirectToCheckout({
      sessionId: session.id,
    })

    if (error) {
      throw new Error(error.message)
    }
  } catch (error) {
    console.error('Erro ao criar sessão de checkout:', error)
    throw error
  }
}