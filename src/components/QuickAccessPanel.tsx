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
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ShoppingCart, Receipt, Plus, Minus, Zap, Banknote, CreditCard, FileText, Settings2 } from 'lucide-react';
import { formatCurrency } from '@/lib/currency';
import { formatDateSL, formatTimeSL, getSriLankanNow } from '@/lib/date-utils';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface Product {
  id: string;
  name: string;
  price: number;
  is_quick_access: boolean;
}

interface ExpenseType {
  id: string;
  name: string;
  default_amount: number;
  is_quick_access: boolean;
}

export default function QuickAccessPanel() {
  const [products, setProducts] = useState<Product[]>([]);
  const [expenseTypes, setExpenseTypes] = useState<ExpenseType[]>([]);
  const [loading, setLoading] = useState(true);

  // Quick sale dialog
  const [quickSaleDialog, setQuickSaleDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [saleQuantity, setSaleQuantity] = useState(1);
  const [salePaymentMethod, setSalePaymentMethod] = useState<'cash' | 'card'>('cash');
  const [saleSubmitting, setSaleSubmitting] = useState(false);

  // Quick expense dialog
  const [quickExpenseDialog, setQuickExpenseDialog] = useState(false);
  const [selectedExpenseType, setSelectedExpenseType] = useState<ExpenseType | null>(null);
  const [expenseAmount, setExpenseAmount] = useState(0);
  const [expensePaymentMethod, setExpensePaymentMethod] = useState<'cash' | 'card' | 'credit'>('cash');
  const [expenseSubmitting, setExpenseSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [productsRes, expenseTypesRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/expense-types'),
      ]);
      const [productsJson, expenseTypesJson] = await Promise.all([
        productsRes.json(),
        expenseTypesRes.json(),
      ]);
      if (productsJson.success) {
        setProducts(productsJson.data.filter((p: Product) => p.is_quick_access));
      }
      if (expenseTypesJson.success) {
        setExpenseTypes(expenseTypesJson.data.filter((e: ExpenseType) => e.is_quick_access));
      }
    } catch (error) {
      console.error('Error fetching quick access data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickSale = (product: Product) => {
    setSelectedProduct(product);
    setSaleQuantity(1);
    setSalePaymentMethod('cash');
    setQuickSaleDialog(true);
  };

  const handleQuickExpense = (expenseType: ExpenseType) => {
    setSelectedExpenseType(expenseType);
    setExpenseAmount(expenseType.default_amount || 0);
    setExpensePaymentMethod('cash');
    setQuickExpenseDialog(true);
  };

  const submitQuickSale = async () => {
    if (!selectedProduct || saleQuantity <= 0) return;
    
    setSaleSubmitting(true);
    try {
      const now = getSriLankanNow();
      const res = await fetch('/api/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: selectedProduct.id,
          quantity: saleQuantity,
          date: formatDateSL(now),
          time: formatTimeSL(now),
          paymentMethod: salePaymentMethod,
        }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success(`Sale recorded: ${saleQuantity}x ${selectedProduct.name}`);
        setQuickSaleDialog(false);
      } else {
        toast.error(json.error || 'Failed to record sale');
      }
    } catch (error) {
      console.error('Error recording quick sale:', error);
      toast.error('Failed to record sale');
    } finally {
      setSaleSubmitting(false);
    }
  };

  const submitQuickExpense = async () => {
    if (!selectedExpenseType || expenseAmount <= 0) return;
    
    setExpenseSubmitting(true);
    try {
      const now = getSriLankanNow();
      const res = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          expenseTypeId: selectedExpenseType.id,
          amount: expenseAmount,
          description: `Quick expense: ${selectedExpenseType.name}`,
          date: formatDateSL(now),
          paymentMethod: expensePaymentMethod,
        }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success(`Expense recorded: ${selectedExpenseType.name}`);
        setQuickExpenseDialog(false);
      } else {
        toast.error(json.error || 'Failed to record expense');
      }
    } catch (error) {
      console.error('Error recording quick expense:', error);
      toast.error('Failed to record expense');
    } finally {
      setExpenseSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          Loading quick access...
        </CardContent>
      </Card>
    );
  }

  const hasQuickItems = products.length > 0 || expenseTypes.length > 0;

  if (!hasQuickItems) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-500" />
            Quick Access
          </CardTitle>
          <CardDescription>
            Quickly record frequent sales and expenses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-muted-foreground">
            <Settings2 className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No quick access items configured.</p>
            <p className="text-xs mt-1">Go to Products or Expense Types and enable &quot;Quick Access&quot; for items you use frequently.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-500" />
            Quick Access
          </CardTitle>
          <CardDescription>
            Quickly record frequent sales and expenses
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Quick Sales */}
          {products.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                <ShoppingCart className="h-4 w-4" />
                Quick Sales
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {products.map((product) => (
                  <Button
                    key={product.id}
                    variant="outline"
                    className="h-auto py-3 flex flex-col items-center gap-1 hover:bg-green-50 hover:border-green-300 dark:hover:bg-green-950"
                    onClick={() => handleQuickSale(product)}
                  >
                    <span className="font-medium text-sm">{product.name}</span>
                    <span className="text-xs text-muted-foreground">{formatCurrency(product.price)}</span>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Quick Expenses */}
          {expenseTypes.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                <Receipt className="h-4 w-4" />
                Quick Expenses
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {expenseTypes.map((expenseType) => (
                  <Button
                    key={expenseType.id}
                    variant="outline"
                    className="h-auto py-3 flex flex-col items-center gap-1 hover:bg-red-50 hover:border-red-300 dark:hover:bg-red-950"
                    onClick={() => handleQuickExpense(expenseType)}
                  >
                    <span className="font-medium text-sm">{expenseType.name}</span>
                    {expenseType.default_amount > 0 && (
                      <span className="text-xs text-muted-foreground">{formatCurrency(expenseType.default_amount)}</span>
                    )}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Sale Dialog */}
      <Dialog open={quickSaleDialog} onOpenChange={setQuickSaleDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Quick Sale</DialogTitle>
            <DialogDescription>
              Record a sale for {selectedProduct?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {selectedProduct && (
              <div className="p-3 bg-muted rounded-lg">
                <div className="font-medium">{selectedProduct.name}</div>
                <div className="text-sm text-muted-foreground">{formatCurrency(selectedProduct.price)} each</div>
              </div>
            )}
            <div className="space-y-2">
              <Label>Quantity</Label>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setSaleQuantity(Math.max(1, saleQuantity - 1))}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Input
                  type="number"
                  min="1"
                  value={saleQuantity}
                  onChange={(e) => setSaleQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="text-center"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setSaleQuantity(saleQuantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Payment Method</Label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant={salePaymentMethod === 'cash' ? 'default' : 'outline'}
                  className={cn(salePaymentMethod === 'cash' && 'bg-green-600 hover:bg-green-700')}
                  onClick={() => setSalePaymentMethod('cash')}
                >
                  <Banknote className="h-4 w-4 mr-2" />
                  Cash
                </Button>
                <Button
                  type="button"
                  variant={salePaymentMethod === 'card' ? 'default' : 'outline'}
                  className={cn(salePaymentMethod === 'card' && 'bg-blue-600 hover:bg-blue-700')}
                  onClick={() => setSalePaymentMethod('card')}
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Card
                </Button>
              </div>
            </div>
            {selectedProduct && (
              <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
                <div className="text-sm text-muted-foreground">Total</div>
                <div className="text-xl font-bold text-green-600">
                  {formatCurrency(selectedProduct.price * saleQuantity)}
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setQuickSaleDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={submitQuickSale} 
              disabled={saleSubmitting}
              className="bg-green-600 hover:bg-green-700"
            >
              {saleSubmitting ? 'Recording...' : 'Record Sale'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Quick Expense Dialog */}
      <Dialog open={quickExpenseDialog} onOpenChange={setQuickExpenseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Quick Expense</DialogTitle>
            <DialogDescription>
              Record an expense for {selectedExpenseType?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {selectedExpenseType && (
              <div className="p-3 bg-muted rounded-lg">
                <div className="font-medium">{selectedExpenseType.name}</div>
              </div>
            )}
            <div className="space-y-2">
              <Label>Amount (Rs.)</Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={expenseAmount}
                onChange={(e) => setExpenseAmount(parseFloat(e.target.value) || 0)}
              />
            </div>
            <div className="space-y-2">
              <Label>Payment Method</Label>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  type="button"
                  variant={expensePaymentMethod === 'cash' ? 'default' : 'outline'}
                  className={cn(expensePaymentMethod === 'cash' && 'bg-green-600 hover:bg-green-700')}
                  onClick={() => setExpensePaymentMethod('cash')}
                >
                  <Banknote className="h-4 w-4 mr-1" />
                  Cash
                </Button>
                <Button
                  type="button"
                  variant={expensePaymentMethod === 'card' ? 'default' : 'outline'}
                  className={cn(expensePaymentMethod === 'card' && 'bg-blue-600 hover:bg-blue-700')}
                  onClick={() => setExpensePaymentMethod('card')}
                >
                  <CreditCard className="h-4 w-4 mr-1" />
                  Card
                </Button>
                <Button
                  type="button"
                  variant={expensePaymentMethod === 'credit' ? 'default' : 'outline'}
                  className={cn(expensePaymentMethod === 'credit' && 'bg-orange-600 hover:bg-orange-700')}
                  onClick={() => setExpensePaymentMethod('credit')}
                >
                  <FileText className="h-4 w-4 mr-1" />
                  Credit
                </Button>
              </div>
            </div>
            {expenseAmount > 0 && (
              <div className="p-3 bg-red-50 dark:bg-red-950 rounded-lg border border-red-200 dark:border-red-800">
                <div className="text-sm text-muted-foreground">Total</div>
                <div className="text-xl font-bold text-red-600">
                  {formatCurrency(expenseAmount)}
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setQuickExpenseDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={submitQuickExpense} 
              disabled={expenseSubmitting || expenseAmount <= 0}
              variant="destructive"
            >
              {expenseSubmitting ? 'Recording...' : 'Record Expense'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
