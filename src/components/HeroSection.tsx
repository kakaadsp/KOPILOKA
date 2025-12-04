import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Leaf, Users } from 'lucide-react';
import heroCoffee from '@/assets/hero-coffee.jpg';

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src={heroCoffee}
          alt="Premium Indonesian Coffee"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-hero-gradient opacity-85" />
        <div className="absolute inset-0 coffee-pattern opacity-10" />
      </div>

      {/* Content */}
      <div className="container relative z-10 mx-auto px-4 py-32">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-coffee-cream/10 border border-coffee-cream/20 text-coffee-cream mb-8 animate-fade-up">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">AI-Powered Coffee Marketplace</span>
          </div>

          {/* Headline */}
          <h1 className="font-serif text-5xl md:text-7xl font-bold text-coffee-cream mb-6 animate-fade-up delay-100">
            Temukan Kopi Terbaik
            <span className="block text-coffee-crema">Nusantara</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-coffee-cream/80 mb-10 max-w-xl animate-fade-up delay-200">
            Marketplace kopi Indonesia dengan teknologi AI inklusif. Hubungkan petani lokal, penjual, dan pecinta kopi dalam satu platform.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 mb-16 animate-fade-up delay-300">
            <Link to="/marketplace">
              <Button variant="hero" size="xl" className="gap-2">
                Jelajahi Kopi
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/chatbot">
              <Button variant="heroOutline" size="xl" className="gap-2">
                <Sparkles className="w-5 h-5" />
                Tanya AI Assistant
              </Button>
            </Link>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-up delay-400">
            <FeatureCard
              icon={Leaf}
              title="100+ Varietas"
              description="Kopi lokal dari berbagai daerah Indonesia"
            />
            <FeatureCard
              icon={Users}
              title="Petani Lokal"
              description="Langsung dari perkebunan ke tangan Anda"
            />
            <FeatureCard
              icon={Sparkles}
              title="AI Inklusif"
              description="Asisten cerdas untuk rekomendasi kopi"
            />
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
        <div className="w-6 h-10 rounded-full border-2 border-coffee-cream/30 flex items-start justify-center p-2">
          <div className="w-1.5 h-3 bg-coffee-crema rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ icon: Icon, title, description }: { icon: any; title: string; description: string }) {
  return (
    <div className="flex items-start gap-4 p-4 rounded-xl bg-coffee-cream/5 border border-coffee-cream/10 backdrop-blur-sm">
      <div className="w-12 h-12 rounded-lg bg-coffee-crema/20 flex items-center justify-center shrink-0">
        <Icon className="w-6 h-6 text-coffee-crema" />
      </div>
      <div>
        <h3 className="font-semibold text-coffee-cream mb-1">{title}</h3>
        <p className="text-sm text-coffee-cream/70">{description}</p>
      </div>
    </div>
  );
}
