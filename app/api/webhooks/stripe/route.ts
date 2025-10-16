import { NextRequest, NextResponse } from 'next/server';
import { StripePaymentService } from '@/lib/stripe-payment-service';
import crypto from 'crypto';

const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || 'whsec_1234567890abcdefghijKLMNOpqrstuvwxyZ01234567890';

function verifyStripeWebhook(payload: string, signature: string, secret: string): boolean {
  const elements = signature.split(',');
  const signatureHash = elements.find(el => el.startsWith('v1='))?.split('=')[1];
  
  if (!signatureHash) return false;
  
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload, 'utf8')
    .digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(signatureHash, 'hex'),
    Buffer.from(expectedSignature, 'hex')
  );
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');
    
    if (!signature) {
      console.error('❌ Missing Stripe webhook signature');
      return NextResponse.json(
        { error: 'Missing webhook signature' },
        { status: 401 }
      );
    }

    // Verify webhook signature
    if (!verifyStripeWebhook(body, signature, STRIPE_WEBHOOK_SECRET)) {
      console.error('❌ Invalid Stripe webhook signature');
      return NextResponse.json(
        { error: 'Invalid webhook signature' },
        { status: 401 }
      );
    }

    const event = JSON.parse(body);
    
    console.log(`🔔 Processing Stripe webhook event: ${event.type}`);

    // Initialize Stripe payment service
    const stripeService = new StripePaymentService();
    
    // Process the webhook event
    await stripeService.processWebhookEvent(event);

    console.log(`✅ Stripe webhook event ${event.type} processed successfully`);

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('❌ Stripe webhook processing error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

// Handle GET requests for webhook verification
export async function GET() {
  return NextResponse.json({ 
    message: 'Stripe webhook endpoint is active',
    timestamp: new Date().toISOString()
  });
}
