import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { ShoppingCart, User, Menu, X, Coffee, MessageCircle, Store, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { totalItems } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();

  const navLinks = [
    { href: '/', label: 'Beranda' },
    { href: '/marketplace', label: 'Marketplace' },
    { href: '/chatbot', label: 'AI Assistant', icon: MessageCircle },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center group-hover:scale-105 transition-transform">
              <Coffee className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="font-serif text-2xl font-bold text-primary">KOPILOKA</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary",
                  isActive(link.href) ? "text-primary" : "text-muted-foreground"
                )}
              >
                {link.icon && <link.icon className="w-4 h-4" />}
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            <Link to="/cart" className="relative">
              <Button variant="ghost" size="icon">
                <ShoppingCart className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-accent-foreground text-xs rounded-full flex items-center justify-center font-bold">
                    {totalItems}
                  </span>
                )}
              </Button>
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link to={user?.role === 'seller' ? '/seller' : '/buyer'}>
                  <Button variant="outline" size="sm" className="gap-2">
                    {user?.role === 'seller' ? <Store className="w-4 h-4" /> : <User className="w-4 h-4" />}
                    {user?.name?.split(' ')[0]}
                  </Button>
                </Link>
                <Button variant="ghost" size="icon" onClick={logout}>
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm">Masuk</Button>
                </Link>
                <Link to="/register">
                  <Button variant="coffee" size="sm">Daftar</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border/50 animate-fade-in">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center gap-2 px-2 py-2 rounded-lg transition-colors",
                    isActive(link.href) 
                      ? "bg-primary/10 text-primary" 
                      : "text-muted-foreground hover:bg-secondary"
                  )}
                >
                  {link.icon && <link.icon className="w-4 h-4" />}
                  {link.label}
                </Link>
              ))}
              
              <div className="flex items-center gap-2 pt-4 border-t border-border/50">
                <Link to="/cart" onClick={() => setIsOpen(false)} className="flex-1">
                  <Button variant="outline" className="w-full gap-2">
                    <ShoppingCart className="w-4 h-4" />
                    Keranjang ({totalItems})
                  </Button>
                </Link>
              </div>

              {isAuthenticated ? (
                <div className="flex flex-col gap-2">
                  <Link to={user?.role === 'seller' ? '/seller' : '/buyer'} onClick={() => setIsOpen(false)}>
                    <Button variant="outline" className="w-full gap-2">
                      <User className="w-4 h-4" />
                      {user?.name}
                    </Button>
                  </Link>
                  <Button variant="ghost" className="w-full" onClick={() => { logout(); setIsOpen(false); }}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Keluar
                  </Button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Link to="/login" onClick={() => setIsOpen(false)} className="flex-1">
                    <Button variant="outline" className="w-full">Masuk</Button>
                  </Link>
                  <Link to="/register" onClick={() => setIsOpen(false)} className="flex-1">
                    <Button variant="coffee" className="w-full">Daftar</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
