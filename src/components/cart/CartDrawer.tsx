import React from 'react';
import { useCart } from '@/contexts/CartContext';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetFooter 
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ShoppingBag, X, Plus, Minus, ChevronRight } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

export function CartDrawer() {
  const { 
    cart, 
    removeFromCart, 
    updateQuantity, 
    totalPrice, 
    isCartOpen, 
    setIsCartOpen 
  } = useCart();

  return (
    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
      <SheetContent side="right" className="w-full sm:max-w-md p-0 flex flex-col glass-card border-l border-black/5 bg-white/80 backdrop-blur-xl">
        <SheetHeader className="p-6 border-b border-black/5">
          <SheetTitle className="text-2xl font-bold tracking-tighter uppercase flex items-center gap-3">
            <ShoppingBag className="w-6 h-6 text-secondary" /> Your Collection
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-hidden">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center p-12 text-center space-y-4">
              <div className="p-6 bg-black/5 rounded-full">
                <ShoppingBag className="w-12 h-12 text-muted-foreground/30" />
              </div>
              <div className="space-y-2">
                <p className="font-bold uppercase tracking-widest text-muted-foreground">Empty Thread</p>
                <p className="text-sm text-muted-foreground/60 italic font-medium">Your collection is waiting to be started.</p>
              </div>
              <Button 
                variant="ghost" 
                onClick={() => setIsCartOpen(false)}
                className="rounded-full border border-black/5 uppercase text-[10px] font-bold tracking-widest mt-4"
              >
                Back to Shop
              </Button>
            </div>
          ) : (
            <ScrollArea className="h-full p-6">
              <div className="space-y-8">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-4 group animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="w-24 h-24 rounded-lg overflow-hidden bg-black/5 flex-shrink-0 border border-black/5">
                      <img 
                        src={item.image_urls?.[0] || item.image_url || ''} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                        alt={item.name} 
                      />
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold uppercase tracking-tight text-sm line-clamp-1">{item.name}</h4>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="text-muted-foreground hover:text-red-500 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-secondary font-bold text-lg">Ksh {Number(item.price).toLocaleString()}</p>
                      
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center border border-black/10 rounded-full overflow-hidden bg-black/5">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-2 hover:bg-black/10 transition-colors"
                          >
                            <Minus className="w-3 h-3 text-muted-foreground" />
                          </button>
                          <span className="w-8 text-center font-bold text-xs">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-2 hover:bg-black/10 transition-colors"
                          >
                            <Plus className="w-3 h-3 text-muted-foreground" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>

        {cart.length > 0 && (
          <SheetFooter className="p-8 border-t border-black/5 bg-white/40 backdrop-blur-md">
            <div className="w-full space-y-4">
              <div className="flex justify-between items-center text-lg font-bold uppercase tracking-widest">
                <span className="text-muted-foreground text-sm">Collective Value</span>
                <span className="text-secondary text-3xl tracking-tighter">Ksh {totalPrice.toLocaleString()}</span>
              </div>
              <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mb-6 opacity-60">
                Logistics and tailoring audits at checkout.
              </p>
              <Button className="w-full rounded-full bg-secondary text-white h-16 font-bold text-lg uppercase tracking-widest shadow-xl shadow-secondary/20 group hover:bg-secondary/90 transition-all">
                Final Audit <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
