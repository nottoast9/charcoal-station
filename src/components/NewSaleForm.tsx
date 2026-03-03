'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ShoppingCart, Clock, Banknote, CreditCard } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { formatDateSL, formatTimeSL, getSriLankanNow } from '@/lib/date-utils';
import { formatCurrency } from '@/lib/currency';

interface Product {
  id: string;
  name: string;
  price: number;
}

interface NewSaleFormProps {
  products: Product[];
  onSaleAdded?: () => void;
}

export default function NewSaleForm({ products, onSaleAdded }: NewSaleFormProps) {
  // Generate a stable key that changes when products change
  const productsKey = products.map(p => p.id).join('-');
  
  return (
    <NewSaleFormInner 
      key={productsKey}
      products={products} 
      onSaleAdded={onSaleAdded} 
    />
  );
}

function NewSaleFormInner({ products, onSaleAdded }: NewSaleFormProps) {
  const [submitting, setSubmitting] = useState(false);
  
  // Form states - these reset when the component remounts (when products change)
  const [selectedProductId, setSelectedProductId] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [date, setDate] = useState(formatDateSL());
  const [time, setTime] = useState(formatTimeSL());
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card'>('cash');

  // Update time to current Sri Lankan time when component mounts
  useEffect(() => {
    const now = getSriLankanNow();
    setDate(formatDateSL(now));
    setTime(formatTimeSL(now));
  }, []);

  const selectedProduct = products.find(p => p.id === selectedProductId);
  const quantityNum = parseInt(quantity) || 0;
  const totalAmount = selectedProduct ? selectedProduct.price * quantityNum : 0;

  const handleSubmit = async () => {
    if (!selectedProductId) {
      toast.error('Please select a product');
      return;
    }

    if (quantityNum <= 0) {
      toast.error('Please enter a valid quantity');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: selectedProductId,
          quantity: quantityNum,
          date,
          time,
          paymentMethod,
        }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success('Sale recorded successfully');
        // Reset form with current Sri Lankan time
        const now = getSriLankanNow();
        setSelectedProductId('');
        setQuantity('1');
        setDate(formatDateSL(now));
        setTime(formatTimeSL(now));
        // Notify parent
        onSaleAdded?.();
      } else {
        toast.error(json.error || 'Failed to record sale');
      }
    } catch (error) {
      console.error('Error adding sale:', error);
      toast.error('Failed to record sale');
    } finally {
      setSubmitting(false);
    }
  };

  // Set current time button
  const setCurrentTime = () => {
    const now = getSriLankanNow();
    setDate(formatDateSL(now));
    setTime(formatTimeSL(now));
  };

  if (products.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          No products available. Please add products first.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5" />
          Record New Sale
        </CardTitle>
        <CardDescription>Record a new sales transaction (Sri Lankan Time - UTC+5:30)</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Product Selection */}
          <div className="space-y-2">
            <Label>Product</Label>
            <Select 
              value={selectedProductId} 
              onValueChange={setSelectedProductId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a product" />
              </SelectTrigger>
              <SelectContent>
                {products.map((product) => (
                  <SelectItem key={product.id} value={product.id}>
                    {product.name} - {formatCurrency(product.price)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Quantity */}
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          {/* Time */}
          <div className="space-y-2">
            <Label htmlFor="time">Time</Label>
            <div className="flex gap-2">
              <Input
                id="time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="flex-1"
              />
              <Button 
                type="button" 
                variant="outline" 
                size="icon"
                onClick={setCurrentTime}
                title="Set current time"
              >
                <Clock className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Payment Method */}
          <div className="space-y-2 md:col-span-2">
            <Label>Payment Method</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant={paymentMethod === 'cash' ? 'default' : 'outline'}
                className={cn(
                  'h-auto py-3 flex flex-col items-center gap-1',
                  paymentMethod === 'cash' && 'bg-green-600 hover:bg-green-700'
                )}
                onClick={() => setPaymentMethod('cash')}
              >
                <Banknote className="h-5 w-5" />
                <span className="text-sm font-medium">Cash</span>
              </Button>
              <Button
                type="button"
                variant={paymentMethod === 'card' ? 'default' : 'outline'}
                className={cn(
                  'h-auto py-3 flex flex-col items-center gap-1',
                  paymentMethod === 'card' && 'bg-blue-600 hover:bg-blue-700'
                )}
                onClick={() => setPaymentMethod('card')}
              >
                <CreditCard className="h-5 w-5" />
                <span className="text-sm font-medium">Card</span>
              </Button>
            </div>
          </div>

          {/* Total Amount Display */}
          <div className="space-y-2 md:col-span-2">
            <Label>Total Amount</Label>
            <div className="flex items-center h-10 px-3 rounded-md border bg-muted">
              <span className={cn(
                'font-semibold',
                totalAmount > 0 ? 'text-green-600' : 'text-muted-foreground'
              )}>
                {formatCurrency(totalAmount)}
              </span>
            </div>
          </div>
        </div>

        {/* Summary */}
        {selectedProduct && quantityNum > 0 && (
          <div className="p-4 bg-muted rounded-lg">
            <div className="text-sm text-muted-foreground mb-1">Summary</div>
            <div className="font-medium">
              {quantityNum}x {selectedProduct.name} @ {formatCurrency(selectedProduct.price)} each
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              Date & Time: {date} {time} (SL Time)
            </div>
            <div className="text-sm text-muted-foreground">
              Payment: {paymentMethod === 'cash' ? '💵 Cash' : '💳 Card'}
            </div>
            <div className="text-lg font-bold text-green-600 mt-1">
              Total: {formatCurrency(totalAmount)}
            </div>
          </div>
        )}

        {/* Submit Button */}
        <Button 
          onClick={handleSubmit} 
          disabled={submitting || !selectedProductId || quantityNum <= 0}
          className="w-full"
        >
          {submitting ? 'Recording...' : 'Record Sale'}
        </Button>
      </CardContent>
    </Card>
  );
}
