import Link from 'next/link';

export default function ReturnPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Return & Cancellation Policy</h1>
          <p className="text-gray-600">DS LLC - DarkStreet Series</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8">
          {/* Overview */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Overview</h2>
            <p className="text-gray-700 leading-relaxed">
              At DS LLC, we want you to be completely satisfied with your purchase. This policy outlines 
              our return, exchange, and cancellation procedures for all products sold through our website.
            </p>
          </div>

          {/* Cancellation Policy */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Order Cancellation</h2>
            <div className="space-y-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-2">Before Shipment</h3>
                <p className="text-green-700">
                  Orders can be cancelled at any time before they are shipped. You will receive a full refund 
                  within 3-5 business days to your original payment method.
                </p>
              </div>
              
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="font-semibold text-yellow-800 mb-2">After Shipment</h3>
                <p className="text-yellow-700">
                  Once your order has been shipped, cancellation is not possible. However, you may return 
                  the item(s) following our return policy below.
                </p>
              </div>
            </div>
          </div>

          {/* Return Policy */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Return Policy</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Return Window</h3>
                <p className="text-gray-700">
                  You have <strong>30 days</strong> from the delivery date to return items for a full refund.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Eligible Items</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Books (paperback and hardcover) - must be in original condition</li>
                  <li>Apparel (t-shirts, hoodies) - must be unworn with tags attached</li>
                  <li>Accessories (hats, mugs) - must be unused in original packaging</li>
                  <li>Digital products (e-books) - no returns due to digital nature</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Return Process</h3>
                <ol className="list-decimal list-inside text-gray-700 space-y-2">
                  <li>Contact us at <a href="mailto:support@darkstreetllc.com" className="text-blue-600 hover:underline">support@darkstreetllc.com</a> to initiate a return</li>
                  <li>Provide your order number and reason for return</li>
                  <li>We will email you a return authorization and shipping label</li>
                  <li>Package the item(s) securely and ship using the provided label</li>
                  <li>Once received, we will process your refund within 5-7 business days</li>
                </ol>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Return Conditions</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Items must be in original condition (unread, unworn, unused)</li>
                  <li>Original packaging and tags must be included</li>
                  <li>Books must not have any writing, highlighting, or damage</li>
                  <li>Apparel must not show signs of wear or washing</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Refund Policy */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Refund Policy</h2>
            
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">Refund Timeline</h3>
                <p className="text-blue-700">
                  Refunds are processed within 5-7 business days after we receive your returned item(s). 
                  The refund will be credited to your original payment method.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Refund Amount</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li><strong>Full Refund:</strong> Original purchase price for eligible returns</li>
                  <li><strong>Shipping:</strong> Original shipping costs are non-refundable</li>
                  <li><strong>Return Shipping:</strong> Free return shipping for defective items</li>
                  <li><strong>Restocking Fee:</strong> No restocking fees for eligible returns</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Exchange Policy */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Exchange Policy</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Size Exchanges</h3>
                <p className="text-gray-700">
                  We offer free size exchanges for apparel items within 30 days of delivery. 
                  Contact us at <a href="mailto:support@darkstreetllc.com" className="text-blue-600 hover:underline">support@darkstreetllc.com</a> 
                  to arrange an exchange.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Defective Items</h3>
                <p className="text-gray-700">
                  If you receive a defective item, we will provide a free replacement or full refund. 
                  Please contact us immediately with photos of the defect.
                </p>
              </div>
            </div>
          </div>

          {/* Special Circumstances */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Special Circumstances</h2>
            
            <div className="space-y-4">
              <div className="bg-red-50 p-4 rounded-lg">
                <h3 className="font-semibold text-red-800 mb-2">Digital Products</h3>
                <p className="text-red-700">
                  E-books and digital downloads are non-refundable due to their digital nature. 
                  Please ensure compatibility before purchase.
                </p>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-semibold text-purple-800 mb-2">Custom Orders</h3>
                <p className="text-purple-700">
                  Custom or personalized items are non-refundable unless defective. 
                  Please review all customizations carefully before confirming your order.
                </p>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="border-t pt-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Us</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Customer Service</h3>
                <p className="text-gray-700">
                  Email: <a href="mailto:support@darkstreetllc.com" className="text-blue-600 hover:underline">support@darkstreetllc.com</a>
                </p>
                <p className="text-gray-700">
                  Response Time: Within 24 hours
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Business Hours</h3>
                <p className="text-gray-700">
                  Monday - Friday: 9:00 AM - 5:00 PM PST
                </p>
                <p className="text-gray-700">
                  Saturday: 10:00 AM - 2:00 PM PST
                </p>
                <p className="text-gray-700">
                  Sunday: Closed
                </p>
              </div>
            </div>
          </div>

          {/* Back to Shop */}
          <div className="mt-8 text-center">
            <Link
              href="/shop"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
