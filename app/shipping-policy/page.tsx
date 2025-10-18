import Link from 'next/link';

export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Shipping Policy</h1>
          <p className="text-gray-600">DS LLC - DarkStreet Series</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8">
          {/* Overview */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Shipping Overview</h2>
            <p className="text-gray-700 leading-relaxed">
              We ship worldwide from our fulfillment centers in the United States. All orders are processed 
              within 1-2 business days and shipped via USPS, FedEx, or UPS depending on your location and 
              selected shipping method.
            </p>
          </div>

          {/* Shipping Methods */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Shipping Methods</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-green-800 mb-2">Standard Shipping</h3>
                <p className="text-green-700 mb-2">$4.99</p>
                <p className="text-sm text-green-600 mb-2">5-7 business days</p>
                <p className="text-sm text-green-600">USPS Ground</p>
              </div>
              
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">Express Shipping</h3>
                <p className="text-blue-700 mb-2">$9.99</p>
                <p className="text-sm text-blue-600 mb-2">2-3 business days</p>
                <p className="text-sm text-blue-600">USPS Priority Mail</p>
              </div>
              
              <div className="bg-purple-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-800 mb-2">Overnight Shipping</h3>
                <p className="text-purple-700 mb-2">$19.99</p>
                <p className="text-sm text-purple-600 mb-2">1 business day</p>
                <p className="text-sm text-purple-600">FedEx Overnight</p>
              </div>
            </div>
          </div>

          {/* Free Shipping */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Free Shipping</h2>
            
            <div className="bg-yellow-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">Free Standard Shipping</h3>
              <p className="text-yellow-700">
                Orders of <strong>$50 or more</strong> qualify for free standard shipping within the United States. 
                This applies automatically at checkout.
              </p>
            </div>
          </div>

          {/* Processing Times */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Order Processing</h2>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-blue-600 text-sm font-semibold">1</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Order Received</h3>
                  <p className="text-gray-700">Orders are processed within 1-2 business days</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-blue-600 text-sm font-semibold">2</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Fulfillment</h3>
                  <p className="text-gray-700">Items are picked, packed, and prepared for shipment</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-blue-600 text-sm font-semibold">3</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Shipment</h3>
                  <p className="text-gray-700">Package is shipped and tracking information is provided</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-green-600 text-sm font-semibold">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Delivery</h3>
                  <p className="text-gray-700">Package arrives at your specified address</p>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Destinations */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Shipping Destinations</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Domestic (United States)</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>All 50 states</li>
                  <li>Washington D.C.</li>
                  <li>Puerto Rico</li>
                  <li>US Virgin Islands</li>
                  <li>Standard shipping rates apply</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">International</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Canada</li>
                  <li>United Kingdom</li>
                  <li>Australia</li>
                  <li>Most European countries</li>
                  <li>Additional shipping fees apply</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Tracking */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Order Tracking</h2>
            
            <div className="space-y-4">
              <p className="text-gray-700">
                Once your order ships, you will receive an email with tracking information. 
                You can also track your order by:
              </p>
              
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Checking your order confirmation email</li>
                <li>Logging into your account (if you created one)</li>
                <li>Using the tracking number provided by the carrier</li>
                <li>Contacting customer service</li>
              </ul>
            </div>
          </div>

          {/* Delivery Issues */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Delivery Issues</h2>
            
            <div className="space-y-4">
              <div className="bg-red-50 p-4 rounded-lg">
                <h3 className="font-semibold text-red-800 mb-2">Lost or Damaged Packages</h3>
                <p className="text-red-700">
                  If your package is lost or damaged during shipping, please contact us immediately. 
                  We will work with the carrier to resolve the issue and provide a replacement or refund.
                </p>
              </div>
              
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="font-semibold text-yellow-800 mb-2">Delivery Delays</h3>
                <p className="text-yellow-700">
                  Delivery delays can occur due to weather, carrier issues, or incorrect addresses. 
                  We will work with you to resolve any delivery problems.
                </p>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">Address Changes</h3>
                <p className="text-blue-700">
                  Address changes must be made before the order ships. Once shipped, address changes 
                  are subject to carrier policies and may incur additional fees.
                </p>
              </div>
            </div>
          </div>

          {/* Special Items */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Special Items</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Books</h3>
                <p className="text-gray-700">
                  Books are shipped via media mail for domestic orders, which may take 5-10 business days. 
                  International book shipments use standard shipping methods.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Apparel</h3>
                <p className="text-gray-700">
                  Clothing items are shipped via standard shipping methods. We recommend selecting 
                  express shipping for time-sensitive orders.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Digital Products</h3>
                <p className="text-gray-700">
                  E-books and digital downloads are delivered immediately via email after purchase. 
                  No physical shipping required.
                </p>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="border-t pt-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Shipping Questions?</h2>
            
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
