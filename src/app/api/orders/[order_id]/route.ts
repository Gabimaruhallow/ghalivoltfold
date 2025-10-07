import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { order_id: string } }
) {
  try {
    const order = await db.order.findUnique({
      where: { order_id: params.order_id }
    })

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(order)

  } catch (error) {
    console.error('Order fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch order' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { order_id: string } }
) {
  try {
    const body = await request.json()
    const {
      status,
      payment_method,
      paypal_order_id,
      payer_email
    } = body

    // Update order
    const order = await db.order.update({
      where: { order_id: params.order_id },
      data: {
        ...(status && { status }),
        ...(payment_method && { payment_method }),
        ...(paypal_order_id && { paypal_order_id }),
        ...(payer_email && { payer_email })
      }
    })

    return NextResponse.json(order)

  } catch (error) {
    console.error('Order update error:', error)
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    )
  }
}