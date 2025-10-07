'use client'

import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Check, MessageCircle, Truck, Shield } from 'lucide-react'
import Link from 'next/link'

export default function ThankYouPage() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('order_id')

  return (
    <div className="min-h-screen bg-[#0B0F14] text-[#E5E7EB] flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <Card className="bg-[#0F172A] border-[#1F2937]">
          <CardContent className="p-8 text-center space-y-6">
            <div className="w-20 h-20 bg-[#10B981]/20 rounded-full flex items-center justify-center mx-auto">
              <Check className="w-10 h-10 text-[#10B981]" />
            </div>
            
            <h1 className="text-4xl font-bold text-[#22D3EE]">Thank You!</h1>
            
            <p className="text-xl text-gray-300">
              Your order has been successfully placed and payment confirmed.
            </p>
            
            {orderId && (
              <div className="bg-[#0B0F14] p-4 rounded-lg">
                <p className="text-sm text-gray-400 mb-2">Order ID</p>
                <p className="font-mono text-lg text-[#22D3EE]">{orderId}</p>
              </div>
            )}
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">What happens next?</h3>
              <div className="grid md:grid-cols-3 gap-4 text-left">
                <div className="bg-[#0B0F14] p-4 rounded-lg">
                  <Truck className="w-8 h-8 text-[#22D3EE] mb-2" />
                  <h4 className="font-semibold mb-1">Processing</h4>
                  <p className="text-sm text-gray-400">We'll prepare your order for shipping within 1-2 business days.</p>
                </div>
                <div className="bg-[#0B0F14] p-4 rounded-lg">
                  <Shield className="w-8 h-8 text-[#22D3EE] mb-2" />
                  <h4 className="font-semibold mb-1">Shipping</h4>
                  <p className="text-sm text-gray-400">Delivery takes 7-12 business days with tracking.</p>
                </div>
                <div className="bg-[#0B0F14] p-4 rounded-lg">
                  <MessageCircle className="w-8 h-8 text-[#22D3EE] mb-2" />
                  <h4 className="font-semibold mb-1">Support</h4>
                  <p className="text-sm text-gray-400">Questions? Contact us via WhatsApp anytime.</p>
                </div>
              </div>
            </div>
            
            <div className="bg-[#10B981]/10 border border-[#10B981] p-4 rounded-lg">
              <p className="text-sm text-[#10B981]">
                <strong>12-Month Warranty</strong> • Your VoltFold is protected against manufacturing defects.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/">
                <Button className="bg-[#22D3EE] text-black hover:bg-[#1AB8CC] font-semibold">
                  Back to Home
                </Button>
              </Link>
              <a 
                href="https://api.whatsapp.com/send?phone=212665848588&text=Hi%2C%20I%20have%20a%20question%20about%20my%20order%20{orderId}"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" className="border-[#22D3EE] text-[#22D3EE] hover:bg-[#22D3EE] hover:text-black font-semibold">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  WhatsApp Support
                </Button>
              </a>
            </div>
            
            <div className="text-sm text-gray-400">
              <p>A confirmation email has been sent to your registered email address.</p>
              <p className="mt-2">For any questions, contact us at pinkyfati1@gmail.com or +212 665 848 588</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}