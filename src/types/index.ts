export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  origin: string;
  roastLevel: 'light' | 'medium' | 'dark';
  rating: number;
  reviews: number;
  sellerId: string;
  sellerName: string;
  stock: number;
  weight: string;
  flavor: string[];
  isOrganic: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'buyer' | 'seller';
  avatar?: string;
  phone?: string;
  address?: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface Order {
  id: string;
  buyerId: string;
  sellerId: string;
  items: CartItem[];
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: Date;
  shippingAddress: string;
}
