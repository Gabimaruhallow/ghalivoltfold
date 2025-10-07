export const dynamic = "force-dynamic";


import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      order_id,
      name,
      email,
      phone,
      country,
      city,
      address,
      postalCode,
      notes,
      ip,
      user_agent
    } = body

    // Validate required fields
    if (!order_id || !name || !email || !phone || !country || !city || !address || !postalCode) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create order in database
    const order = await db.order.create({
      data: {
        order_id,
        name,
        email,
        phone,
        country,
        city,
        address,
        postal_code: postalCode,
        notes: notes || null,
        price_usd: 799,
        status: 'initiated',
        ip: ip || null,
        user_agent: user_agent || null
      }
    })

    // TODO: Send email notification to pinkyfati1@gmail.com
    // This would require setting up an email service

    return NextResponse.json({ 
      success: true, 
      order_id: order.order_id 
    })

  } catch (error) {
    console.error('Order creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Build where clause
    const where: any = {}
    if (status) {
      where.status = status
    }

    // Get orders with pagination
    const orders = await db.order.findMany({
      where,
      orderBy: { created_at: 'desc' },
      take: limit,
      skip: offset
    })

    // Get total count
    const total = await db.order.count({ where })

    return NextResponse.json({
      orders,
      total,
      limit,
      offset
    })

  } catch (error) {
    console.error('Orders fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}
