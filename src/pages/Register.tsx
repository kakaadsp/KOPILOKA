import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Coffee, Eye, EyeOff, User, Store } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState<'buyer' | 'seller'>('buyer');
  
  const { register } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Password tidak cocok",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Error",
        description: "Password minimal 6 karakter",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    const success = await register(email, password, name, role);
    
    if (success) {
      toast({
        title: "Registrasi Berhasil",
        description: `Selamat datang di KOPILOKA, ${name}!`,
      });
      navigate(role === 'seller' ? '/seller' : '/');
    } else {
      toast({
        title: "Registrasi Gagal",
        description: "Email sudah terdaftar",
        variant: "destructive",
      });
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20 min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
                <Coffee className="w-7 h-7 text-primary-foreground" />
              </div>
              <span className="font-serif text-3xl font-bold text-primary">KOPILOKA</span>
            </div>
            <h1 className="font-serif text-2xl font-bold">Buat Akun Baru</h1>
            <p className="text-muted-foreground mt-2">Bergabung dengan komunitas kopi Indonesia</p>
          </div>

          {/* Register Form */}
          <div className="bg-card rounded-2xl p-8 shadow-card">
            <Tabs value={role} onValueChange={(v) => setRole(v as 'buyer' | 'seller')} className="mb-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="buyer" className="gap-2">
                  <User className="w-4 h-4" />
                  Pembeli
                </TabsTrigger>
                <TabsTrigger value="seller" className="gap-2">
                  <Store className="w-4 h-4" />
                  Penjual
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Nama Lengkap</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder={role === 'seller' ? 'Nama Toko / Usaha' : 'Nama Anda'}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="nama@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Minimal 6 karakter"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Ulangi password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" variant="coffee" className="w-full" size="lg" disabled={isLoading}>
                {isLoading ? 'Mendaftar...' : `Daftar sebagai ${role === 'buyer' ? 'Pembeli' : 'Penjual'}`}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Sudah punya akun?{' '}
                <Link to="/login" className="text-primary font-medium hover:underline">
                  Masuk
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
