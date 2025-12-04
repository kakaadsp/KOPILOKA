import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { coffeeProducts } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/hooks/use-toast';
import { ProductCard } from '@/components/ProductCard';
import { Star, Minus, Plus, ShoppingCart, Leaf, ArrowLeft, MessageCircle } from 'lucide-react';

export default function ProductDetail() {
  const { id } = useParams();
  const product = coffeeProducts.find(p => p.id === id);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { toast } = useToast();

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-20 min-h-[80vh] flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-serif text-3xl font-bold mb-4">Produk Tidak Ditemukan</h1>
            <Link to="/marketplace">
              <Button variant="coffee">Kembali ke Marketplace</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getRoastLevelLabel = (level: string) => {
    const labels = { light: 'Light Roast', medium: 'Medium Roast', dark: 'Dark Roast' };
    return labels[level as keyof typeof labels] || level;
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast({
      title: "Ditambahkan ke keranjang",
      description: `${quantity}x ${product.name}`,
    });
  };

  const relatedProducts = coffeeProducts
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <Link to="/marketplace" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Marketplace
          </Link>

          {/* Product Detail */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {/* Image */}
            <div className="relative">
              <img
                src={product.image}
                alt={product.name}
                className="w-full aspect-square object-cover rounded-2xl shadow-card"
              />
              {product.isOrganic && (
                <Badge className="absolute top-4 left-4 bg-green-600 text-white gap-1">
                  <Leaf className="w-3 h-3" />
                  Organik
                </Badge>
              )}
            </div>

            {/* Info */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="secondary">{product.category}</Badge>
                <Badge variant="outline">{getRoastLevelLabel(product.roastLevel)}</Badge>
              </div>

              <h1 className="font-serif text-4xl font-bold mb-2">{product.name}</h1>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-coffee-crema text-coffee-crema" />
                  <span className="font-semibold">{product.rating}</span>
                  <span className="text-muted-foreground">({product.reviews} ulasan)</span>
                </div>
                <span className="text-muted-foreground">•</span>
                <span className="text-muted-foreground">{product.origin}</span>
              </div>

              <p className="text-3xl font-bold text-primary mb-6">{formatPrice(product.price)}</p>

              <p className="text-muted-foreground mb-6">{product.description}</p>

              {/* Flavor Tags */}
              <div className="mb-6">
                <p className="font-medium mb-2">Flavor Notes:</p>
                <div className="flex flex-wrap gap-2">
                  {product.flavor.map((f) => (
                    <span key={f} className="px-3 py-1 rounded-full bg-secondary text-sm">
                      {f}
                    </span>
                  ))}
                </div>
              </div>

              {/* Product Info */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-secondary rounded-xl mb-6">
                <div>
                  <p className="text-sm text-muted-foreground">Berat</p>
                  <p className="font-medium">{product.weight}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Stok</p>
                  <p className="font-medium">{product.stock} tersedia</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Penjual</p>
                  <p className="font-medium">{product.sellerName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Asal</p>
                  <p className="font-medium">{product.origin}</p>
                </div>
              </div>

              {/* Quantity */}
              <div className="flex items-center gap-4 mb-6">
                <span className="font-medium">Jumlah:</span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4">
                <Button
                  variant="coffee"
                  size="lg"
                  className="flex-1 gap-2"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="w-5 h-5" />
                  Tambah ke Keranjang
                </Button>
                <Link to="/chatbot">
                  <Button variant="outline" size="lg" className="gap-2">
                    <MessageCircle className="w-5 h-5" />
                    Tanya AI
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <section>
              <h2 className="font-serif text-2xl font-bold mb-6">Produk Serupa</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map(p => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
