import { Link } from 'react-router-dom';
import { Coffee, Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-xl bg-coffee-crema flex items-center justify-center">
                <Coffee className="w-6 h-6 text-coffee-dark" />
              </div>
              <span className="font-serif text-2xl font-bold">KOPILOKA</span>
            </Link>
            <p className="text-primary-foreground/70 mb-6">
              Platform marketplace kopi Indonesia dengan teknologi AI inklusif untuk menghubungkan petani, penjual, dan pecinta kopi.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-serif text-lg font-semibold mb-6">Navigasi</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/marketplace" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                  Marketplace
                </Link>
              </li>
              <li>
                <Link to="/chatbot" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                  AI Assistant
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                  Masuk
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                  Daftar
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-serif text-lg font-semibold mb-6">Kategori Kopi</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/marketplace?category=Arabika" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                  Arabika
                </Link>
              </li>
              <li>
                <Link to="/marketplace?category=Robusta" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                  Robusta
                </Link>
              </li>
              <li>
                <Link to="/marketplace?category=Liberika" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                  Liberika
                </Link>
              </li>
              <li>
                <Link to="/marketplace?category=Luwak" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                  Luwak
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-serif text-lg font-semibold mb-6">Kontak</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 mt-0.5 text-coffee-crema" />
                <span className="text-primary-foreground/70">
                  Jl. Kopi Nusantara No. 1<br />
                  Jakarta Selatan, 12345
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-coffee-crema" />
                <span className="text-primary-foreground/70">+62 812 3456 7890</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-coffee-crema" />
                <span className="text-primary-foreground/70">hello@kopiloka.id</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-primary-foreground/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-primary-foreground/50 text-sm">
            © 2024 KOPILOKA. All rights reserved. | Hackathon IMPHNEN
          </p>
          <p className="text-primary-foreground/50 text-sm">
            Inovasi AI: Mendorong Usaha Lokal dengan AI Inklusif
          </p>
        </div>
      </div>
    </footer>
  );
}
