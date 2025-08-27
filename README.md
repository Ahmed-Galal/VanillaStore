# PremiumMen E-commerce Website

A full-stack e-commerce website for selling premium vanilla products and men's underwear with integrated Payflowly payment processing.

## 🚨 Important Note About "Static" Deployment

**This is NOT a static website** - it's a full-stack application that requires both frontend and backend components to function properly. It cannot be deployed as a simple static page because it includes:

- Express.js backend server
- Payment processing with Payflowly API
- Order management system
- Database storage
- API endpoints

## 🏗️ Application Architecture

- **Frontend**: React with TypeScript, Vite build system
- **Backend**: Express.js server with REST API
- **Payment**: Payflowly integration for secure payments
- **Storage**: In-memory storage (can be upgraded to PostgreSQL)
- **UI**: shadcn/ui components with Tailwind CSS

## 🚀 Deployment Options

### Option 1: Replit Autoscale Deployment (Recommended)

Deploy directly from your Replit workspace for automatic scaling:

1. **Prepare for Deployment**:
   ```bash
   npm run build
   ```

2. **Create Deployment**:
   - Click the "Deploy" button in your Replit workspace
   - Choose "Autoscale Deployment"
   - Configure machine power (CPU/RAM) as needed
   - Set maximum scaling instances

3. **Environment Setup**:
   - Your Payflowly configuration is already included
   - The app will be accessible via a `.replit.app` domain

4. **Benefits**:
   - Automatic scaling based on traffic
   - Cost-effective (scales down to zero when idle)
   - Built-in monitoring and logs

### Option 2: Replit Reserved VM Deployment

For applications that need to stay always-on:

1. **Choose Reserved VM** when creating deployment
2. **Configure Resources**:
   - Set dedicated CPU and RAM
   - Choose always-on configuration
3. **Best For**:
   - High-traffic applications
   - Consistent performance requirements
   - Applications that need persistent connections

### Option 3: External Hosting Providers

Deploy to other platforms that support Node.js applications:

#### Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

#### Netlify
```bash
# Build the application
npm run build

# Deploy using Netlify CLI
npm i -g netlify-cli
netlify deploy --prod --dir=dist
```

#### Heroku
```bash
# Install Heroku CLI and login
heroku login

# Create app
heroku create your-app-name

# Deploy
git push heroku main
```

## 🔧 Environment Configuration

### Required Environment Variables

The application includes these pre-configured settings:

```env
# Payflowly Configuration (Already configured)
PAYFLOWLY_API_URL=https://payflowly.com/sign
PAYFLOWLY_TOKEN=6-u9dQvn2iZ.__qL)n
PAYFLOWLY_APP_ID=dd6d3e8b-4b43-4eee-8854-6cd885222ff4

# Application Settings
NODE_ENV=production
PORT=5000
```

### WhatsApp Integration

After successful payments, customers are redirected to WhatsApp:
- **Phone Number**: +201006736720
- **Auto-message**: Includes order number and details

## 📦 Build Process

### Development
```bash
npm install
npm run dev
```

### Production Build
```bash
# Build frontend
npm run build

# Start production server
npm start
```

## 🛍️ Features

- **Product Catalog**: Vanilla products and men's underwear
- **Shopping Cart**: Add/remove items with quantity management
- **Secure Checkout**: Customer information collection
- **Payment Processing**: Payflowly integration for easy payments
- **Order Management**: Unique order numbers for each purchase
- **WhatsApp Integration**: Direct customer communication after purchase
- **Responsive Design**: Works on desktop and mobile devices

## 🔄 Payment Flow

1. Customer browses products and adds to cart
2. Proceeds to checkout with customer information
3. Clicks "Proceed to Payment"
4. Redirected to Payflowly secure payment page
5. After successful payment, redirected to WhatsApp
6. Order confirmation sent via WhatsApp

## 📱 Mobile Optimization

The website is fully responsive and optimized for:
- Mobile phones
- Tablets
- Desktop computers
- All modern browsers

## 🛠️ Technical Details

### Frontend Build
- React 18 with TypeScript
- Vite for fast builds and hot reload
- Tailwind CSS for styling
- Responsive design components

### Backend API
- Express.js server
- RESTful API endpoints
- CORS enabled for cross-origin requests
- Error handling and logging

### Payment Integration
- Payflowly API for payment processing
- Webhook support for payment confirmations
- Secure payment link generation

## 📞 Support

For deployment issues or technical support:
- Contact via WhatsApp: +201006736720
- Check server logs for debugging
- Verify all environment variables are set

## 🔐 Security Features

- HTTPS enforcement in production
- Secure payment processing via Payflowly
- Input validation and sanitization
- CORS protection
- Environment variable protection

---

**Note**: This application requires a Node.js hosting environment and cannot be deployed as a static HTML/CSS/JS website due to its backend requirements for payment processing and order management.