import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/contexts/cart-context';
import { ArrowLeft, Check } from 'lucide-react';

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = import.meta.env.VITE_STRIPE_PUBLIC_KEY 
  ? loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)
  : null;

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const { items, total, clearCart } = useCart();
  const [, setLocation] = useLocation();
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment-success`,
        },
        redirect: 'if_required'
      });

      if (error) {
        toast({
          title: "Payment Failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        // Generate order number and show success
        const orderNum = 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4).toUpperCase();
        setOrderNumber(orderNum);
        setShowSuccess(true);
        clearCart();
        
        toast({
          title: "Payment Successful",
          description: "Thank you for your purchase!",
        });
      }
    } catch (error: any) {
      toast({
        title: "Payment Error",
        description: error.message || "An unexpected error occurred",
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

          {/* Payment Form */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <PaymentElement />
                <Button 
                  type="submit"
                  disabled={!stripe || isProcessing}
                  className="w-full"
                  data-testid="button-complete-payment"
                >
                  {isProcessing ? 'Processing...' : `Pay $${total.toFixed(2)}`}
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
  const [clientSecret, setClientSecret] = useState("");
  const { items, total } = useCart();
  const [, setLocation] = useLocation();
  const [paymentError, setPaymentError] = useState("");

  useEffect(() => {
    // Redirect if cart is empty
    if (items.length === 0) {
      setLocation('/');
      return;
    }

    // Check if Stripe is configured
    if (!stripePromise) {
      setPaymentError("Payment processing is not configured. Please set up Stripe keys.");
      return;
    }

    // Create PaymentIntent as soon as the page loads
    apiRequest("POST", "/api/create-payment-intent", { 
      amount: total
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.clientSecret) {
          setClientSecret(data.clientSecret);
        } else {
          setPaymentError(data.message || "Payment processing not available");
        }
      })
      .catch((error) => {
        console.error('Error creating payment intent:', error);
        setPaymentError("Unable to setup payment processing");
      });
  }, [items.length, total, setLocation]);

  if (items.length === 0) {
    return null; // Will redirect via useEffect
  }

  // Show error if payment is not configured
  if (paymentError) {
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
          <Card className="max-w-md mx-auto">
            <CardContent className="pt-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-primary mb-4">Payment Not Available</h3>
                <p className="text-muted-foreground mb-4">{paymentError}</p>
                <p className="text-sm text-muted-foreground mb-6">
                  Please contact us directly to complete your order.
                </p>
                <Button 
                  onClick={() => {
                    const phone = '+201006736720';
                    const orderItems = items.map(item => `${item.quantity}x ${item.product.name}`).join(', ');
                    const message = `Hello! I'd like to order: ${orderItems}. Total: $${total.toFixed(2)}`;
                    const whatsappURL = `https://wa.me/${phone.replace('+', '')}?text=${encodeURIComponent(message)}`;
                    window.open(whatsappURL, '_blank');
                  }}
                  className="w-full bg-green-500 text-white hover:bg-green-600"
                  data-testid="button-whatsapp-order"
                >
                  📱 Order via WhatsApp
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  // Make SURE to wrap the form in <Elements> which provides the stripe context.
  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <CheckoutForm />
    </Elements>
  );
}
