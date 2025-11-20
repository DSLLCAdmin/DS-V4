import { NextRequest, NextResponse } from 'next/server';
import { storeProductInterestInZoho } from '@/lib/zoho-crm';

/**
 * Product Interest API Route
 * 
 * Sends product interest notifications to ProductInterest@darkstreetllc.com (Zoho)
 * Stores product interest data in Zoho CRM (if configured)
 * Includes customer contact details, product information, and browsing history
 */

interface ProductInterestRequest {
  productId: string;
  productTitle: string;
  productCategory: string;
  customerEmail?: string;
  customerName?: string;
  customerPhone?: string;
  customerMessage?: string;
  productsVisited?: string[];
  productsPurchased?: string[];
  cartItems?: string[];
  totalProductViews?: number;
  totalPurchases?: number;
  totalCartAdds?: number;
  totalSpent?: number;
  timeOnSiteMinutes?: number;
  referrer?: string;
  userAgent?: string;
  timestamp: string;
}

// Zoho SMTP Configuration (using environment variables)
const ZOHO_SMTP_HOST = process.env.ZOHO_SMTP_HOST || 'smtp.zoho.com';
const ZOHO_SMTP_PORT = parseInt(process.env.ZOHO_SMTP_PORT || '587');
const ZOHO_SMTP_USER = process.env.ZOHO_SMTP_USER || 'admin@darkstreetllc.com';
const ZOHO_SMTP_PASSWORD = process.env.ZOHO_SMTP_PASSWORD || '';
const PRODUCT_INTEREST_EMAIL = process.env.PRODUCT_INTEREST_EMAIL || 'ProductInterest@darkstreetllc.com';

export async function POST(request: NextRequest) {
  try {
    const body: ProductInterestRequest = await request.json();

    // Validate required fields
    if (!body.productId || !body.productTitle) {
      return NextResponse.json(
        { error: 'Missing required fields: productId and productTitle' },
        { status: 400 }
      );
    }

    // Build email content
    const emailSubject = `Product Interest: ${body.productTitle} (${body.productId})`;
    
    const emailBody = `
📦 PRODUCT INTEREST NOTIFICATION
================================

Product Information:
--------------------
Product ID: ${body.productId}
Product Title: ${body.productTitle}
Category: ${body.productCategory || 'N/A'}
Timestamp: ${body.timestamp || new Date().toISOString()}

Customer Information:
---------------------
${body.customerName ? `Name: ${body.customerName}` : 'Name: Not provided'}
${body.customerEmail ? `Email: ${body.customerEmail}` : 'Email: Not provided'}
${body.customerPhone ? `Phone: ${body.customerPhone}` : 'Phone: Not provided'}
${body.customerMessage ? `Message: ${body.customerMessage}` : ''}

Customer Profile:
-----------------
Products Visited (${body.totalProductViews || 0} total): ${body.productsVisited && body.productsVisited.length > 0 
  ? body.productsVisited.join(', ') 
  : 'None tracked'}
Products Purchased (${body.totalPurchases || 0} total): ${body.productsPurchased && body.productsPurchased.length > 0 
  ? body.productsPurchased.join(', ') 
  : 'None'}
Cart Items Added (${body.totalCartAdds || 0} total): ${body.cartItems && body.cartItems.length > 0 
  ? body.cartItems.join(', ') 
  : 'None'}
Total Spent: $${(body.totalSpent || 0).toFixed(2)}
Time on Site: ${body.timeOnSiteMinutes || 0} minutes

Technical Details:
------------------
Referrer: ${body.referrer || 'Direct'}
User Agent: ${body.userAgent || 'Unknown'}
Timestamp: ${body.timestamp || new Date().toISOString()}

---
This is an automated notification from the DS LLC website.
Customer expressed interest in a product that is currently in development.
    `.trim();

    // Store in Zoho CRM (if configured)
    let zohoCRMStored = false;
    try {
      zohoCRMStored = await storeProductInterestInZoho(body);
      if (zohoCRMStored) {
        console.log(`✅ Product Interest stored in Zoho CRM for product ${body.productId}`);
      }
    } catch (error) {
      console.error('Error storing in Zoho CRM (continuing with email):', error);
      // Continue with email even if CRM storage fails
    }

    // Send email to ProductInterest@zoho (internal notification)
    const emailSent = await sendEmailViaZoho({
      to: PRODUCT_INTEREST_EMAIL,
      subject: emailSubject,
      body: emailBody,
      from: ZOHO_SMTP_USER
    });

    if (!emailSent) {
      console.error('Failed to send product interest email');
      return NextResponse.json(
        { error: 'Failed to send email notification' },
        { status: 500 }
      );
    }

    // Send confirmation email to customer
    if (body.customerEmail) {
      const customerEmailSubject = `Thank You for Your Interest - ${body.productTitle}`;
      const customerEmailBody = `
Hello ${body.customerName || 'Valued Customer'},

Thank you for expressing interest in "${body.productTitle}"!

We've received your interest notification and have added you to our list. We'll notify you as soon as this product becomes available.

Product Details:
- Product: ${body.productTitle}
- Category: ${body.productCategory || 'N/A'}
${body.customerMessage ? `- Your Message: ${body.customerMessage}` : ''}

What's Next?
We're working hard to bring this product to market. You'll be among the first to know when it's ready!

In the meantime, feel free to browse our current collection at https://darkstreetllc.com/shop

Thank you for your interest in DarkStreet LLC!

Best regards,
The DarkStreet Team

---
This is an automated confirmation email. If you have any questions, please reply to this email.
      `.trim();

      await sendEmailViaZoho({
        to: body.customerEmail,
        subject: customerEmailSubject,
        body: customerEmailBody,
        from: ZOHO_SMTP_USER
      });
    }

    console.log(`✅ Product interest email sent to ${PRODUCT_INTEREST_EMAIL} for product ${body.productId}`);
    if (body.customerEmail) {
      console.log(`✅ Confirmation email sent to ${body.customerEmail}`);
    }

    return NextResponse.json({ 
      success: true,
      message: 'Product interest notification sent successfully'
    });

  } catch (error) {
    console.error('❌ Product interest API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Send email via Zoho SMTP
 * 
 * Note: For production, consider using a service like:
 * - Resend (recommended for Next.js)
 * - SendGrid
 * - AWS SES
 * - Or Zoho Mail API
 */
async function sendEmailViaZoho({
  to,
  subject,
  body,
  from
}: {
  to: string;
  subject: string;
  body: string;
  from: string;
}): Promise<boolean> {
  try {
    // For now, we'll use a simple fetch to a mail service
    // In production, you should use a proper email service like Resend, SendGrid, or Zoho Mail API
    
    // Option 1: Use Resend (recommended for Next.js)
    if (process.env.RESEND_API_KEY) {
      return await sendViaResend({ to, subject, body, from });
    }
    
    // Option 2: Use Zoho Mail API (if configured)
    if (process.env.ZOHO_MAIL_API_KEY) {
      return await sendViaZohoAPI({ to, subject, body, from });
    }
    
    // Option 3: Use SMTP (requires nodemailer - add to package.json if needed)
    if (process.env.ZOHO_SMTP_PASSWORD) {
      return await sendViaSMTP({ to, subject, body, from });
    }
    
    // Fallback: Log to console (development only)
    console.log('📧 Email would be sent (no email service configured):');
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body:\n${body}`);
    
    return true; // Return true for development
    
  } catch (error) {
    console.error('Email sending error:', error);
    return false;
  }
}

/**
 * Send email via Resend (recommended for Next.js)
 */
async function sendViaResend({
  to,
  subject,
  body,
  from
}: {
  to: string;
  subject: string;
  body: string;
  from: string;
}): Promise<boolean> {
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: from,
        to: [to],
        subject: subject,
        text: body,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Resend API error:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Resend error:', error);
    return false;
  }
}

/**
 * Send email via Zoho Mail API
 */
async function sendViaZohoAPI({
  to,
  subject,
  body,
  from
}: {
  to: string;
  subject: string;
  body: string;
  from: string;
}): Promise<boolean> {
  try {
    // Zoho Mail API implementation
    // See: https://www.zoho.com/mail/help/api/
    const response = await fetch('https://mail.zoho.com/api/accounts/send', {
      method: 'POST',
      headers: {
        'Authorization': `Zoho-oauthtoken ${process.env.ZOHO_MAIL_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fromAddress: from,
        toAddress: to,
        subject: subject,
        content: body,
      }),
    });

    return response.ok;
  } catch (error) {
    console.error('Zoho Mail API error:', error);
    return false;
  }
}

/**
 * Send email via SMTP (requires nodemailer)
 */
async function sendViaSMTP({
  to,
  subject,
  body,
  from
}: {
  to: string;
  subject: string;
  body: string;
  from: string;
}): Promise<boolean> {
  try {
    // This requires nodemailer package
    // Install: npm install nodemailer @types/nodemailer
    const nodemailer = require('nodemailer');
    
    const transporter = nodemailer.createTransport({
      host: ZOHO_SMTP_HOST,
      port: ZOHO_SMTP_PORT,
      secure: ZOHO_SMTP_PORT === 465, // true for 465, false for other ports
      auth: {
        user: ZOHO_SMTP_USER,
        pass: ZOHO_SMTP_PASSWORD,
      },
    });

    const info = await transporter.sendMail({
      from: from,
      to: to,
      subject: subject,
      text: body,
    });

    console.log('Email sent via SMTP:', info.messageId);
    return true;
  } catch (error) {
    console.error('SMTP error:', error);
    return false;
  }
}

