import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { CreditCard, Wallet, Building2, CheckCircle2 } from 'lucide-react';

export default function Checkout() {
  const { items, totalPrice, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    address: user?.address || '',
    notes: '',
    paymentMethod: 'transfer'
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone || !formData.address) {
      toast({
        title: "Error",
        description: "Mohon lengkapi semua data yang diperlukan",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      // Save order to localStorage
      const orders = JSON.parse(localStorage.getItem('kopiloka_orders') || '[]');
      const newOrder = {
        id: `ORD-${Date.now()}`,
        buyerId: user?.id || 'guest',
        items,
        totalPrice,
        ...formData,
        status: 'confirmed',
        createdAt: new Date().toISOString()
      };
      orders.push(newOrder);
      localStorage.setItem('kopiloka_orders', JSON.stringify(orders));

      clearCart();
      setIsProcessing(false);
      setIsComplete(true);

      toast({
        title: "Pesanan Berhasil!",
        description: `Order ID: ${newOrder.id}`,
      });
    }, 2000);
  };

  if (isComplete) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-20 min-h-[80vh] flex items-center justify-center">
          <div className="text-center px-4">
            <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="font-serif text-3xl font-bold mb-4">Pesanan Berhasil!</h1>
            <p className="text-muted-foreground mb-8">
              Terima kasih telah berbelanja di KOPILOKA.<br />
              Kami akan segera memproses pesanan Anda.
            </p>
            <div className="flex gap-4 justify-center">
              <Button variant="outline" onClick={() => navigate('/marketplace')}>
                Lanjut Belanja
              </Button>
              <Button variant="coffee" onClick={() => navigate(isAuthenticated ? '/buyer' : '/')}>
                {isAuthenticated ? 'Lihat Pesanan' : 'Kembali ke Beranda'}
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4 py-8">
          <h1 className="font-serif text-3xl font-bold mb-8">Checkout</h1>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Shipping Info */}
              <div className="lg:col-span-2 space-y-6">
                {/* Personal Info */}
                <div className="bg-card rounded-xl p-6 shadow-card">
                  <h2 className="font-serif text-xl font-semibold mb-4">Informasi Pengiriman</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Nama Lengkap *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">No. Telepon *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="address">Alamat Lengkap *</Label>
                      <Textarea
                        id="address"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        rows={3}
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="notes">Catatan (opsional)</Label>
                      <Textarea
                        id="notes"
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        placeholder="Instruksi khusus untuk pengiriman..."
                        rows={2}
                      />
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="bg-card rounded-xl p-6 shadow-card">
                  <h2 className="font-serif text-xl font-semibold mb-4">Metode Pembayaran</h2>
                  
                  <RadioGroup
                    value={formData.paymentMethod}
                    onValueChange={(value) => setFormData({ ...formData, paymentMethod: value })}
                    className="space-y-3"
                  >
                    <label className="flex items-center gap-4 p-4 rounded-lg border-2 border-border cursor-pointer hover:border-primary/50 has-[:checked]:border-primary has-[:checked]:bg-primary/5 transition-colors">
                      <RadioGroupItem value="transfer" id="transfer" />
                      <Building2 className="w-6 h-6 text-primary" />
                      <div className="flex-1">
                        <p className="font-medium">Transfer Bank</p>
                        <p className="text-sm text-muted-foreground">BCA, Mandiri, BNI, BRI</p>
                      </div>
                    </label>

                    <label className="flex items-center gap-4 p-4 rounded-lg border-2 border-border cursor-pointer hover:border-primary/50 has-[:checked]:border-primary has-[:checked]:bg-primary/5 transition-colors">
                      <RadioGroupItem value="ewallet" id="ewallet" />
                      <Wallet className="w-6 h-6 text-primary" />
                      <div className="flex-1">
                        <p className="font-medium">E-Wallet</p>
                        <p className="text-sm text-muted-foreground">GoPay, OVO, DANA, ShopeePay</p>
                      </div>
                    </label>

                    <label className="flex items-center gap-4 p-4 rounded-lg border-2 border-border cursor-pointer hover:border-primary/50 has-[:checked]:border-primary has-[:checked]:bg-primary/5 transition-colors">
                      <RadioGroupItem value="cod" id="cod" />
                      <CreditCard className="w-6 h-6 text-primary" />
                      <div className="flex-1">
                        <p className="font-medium">COD (Bayar di Tempat)</p>
                        <p className="text-sm text-muted-foreground">Bayar saat barang diterima</p>
                      </div>
                    </label>
                  </RadioGroup>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-card rounded-xl p-6 shadow-card sticky top-24">
                  <h2 className="font-serif text-xl font-semibold mb-4">Ringkasan Pesanan</h2>
                  
                  <div className="space-y-3 pb-4 border-b border-border max-h-60 overflow-y-auto">
                    {items.map((item) => (
                      <div key={item.id} className="flex gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-sm line-clamp-1">{item.name}</p>
                          <p className="text-xs text-muted-foreground">{item.quantity}x {formatPrice(item.price)}</p>
                        </div>
                        <p className="font-medium text-sm">{formatPrice(item.price * item.quantity)}</p>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2 py-4 border-b border-border">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>{formatPrice(totalPrice)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Ongkos Kirim</span>
                      <span className="text-green-600">Gratis</span>
                    </div>
                  </div>

                  <div className="flex justify-between py-4 font-bold text-lg">
                    <span>Total</span>
                    <span className="text-primary">{formatPrice(totalPrice)}</span>
                  </div>

                  <Button 
                    type="submit" 
                    variant="coffee" 
                    className="w-full" 
                    size="lg"
                    disabled={isProcessing}
                  >
                    {isProcessing ? 'Memproses...' : 'Bayar Sekarang'}
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
