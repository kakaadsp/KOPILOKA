import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ProductCard } from '@/components/ProductCard';
import { coffeeProducts, categories, origins, roastLevels } from '@/data/products';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Search, Filter, X, SlidersHorizontal } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

export default function Marketplace() {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'Semua';
  
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(initialCategory);
  const [origin, setOrigin] = useState('Semua');
  const [roastLevel, setRoastLevel] = useState('Semua');
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [sortBy, setSortBy] = useState('featured');

  const filteredProducts = useMemo(() => {
    let filtered = coffeeProducts.filter(product => {
      const matchSearch = product.name.toLowerCase().includes(search.toLowerCase()) ||
                         product.description.toLowerCase().includes(search.toLowerCase()) ||
                         product.origin.toLowerCase().includes(search.toLowerCase());
      const matchCategory = category === 'Semua' || product.category === category;
      const matchOrigin = origin === 'Semua' || product.origin === origin;
      const matchRoast = roastLevel === 'Semua' || product.roastLevel === roastLevel;
      const matchPrice = product.price >= priceRange[0] && product.price <= priceRange[1];

      return matchSearch && matchCategory && matchOrigin && matchRoast && matchPrice;
    });

    // Sorting
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filtered.sort((a, b) => parseInt(b.id) - parseInt(a.id));
        break;
    }

    return filtered;
  }, [search, category, origin, roastLevel, priceRange, sortBy]);

  const resetFilters = () => {
    setSearch('');
    setCategory('Semua');
    setOrigin('Semua');
    setRoastLevel('Semua');
    setPriceRange([0, 1000000]);
    setSortBy('featured');
  };

  const hasActiveFilters = category !== 'Semua' || origin !== 'Semua' || roastLevel !== 'Semua' || priceRange[0] > 0 || priceRange[1] < 1000000;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Category */}
      <div>
        <label className="text-sm font-medium mb-2 block">Kategori</label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categories.map(cat => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Origin */}
      <div>
        <label className="text-sm font-medium mb-2 block">Asal Daerah</label>
        <Select value={origin} onValueChange={setOrigin}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {origins.map(o => (
              <SelectItem key={o} value={o}>{o}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Roast Level */}
      <div>
        <label className="text-sm font-medium mb-2 block">Level Roast</label>
        <Select value={roastLevel} onValueChange={setRoastLevel}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {roastLevels.map(r => (
              <SelectItem key={r} value={r}>
                {r === 'Semua' ? 'Semua' : r === 'light' ? 'Light Roast' : r === 'medium' ? 'Medium Roast' : 'Dark Roast'}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Price Range */}
      <div>
        <label className="text-sm font-medium mb-4 block">
          Rentang Harga: {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
        </label>
        <Slider
          value={priceRange}
          onValueChange={setPriceRange}
          min={0}
          max={1000000}
          step={25000}
          className="mb-2"
        />
      </div>

      {hasActiveFilters && (
        <Button variant="outline" onClick={resetFilters} className="w-full gap-2">
          <X className="w-4 h-4" />
          Reset Filter
        </Button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20">
        {/* Header */}
        <section className="bg-hero-gradient text-coffee-cream py-16">
          <div className="container mx-auto px-4">
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">Marketplace Kopi</h1>
            <p className="text-coffee-cream/80 text-lg max-w-2xl">
              Temukan {coffeeProducts.length}+ varietas kopi premium dari seluruh Indonesia
            </p>
          </div>
        </section>

        {/* Filters & Products */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            {/* Search & Sort Bar */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Cari kopi, daerah, atau tipe..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex gap-2">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Urutkan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Pilihan</SelectItem>
                    <SelectItem value="price-low">Harga Terendah</SelectItem>
                    <SelectItem value="price-high">Harga Tertinggi</SelectItem>
                    <SelectItem value="rating">Rating Tertinggi</SelectItem>
                    <SelectItem value="newest">Terbaru</SelectItem>
                  </SelectContent>
                </Select>

                {/* Mobile Filter Button */}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="md:hidden gap-2">
                      <SlidersHorizontal className="w-4 h-4" />
                      Filter
                    </Button>
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>Filter Produk</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6">
                      <FilterContent />
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>

            <div className="flex gap-8">
              {/* Desktop Sidebar Filter */}
              <aside className="hidden md:block w-64 shrink-0">
                <div className="sticky top-24 p-6 rounded-xl bg-card shadow-card">
                  <div className="flex items-center gap-2 mb-6">
                    <Filter className="w-5 h-5" />
                    <h3 className="font-semibold">Filter</h3>
                  </div>
                  <FilterContent />
                </div>
              </aside>

              {/* Products Grid */}
              <div className="flex-1">
                {/* Active Filters Tags */}
                {hasActiveFilters && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {category !== 'Semua' && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
                        {category}
                        <button onClick={() => setCategory('Semua')}>
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    )}
                    {origin !== 'Semua' && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
                        {origin}
                        <button onClick={() => setOrigin('Semua')}>
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    )}
                  </div>
                )}

                {/* Results Count */}
                <p className="text-sm text-muted-foreground mb-6">
                  Menampilkan {filteredProducts.length} produk
                </p>

                {/* Products */}
                {filteredProducts.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts.map(product => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20">
                    <p className="text-muted-foreground mb-4">Tidak ada produk yang cocok dengan filter</p>
                    <Button variant="outline" onClick={resetFilters}>Reset Filter</Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
