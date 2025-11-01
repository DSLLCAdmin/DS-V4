'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navigation } from '@/components/navigation';
import { ChevronDown, ChevronUp, Package, Truck, Clock, Mail, Shield, HelpCircle } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqData: FAQItem[] = [
  {
    category: 'Order Processing',
    question: 'How long does it take for my order to be processed?',
    answer: 'Orders are processed within 1-2 business days after payment confirmation. Printful products require additional production time before shipping, typically 2-3 business days for apparel items.'
  },
  {
    category: 'Order Processing',
    question: 'When will I receive my order?',
    answer: 'Delivery times depend on your selected shipping method. Standard shipping: 5-7 business days. Express shipping: 2-3 business days. Overnight shipping: 1 business day. These timelines begin after order processing is complete. You will receive tracking information via email once your order ships.'
  },
  {
    category: 'Shipping & Delivery',
    question: 'How is my order shipped?',
    answer: 'All merchandise orders are fulfilled through Printful, our trusted print-on-demand partner. Books are fulfilled directly through Amazon KDP. Shipping carriers include USPS, FedEx, and DHL depending on your location and selected shipping method.'
  },
  {
    category: 'Shipping & Delivery',
    question: 'Will I receive tracking information?',
    answer: 'Yes. Once your order ships, you will receive an email with your tracking number and a link to monitor your package. Shipping notifications are sent to the email address provided at checkout.'
  },
  {
    category: 'Shipping & Delivery',
    question: 'What happens after I complete my order?',
    answer: 'After payment confirmation, you will receive an order confirmation email. Your order is then processed and forwarded to our fulfillment partner. You will receive a second email with tracking information once your package ships. Orders typically ship within 3-5 business days.'
  },
  {
    category: 'Order Status',
    question: 'How can I check my order status?',
    answer: 'Check your email for order confirmation and shipping notifications. You can also track your order using the link provided in the shipping email. If you need additional assistance, contact us using the information provided at checkout.'
  },
  {
    category: 'Order Status',
    question: 'I received a text message with a Shopify link. What is this?',
    answer: 'Shopify is our secure checkout platform. The link provides access to your order details and tracking information. This is a standard part of our order confirmation process. You can view your order status, track your package, and access your receipt through this link.'
  },
  {
    category: 'Products',
    question: 'What is print-on-demand fulfillment?',
    answer: 'Printful is our fulfillment partner for merchandise items. When you order apparel or accessories, your item is custom-printed and shipped directly from Printful facilities. This ensures high quality and eliminates inventory risk, allowing us to offer unique designs without maintaining stock.'
  },
  {
    category: 'Products',
    question: 'How are books fulfilled?',
    answer: 'Books are fulfilled through Amazon KDP (Kindle Direct Publishing). When you purchase a book, you are redirected to Amazon where you complete your purchase. This ensures you receive authentic, high-quality print or digital editions directly from the publisher.'
  },
  {
    category: 'Support',
    question: 'What if I have questions about my order?',
    answer: 'Contact us through the email provided at checkout or use the contact information in your order confirmation. We respond to all inquiries within 24-48 business hours. For urgent matters, include your order number for faster assistance.'
  },
  {
    category: 'Support',
    question: 'What is your return policy?',
    answer: 'Returns are accepted within 30 days of delivery for unopened items in original condition. Custom print-on-demand items may have specific return policies outlined at checkout. Books purchased through Amazon are subject to Amazon return policies.'
  }
];

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', ...Array.from(new Set(faqData.map(item => item.category)))];
  
  const filteredFAQs = selectedCategory === 'All' 
    ? faqData 
    : faqData.filter(item => item.category === selectedCategory);

  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index);
    } else {
      newOpenItems.add(index);
    }
    setOpenItems(newOpenItems);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-200 via-slate-400 to-slate-600">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-swatch103/20 rounded-full mb-4">
            <HelpCircle className="w-8 h-8 text-swatch103" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Find answers about ordering, shipping, and delivery. Everything you need to know about your DarkStreets purchase.
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-8 flex flex-wrap gap-3 justify-center">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                selectedCategory === category
                  ? 'bg-swatch103 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {filteredFAQs.map((item, index) => {
            const isOpen = openItems.has(index);
            return (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200"
              >
                <button
                  onClick={() => toggleItem(index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-gray-900 pr-4">{item.question}</span>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-swatch103 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  )}
                </button>
                
                {isOpen && (
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                    <p className="text-gray-700 leading-relaxed">{item.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Quick Reference */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Clock className="w-8 h-8 text-swatch103 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Processing Time</h3>
            <p className="text-sm text-gray-600">1-2 business days after payment</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Truck className="w-8 h-8 text-swatch103 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Shipping</h3>
            <p className="text-sm text-gray-600">5-7 business days standard</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Mail className="w-8 h-8 text-swatch103 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Tracking</h3>
            <p className="text-sm text-gray-600">Sent via email when shipped</p>
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-12 bg-swatch103/10 rounded-lg p-8 text-center border border-swatch103/20">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Still Have Questions?</h2>
          <p className="text-gray-700 mb-6">
            Contact us through your order confirmation email or visit our support page for additional assistance.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center px-6 py-3 bg-swatch103 text-white rounded-lg font-medium hover:bg-swatch104 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>

      <Navigation variant="footer" />
    </div>
  );
}

