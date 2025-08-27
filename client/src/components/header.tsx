import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/contexts/cart-context';

export function Header() {
  const { toggleCart, itemCount } = useCart();

  return (
    <header className="bg-card border-b border-border sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-primary">PremiumMen</h1>
          </div>
          <nav className="hidden md:flex space-x-8">
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Home</a>
            <a href="#products" className="text-muted-foreground hover:text-foreground transition-colors">Products</a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">About</a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Contact</a>
          </nav>
          <div className="flex items-center space-x-4">
            <button 
              onClick={toggleCart}
              className="relative p-2 text-muted-foreground hover:text-foreground transition-colors"
              data-testid="button-cart-toggle"
            >
              <ShoppingCart className="h-6 w-6" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center" data-testid="text-cart-count">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
