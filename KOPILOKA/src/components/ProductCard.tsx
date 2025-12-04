import { Product } from '@/types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/context/CartContext';
import { Star, ShoppingCart, Leaf } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product);
    toast({
      title: "Ditambahkan ke keranjang",
      description: `${product.name} berhasil ditambahkan`,
    });
  };

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

  return (
    <Link to={`/product/${product.id}`}>
      <Card className="group overflow-hidden h-full flex flex-col hover:shadow-card-hover transition-all duration-300 cursor-pointer">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-secondary">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-2">
            {product.isOrganic && (
              <Badge className="bg-green-600 text-white gap-1">
                <Leaf className="w-3 h-3" />
                Organik
              </Badge>
            )}
            <Badge variant="secondary" className="backdrop-blur-sm bg-background/80">
              {product.category}
            </Badge>
          </div>
          {/* Quick Add */}
          <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="coffee"
              size="icon"
              onClick={handleAddToCart}
              className="rounded-full shadow-lg"
            >
              <ShoppingCart className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <CardContent className="flex-1 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground">{product.origin}</span>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-coffee-crema text-coffee-crema" />
              <span className="text-sm font-medium">{product.rating}</span>
              <span className="text-xs text-muted-foreground">({product.reviews})</span>
            </div>
          </div>

          <h3 className="font-serif font-semibold text-lg mb-1 line-clamp-1 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {product.description}
          </p>

          <div className="flex flex-wrap gap-1 mb-3">
            {product.flavor.slice(0, 3).map((f) => (
              <span
                key={f}
                className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground"
              >
                {f}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{product.weight}</span>
            <span>{getRoastLevelLabel(product.roastLevel)}</span>
          </div>
        </CardContent>

        {/* Footer */}
        <CardFooter className="p-4 pt-0 flex items-center justify-between">
          <div>
            <p className="text-lg font-bold text-primary">{formatPrice(product.price)}</p>
            <p className="text-xs text-muted-foreground">Stok: {product.stock}</p>
          </div>
          <Button
            variant="coffee"
            size="sm"
            onClick={handleAddToCart}
            className="gap-2"
          >
            <ShoppingCart className="w-4 h-4" />
            Tambah
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
