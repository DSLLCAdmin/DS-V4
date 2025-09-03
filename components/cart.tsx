"use client";
import React from 'react';
import { useCart } from '../hooks/use-cart';
import { Button } from './ui/button';
import { ShoppingBag, X, Plus, Minus, Trash2 } from 'lucide-react';

export function Cart() {
  const { cart, loading, updateQuantity, removeFromCart, clearCart } = useCart();

  if (cart.items.length === 0) {
    return (
      <div className="fixed top-20 right-4 w-80 bg-white rounded-lg shadow-lg border p-6 z-50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Shopping Cart</h3>
          <ShoppingBag className="w-5 h-5" />
        </div>
        <p className="text-gray-500 text-center py-8">Your cart is empty</p>
      </div>
    );
  }

  return (
    <div className="fixed top-20 right-4 w-80 bg-white rounded-lg shadow-lg border p-6 z-50 max-h-96 overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Shopping Cart</h3>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">({cart.itemCount} items)</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearCart}
            disabled={loading}
            className="text-red-500 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {cart.items.map((item) => (
          <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            {item.image && (
              <img
                src={item.image}
                alt={item.title}
                className="w-12 h-12 object-cover rounded"
              />
            )}
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium truncate">{item.title}</h4>
              <p className="text-sm text-gray-500">${item.price.toFixed(2)}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                disabled={loading}
                className="w-8 h-8 p-0"
              >
                <Minus className="w-3 h-3" />
              </Button>
              <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                disabled={loading}
                className="w-8 h-8 p-0"
              >
                <Plus className="w-3 h-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeFromCart(item.id)}
                disabled={loading}
                className="w-8 h-8 p-0 text-red-500 hover:text-red-700"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t pt-4 mt-4">
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-semibold">Total:</span>
          <span className="text-lg font-semibold">${cart.total.toFixed(2)}</span>
        </div>
        <Button 
          className="w-full" 
          disabled={loading}
          onClick={() => window.location.href = '/checkout'}
        >
          {loading ? 'Processing...' : 'Checkout'}
        </Button>
      </div>
    </div>
  );
}

export function CartIcon() {
  const { itemCount } = useCart();

  return (
    <div className="relative">
      <ShoppingBag className="w-6 h-6" />
      {itemCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {itemCount}
        </span>
      )}
    </div>
  );
}
