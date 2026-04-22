import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Product } from '@/types';
import { toast } from 'sonner';
import { supabase, isConfigured } from '@/lib/supabase';
import { useAuth } from './AuthContext';

export interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const savedCart = localStorage.getItem('brenda-cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (e) {
      console.error('Failed to load cart from localStorage:', e);
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Sync with Supabase on Login
  useEffect(() => {
    async function syncCart() {
      if (!user || !isConfigured) {
        // If logged out, load from localStorage
        const savedCart = localStorage.getItem('brenda-cart');
        if (savedCart) setCart(JSON.parse(savedCart));
        return;
      }

      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('cart_items')
          .select('quantity, products(*)')
          .eq('user_id', user.id);

        if (error) throw error;

        if (data && data.length > 0) {
          const remoteCart: CartItem[] = data.map((item: any) => ({
            ...item.products,
            quantity: item.quantity
          }));
          setCart(remoteCart);
        } else if (cart.length > 0) {
          // If remote is empty but local has items, sync local to remote
          for (const item of cart) {
            await supabase.from('cart_items').upsert({
              user_id: user.id,
              product_id: item.id,
              quantity: item.quantity
            });
          }
        }
      } catch (err) {
        console.error('Cart sync error:', err);
      } finally {
        setLoading(false);
      }
    }

    syncCart();
  }, [user]);

  // Persist to localStorage for guests
  useEffect(() => {
    if (!user) {
      localStorage.setItem('brenda-cart', JSON.stringify(cart));
    }
  }, [cart, user]);

  const addToCart = async (product: Product) => {
    const existingItem = cart.find((item) => item.id === product.id);
    const newQuantity = existingItem ? existingItem.quantity + 1 : 1;

    if (user && isConfigured) {
      try {
        const { error } = await supabase
          .from('cart_items')
          .upsert({
            user_id: user.id,
            product_id: product.id,
            quantity: newQuantity
          }, { onConflict: 'user_id,product_id' });

        if (error) throw error;
      } catch (err) {
        console.error('Failed to sync add to cart:', err);
      }
    }

    setCart((prevCart) => {
      if (existingItem) {
        toast.success(`Another ${product.name} added to your collection.`);
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      toast.success(`${product.name} added to your collection.`);
      return [...prevCart, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = async (productId: string) => {
    if (user && isConfigured) {
      try {
        await supabase.from('cart_items').delete().eq('user_id', user.id).eq('product_id', productId);
      } catch (err) {
        console.error('Failed to sync remove from cart:', err);
      }
    }
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
    toast.info('Item removed from collection.');
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    if (user && isConfigured) {
      try {
        await supabase.from('cart_items').update({ quantity }).eq('user_id', user.id).eq('product_id', productId);
      } catch (err) {
        console.error('Failed to sync update quantity:', err);
      }
    }

    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = async () => {
    if (user && isConfigured) {
      try {
        await supabase.from('cart_items').delete().eq('user_id', user.id);
      } catch (err) {
        console.error('Failed to sync clear cart:', err);
      }
    }
    setCart([]);
    toast.info('Cart cleared.');
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      isCartOpen,
      setIsCartOpen,
      totalItems,
      totalPrice
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
