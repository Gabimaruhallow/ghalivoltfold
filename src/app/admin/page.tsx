'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, Download, Eye, LogOut } from 'lucide-react'

interface Order {
  id: string
  order_id: string
  created_at: string
  name: string
  email: string
  phone: string
  country: string
  city: string
  address: string
  postal_code: string
  notes: string | null
  price_usd: number
  status: string
  payment_method: string | null
  paypal_order_id: string | null
  payer_email: string | null
  ip: string | null
  user_agent: string | null
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [credentials, setCredentials] = useState({ username: '', password: '' })
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    // Check if already authenticated
    const auth = localStorage.getItem('adminAuth')
    if (auth === 'true') {
      setIsAuthenticated(true)
      fetchOrders()
    }
  }, [])

  useEffect(() => {
    // Filter orders based on search and status
    let filtered = orders
    
    if (searchTerm) {
      filtered = filtered.filter(order => 
        order.order_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.phone.includes(searchTerm)
      )
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter)
    }
    
    setFilteredOrders(filtered)
  }, [orders, searchTerm, statusFilter])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (credentials.username === 'ghali' && credentials.password === 'ghali.12345') {
      setIsAuthenticated(true)
      localStorage.setItem('adminAuth', 'true')
      await fetchOrders()
    } else {
      setError('Invalid credentials')
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem('adminAuth')
    setOrders([])
    setCredentials({ username: '', password: '' })
  }

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/orders')
      if (response.ok) {
        const data = await response.json()
        setOrders(data.orders)
      } else {
        setError('Failed to fetch orders')
      }
    } catch (error) {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  const exportCSV = () => {
    const headers = [
      'Order ID', 'Date', 'Name', 'Email', 'Phone', 'Country', 'City', 
      'Address', 'Postal Code', 'Price', 'Status', 'Payment Method', 'PayPal Order ID'
    ]
    
    const csvContent = [
      headers.join(','),
      ...filteredOrders.map(order => [
        order.order_id,
        new Date(order.created_at).toLocaleDateString(),
        order.name,
        order.email,
        order.phone,
        order.country,
        order.city,
        `"${order.address}"`,
        order.postal_code,
        order.price_usd,
        order.status,
        order.payment_method || '',
        order.paypal_order_id || ''
      ].join(','))
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `voltfold-orders-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'initiated': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'cancelled': return 'bg-red-500/20 text-red-400 border-red-500/30'
      case 'refunded': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0B0F14] text-[#E5E7EB] flex items-center justify-center p-4">
        <Card className="bg-[#0F172A] border-[#1F2937] w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center text-[#22D3EE]">
              Admin Login
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">Username</label>
                <Input
                  type="text"
                  value={credentials.username}
                  onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                  className="bg-[#0B0F14] border-[#1F2937] text-white placeholder:text-gray-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">Password</label>
                <Input
                  type="password"
                  value={credentials.password}
                  onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                  className="bg-[#0B0F14] border-[#1F2937] text-white placeholder:text-gray-500"
                  required
                />
              </div>
              {error && (
                <div className="text-red-400 text-sm text-center">{error}</div>
              )}
              <Button type="submit" className="w-full bg-[#22D3EE] text-black hover:bg-[#1AB8CC]">
                Login
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0B0F14] text-[#E5E7EB]">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-[#22D3EE]">VoltFold Admin</h1>
          <Button onClick={handleLogout} variant="outline" className="border-[#1F2937]">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-[#0F172A] border-[#1F2937]">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-[#22D3EE]">{orders.length}</div>
              <div className="text-sm text-gray-400">Total Orders</div>
            </CardContent>
          </Card>
          <Card className="bg-[#0F172A] border-[#1F2937]">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-400">
                {orders.filter(o => o.status === 'paid').length}
              </div>
              <div className="text-sm text-gray-400">Paid Orders</div>
            </CardContent>
          </Card>
          <Card className="bg-[#0F172A] border-[#1F2937]">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-yellow-400">
                {orders.filter(o => o.status === 'initiated').length}
              </div>
              <div className="text-sm text-gray-400">Pending</div>
            </CardContent>
          </Card>
          <Card className="bg-[#0F172A] border-[#1F2937]">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-[#22D3EE]">
                ${orders.filter(o => o.status === 'paid').reduce((sum, o) => sum + o.price_usd, 0)}
              </div>
              <div className="text-sm text-gray-400">Total Revenue</div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-[#0F172A] border-[#1F2937]">
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <CardTitle>Orders</CardTitle>
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search orders..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-[#0B0F14] border-[#1F2937] pl-10 w-full sm:w-64 text-white placeholder:text-gray-500"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="bg-[#0B0F14] border-[#1F2937] w-full sm:w-40 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="initiated">Pending</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                    <SelectItem value="refunded">Refunded</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={exportCSV} variant="outline" className="border-[#1F2937]">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Loading...</div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-[#1F2937]">
                      <TableHead>Order ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Country</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.map((order) => (
                      <TableRow key={order.id} className="border-[#1F2937]">
                        <TableCell className="font-mono text-sm">{order.order_id}</TableCell>
                        <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>{order.name}</TableCell>
                        <TableCell className="text-sm">{order.email}</TableCell>
                        <TableCell>{order.country}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(order.status)}>
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{order.payment_method || '-'}</TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedOrder(order)}
                            className="border-[#1F2937]"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {filteredOrders.length === 0 && (
                  <div className="text-center py-8 text-gray-400">
                    No orders found
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Order Detail Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="bg-[#0F172A] border-[#1F2937] w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle>Order Details: {selectedOrder.order_id}</CardTitle>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedOrder(null)}
                    className="border-[#1F2937]"
                  >
                    ×
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-400">Status</label>
                    <Badge className={getStatusColor(selectedOrder.status)}>
                      {selectedOrder.status}
                    </Badge>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Payment Method</label>
                    <p>{selectedOrder.payment_method || 'Not set'}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-400">Name</label>
                    <p>{selectedOrder.name}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Email</label>
                    <p>{selectedOrder.email}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-400">Phone</label>
                    <p>{selectedOrder.phone}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Price</label>
                    <p>${selectedOrder.price_usd}</p>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm text-gray-400">Address</label>
                  <p>{selectedOrder.address}, {selectedOrder.city}, {selectedOrder.country}, {selectedOrder.postal_code}</p>
                </div>
                
                {selectedOrder.notes && (
                  <div>
                    <label className="text-sm text-gray-400">Notes</label>
                    <p>{selectedOrder.notes}</p>
                  </div>
                )}
                
                {selectedOrder.paypal_order_id && (
                  <div>
                    <label className="text-sm text-gray-400">PayPal Order ID</label>
                    <p className="font-mono text-sm">{selectedOrder.paypal_order_id}</p>
                  </div>
                )}
                
                {selectedOrder.payer_email && (
                  <div>
                    <label className="text-sm text-gray-400">Payer Email</label>
                    <p>{selectedOrder.payer_email}</p>
                  </div>
                )}
                
                <div>
                  <label className="text-sm text-gray-400">Created</label>
                  <p>{new Date(selectedOrder.created_at).toLocaleString()}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}