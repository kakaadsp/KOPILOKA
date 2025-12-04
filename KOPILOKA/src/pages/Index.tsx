import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/HeroSection';
import { Footer } from '@/components/Footer';
import { ProductCard } from '@/components/ProductCard';
import { coffeeProducts } from '@/data/products';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, Bot, ShieldCheck, Truck, Coffee, Users, TrendingUp } from 'lucide-react';

const Index = () => {
  const featuredProducts = coffeeProducts.slice(0, 4);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main>
        {/* Hero Section */}
        <HeroSection />

        {/* Featured Products */}
        <section className="py-20 bg-warm-gradient">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-serif text-4xl font-bold mb-4">Kopi Pilihan</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Koleksi kopi terbaik dari berbagai daerah Indonesia, dipilih langsung dari petani lokal
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <div className="text-center">
              <Link to="/marketplace">
                <Button variant="coffee" size="lg" className="gap-2">
                  Lihat Semua Produk
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-secondary">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-serif text-4xl font-bold mb-4">Mengapa KOPILOKA?</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Platform yang dirancang untuk mendukung ekosistem kopi Indonesia
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard
                icon={Bot}
                title="AI Assistant Inklusif"
                description="Chatbot cerdas yang membantu Anda memilih kopi sesuai selera, lengkap dengan informasi brewing dan rekomendasi personal."
              />
              <FeatureCard
                icon={ShieldCheck}
                title="Kualitas Terjamin"
                description="Setiap kopi melalui proses seleksi ketat dan verifikasi langsung dari petani untuk menjamin keaslian dan kualitas."
              />
              <FeatureCard
                icon={Truck}
                title="Pengiriman Cepat"
                description="Sistem logistik terintegrasi memastikan kopi segar sampai ke tangan Anda dalam kondisi terbaik."
              />
              <FeatureCard
                icon={Coffee}
                title="100+ Varietas Kopi"
                description="Jelajahi berbagai jenis kopi dari Sabang sampai Merauke, dari Arabika hingga Liberika."
              />
              <FeatureCard
                icon={Users}
                title="Komunitas Kopi"
                description="Bergabung dengan komunitas pecinta kopi Indonesia, berbagi pengalaman dan review."
              />
              <FeatureCard
                icon={TrendingUp}
                title="Dukung UMKM Lokal"
                description="Setiap pembelian langsung mendukung petani dan UMKM kopi di seluruh Indonesia."
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-hero-gradient text-coffee-cream">
          <div className="container mx-auto px-4 text-center">
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6">
              Siap Menemukan Kopi Impian?
            </h2>
            <p className="text-coffee-cream/80 text-lg mb-10 max-w-2xl mx-auto">
              Mulai perjalanan kopi Anda bersama KOPILOKA. AI Assistant kami siap membantu menemukan kopi yang sempurna untuk Anda.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/chatbot">
                <Button variant="hero" size="xl" className="gap-2">
                  <Bot className="w-5 h-5" />
                  Tanya AI Assistant
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="heroOutline" size="xl">
                  Daftar Sekarang
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

function FeatureCard({ icon: Icon, title, description }: { icon: any; title: string; description: string }) {
  return (
    <div className="p-6 rounded-xl bg-background shadow-card hover:shadow-card-hover transition-all duration-300 group">
      <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
        <Icon className="w-7 h-7 text-primary" />
      </div>
      <h3 className="font-serif text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}

export default Index;
