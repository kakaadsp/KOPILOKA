import { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Package, ShoppingBag, MessageCircle, User, Clock } from 'lucide-react';

interface Order {
  id: string;
  items: any[];
  totalPrice: number;
  status: string;
  createdAt: string;
  address: string;
}

export default function BuyerDashboard() {
  const { user, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const savedOrders = JSON.parse(localStorage.getItem('kopiloka_orders') || '[]');
    const userOrders = savedOrders.filter((o: any) => 
      o.buyerId === user?.id || o.email === user?.email
    );
    setOrders(userOrders);
  }, [user]);

  if (!isAuthenticated || user?.role !== 'buyer') {
    return <Navigate to="/login" />;
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: 'Menunggu',
      confirmed: 'Dikonfirmasi',
      shipped: 'Dikirim',
      delivered: 'Selesai',
      cancelled: 'Dibatalkan'
    };
    return labels[status] || status;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
              <User className="w-8 h-8 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-serif text-3xl font-bold">Halo, {user?.name}!</h1>
              <p className="text-muted-foreground">Kelola pesanan dan aktivitas Anda di sini</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Pesanan
                </CardTitle>
                <ShoppingBag className="w-5 h-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{orders.length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Dalam Proses
                </CardTitle>
                <Package className="w-5 h-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">
                  {orders.filter(o => ['pending', 'confirmed', 'shipped'].includes(o.status)).length}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Belanja
                </CardTitle>
                <Clock className="w-5 h-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">
                  {formatPrice(orders.reduce((sum, o) => sum + o.totalPrice, 0))}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="orders">
            <TabsList>
              <TabsTrigger value="orders" className="gap-2">
                <Package className="w-4 h-4" />
                Pesanan
              </TabsTrigger>
              <TabsTrigger value="messages" className="gap-2">
                <MessageCircle className="w-4 h-4" />
                Pesan
              </TabsTrigger>
            </TabsList>

            <TabsContent value="orders" className="mt-6">
              {orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.map(order => (
                    <Card key={order.id}>
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <p className="font-semibold">{order.id}</p>
                              <Badge className={getStatusColor(order.status)}>
                                {getStatusLabel(order.status)}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {new Date(order.createdAt).toLocaleDateString('id-ID', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">
                              {order.items.length} item • {order.address}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-primary">{formatPrice(order.totalPrice)}</p>
                          </div>
                        </div>
                        
                        {/* Order Items Preview */}
                        <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                          {order.items.map((item: any) => (
                            <img
                              key={item.id}
                              src={item.image}
                              alt={item.name}
                              className="w-16 h-16 rounded-lg object-cover shrink-0"
                            />
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <ShoppingBag className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
                  <p className="text-muted-foreground mb-4">Belum ada pesanan</p>
                  <Link to="/marketplace">
                    <Button variant="coffee">Mulai Belanja</Button>
                  </Link>
                </div>
              )}
            </TabsContent>

            <TabsContent value="messages" className="mt-6">
              <div className="text-center py-12">
                <MessageCircle className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
                <p className="text-muted-foreground mb-4">Belum ada pesan</p>
                <Link to="/chatbot">
                  <Button variant="coffee">Tanya AI Assistant</Button>
                </Link>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}
