import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertOrderSchema } from "@shared/schema";
import { z } from "zod";

// Payflowly configuration
const PAYFLOWLY_API_URL = "https://payflowly.com/sign";
const PAYFLOWLY_TOKEN = "6-u9dQvn2iZ.__qL)n";
const PAYFLOWLY_APP_ID = "dd6d3e8b-4b43-4eee-8854-6cd885222ff4";

function generateOrderNumber(): string {
  return 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4).toUpperCase();
}

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Create order
  app.post("/api/orders", async (req, res) => {
    try {
      const orderData = insertOrderSchema.parse({
        ...req.body,
        orderNumber: generateOrderNumber(),
        status: "pending"
      });
      
      const order = await storage.createOrder(orderData);
      res.json(order);
    } catch (error: any) {
      res.status(400).json({ message: "Error creating order: " + error.message });
    }
  });

  // Get order by number
  app.get("/api/orders/:orderNumber", async (req, res) => {
    try {
      const order = await storage.getOrderByNumber(req.params.orderNumber);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.json(order);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching order: " + error.message });
    }
  });

  // Create Payflowly payment link
  app.post("/api/create-payment-link", async (req, res) => {
    try {
      const { amount, orderId, customerInfo } = req.body;
      
      if (!amount || amount <= 0) {
        return res.status(400).json({ message: "Invalid amount" });
      }

      // Create order first to get reference ID
      const orderNumber = generateOrderNumber();
      const order = await storage.createOrder({
        orderNumber,
        items: JSON.stringify(req.body.items || []),
        total: amount,
        status: "pending"
      });

      const webhookUrl = `${req.protocol}://${req.get('host')}/api/payflowly-webhook`;
      
      const payflowlyPayload = {
        app_id: PAYFLOWLY_APP_ID,
        reference_id: order.id,
        total: amount,
        webhook_url: webhookUrl,
        customer_id: customerInfo?.customerId || "default-customer",
        phone_code: "+2",
        phone_number: "01006736720",
        order_email: customerInfo?.email || "customer@example.com",
        order_customer_first_name: customerInfo?.firstName || "Customer",
        order_customer_last_name: customerInfo?.lastName || "Name"
      };

      console.log('Payflowly Request:', {
        url: PAYFLOWLY_API_URL,
        payload: payflowlyPayload
      });

      const response = await fetch(PAYFLOWLY_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${PAYFLOWLY_TOKEN}`
        },
        body: JSON.stringify(payflowlyPayload)
      });

      console.log('Payflowly Response Status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.log('Payflowly Error Response:', errorText);
        throw new Error(`Payflowly API error: ${response.status} - ${errorText}`);
      }

      const responseText = await response.text();
      console.log('Payflowly Raw Response:', responseText);

      let paymentUrl = null;
      
      // Try to parse as JSON first
      try {
        const paymentData = JSON.parse(responseText);
        console.log('Payflowly JSON Response:', paymentData);
        paymentUrl = paymentData.url || paymentData.payment_url || paymentData.link;
      } catch (jsonError) {
        // If not JSON, check if it's a direct URL
        if (responseText.startsWith('http')) {
          paymentUrl = responseText.trim();
          console.log('Payflowly returned direct URL:', paymentUrl);
        } else {
          // Try to extract URL from HTML response
          const urlMatch = responseText.match(/https?:\/\/[^\s"'>]+/);
          if (urlMatch) {
            paymentUrl = urlMatch[0];
            console.log('Extracted URL from response:', paymentUrl);
          }
        }
      }

      if (!paymentUrl) {
        throw new Error('No payment URL found in Payflowly response');
      }

      res.json({ 
        paymentUrl,
        orderId: order.id,
        orderNumber: order.orderNumber
      });
    } catch (error: any) {
      res.status(500).json({ message: "Error creating payment link: " + error.message });
    }
  });

  // Payflowly webhook handler
  app.post("/api/payflowly-webhook", async (req, res) => {
    try {
      const { reference_id, status, transaction_id } = req.body;
      
      if (status === "completed" || status === "success") {
        const order = await storage.updateOrderStatus(reference_id, "completed");
        if (order) {
          console.log(`Payment completed for order ${order.orderNumber}`);
        }
      }
      
      res.json({ success: true });
    } catch (error: any) {
      console.error("Webhook error:", error);
      res.status(500).json({ message: "Webhook processing error" });
    }
  });

  // Confirm payment success (for manual confirmation)
  app.post("/api/confirm-payment", async (req, res) => {
    try {
      const { orderId } = req.body;
      
      if (orderId) {
        const order = await storage.updateOrderStatus(orderId, "completed");
        res.json({ success: true, order });
      } else {
        res.json({ success: true });
      }
    } catch (error: any) {
      res.status(500).json({ message: "Error confirming payment: " + error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
