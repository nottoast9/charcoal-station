'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Receipt, Banknote, CreditCard, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { formatDateSL } from '@/lib/date-utils';
import { formatCurrency } from '@/lib/currency';

interface ExpenseType {
  id: string;
  name: string;
  default_amount?: number;
}

interface NewExpenseFormProps {
  expenseTypes: ExpenseType[];
  onExpenseAdded?: () => void;
}

export default function NewExpenseForm({ expenseTypes, onExpenseAdded }: NewExpenseFormProps) {
  // Generate a stable key that changes when expense types change
  const expenseTypesKey = expenseTypes.map(e => e.id).join('-');
  
  return (
    <NewExpenseFormInner 
      key={expenseTypesKey}
      expenseTypes={expenseTypes} 
      onExpenseAdded={onExpenseAdded} 
    />
  );
}

function NewExpenseFormInner({ expenseTypes, onExpenseAdded }: NewExpenseFormProps) {
  const [submitting, setSubmitting] = useState(false);
  
  // Form states - these reset when the component remounts (when expense types change)
  const [selectedExpenseTypeId, setSelectedExpenseTypeId] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(formatDateSL());
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'credit'>('cash');

  // Set current date in Sri Lankan time when component mounts
  useEffect(() => {
    setDate(formatDateSL());
  }, []);

  // Update amount when expense type changes
  useEffect(() => {
    const selected = expenseTypes.find(e => e.id === selectedExpenseTypeId);
    if (selected?.default_amount && selected.default_amount > 0) {
      setAmount(selected.default_amount.toString());
    }
  }, [selectedExpenseTypeId, expenseTypes]);

  const selectedExpenseType = expenseTypes.find(e => e.id === selectedExpenseTypeId);
  const amountNum = parseFloat(amount) || 0;

  const handleSubmit = async () => {
    if (!selectedExpenseTypeId) {
      toast.error('Please select an expense type');
      return;
    }

    if (amountNum <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          expenseTypeId: selectedExpenseTypeId,
          amount: amountNum,
          description: description.trim(),
          date,
          paymentMethod,
        }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success('Expense recorded successfully');
        // Reset form
        setSelectedExpenseTypeId('');
        setAmount('');
        setDescription('');
        setDate(formatDateSL());
        setPaymentMethod('cash');
        // Notify parent
        onExpenseAdded?.();
      } else {
        toast.error(json.error || 'Failed to record expense');
      }
    } catch (error) {
      console.error('Error adding expense:', error);
      toast.error('Failed to record expense');
    } finally {
      setSubmitting(false);
    }
  };

  if (expenseTypes.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          No expense types available. Please add expense types first.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Receipt className="h-5 w-5" />
          Record New Expense
        </CardTitle>
        <CardDescription>Record a new expense transaction (Sri Lankan Time - UTC+5:30)</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Expense Type Selection */}
          <div className="space-y-2">
            <Label>Expense Type</Label>
            <Select 
              value={selectedExpenseTypeId} 
              onValueChange={setSelectedExpenseTypeId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select expense type" />
              </SelectTrigger>
              <SelectContent>
                {expenseTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (Rs.)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
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

          {/* Amount Display */}
          <div className="space-y-2">
            <Label>Total Amount</Label>
            <div className="flex items-center h-10 px-3 rounded-md border bg-muted">
              <span className={cn(
                'font-semibold',
                amountNum > 0 ? 'text-red-600' : 'text-muted-foreground'
              )}>
                {formatCurrency(amountNum)}
              </span>
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="space-y-2">
          <Label>Payment Method</Label>
          <div className="grid grid-cols-3 gap-2">
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
            <Button
              type="button"
              variant={paymentMethod === 'credit' ? 'default' : 'outline'}
              className={cn(
                'h-auto py-3 flex flex-col items-center gap-1',
                paymentMethod === 'credit' && 'bg-orange-600 hover:bg-orange-700'
              )}
              onClick={() => setPaymentMethod('credit')}
            >
              <FileText className="h-5 w-5" />
              <span className="text-sm font-medium">Credit</span>
            </Button>
          </div>
          {paymentMethod === 'credit' && (
            <p className="text-sm text-orange-600 mt-1">
              This expense will be recorded as credit to be paid later.
            </p>
          )}
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">Description (Optional)</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add notes about this expense..."
            rows={3}
          />
        </div>

        {/* Summary */}
        {selectedExpenseType && amountNum > 0 && (
          <div className="p-4 bg-muted rounded-lg">
            <div className="text-sm text-muted-foreground mb-1">Summary</div>
            <div className="font-medium">
              {selectedExpenseType.name}
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              Date: {date} (SL Time)
            </div>
            <div className="text-sm text-muted-foreground">
              Payment: {paymentMethod === 'cash' ? '💵 Cash' : paymentMethod === 'card' ? '💳 Card' : '📄 Credit (Pay Later)'}
            </div>
            <div className="text-lg font-bold text-red-600 mt-1">
              Amount: {formatCurrency(amountNum)}
            </div>
          </div>
        )}

        {/* Submit Button */}
        <Button 
          onClick={handleSubmit} 
          disabled={submitting || !selectedExpenseTypeId || amountNum <= 0}
          className="w-full"
          variant="destructive"
        >
          {submitting ? 'Recording...' : 'Record Expense'}
        </Button>
      </CardContent>
    </Card>
  );
}
