'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { Check, X, Star, Shield, Truck, RotateCcw, MessageCircle, Menu, ChevronRight, Zap, Clock, Users } from 'lucide-react'
import Head from 'next/head'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'

export default function Home() {
  const [showOrderForm, setShowOrderForm] = useState(false)
  const [orderStep, setOrderStep] = useState(1)
  const [showStickyBar, setShowStickyBar] = useState(false)
  const [showExitIntent, setShowExitIntent] = useState(false)
  const [orderId, setOrderId] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    country: '',
    city: '',
    address: '',
    postalCode: '',
    notes: '',
    consent: false
  })

  useEffect(() => {
    const handleScroll = () => {
      setShowStickyBar(window.scrollY > window.innerHeight * 0.3)
    }

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) {
        setShowExitIntent(true)
        setTimeout(() => setShowExitIntent(false), 5000)
      }
    }

    window.addEventListener('scroll', handleScroll)
    document.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      document.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  const generateOrderId = () => {
    const now = new Date()
    const date = now.toISOString().slice(0, 10).replace(/-/g, '')
    const time = now.toTimeString().slice(0, 5).replace(/:/g, '')
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
    return `VF-${date}-${time}-${random}`
  }

  const handleOrderSubmit = async () => {
    const newOrderId = generateOrderId()
    setOrderId(newOrderId)
    
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_id: newOrderId,
          ...formData,
          ip: '127.0.0.1',
          user_agent: navigator.userAgent
        })
      })
      
      if (response.ok) {
        setOrderStep(2)
        // Load PayPal SDK
        const script = document.createElement('script')
        script.src = 'https://www.paypal.com/sdk/js?client-id=sb&intent=capture&currency=USD&components=buttons&enable-funding=card'
        script.onload = () => {
          // Render PayPal buttons
          window.paypal.Buttons({
            createOrder: (data, actions) => {
              return actions.order.create({
                purchase_units: [{
                  amount: { value: '799.00' },
                  custom_id: newOrderId,
                  description: 'VoltFold Electric Scooter'
                }]
              })
            },
            onApprove: async (data, actions) => {
              const order = await actions.order.capture()
              await fetch(`/api/orders/${newOrderId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  status: 'paid',
                  payment_method: data.paymentSource === 'card' ? 'paypal_card' : 'paypal',
                  paypal_order_id: order.id,
                  payer_email: order.payer.email_address
                })
              })
              window.location.href = `/thank-you?order_id=${newOrderId}`
            }
          }).render('#paypal-button-container')
        }
        document.body.appendChild(script)
      }
    } catch (error) {
      console.error('Order creation failed:', error)
    }
  }

  return (
    <>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Product",
              "name": "VoltFold Electric Scooter",
              "description": "A premium folding electric scooter with up to 60 km range and 25 km/h speed. Built for daily commutes and tight spaces.",
              "brand": {
                "@type": "Brand",
                "name": "VoltFold"
              },
              "offers": {
                "@type": "Offer",
                "price": "799",
                "priceCurrency": "USD",
                "availability": "https://schema.org/InStock",
                "seller": {
                  "@type": "Organization",
                  "name": "VoltFold"
                }
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.9",
                "reviewCount": "127"
              },
              "review": [
                {
                  "@type": "Review",
                  "author": {
                    "@type": "Person",
                    "name": "Alex M."
                  },
                  "reviewRating": {
                    "@type": "Rating",
                    "ratingValue": "5"
                  },
                  "reviewBody": "Perfect for my daily commute. Folds easily and fits under my desk."
                },
                {
                  "@type": "Review",
                  "author": {
                    "@type": "Person",
                    "name": "Sarah L."
                  },
                  "reviewRating": {
                    "@type": "Rating",
                    "ratingValue": "5"
                  },
                  "reviewBody": "Great build quality and the battery lasts forever. Highly recommend!"
                }
              ]
            })
          }}
        />
      </Head>
      <div className="min-h-screen bg-[#0B0F14] text-[#E5E7EB]">
      {/* Announcement Bar */}
      <div className="bg-[#22D3EE] text-black text-center py-2 text-sm font-medium">
        PayPal Protected • 12-Month Warranty • 30-Day Returns • Tracked Shipping
      </div>

      {/* Header */}
      <header className="sticky top-0 bg-[#0B0F14]/95 backdrop-blur-md border-b border-[#1F2937] z-40">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <img src="/logo.png" alt="VoltFold" className="w-8 h-8" />
            <div className="text-2xl font-bold text-[#22D3EE]">VoltFold</div>
          </div>
          <nav className="hidden md:flex space-x-8">
            <a href="#details" className="hover:text-[#22D3EE] transition-colors">Details</a>
            <a href="#reviews" className="hover:text-[#22D3EE] transition-colors">Reviews</a>
            <a href="#faq" className="hover:text-[#22D3EE] transition-colors">FAQ</a>
            <a href="https://api.whatsapp.com/send?phone=212665848588&text=Hi%2C%20I%27m%20interested%20in%20VoltFold%20%28%24799%29." 
               className="hover:text-[#22D3EE] transition-colors" target="_blank" rel="noopener noreferrer">Support</a>
          </nav>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-[#0F172A] border-[#1F2937]">
              <nav className="flex flex-col space-y-4 mt-8">
                <a href="#details" className="hover:text-[#22D3EE] transition-colors">Details</a>
                <a href="#reviews" className="hover:text-[#22D3EE] transition-colors">Reviews</a>
                <a href="#faq" className="hover:text-[#22D3EE] transition-colors">FAQ</a>
                <a href="https://api.whatsapp.com/send?phone=212665848588&text=Hi%2C%20I%27m%20interested%20in%20VoltFold%20%28%24799%29." 
                   className="hover:text-[#22D3EE] transition-colors" target="_blank" rel="noopener noreferrer">Support</a>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                Fold.<br/>Charge.<br/>Glide.
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed">
                Compact 250W city ride that folds in seconds. Built for daily commutes and tight spaces.
              </p>
              
              <div className="flex items-center space-x-4">
                <div className="bg-[#22D3EE] text-black px-6 py-3 rounded-full text-3xl font-bold">
                  $799
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Badge variant="secondary" className="bg-[#1F2937] text-[#E5E7EB] px-3 py-1">
                  <Shield className="w-4 h-4 mr-1" /> PayPal Protected
                </Badge>
                <Badge variant="secondary" className="bg-[#1F2937] text-[#E5E7EB] px-3 py-1">
                  <Truck className="w-4 h-4 mr-1" /> Tracked Shipping
                </Badge>
                <Badge variant="secondary" className="bg-[#1F2937] text-[#E5E7EB] px-3 py-1">
                  <RotateCcw className="w-4 h-4 mr-1" /> 12-Month Warranty
                </Badge>
                <Badge variant="secondary" className="bg-[#1F2937] text-[#E5E7EB] px-3 py-1">
                  30-Day Returns
                </Badge>
              </div>

              <div className="space-y-4">
                <Button 
                  onClick={() => {setShowOrderForm(true); setOrderStep(1)}}
                  className="w-full md:w-auto bg-[#22D3EE] text-black hover:bg-[#1AB8CC] text-lg px-8 py-4 rounded-lg font-semibold transition-all transform hover:scale-105"
                >
                  Buy with PayPal
                </Button>
                <div className="text-center">
                  <a href="https://api.whatsapp.com/send?phone=212665848588&text=Hi%2C%20I%27m%20interested%20in%20VoltFold%20%28%24799%29." 
                     className="text-[#22D3EE] hover:text-[#1AB8CC] transition-colors inline-flex items-center">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    WhatsApp Contact
                  </a>
                </div>
              </div>

              <div className="text-center text-sm text-gray-400">
                Encrypted by PayPal • 12-Month Warranty • 30-Day Returns
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-[#1F2937] to-[#0F172A] rounded-2xl p-8 aspect-square flex items-center justify-center overflow-hidden">
                <img 
                  src="https://i.imgur.com/79aa9tp.png" 
                  alt="VoltFold Electric Scooter" 
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="bg-[#0F172A] py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <p className="text-2xl font-bold text-[#22D3EE]">4.9/5 from riders</p>
            <div className="flex justify-center mt-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
              ))}
            </div>
          </div>
          
          <div className="mb-8">
            <p className="text-center text-gray-400 mb-6">As seen in</p>
            <div className="relative max-w-4xl mx-auto">
              <Carousel className="w-full">
                <CarouselContent>
                  <CarouselItem className="flex items-center justify-center p-2">
                    <div className="bg-[#0B0F14] rounded-lg overflow-hidden w-full aspect-video flex items-center justify-center">
                      <img src="https://i.imgur.com/f0vUK2X.png" alt="TechCrunch" className="w-full h-full object-cover" />
                    </div>
                  </CarouselItem>
                  <CarouselItem className="flex items-center justify-center p-2">
                    <div className="bg-[#0B0F14] rounded-lg overflow-hidden w-full aspect-video flex items-center justify-center">
                      <img src="https://i.imgur.com/0WdUAoX.png" alt="Wired" className="w-full h-full object-cover" />
                    </div>
                  </CarouselItem>
                  <CarouselItem className="flex items-center justify-center p-2">
                    <div className="bg-[#0B0F14] rounded-lg overflow-hidden w-full aspect-video flex items-center justify-center">
                      <img src="https://i.imgur.com/SEyJCsW.png" alt="Urban Mobility Today" className="w-full h-full object-cover" />
                    </div>
                  </CarouselItem>
                </CarouselContent>
                <CarouselPrevious className="left-2 bg-[#22D3EE] hover:bg-[#1AB8CC] text-black border-none" />
                <CarouselNext className="right-2 bg-[#22D3EE] hover:bg-[#1AB8CC] text-black border-none" />
              </Carousel>
            </div>
          </div>
        </div>
      </section>

      {/* Value Props */}
      <section id="details" className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: <Zap className="w-8 h-8" />, title: "Up to 60 km range", desc: "Long-lasting battery for extended commutes" },
              { icon: <Clock className="w-8 h-8" />, title: "Up to 25 km/h", desc: "Fast enough for city riding" },
              { icon: <RotateCcw className="w-8 h-8" />, title: "Folds in seconds", desc: "Compact storage anywhere" },
              { icon: <Shield className="w-8 h-8" />, title: "Dual disc brakes", desc: "Reliable stopping power" },
              { icon: <Zap className="w-8 h-8" />, title: "LED lights", desc: "Visible day and night" },
              { icon: <Truck className="w-8 h-8" />, title: "All-terrain tires", desc: "Ready for any surface" }
            ].map((prop, i) => (
              <Card key={i} className="bg-[#0F172A] border-[#1F2937] hover:border-[#22D3EE] transition-colors">
                <CardContent className="p-6">
                  <div className="text-[#22D3EE] mb-4">{prop.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{prop.title}</h3>
                  <p className="text-gray-400">{prop.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Specs */}
      <section className="bg-[#0F172A] py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Technical Specifications</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="space-y-4">
              <div className="flex justify-between py-2 border-b border-[#1F2937]">
                <span className="text-gray-400">Motor</span>
                <span className="font-semibold">250W hub</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#1F2937]">
                <span className="text-gray-400">Battery</span>
                <span className="font-semibold">36–48V (removable)</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#1F2937]">
                <span className="text-gray-400">Range</span>
                <span className="font-semibold">Up to 60 km</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#1F2937]">
                <span className="text-gray-400">Top speed</span>
                <span className="font-semibold">Up to 25 km/h</span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between py-2 border-b border-[#1F2937]">
                <span className="text-gray-400">Brakes</span>
                <span className="font-semibold">Front + rear disc</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#1F2937]">
                <span className="text-gray-400">Frame</span>
                <span className="font-semibold">Foldable alloy (120kg max)</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#1F2937]">
                <span className="text-gray-400">Tires</span>
                <span className="font-semibold">20"</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#1F2937]">
                <span className="text-gray-400">In the box</span>
                <span className="font-semibold">Scooter, charger, toolkit, guide</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">VoltFold vs Others</h2>
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-[#0F172A] p-4 rounded-lg">
                <h3 className="font-semibold mb-4">Feature</h3>
              </div>
              <div className="bg-[#22D3EE]/20 p-4 rounded-lg border border-[#22D3EE]">
                <h3 className="font-semibold mb-4 text-[#22D3EE]">VoltFold</h3>
              </div>
              <div className="bg-[#0F172A] p-4 rounded-lg">
                <h3 className="font-semibold mb-4">Others</h3>
              </div>
            </div>
            {[
              "60 km range",
              "Dual disc brakes", 
              "LED lights",
              "12-month warranty"
            ].map((feature, i) => (
              <div key={i} className="grid grid-cols-3 gap-4 text-center mt-2">
                <div className="bg-[#0F172A] p-4 rounded-lg">
                  <span className="text-gray-300">{feature}</span>
                </div>
                <div className="bg-[#22D3EE]/20 p-4 rounded-lg border border-[#22D3EE]">
                  <Check className="w-6 h-6 text-[#10B981] mx-auto" />
                </div>
                <div className="bg-[#0F172A] p-4 rounded-lg">
                  <X className="w-6 h-6 text-red-500 mx-auto" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section id="reviews" className="bg-[#0F172A] py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">What Riders Say</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { name: "Alex M.", rating: 5, text: "Perfect for my daily commute. Folds easily and fits under my desk." },
              { name: "Sarah L.", rating: 5, text: "Great build quality and the battery lasts forever. Highly recommend!" },
              { name: "Mike R.", rating: 4, text: "Solid scooter, good value for money. Customer service was helpful." },
              { name: "Emma K.", rating: 5, text: "Love the LED lights and dual brakes. Makes me feel safe riding at night." },
              { name: "John D.", rating: 5, text: "Best purchase I've made this year. Saves me so much time and money." },
              { name: "Lisa T.", rating: 5, text: "The folding mechanism is genius. Takes me 5 seconds to collapse it." }
            ].map((review, i) => (
              <Card key={i} className="bg-[#0B0F14] border-[#1F2937]">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className={`w-4 h-4 ${j < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-600'}`} />
                    ))}
                  </div>
                  <p className="text-gray-300 mb-4">"{review.text}"</p>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">{review.name}</span>
                    <Badge variant="secondary" className="bg-[#10B981]/20 text-[#10B981]">
                      Verified buyer
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-4xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="delivery" className="bg-[#0F172A] border-[#1F2937] px-6 rounded-lg">
              <AccordionTrigger className="text-left">How long does delivery take?</AccordionTrigger>
              <AccordionContent className="text-gray-300">
                Delivery takes 7-12 business days with tracking, depending on your destination. You'll receive a tracking number once your order ships.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="returns" className="bg-[#0F172A] border-[#1F2937] px-6 rounded-lg">
              <AccordionTrigger className="text-left">What's your return policy?</AccordionTrigger>
              <AccordionContent className="text-gray-300">
                We offer 30-day returns in original condition. Contact us via WhatsApp for an RMA number and return instructions.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="warranty" className="bg-[#0F172A] border-[#1F2937] px-6 rounded-lg">
              <AccordionTrigger className="text-left">What does the warranty cover?</AccordionTrigger>
              <AccordionContent className="text-gray-300">
                Our 12-month limited warranty covers manufacturing defects. It doesn't cover normal wear and tear or damage from accidents.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="payments" className="bg-[#0F172A] border-[#1F2937] px-6 rounded-lg">
              <AccordionTrigger className="text-left">What payment methods do you accept?</AccordionTrigger>
              <AccordionContent className="text-gray-300">
                We accept PayPal wallet or Pay by Card via PayPal. We never store your card details - all payments are processed securely by PayPal.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0F172A] border-t border-[#1F2937] py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <img src="/logo.png" alt="VoltFold" className="w-8 h-8" />
                <h3 className="text-2xl font-bold text-[#22D3EE]">VoltFold</h3>
              </div>
              <p className="text-gray-400">Premium folding electric scooters for urban mobility.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <p className="text-gray-400">Email: pinkyfati1@gmail.com</p>
              <p className="text-gray-400">WhatsApp: +212 665 848 588</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <a href="#" className="block text-gray-400 hover:text-[#22D3EE] transition-colors mb-2">Terms & Privacy</a>
              <a href="/admin" className="block text-gray-400 hover:text-[#22D3EE] transition-colors">Admin</a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-[#1F2937] text-center text-gray-400">
            <p>&copy; 2024 VoltFold. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Order Form Sheet */}
      <Sheet open={showOrderForm} onOpenChange={setShowOrderForm}>
        <SheetContent className="bg-[#0F172A] border-[#1F2937] w-full sm:w-[540px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="text-2xl font-bold text-[#22D3EE]">
              {orderStep === 1 ? 'Order Details' : 'Pay Securely'}
            </SheetTitle>
          </SheetHeader>
          
          {orderStep === 1 ? (
            <div className="mt-6 space-y-6">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Step 1 of 2</span>
                <div className="flex space-x-2">
                  <div className="w-8 h-1 bg-[#22D3EE] rounded"></div>
                  <div className="w-8 h-1 bg-gray-600 rounded"></div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name *</label>
                  <Input 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="bg-[#0B0F14] border-[#1F2937]" 
                    placeholder="John Doe"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Email *</label>
                  <Input 
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="bg-[#0B0F14] border-[#1F2937]" 
                    placeholder="john@example.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Phone/WhatsApp *</label>
                  <Input 
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="bg-[#0B0F14] border-[#1F2937]" 
                    placeholder="+1234567890"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Country *</label>
                  <Input 
                    value={formData.country}
                    onChange={(e) => setFormData({...formData, country: e.target.value})}
                    className="bg-[#0B0F14] border-[#1F2937]" 
                    placeholder="United States"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">City *</label>
                  <Input 
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                    className="bg-[#0B0F14] border-[#1F2937]" 
                    placeholder="New York"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Address Line *</label>
                  <Input 
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    className="bg-[#0B0F14] border-[#1F2937]" 
                    placeholder="123 Main Street"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Postal Code *</label>
                  <Input 
                    value={formData.postalCode}
                    onChange={(e) => setFormData({...formData, postalCode: e.target.value})}
                    className="bg-[#0B0F14] border-[#1F2937]" 
                    placeholder="10001"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Notes (Optional)</label>
                  <Textarea 
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    className="bg-[#0B0F14] border-[#1F2937]" 
                    placeholder="Special delivery instructions..."
                    rows={3}
                  />
                </div>
                
                <div className="flex items-start space-x-2">
                  <Checkbox 
                    id="consent"
                    checked={formData.consent}
                    onCheckedChange={(checked) => setFormData({...formData, consent: checked as boolean})}
                  />
                  <label htmlFor="consent" className="text-sm text-gray-300">
                    I agree to the Terms & Privacy and consent to be contacted about my order.
                  </label>
                </div>
              </div>

              <Button 
                onClick={handleOrderSubmit}
                disabled={!formData.name || !formData.email || !formData.phone || !formData.country || !formData.city || !formData.address || !formData.postalCode || !formData.consent}
                className="w-full bg-[#22D3EE] text-black hover:bg-[#1AB8CC] font-semibold"
              >
                Continue to Payment
              </Button>
            </div>
          ) : (
            <div className="mt-6 space-y-6">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Step 2 of 2</span>
                <div className="flex space-x-2">
                  <div className="w-8 h-1 bg-[#22D3EE] rounded"></div>
                  <div className="w-8 h-1 bg-[#22D3EE] rounded"></div>
                </div>
              </div>

              <div className="bg-[#0B0F14] p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Order Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">VoltFold Electric Scooter</span>
                    <span>$799</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Order ID</span>
                    <span className="font-mono text-xs">{orderId}</span>
                  </div>
                  <Separator className="my-2 bg-[#1F2937]" />
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>$799</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-sm text-gray-300">Choose your payment method:</p>
                <div id="paypal-button-container" className="space-y-3">
                  {/* PayPal buttons will be rendered here */}
                </div>
                
                <div className="text-center">
                  <a 
                    href={`https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=pinkyfati1%40gmail.com&item_name=VoltFold%20Electric%20Scooter&amount=799&currency_code=USD&no_shipping=1&custom=${orderId}&return=https%3A%2F%2Fthankyou&cancel_return=https%3A%2F%2Fcancelled`}
                    className="text-[#22D3EE] hover:text-[#1AB8CC] text-sm transition-colors"
                  >
                    Or use PayPal Standard Checkout
                  </a>
                </div>
              </div>

              <Button 
                variant="outline"
                onClick={() => setOrderStep(1)}
                className="w-full border-[#1F2937] text-gray-300 hover:bg-[#1F2937]"
              >
                Back to Details
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Sticky Buy Bar */}
      {showStickyBar && (
        <div className="fixed bottom-0 left-0 right-0 bg-[#0F172A]/95 backdrop-blur-md border-t border-[#1F2937] p-4 z-50">
          <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <span className="font-semibold">VoltFold Electric Scooter</span>
              <span className="text-2xl font-bold text-[#22D3EE]">$799</span>
            </div>
            <div className="flex space-x-3">
              <Button 
                onClick={() => {setShowOrderForm(true); setOrderStep(1)}}
                className="bg-[#22D3EE] text-black hover:bg-[#1AB8CC] font-semibold"
              >
                Buy with PayPal
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* WhatsApp Floating Button */}
      <a 
        href="https://api.whatsapp.com/send?phone=212665848588&text=Hi%2C%20I%27m%20interested%20in%20VoltFold%20%28%24799%29."
        className="fixed bottom-6 right-6 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:bg-[#128C7E] transition-all z-40 hover:scale-110"
        target="_blank"
        rel="noopener noreferrer"
      >
        <MessageCircle className="w-6 h-6" />
      </a>

      {/* Exit Intent Banner */}
      {showExitIntent && (
        <div className="fixed top-20 left-4 right-4 bg-[#22D3EE]/10 backdrop-blur-md border border-[#22D3EE] rounded-lg p-4 z-50 max-w-md mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-[#22D3EE]">Need help?</p>
              <p className="text-sm text-gray-300">Chat with us on WhatsApp for instant support!</p>
            </div>
            <a 
              href="https://api.whatsapp.com/send?phone=212665848588&text=Hi%2C%20I%27m%20interested%20in%20VoltFold%20%28%24799%29."
              className="bg-[#25D366] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#128C7E] transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              Chat Now
            </a>
          </div>
        </div>
      )}
      </div>
    </>
  )
}