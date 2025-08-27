-- Initialize PremiumMen Database

-- Create database if not exists
CREATE DATABASE IF NOT EXISTS premiummen;

-- Connect to the database
\c premiummen;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number TEXT NOT NULL UNIQUE,
    items TEXT NOT NULL,
    total REAL NOT NULL,
    stripe_payment_intent_id TEXT,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    customer_first_name TEXT,
    customer_last_name TEXT,
    customer_email TEXT,
    customer_phone TEXT,
    payflowly_payment_url TEXT,
    payflowly_reference_id TEXT
);

-- Create index on order_number for faster lookups
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);

-- Create index on status for filtering
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);

-- Insert sample user (optional)
INSERT INTO users (username, password) 
VALUES ('admin', 'admin123') 
ON CONFLICT (username) DO NOTHING;

GRANT ALL PRIVILEGES ON DATABASE premiummen TO postgres;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO postgres;