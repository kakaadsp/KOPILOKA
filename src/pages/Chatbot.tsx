import { useState, useRef, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatMessage } from '@/types';
import { coffeeProducts } from '@/data/products';
import { Bot, Send, User, Coffee, Sparkles, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

// AI Coffee Knowledge Base
const coffeeKnowledge = {
  greetings: [
    "Halo! Saya KopiBot, asisten AI KOPILOKA. Saya siap membantu Anda menemukan kopi yang sempurna! 🌿",
    "Selamat datang di KOPILOKA! Ada yang bisa saya bantu tentang kopi hari ini? ☕",
    "Hai! Saya di sini untuk membantu Anda menjelajahi dunia kopi Indonesia. Apa yang ingin Anda ketahui?"
  ],
  arabika: "**Kopi Arabika** adalah jenis kopi premium dengan karakteristik:\n- Kadar kafein lebih rendah (1-1.5%)\n- Rasa lebih kompleks dan beragam\n- Aroma lebih harum dan fruity\n- Tumbuh di ketinggian 1000-2000 mdpl\n- Cocok untuk: Single origin, pour over, cold brew\n\n**Rekomendasi Arabika kami:**\n1. Gayo Premium - Fruity & Floral\n2. Toraja Sapan - Chocolate & Herbal\n3. Bali Kintamani - Berry & Wine",
  robusta: "**Kopi Robusta** memiliki karakteristik yang berbeda:\n- Kadar kafein lebih tinggi (2-2.7%)\n- Rasa lebih bold dan pahit\n- Body lebih tebal\n- Tumbuh di ketinggian 200-800 mdpl\n- Cocok untuk: Espresso, kopi susu, campuran blend\n\n**Rekomendasi Robusta kami:**\n1. Lampung Robusta - Earthy & Bold\n2. Temanggung Java - Perfect for Espresso\n3. Aceh Ulee Kareng - Smoky & Intense",
  brewing: "**Panduan Brewing Kopi:**\n\n☕ **Pour Over (V60/Chemex)**\n- Rasio: 1:15 (15g kopi : 225ml air)\n- Suhu: 92-96°C\n- Waktu: 2.5-3 menit\n- Cocok untuk: Arabika light-medium roast\n\n☕ **French Press**\n- Rasio: 1:12\n- Suhu: 93-96°C\n- Waktu: 4 menit\n- Cocok untuk: Medium-dark roast\n\n☕ **Espresso**\n- Rasio: 1:2\n- Suhu: 90-94°C\n- Waktu: 25-30 detik\n- Cocok untuk: Dark roast, blend",
  origins: "**Daerah Penghasil Kopi Indonesia:**\n\n🏔️ **Sumatra:**\n- Gayo (Arabika) - Fruity, low acidity\n- Mandailing - Full body, chocolate\n- Lampung (Robusta) - Bold, earthy\n\n🏔️ **Sulawesi:**\n- Toraja - Complex, spicy, herbal\n- Enrekang - Clean, sweet\n\n🏔️ **Jawa:**\n- Preanger - Clean cup, nutty\n- Ijen - Bright, citrusy\n\n🏔️ **Bali:**\n- Kintamani - Fruity, wine-like\n\n🏔️ **Papua:**\n- Wamena - Tea-like, floral",
  recommendations: "Untuk memberikan rekomendasi yang tepat, saya perlu tahu preferensi Anda:\n\n1. **Rasa yang disukai:**\n   - Fruity & acidic\n   - Chocolatey & nutty\n   - Bold & strong\n\n2. **Metode penyeduhan:**\n   - Manual brew (V60, French Press)\n   - Espresso machine\n   - Kopi tubruk/tradisional\n\n3. **Budget:**\n   - Ekonomis (< Rp 100rb/250g)\n   - Premium (Rp 100-200rb/250g)\n   - Super Premium (> Rp 200rb/250g)\n\nBeritahu saya preferensi Anda!",
  health: "**Manfaat Kesehatan Kopi:**\n\n✅ Meningkatkan energi dan fokus\n✅ Kaya antioksidan\n✅ Dapat meningkatkan metabolisme\n✅ Mendukung kesehatan otak\n✅ Mengurangi risiko penyakit tertentu\n\n⚠️ **Tips sehat:**\n- Batasi 3-4 cangkir/hari\n- Hindari konsumsi setelah jam 2 siang\n- Pilih kopi tanpa gula berlebih\n- Minum air putih yang cukup",
  storage: "**Tips Penyimpanan Kopi:**\n\n🏠 **Biji Kopi:**\n- Simpan di wadah kedap udara\n- Jauhkan dari cahaya matahari\n- Suhu ruangan (20-25°C)\n- Jangan simpan di kulkas\n- Habiskan dalam 2-4 minggu setelah roasting\n\n☕ **Kopi Bubuk:**\n- Segera seduh setelah digiling\n- Jika disimpan, maksimal 1 minggu\n- Gunakan wadah kedap udara",
};

// Simple AI response generator based on keywords
function generateAIResponse(message: string): string {
  const lowerMessage = message.toLowerCase();
  
  // Check for greetings
  if (/^(halo|hai|hi|hello|selamat|pagi|siang|malam|apa kabar)/.test(lowerMessage)) {
    return coffeeKnowledge.greetings[Math.floor(Math.random() * coffeeKnowledge.greetings.length)];
  }
  
  // Check for arabika
  if (lowerMessage.includes('arabika') || lowerMessage.includes('arabica')) {
    return coffeeKnowledge.arabika;
  }
  
  // Check for robusta
  if (lowerMessage.includes('robusta')) {
    return coffeeKnowledge.robusta;
  }
  
  // Check for brewing/seduh
  if (lowerMessage.includes('seduh') || lowerMessage.includes('brew') || lowerMessage.includes('cara buat') || lowerMessage.includes('v60') || lowerMessage.includes('french press')) {
    return coffeeKnowledge.brewing;
  }
  
  // Check for origins/daerah
  if (lowerMessage.includes('daerah') || lowerMessage.includes('asal') || lowerMessage.includes('origin') || lowerMessage.includes('sumatra') || lowerMessage.includes('toraja') || lowerMessage.includes('gayo')) {
    return coffeeKnowledge.origins;
  }
  
  // Check for recommendations
  if (lowerMessage.includes('rekomen') || lowerMessage.includes('saran') || lowerMessage.includes('pilih') || lowerMessage.includes('cocok')) {
    return coffeeKnowledge.recommendations;
  }
  
  // Check for health
  if (lowerMessage.includes('sehat') || lowerMessage.includes('manfaat') || lowerMessage.includes('kesehatan') || lowerMessage.includes('kafein')) {
    return coffeeKnowledge.health;
  }
  
  // Check for storage
  if (lowerMessage.includes('simpan') || lowerMessage.includes('storage') || lowerMessage.includes('awet')) {
    return coffeeKnowledge.storage;
  }
  
  // Check for price/harga
  if (lowerMessage.includes('harga') || lowerMessage.includes('murah') || lowerMessage.includes('mahal') || lowerMessage.includes('budget')) {
    const cheapProducts = coffeeProducts.filter(p => p.price < 150000);
    const premiumProducts = coffeeProducts.filter(p => p.price >= 150000 && p.price < 250000);
    return `**Kategori Harga Kopi Kami:**\n\n💰 **Budget Friendly (< Rp 150rb):**\n${cheapProducts.slice(0, 3).map(p => `- ${p.name} - Rp ${p.price.toLocaleString('id-ID')}`).join('\n')}\n\n💎 **Premium (Rp 150-250rb):**\n${premiumProducts.slice(0, 3).map(p => `- ${p.name} - Rp ${p.price.toLocaleString('id-ID')}`).join('\n')}\n\nKunjungi Marketplace kami untuk melihat semua produk!`;
  }
  
  // Check for specific product queries
  if (lowerMessage.includes('produk') || lowerMessage.includes('jual') || lowerMessage.includes('beli')) {
    return `**Produk Kopi Tersedia di KOPILOKA:**\n\nKami memiliki ${coffeeProducts.length} varietas kopi dari seluruh Indonesia:\n\n${coffeeProducts.slice(0, 5).map(p => `☕ **${p.name}** - ${p.origin}\n   ${p.category} | ${p.roastLevel} roast | Rp ${p.price.toLocaleString('id-ID')}`).join('\n\n')}\n\n...dan masih banyak lagi!\n\nKunjungi halaman Marketplace untuk melihat semua produk kami.`;
  }
  
  // Default response
  return `Terima kasih atas pertanyaannya! 😊\n\nSaya bisa membantu Anda dengan:\n\n1. **Informasi Kopi** - Arabika, Robusta, Liberika\n2. **Cara Penyeduhan** - Pour over, French Press, Espresso\n3. **Asal Daerah** - Gayo, Toraja, Bali, dll\n4. **Rekomendasi Kopi** - Sesuai selera Anda\n5. **Tips Penyimpanan** - Agar kopi tetap segar\n6. **Manfaat Kesehatan** - Kopi dan kesehatan\n7. **Harga & Produk** - Katalog kopi kami\n\nSilakan tanyakan topik yang Anda minati!`;
}

export default function Chatbot() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Halo! Saya **KopiBot**, asisten AI KOPILOKA yang siap membantu Anda! 🌿☕\n\nSaya dapat membantu Anda dengan:\n- Informasi jenis-jenis kopi\n- Rekomendasi kopi sesuai selera\n- Tips penyeduhan (brewing)\n- Informasi daerah penghasil kopi\n- Dan banyak lagi!\n\nApa yang ingin Anda ketahui tentang kopi hari ini?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI thinking delay
    setTimeout(() => {
      const aiResponse = generateAIResponse(userMessage.content);
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    setMessages([{
      id: '1',
      role: 'assistant',
      content: 'Chat telah direset. Ada yang bisa saya bantu? ☕',
      timestamp: new Date()
    }]);
  };

  const suggestedQuestions = [
    "Apa perbedaan Arabika dan Robusta?",
    "Rekomendasikan kopi untuk pemula",
    "Cara menyeduh kopi yang benar",
    "Kopi dari daerah mana yang paling enak?"
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20 pb-8">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary mb-4">
              <Bot className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="font-serif text-3xl font-bold mb-2">KopiBot AI Assistant</h1>
            <p className="text-muted-foreground">Asisten cerdas untuk semua kebutuhan kopi Anda</p>
          </div>

          {/* Chat Container */}
          <div className="bg-card rounded-2xl shadow-card overflow-hidden">
            {/* Chat Messages */}
            <ScrollArea className="h-[500px] p-6" ref={scrollRef}>
              <div className="space-y-6">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex gap-3",
                      message.role === 'user' ? 'flex-row-reverse' : ''
                    )}
                  >
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                      message.role === 'user' ? 'bg-primary' : 'bg-accent'
                    )}>
                      {message.role === 'user' ? (
                        <User className="w-5 h-5 text-primary-foreground" />
                      ) : (
                        <Coffee className="w-5 h-5 text-accent-foreground" />
                      )}
                    </div>
                    <div className={cn(
                      "max-w-[80%] rounded-2xl px-4 py-3",
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground rounded-tr-none'
                        : 'bg-secondary text-secondary-foreground rounded-tl-none'
                    )}>
                      <div className="prose prose-sm max-w-none dark:prose-invert">
                        {message.content.split('\n').map((line, i) => {
                          // Handle bold text
                          const boldRegex = /\*\*(.*?)\*\*/g;
                          const parts = line.split(boldRegex);
                          return (
                            <p key={i} className="mb-1 last:mb-0">
                              {parts.map((part, j) => 
                                j % 2 === 1 ? <strong key={j}>{part}</strong> : part
                              )}
                            </p>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                      <Coffee className="w-5 h-5 text-accent-foreground" />
                    </div>
                    <div className="bg-secondary rounded-2xl rounded-tl-none px-4 py-3">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Suggested Questions */}
            {messages.length <= 2 && (
              <div className="px-6 pb-4">
                <p className="text-sm text-muted-foreground mb-3">Coba tanyakan:</p>
                <div className="flex flex-wrap gap-2">
                  {suggestedQuestions.map((question, i) => (
                    <button
                      key={i}
                      onClick={() => setInput(question)}
                      className="px-3 py-1.5 text-sm bg-secondary hover:bg-secondary/80 rounded-full transition-colors"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Area */}
            <div className="p-4 border-t border-border">
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={clearChat}
                  title="Reset Chat"
                >
                  <RefreshCw className="w-5 h-5" />
                </Button>
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Tanyakan sesuatu tentang kopi..."
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button
                  variant="coffee"
                  size="icon"
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div className="p-4 rounded-xl bg-card shadow-card text-center">
              <Sparkles className="w-8 h-8 mx-auto mb-2 text-accent" />
              <h3 className="font-semibold mb-1">AI Inklusif</h3>
              <p className="text-sm text-muted-foreground">Memahami bahasa Indonesia dengan baik</p>
            </div>
            <div className="p-4 rounded-xl bg-card shadow-card text-center">
              <Coffee className="w-8 h-8 mx-auto mb-2 text-primary" />
              <h3 className="font-semibold mb-1">Pakar Kopi</h3>
              <p className="text-sm text-muted-foreground">Pengetahuan lengkap tentang kopi Indonesia</p>
            </div>
            <div className="p-4 rounded-xl bg-card shadow-card text-center">
              <Bot className="w-8 h-8 mx-auto mb-2 text-coffee-crema" />
              <h3 className="font-semibold mb-1">Rekomendasi Personal</h3>
              <p className="text-sm text-muted-foreground">Saran kopi sesuai selera Anda</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
