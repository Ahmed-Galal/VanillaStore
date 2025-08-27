import { useState } from 'react';
import { ShoppingCart, Check } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Product } from '@/lib/products';
import { useCart } from '@/contexts/cart-context';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    setIsAdding(true);
    addItem(product);
    
    // Show success feedback for 1 second
    setTimeout(() => {
      setIsAdding(false);
    }, 1000);
  };

  return (
    <Card className="overflow-hidden group hover:shadow-xl transition-shadow duration-300">
      <div className="aspect-[4/3] overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold text-primary mb-2">{product.name}</h3>
        <p className="text-muted-foreground mb-4">{product.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold text-primary">${product.price.toFixed(2)}</span>
          <Button
            onClick={handleAddToCart}
            disabled={isAdding}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            data-testid={`button-add-to-cart-${product.id}`}
          >
            {isAdding ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Added!
              </>
            ) : (
              <>
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
