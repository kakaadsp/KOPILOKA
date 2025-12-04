import { Link } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';

export default function Cart() {
  const { items, updateQuantity, removeFromCart, totalPrice, totalItems } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-20 min-h-[80vh] flex items-center justify-center">
          <div className="text-center px-4">
            <ShoppingBag className="w-24 h-24 mx-auto text-muted-foreground/30 mb-6" />
            <h1 className="font-serif text-3xl font-bold mb-4">Keranjang Kosong</h1>
            <p className="text-muted-foreground mb-8">Belum ada produk di keranjang Anda</p>
            <Link to="/marketplace">
              <Button variant="coffee" size="lg" className="gap-2">
                Jelajahi Produk
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20">
        <div className="container mx-auto px-4 py-8">
          <h1 className="font-serif text-3xl font-bold mb-8">Keranjang Belanja</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="bg-card rounded-xl p-4 shadow-card flex gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-semibold">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">{item.origin} • {item.weight}</p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-destructive hover:text-destructive/80"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="w-10 text-center font-medium">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      <p className="font-bold text-primary">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-xl p-6 shadow-card sticky top-24">
                <h2 className="font-serif text-xl font-semibold mb-4">Ringkasan Pesanan</h2>
                
                <div className="space-y-3 pb-4 border-b border-border">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal ({totalItems} item)</span>
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

                <Link to="/checkout">
                  <Button variant="coffee" className="w-full" size="lg">
                    Lanjut ke Pembayaran
                  </Button>
                </Link>

                <Link to="/marketplace">
                  <Button variant="outline" className="w-full mt-3">
                    Lanjut Belanja
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
