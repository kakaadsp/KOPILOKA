import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Product } from '@/types';
import { Store, Package, Plus, TrendingUp, Edit, Trash2, ImagePlus } from 'lucide-react';

export default function SellerDashboard() {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Arabika',
    origin: '',
    roastLevel: 'medium' as 'light' | 'medium' | 'dark',
    weight: '250g',
    stock: '',
    flavor: '',
    isOrganic: false,
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500'
  });

  useEffect(() => {
    const savedProducts = JSON.parse(localStorage.getItem(`kopiloka_seller_products_${user?.id}`) || '[]');
    setProducts(savedProducts);
  }, [user]);

  if (!isAuthenticated || user?.role !== 'seller') {
    return <Navigate to="/login" />;
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newProduct: Product = {
      id: editingProduct?.id || `seller-${Date.now()}`,
      name: formData.name,
      description: formData.description,
      price: parseInt(formData.price),
      image: formData.image,
      category: formData.category,
      origin: formData.origin,
      roastLevel: formData.roastLevel,
      rating: editingProduct?.rating || 4.5,
      reviews: editingProduct?.reviews || 0,
      sellerId: user?.id || '',
      sellerName: user?.name || '',
      stock: parseInt(formData.stock),
      weight: formData.weight,
      flavor: formData.flavor.split(',').map(f => f.trim()),
      isOrganic: formData.isOrganic
    };

    let updatedProducts;
    if (editingProduct) {
      updatedProducts = products.map(p => p.id === editingProduct.id ? newProduct : p);
      toast({ title: "Produk diperbarui" });
    } else {
      updatedProducts = [...products, newProduct];
      toast({ title: "Produk ditambahkan" });
    }

    setProducts(updatedProducts);
    localStorage.setItem(`kopiloka_seller_products_${user?.id}`, JSON.stringify(updatedProducts));
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: 'Arabika',
      origin: '',
      roastLevel: 'medium',
      weight: '250g',
      stock: '',
      flavor: '',
      isOrganic: false,
      image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500'
    });
    setIsAddingProduct(false);
    setEditingProduct(null);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      origin: product.origin,
      roastLevel: product.roastLevel,
      weight: product.weight,
      stock: product.stock.toString(),
      flavor: product.flavor.join(', '),
      isOrganic: product.isOrganic,
      image: product.image
    });
    setIsAddingProduct(true);
  };

  const handleDelete = (productId: string) => {
    const updatedProducts = products.filter(p => p.id !== productId);
    setProducts(updatedProducts);
    localStorage.setItem(`kopiloka_seller_products_${user?.id}`, JSON.stringify(updatedProducts));
    toast({ title: "Produk dihapus" });
  };

  const totalRevenue = products.reduce((sum, p) => sum + (p.price * (p.reviews || 0)), 0);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
                <Store className="w-8 h-8 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-serif text-3xl font-bold">{user?.name}</h1>
                <p className="text-muted-foreground">Dashboard Penjual</p>
              </div>
            </div>
            <Dialog open={isAddingProduct} onOpenChange={setIsAddingProduct}>
              <DialogTrigger asChild>
                <Button variant="coffee" className="gap-2">
                  <Plus className="w-5 h-5" />
                  Tambah Produk
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingProduct ? 'Edit Produk' : 'Tambah Produk Baru'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <Label>Nama Produk *</Label>
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder="Arabika Gayo Premium"
                        required
                      />
                    </div>
                    <div className="col-span-2">
                      <Label>Deskripsi *</Label>
                      <Textarea
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        placeholder="Deskripsi produk kopi Anda..."
                        rows={3}
                        required
                      />
                    </div>
                    <div>
                      <Label>Harga (Rp) *</Label>
                      <Input
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: e.target.value})}
                        placeholder="185000"
                        required
                      />
                    </div>
                    <div>
                      <Label>Stok *</Label>
                      <Input
                        type="number"
                        value={formData.stock}
                        onChange={(e) => setFormData({...formData, stock: e.target.value})}
                        placeholder="50"
                        required
                      />
                    </div>
                    <div>
                      <Label>Kategori</Label>
                      <Select value={formData.category} onValueChange={(v) => setFormData({...formData, category: v})}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Arabika">Arabika</SelectItem>
                          <SelectItem value="Robusta">Robusta</SelectItem>
                          <SelectItem value="Liberika">Liberika</SelectItem>
                          <SelectItem value="Luwak">Luwak</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Level Roast</Label>
                      <Select value={formData.roastLevel} onValueChange={(v: 'light' | 'medium' | 'dark') => setFormData({...formData, roastLevel: v})}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">Light Roast</SelectItem>
                          <SelectItem value="medium">Medium Roast</SelectItem>
                          <SelectItem value="dark">Dark Roast</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Asal Daerah *</Label>
                      <Input
                        value={formData.origin}
                        onChange={(e) => setFormData({...formData, origin: e.target.value})}
                        placeholder="Gayo, Aceh"
                        required
                      />
                    </div>
                    <div>
                      <Label>Berat</Label>
                      <Select value={formData.weight} onValueChange={(v) => setFormData({...formData, weight: v})}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="100g">100g</SelectItem>
                          <SelectItem value="200g">200g</SelectItem>
                          <SelectItem value="250g">250g</SelectItem>
                          <SelectItem value="500g">500g</SelectItem>
                          <SelectItem value="1kg">1kg</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="col-span-2">
                      <Label>Flavor Notes (pisahkan dengan koma)</Label>
                      <Input
                        value={formData.flavor}
                        onChange={(e) => setFormData({...formData, flavor: e.target.value})}
                        placeholder="Fruity, Floral, Citrus"
                      />
                    </div>
                    <div className="col-span-2">
                      <Label>URL Gambar</Label>
                      <Input
                        value={formData.image}
                        onChange={(e) => setFormData({...formData, image: e.target.value})}
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                    <div className="col-span-2 flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="organic"
                        checked={formData.isOrganic}
                        onChange={(e) => setFormData({...formData, isOrganic: e.target.checked})}
                        className="rounded"
                      />
                      <Label htmlFor="organic">Produk Organik</Label>
                    </div>
                  </div>
                  <div className="flex gap-2 justify-end pt-4">
                    <Button type="button" variant="outline" onClick={resetForm}>Batal</Button>
                    <Button type="submit" variant="coffee">
                      {editingProduct ? 'Simpan Perubahan' : 'Tambah Produk'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Produk
                </CardTitle>
                <Package className="w-5 h-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{products.length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Stok
                </CardTitle>
                <Store className="w-5 h-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">
                  {products.reduce((sum, p) => sum + p.stock, 0)}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Nilai Inventori
                </CardTitle>
                <TrendingUp className="w-5 h-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">
                  {formatPrice(products.reduce((sum, p) => sum + (p.price * p.stock), 0))}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Products */}
          <Tabs defaultValue="products">
            <TabsList>
              <TabsTrigger value="products" className="gap-2">
                <Package className="w-4 h-4" />
                Produk Saya
              </TabsTrigger>
            </TabsList>

            <TabsContent value="products" className="mt-6">
              {products.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map(product => (
                    <Card key={product.id} className="overflow-hidden">
                      <div className="relative aspect-video">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                        {product.isOrganic && (
                          <Badge className="absolute top-2 left-2 bg-green-600">Organik</Badge>
                        )}
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold mb-1">{product.name}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{product.origin}</p>
                        <div className="flex items-center justify-between mb-4">
                          <p className="font-bold text-primary">{formatPrice(product.price)}</p>
                          <span className="text-sm text-muted-foreground">Stok: {product.stock}</span>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 gap-1"
                            onClick={() => handleEdit(product)}
                          >
                            <Edit className="w-4 h-4" />
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleDelete(product.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <ImagePlus className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
                  <p className="text-muted-foreground mb-4">Belum ada produk</p>
                  <Button variant="coffee" onClick={() => setIsAddingProduct(true)}>
                    Tambah Produk Pertama
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}
