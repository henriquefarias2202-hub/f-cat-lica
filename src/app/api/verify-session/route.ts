import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
})

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const sessionId = searchParams.get('session_id')

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID é obrigatório' }, { status: 400 })
    }

    // Recuperar detalhes da sessão do Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items', 'customer']
    })

    if (!session) {
      return NextResponse.json({ error: 'Sessão não encontrada' }, { status: 404 })
    }

    // Extrair informações relevantes
    const customerEmail = typeof session.customer === 'object' && session.customer 
      ? session.customer.email 
      : session.customer_details?.email

    const lineItems = session.line_items?.data || []
    const planName = lineItems[0]?.description || 'Plano não identificado'

    return NextResponse.json({
      sessionId: session.id,
      customerEmail,
      planName,
      paymentStatus: session.payment_status,
      subscriptionId: session.subscription,
      amountTotal: session.amount_total,
      currency: session.currency
    })

  } catch (error: any) {
    console.error('Erro ao verificar sessão:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}