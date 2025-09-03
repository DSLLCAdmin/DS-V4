import { Checkout } from '../../components/checkout';

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Checkout
          </h1>
          <p className="text-gray-600">
            Complete your purchase securely
          </p>
        </div>
        
        <Checkout />
      </div>
    </div>
  );
}
