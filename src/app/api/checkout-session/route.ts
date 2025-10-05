import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
})

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const sessionId = searchParams.get('session_id')

  if (!sessionId) {
    return NextResponse.json({ error: 'Session ID é obrigatório' }, { status: 400 })
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['customer', 'subscription']
    })

    return NextResponse.json({
      customer: session.customer,
      subscription: session.subscription,
      amount_total: session.amount_total,
      currency: session.currency,
      payment_status: session.payment_status,
    })
  } catch (error: any) {
    console.error('Erro ao buscar sessão:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar dados da sessão' },
      { status: 500 }
    )
  }
}