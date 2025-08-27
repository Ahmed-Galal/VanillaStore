import { X, Plus, Minus, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/cart-context';
import { useLocation } from 'wouter';

export function CartSidebar() {
  const { items, isOpen, toggleCart, updateQuantity, total, itemCount } = useCart();
  const [, setLocation] = useLocation();

  const handleCheckout = () => {
    if (items.length > 0) {
      toggleCart();
      setLocation('/checkout');
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={toggleCart}
        data-testid="cart-overlay"
      />
      
      {/* Sidebar */}
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-card shadow-2xl z-50 border-l border-border">
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center p-6 border-b border-border">
            <h3 className="text-xl font-semibold text-primary">Shopping Cart</h3>
            <button 
              onClick={toggleCart}
              className="text-muted-foreground hover:text-foreground"
              data-testid="button-close-cart"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6">
            {items.length === 0 ? (
              <div className="text-center text-muted-foreground py-8" data-testid="cart-empty-state">
                <ShoppingCart className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p>Your cart is empty</p>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.product.id} className="flex items-center space-x-4 bg-secondary p-4 rounded-lg" data-testid={`cart-item-${item.product.id}`}>
                    <img 
                      src={item.product.image} 
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-primary">{item.product.name}</h4>
                      <p className="text-sm text-muted-foreground">${item.product.price.toFixed(2)} each</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="w-8 h-8 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center"
                        data-testid={`button-decrease-${item.product.id}`}
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-8 text-center font-medium" data-testid={`text-quantity-${item.product.id}`}>
                        {item.quantity}
                      </span>
                      <button 
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center"
                        data-testid={`button-increase-${item.product.id}`}
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="border-t border-border p-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold text-primary">Total:</span>
              <span className="text-xl font-bold text-primary" data-testid="text-cart-total">
                ${total.toFixed(2)}
              </span>
            </div>
            <Button 
              onClick={handleCheckout}
              disabled={items.length === 0}
              className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
              data-testid="button-proceed-checkout"
            >
              Proceed to Payment
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
