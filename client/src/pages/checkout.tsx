import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/contexts/cart-context';
import { ArrowLeft, Check, CreditCard } from 'lucide-react';

function CheckoutForm() {
  const { toast } = useToast();
  const { items, total, clearCart } = useCart();
  const [, setLocation] = useLocation();
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setCustomerInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // Create payment link with Payflowly
      const response = await apiRequest("POST", "/api/create-payment-link", {
        amount: total,
        items: items.map(item => ({
          id: item.product.id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity
        })),
        customerInfo
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Payment link creation failed');
      }

      if (data.paymentUrl) {
        // Store order info for success page
        sessionStorage.setItem('pendingOrder', JSON.stringify({
          orderNumber: data.orderNumber,
          orderId: data.orderId
        }));
        
        // Redirect to Payflowly payment page
        window.location.href = data.paymentUrl;
      } else {
        throw new Error('No payment URL received from payment processor');
      }
    } catch (error: any) {
      toast({
        title: "Payment Error",
        description: error.message || "Unable to create payment link",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const redirectToWhatsApp = () => {
    const phone = '+201006736720';
    const message = `Hello! I just completed my order #${orderNumber}. Thank you!`;
    const whatsappURL = `https://wa.me/${phone.replace('+', '')}?text=${encodeURIComponent(message)}`;
    
    window.open(whatsappURL, '_blank');
    setLocation('/');
  };

  // Check for payment success on page load
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatus = urlParams.get('status');
    const pendingOrder = sessionStorage.getItem('pendingOrder');
    
    if (paymentStatus === 'success' && pendingOrder) {
      const orderInfo = JSON.parse(pendingOrder);
      setOrderNumber(orderInfo.orderNumber);
      setShowSuccess(true);
      clearCart();
      sessionStorage.removeItem('pendingOrder');
      
      toast({
        title: "Payment Successful",
        description: "Thank you for your purchase!",
      });
    }
  }, [clearCart, toast]);

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <Check className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-primary mb-2">Payment Successful!</h3>
              <p className="text-muted-foreground mb-4">Your order has been confirmed.</p>
              <p className="text-sm text-muted-foreground mb-6" data-testid="text-order-number">
                Order #{orderNumber}
              </p>
              <Button 
                onClick={redirectToWhatsApp}
                className="w-full bg-green-500 text-white hover:bg-green-600"
                data-testid="button-whatsapp-redirect"
              >
                📱 Continue to WhatsApp
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => setLocation('/')}
            className="mb-4"
            data-testid="button-back-home"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Shop
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.product.id} className="flex justify-between items-center" data-testid={`order-item-${item.product.id}`}>
                    <div className="flex items-center space-x-3">
                      <img 
                        src={item.product.image} 
                        alt={item.product.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div>
                        <p className="font-medium">{item.product.name}</p>
                        <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="font-medium">${(item.product.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center font-semibold text-lg">
                    <span>Total:</span>
                    <span data-testid="text-order-total">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Customer Information & Payment */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      type="text"
                      required
                      value={customerInfo.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      data-testid="input-first-name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      type="text"
                      required
                      value={customerInfo.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      data-testid="input-last-name"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={customerInfo.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    data-testid="input-email"
                  />
                </div>
                
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={customerInfo.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    data-testid="input-phone"
                    placeholder="Optional"
                  />
                </div>

                <Button 
                  type="submit"
                  disabled={isProcessing}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                  data-testid="button-proceed-payment"
                >
                  {isProcessing ? 'Creating Payment Link...' : `Proceed to Payment - $${total.toFixed(2)}`}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function Checkout() {
  const { items } = useCart();
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Redirect if cart is empty
    if (items.length === 0) {
      setLocation('/');
      return;
    }
  }, [items.length, setLocation]);

  if (items.length === 0) {
    return null; // Will redirect via useEffect
  }

  return <CheckoutForm />;
}
