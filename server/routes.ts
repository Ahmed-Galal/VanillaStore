import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import { storage } from "./storage";
import { insertOrderSchema } from "@shared/schema";
import { z } from "zod";

// Initialize Stripe only if the secret key is available
let stripe: Stripe | null = null;
if (process.env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-07-30.basil",
  });
}

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

  // Stripe payment intent
  app.post("/api/create-payment-intent", async (req, res) => {
    try {
      if (!stripe) {
        return res.status(503).json({ message: "Payment processing not configured. Please set up Stripe keys." });
      }

      const { amount, orderId } = req.body;
      
      if (!amount || amount <= 0) {
        return res.status(400).json({ message: "Invalid amount" });
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: "usd",
        metadata: {
          orderId: orderId || ""
        }
      });

      // Update order with payment intent ID if orderId provided
      if (orderId) {
        const order = await storage.getOrder(orderId);
        if (order) {
          await storage.updateOrderStatus(orderId, "processing");
        }
      }

      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      res.status(500).json({ message: "Error creating payment intent: " + error.message });
    }
  });

  // Confirm payment success
  app.post("/api/confirm-payment", async (req, res) => {
    try {
      const { orderId, paymentIntentId } = req.body;
      
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
