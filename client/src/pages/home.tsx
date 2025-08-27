import { Header } from '@/components/header';
import { ProductCard } from '@/components/product-card';
import { CartSidebar } from '@/components/cart-sidebar';
import { products } from '@/lib/products';

export default function Home() {
  const scrollToProducts = () => {
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-secondary to-muted py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl lg:text-6xl font-bold text-primary mb-6">
              Premium Men's Collection
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Discover our carefully curated selection of premium vanilla products and luxury underwear for the modern man.
            </p>
            <button 
              onClick={scrollToProducts}
              className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
              data-testid="button-shop-now"
            >
              Shop Now
            </button>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-4">Our Products</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Handpicked premium products for your lifestyle
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">PremiumMen</h3>
              <p className="text-primary-foreground/80">
                Your trusted source for premium men's products and vanilla essentials.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-primary-foreground/80">
                <li><a href="#" className="hover:text-primary-foreground transition-colors">About Us</a></li>
                <li><a href="#products" className="hover:text-primary-foreground transition-colors">Products</a></li>
                <li><a href="#" className="hover:text-primary-foreground transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-primary-foreground transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
              <p className="text-primary-foreground/80">
                📱 +201006736720
              </p>
            </div>
          </div>
          <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-primary-foreground/60">
            <p>&copy; 2024 PremiumMen. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <CartSidebar />
    </div>
  );
}
