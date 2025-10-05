import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
})

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret)
  } catch (err: any) {
    console.error(`Webhook signature verification failed.`, err.message)
    return NextResponse.json({ error: 'Webhook Error' }, { status: 400 })
  }

  // Processar eventos do Stripe
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object as Stripe.Checkout.Session
      console.log('Pagamento concluído:', session.id)
      
      // Aqui você pode:
      // 1. Salvar dados do cliente no banco
      // 2. Enviar email de boas-vindas
      // 3. Ativar acesso ao conteúdo premium
      // 4. Integrar com sistema de CRM
      
      break

    case 'customer.subscription.created':
      const subscription = event.data.object as Stripe.Subscription
      console.log('Nova assinatura criada:', subscription.id)
      break

    case 'customer.subscription.updated':
      const updatedSubscription = event.data.object as Stripe.Subscription
      console.log('Assinatura atualizada:', updatedSubscription.id)
      break

    case 'customer.subscription.deleted':
      const deletedSubscription = event.data.object as Stripe.Subscription
      console.log('Assinatura cancelada:', deletedSubscription.id)
      break

    case 'invoice.payment_succeeded':
      const invoice = event.data.object as Stripe.Invoice
      console.log('Pagamento de fatura bem-sucedido:', invoice.id)
      break

    case 'invoice.payment_failed':
      const failedInvoice = event.data.object as Stripe.Invoice
      console.log('Falha no pagamento da fatura:', failedInvoice.id)
      break

    default:
      console.log(`Evento não tratado: ${event.type}`)
  }

  return NextResponse.json({ received: true })
}