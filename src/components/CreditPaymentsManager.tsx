'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FileText, Plus, CheckCircle, Clock, AlertCircle, Banknote, CreditCard } from 'lucide-react';
import { formatCurrency } from '@/lib/currency';
import { formatDateSL } from '@/lib/date-utils';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface CreditPayment {
  id: string;
  expense_id: string;
  original_amount: number;
  paid_amount: number;
  remaining_amount: number;
  status: 'pending' | 'partial' | 'paid';
  created_at: string;
  updated_at: string;
  expense?: {
    id: string;
    expense_type_name: string;
    amount: number;
    description: string;
    date: string;
  };
}

interface CreditPaymentTransaction {
  id: string;
  amount: number;
  payment_method: 'cash' | 'card';
  date: string;
  notes: string;
}

export default function CreditPaymentsManager() {
  const [creditPayments, setCreditPayments] = useState<CreditPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState<CreditPayment | null>(null);
  const [transactions, setTransactions] = useState<CreditPaymentTransaction[]>([]);
  const [payDialogOpen, setPayDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  
  // Payment form
  const [payAmount, setPayAmount] = useState('');
  const [payMethod, setPayMethod] = useState<'cash' | 'card'>('cash');
  const [payDate, setPayDate] = useState(formatDateSL());
  const [payNotes, setPayNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchCreditPayments = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/credit-payments');
      const json = await res.json();
      if (json.success) {
        setCreditPayments(json.data);
      }
    } catch (error) {
      console.error('Error fetching credit payments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCreditPayments();
  }, []);

  const fetchTransactions = async (creditPaymentId: string) => {
    try {
      const res = await fetch(`/api/credit-payments/${creditPaymentId}/transactions`);
      const json = await res.json();
      if (json.success) {
        setTransactions(json.data);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const handleViewDetails = async (payment: CreditPayment) => {
    setSelectedPayment(payment);
    setDetailsDialogOpen(true);
    await fetchTransactions(payment.id);
  };

  const handleOpenPayDialog = (payment: CreditPayment) => {
    setSelectedPayment(payment);
    setPayAmount(payment.remaining_amount.toString());
    setPayMethod('cash');
    setPayDate(formatDateSL());
    setPayNotes('');
    setPayDialogOpen(true);
  };

  const handlePay = async () => {
    if (!selectedPayment) return;
    
    const amountNum = parseFloat(payAmount);
    if (isNaN(amountNum) || amountNum <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (amountNum > selectedPayment.remaining_amount) {
      toast.error('Payment amount cannot exceed remaining amount');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/credit-payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          creditPaymentId: selectedPayment.id,
          amount: amountNum,
          paymentMethod: payMethod,
          date: payDate,
          notes: payNotes,
        }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success('Payment recorded successfully');
        setPayDialogOpen(false);
        fetchCreditPayments();
      } else {
        toast.error(json.error || 'Failed to record payment');
      }
    } catch (error) {
      console.error('Error recording payment:', error);
      toast.error('Failed to record payment');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="destructive" className="gap-1"><AlertCircle className="h-3 w-3" /> Unpaid</Badge>;
      case 'partial':
        return <Badge variant="secondary" className="gap-1"><Clock className="h-3 w-3" /> Partial</Badge>;
      case 'paid':
        return <Badge variant="default" className="gap-1 bg-green-600"><CheckCircle className="h-3 w-3" /> Paid</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Calculate totals
  const totalPending = creditPayments
    .filter(cp => cp.status !== 'paid')
    .reduce((sum, cp) => sum + cp.remaining_amount, 0);
  const pendingCount = creditPayments.filter(cp => cp.status === 'pending').length;
  const partialCount = creditPayments.filter(cp => cp.status === 'partial').length;
  const paidCount = creditPayments.filter(cp => cp.status === 'paid').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading credit payments...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="bg-orange-50 dark:bg-orange-950 border-orange-200 dark:border-orange-800">
          <CardContent className="pt-4">
            <div className="text-sm text-muted-foreground">Total Outstanding</div>
            <div className="text-xl font-bold text-orange-600">{formatCurrency(totalPending)}</div>
          </CardContent>
        </Card>
        <Card className="bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800">
          <CardContent className="pt-4">
            <div className="text-sm text-muted-foreground">Unpaid</div>
            <div className="text-xl font-bold text-red-600">{pendingCount}</div>
          </CardContent>
        </Card>
        <Card className="bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800">
          <CardContent className="pt-4">
            <div className="text-sm text-muted-foreground">Partially Paid</div>
            <div className="text-xl font-bold text-yellow-600">{partialCount}</div>
          </CardContent>
        </Card>
        <Card className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
          <CardContent className="pt-4">
            <div className="text-sm text-muted-foreground">Fully Paid</div>
            <div className="text-xl font-bold text-green-600">{paidCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Credit Payments List */}
      {creditPayments.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No credit payments recorded yet.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {creditPayments.map((payment) => (
            <Card key={payment.id} className={cn(
              payment.status === 'paid' && 'opacity-60'
            )}>
              <CardContent className="pt-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{payment.expense?.expense_type_name || 'Unknown'}</span>
                      {getStatusBadge(payment.status)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {payment.expense?.description || 'No description'}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Original: {formatCurrency(payment.original_amount)} • 
                      Paid: {formatCurrency(payment.paid_amount)} • 
                      Remaining: <span className="font-semibold text-orange-600">{formatCurrency(payment.remaining_amount)}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleViewDetails(payment)}
                    >
                      View Details
                    </Button>
                    {payment.status !== 'paid' && (
                      <Button 
                        size="sm"
                        onClick={() => handleOpenPayDialog(payment)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Pay
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Payment Dialog */}
      <Dialog open={payDialogOpen} onOpenChange={setPayDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Record Payment</DialogTitle>
            <DialogDescription>
              Record a payment towards this credit expense.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {selectedPayment && (
              <div className="p-3 bg-muted rounded-lg text-sm">
                <div><strong>Expense:</strong> {selectedPayment.expense?.expense_type_name}</div>
                <div><strong>Remaining:</strong> {formatCurrency(selectedPayment.remaining_amount)}</div>
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Amount (Rs.)</Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  max={selectedPayment?.remaining_amount}
                  value={payAmount}
                  onChange={(e) => setPayAmount(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Date</Label>
                <Input
                  type="date"
                  value={payDate}
                  onChange={(e) => setPayDate(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Payment Method</Label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant={payMethod === 'cash' ? 'default' : 'outline'}
                  className={cn(payMethod === 'cash' && 'bg-green-600 hover:bg-green-700')}
                  onClick={() => setPayMethod('cash')}
                >
                  <Banknote className="h-4 w-4 mr-2" />
                  Cash
                </Button>
                <Button
                  type="button"
                  variant={payMethod === 'card' ? 'default' : 'outline'}
                  className={cn(payMethod === 'card' && 'bg-blue-600 hover:bg-blue-700')}
                  onClick={() => setPayMethod('card')}
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Card
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Notes (Optional)</Label>
              <Input
                value={payNotes}
                onChange={(e) => setPayNotes(e.target.value)}
                placeholder="Add notes..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPayDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handlePay} disabled={submitting} className="bg-green-600 hover:bg-green-700">
              {submitting ? 'Recording...' : 'Record Payment'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Details Dialog */}
      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Payment Details</DialogTitle>
            <DialogDescription>
              View payment history and details.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {selectedPayment && (
              <>
                <div className="p-3 bg-muted rounded-lg text-sm space-y-1">
                  <div><strong>Expense Type:</strong> {selectedPayment.expense?.expense_type_name}</div>
                  <div><strong>Original Amount:</strong> {formatCurrency(selectedPayment.original_amount)}</div>
                  <div><strong>Paid Amount:</strong> {formatCurrency(selectedPayment.paid_amount)}</div>
                  <div><strong>Remaining:</strong> <span className="text-orange-600 font-semibold">{formatCurrency(selectedPayment.remaining_amount)}</span></div>
                  <div><strong>Description:</strong> {selectedPayment.expense?.description || 'N/A'}</div>
                  <div><strong>Created:</strong> {new Date(selectedPayment.created_at).toLocaleDateString()}</div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">Payment History</h4>
                  {transactions.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No payments recorded yet.</p>
                  ) : (
                    <div className="space-y-2">
                      {transactions.map((tx) => (
                        <div key={tx.id} className="p-2 border rounded flex justify-between items-center">
                          <div>
                            <div className="font-medium text-green-600">{formatCurrency(tx.amount)}</div>
                            <div className="text-xs text-muted-foreground">
                              {tx.date} • {tx.payment_method === 'cash' ? '💵 Cash' : '💳 Card'}
                            </div>
                            {tx.notes && <div className="text-xs">{tx.notes}</div>}
                          </div>
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDetailsDialogOpen(false)}>
              Close
            </Button>
            {selectedPayment && selectedPayment.status !== 'paid' && (
              <Button 
                onClick={() => {
                  setDetailsDialogOpen(false);
                  handleOpenPayDialog(selectedPayment);
                }}
                className="bg-green-600 hover:bg-green-700"
              >
                <Plus className="h-4 w-4 mr-1" />
                Record Payment
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
