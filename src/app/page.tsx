'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Toaster } from '@/components/ui/sonner';
import Dashboard from '@/components/Dashboard';
import ProductManager from '@/components/ProductManager';
import ExpenseTypeManager from '@/components/ExpenseTypeManager';
import NewSaleForm from '@/components/NewSaleForm';
import NewExpenseForm from '@/components/NewExpenseForm';
import ProfitSplitCard from '@/components/ProfitSplitCard';
import PartnerManager from '@/components/PartnerManager';
import CreditPaymentsManager from '@/components/CreditPaymentsManager';
import QuickAccessPanel from '@/components/QuickAccessPanel';
import UserManager from '@/components/UserManager';
import {
  LayoutDashboard,
  ShoppingCart,
  Receipt,
  Package,
  Tags,
  Download,
  Split,
  RefreshCw,
  Flame,
  Users,
  CreditCard,
  Banknote,
  FileText,
  LogOut,
  Shield,
  Loader2,
  Settings
} from 'lucide-react';
import { format } from 'date-fns';
import JSZip from 'jszip';
import { formatCurrency } from '@/lib/currency';
import { toast } from 'sonner';

interface AppUser {
  id: string;
  username: string;
  full_name: string;
  is_active: boolean;
  is_admin: boolean;
}

interface Sale {
  id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_amount: number;
  date: string;
  time?: string;
  datetime?: string;
  payment_method?: 'cash' | 'card';
  created_at: string;
}

interface Expense {
  id: string;
  expense_type_id: string;
  expense_type_name: string;
  amount: number;
  description: string;
  date: string;
  payment_method?: 'cash' | 'card' | 'credit';
  created_at: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
}

interface ExpenseType {
  id: string;
  name: string;
}

export default function Home() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sales, setSales] = useState<Sale[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [expenseTypes, setExpenseTypes] = useState<ExpenseType[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);

  // Check authentication
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/me');
        const json = await res.json();
        
        if (!json.authenticated) {
          router.push('/login');
          return;
        }
        
        setCurrentUser(json.user);
      } catch (error) {
        console.error('Auth check failed:', error);
        router.push('/login');
      } finally {
        setCheckingAuth(false);
      }
    };
    
    checkAuth();
  }, [router]);

  // Filters
  const [salesProductFilter, setSalesProductFilter] = useState<string>('all');
  const [expensesTypeFilter, setExpensesTypeFilter] = useState<string>('all');

  const fetchSales = useCallback(async () => {
    try {
      const res = await fetch('/api/sales');
      const json = await res.json();
      if (json.success) {
        setSales(json.data);
      }
    } catch (error) {
      console.error('Error fetching sales:', error);
    }
  }, []);

  const fetchExpenses = useCallback(async () => {
    try {
      const res = await fetch('/api/expenses');
      const json = await res.json();
      if (json.success) {
        setExpenses(json.data);
      }
    } catch (error) {
      console.error('Error fetching expenses:', error);
    }
  }, []);

  const fetchProducts = useCallback(async () => {
    try {
      const res = await fetch('/api/products');
      const json = await res.json();
      if (json.success) {
        setProducts(json.data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  }, []);

  const fetchExpenseTypes = useCallback(async () => {
    try {
      const res = await fetch('/api/expense-types');
      const json = await res.json();
      if (json.success) {
        setExpenseTypes(json.data);
      }
    } catch (error) {
      console.error('Error fetching expense types:', error);
    }
  }, []);

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    await Promise.all([
      fetchSales(),
      fetchExpenses(),
      fetchProducts(),
      fetchExpenseTypes(),
    ]);
    setLoading(false);
  }, [fetchSales, fetchExpenses, fetchProducts, fetchExpenseTypes]);

  // Fetch data after auth check
  useEffect(() => {
    if (!checkingAuth && currentUser) {
      fetchAllData();
    }
  }, [checkingAuth, currentUser, fetchAllData]);

  // Refresh data when tab changes
  useEffect(() => {
    if (activeTab === 'sales') {
      fetchProducts();
    } else if (activeTab === 'expenses') {
      fetchExpenseTypes();
    }
  }, [activeTab, fetchProducts, fetchExpenseTypes]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      toast.error('Logout failed');
    }
  };

  const handleExport = async () => {
    try {
      const res = await fetch('/api/export');
      const data = await res.json();
      
      const zip = new JSZip();
      
      if (data.files && Array.isArray(data.files)) {
        data.files.forEach((file: { name: string; content: string }) => {
          zip.file(file.name, file.content);
        });
      }
      
      const blob = await zip.generateAsync({ type: 'blob' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `charcoal_station_export_${new Date().toISOString().split('T')[0]}.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error exporting data:', error);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch {
      return dateString;
    }
  };

  const getPaymentMethodBadge = (method?: string, type: 'sale' | 'expense' = 'sale') => {
    if (!method) return null;
    
    if (type === 'sale') {
      return method === 'cash' ? (
        <Badge variant="outline" className="gap-1 text-green-600 border-green-300">
          <Banknote className="h-3 w-3" /> Cash
        </Badge>
      ) : (
        <Badge variant="outline" className="gap-1 text-blue-600 border-blue-300">
          <CreditCard className="h-3 w-3" /> Card
        </Badge>
      );
    }
    
    return method === 'cash' ? (
      <Badge variant="outline" className="gap-1 text-green-600 border-green-300">
        <Banknote className="h-3 w-3" /> Cash
      </Badge>
    ) : method === 'card' ? (
      <Badge variant="outline" className="gap-1 text-blue-600 border-blue-300">
        <CreditCard className="h-3 w-3" /> Card
      </Badge>
    ) : (
      <Badge variant="outline" className="gap-1 text-orange-600 border-orange-300">
        <FileText className="h-3 w-3" /> Credit
      </Badge>
    );
  };

  const filteredSales = salesProductFilter === 'all'
    ? sales
    : sales.filter(s => s.product_id === salesProductFilter);

  const filteredExpenses = expensesTypeFilter === 'all'
    ? expenses
    : expenses.filter(e => e.expense_type_id === expensesTypeFilter);

  const totalIncome = sales.reduce((sum, s) => sum + s.total_amount, 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const netProfit = totalIncome - totalExpenses;

  // Show loading while checking auth
  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated
  if (!currentUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Toaster position="top-right" />

      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500 rounded-lg">
                <Flame className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Charcoal Station</h1>
                <p className="text-sm text-muted-foreground">
                  Welcome, {currentUser.full_name || currentUser.username}
                  {currentUser.is_admin && (
                    <Badge variant="outline" className="ml-2 text-xs">
                      <Shield className="h-3 w-3 mr-1" />
                      Admin
                    </Badge>
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={fetchAllData}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout} className="text-red-600 hover:text-red-700">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
            <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
              <div className="text-xs text-muted-foreground">Total Income</div>
              <div className="text-lg font-bold text-green-600">{formatCurrency(totalIncome)}</div>
            </div>
            <div className="p-3 bg-red-50 dark:bg-red-950 rounded-lg border border-red-200 dark:border-red-800">
              <div className="text-xs text-muted-foreground">Total Expenses</div>
              <div className="text-lg font-bold text-red-600">{formatCurrency(totalExpenses)}</div>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="text-xs text-muted-foreground">Net Profit</div>
              <div className={`text-lg font-bold ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(netProfit)}
              </div>
            </div>
            <div className="p-3 bg-purple-50 dark:bg-purple-950 rounded-lg border border-purple-200 dark:border-purple-800">
              <div className="text-xs text-muted-foreground">Items Sold</div>
              <div className="text-lg font-bold text-purple-600">{sales.reduce((sum, s) => sum + (s.quantity || 1), 0)}</div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-4 sm:grid-cols-9 gap-2 h-auto p-1">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <LayoutDashboard className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="sales" className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              <span className="hidden sm:inline">Sales</span>
            </TabsTrigger>
            <TabsTrigger value="expenses" className="flex items-center gap-2">
              <Receipt className="h-4 w-4" />
              <span className="hidden sm:inline">Expenses</span>
            </TabsTrigger>
            <TabsTrigger value="credit" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Credit</span>
            </TabsTrigger>
            <TabsTrigger value="products" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              <span className="hidden sm:inline">Products</span>
            </TabsTrigger>
            <TabsTrigger value="expense-types" className="flex items-center gap-2">
              <Tags className="h-4 w-4" />
              <span className="hidden sm:inline">Types</span>
            </TabsTrigger>
            <TabsTrigger value="partners" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Partners</span>
            </TabsTrigger>
            <TabsTrigger value="profit-split" className="flex items-center gap-2">
              <Split className="h-4 w-4" />
              <span className="hidden sm:inline">Profit</span>
            </TabsTrigger>
            {currentUser.is_admin && (
              <TabsTrigger value="users" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Users</span>
              </TabsTrigger>
            )}
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <QuickAccessPanel />
            <Dashboard />
          </TabsContent>

          {/* Sales Tab */}
          <TabsContent value="sales">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <NewSaleForm 
                  products={products} 
                  onSaleAdded={() => { fetchSales(); fetchAllData(); }} 
                />
              </div>
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        <CardTitle>Sales History</CardTitle>
                        <CardDescription>All recorded sales transactions</CardDescription>
                      </div>
                      <Select value={salesProductFilter} onValueChange={setSalesProductFilter}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Filter by product" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Products</SelectItem>
                          {products.map(p => (
                            <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="text-center py-8 text-muted-foreground">Loading sales...</div>
                    ) : filteredSales.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">No sales recorded yet.</div>
                    ) : (
                      <div className="rounded-md border overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Date</TableHead>
                              <TableHead>Product</TableHead>
                              <TableHead className="text-center">Qty</TableHead>
                              <TableHead className="text-right">Price</TableHead>
                              <TableHead>Payment</TableHead>
                              <TableHead className="text-right">Total</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filteredSales.slice(0, 20).map((sale) => (
                              <TableRow key={sale.id}>
                                <TableCell>
                                  <div className="text-sm">
                                    <div>{formatDate(sale.date)}</div>
                                    {sale.time && (
                                      <div className="text-xs text-muted-foreground">{sale.time}</div>
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell className="font-medium">{sale.product_name}</TableCell>
                                <TableCell className="text-center">{sale.quantity}</TableCell>
                                <TableCell className="text-right">{formatCurrency(sale.unit_price)}</TableCell>
                                <TableCell>{getPaymentMethodBadge(sale.payment_method, 'sale')}</TableCell>
                                <TableCell className="text-right font-semibold text-green-600">
                                  {formatCurrency(sale.total_amount)}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                    {filteredSales.length > 20 && (
                      <div className="text-center py-4 text-sm text-muted-foreground">
                        Showing 20 of {filteredSales.length} sales
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Expenses Tab */}
          <TabsContent value="expenses">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <NewExpenseForm 
                  expenseTypes={expenseTypes} 
                  onExpenseAdded={() => { fetchExpenses(); fetchAllData(); }} 
                />
              </div>
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        <CardTitle>Expense History</CardTitle>
                        <CardDescription>All recorded expense transactions</CardDescription>
                      </div>
                      <Select value={expensesTypeFilter} onValueChange={setExpensesTypeFilter}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Filter by type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Types</SelectItem>
                          {expenseTypes.map(t => (
                            <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="text-center py-8 text-muted-foreground">Loading expenses...</div>
                    ) : filteredExpenses.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">No expenses recorded yet.</div>
                    ) : (
                      <div className="rounded-md border overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Date</TableHead>
                              <TableHead>Type</TableHead>
                              <TableHead>Description</TableHead>
                              <TableHead>Payment</TableHead>
                              <TableHead className="text-right">Amount</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filteredExpenses.slice(0, 20).map((expense) => (
                              <TableRow key={expense.id}>
                                <TableCell>{formatDate(expense.date)}</TableCell>
                                <TableCell>
                                  <Badge variant="outline">{expense.expense_type_name}</Badge>
                                </TableCell>
                                <TableCell className="max-w-[200px] truncate">
                                  {expense.description || '-'}
                                </TableCell>
                                <TableCell>{getPaymentMethodBadge(expense.payment_method, 'expense')}</TableCell>
                                <TableCell className="text-right font-semibold text-red-600">
                                  {formatCurrency(expense.amount)}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                    {filteredExpenses.length > 20 && (
                      <div className="text-center py-4 text-sm text-muted-foreground">
                        Showing 20 of {filteredExpenses.length} expenses
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Credit Payments Tab */}
          <TabsContent value="credit">
            <CreditPaymentsManager />
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products">
            <ProductManager onChange={fetchAllData} />
          </TabsContent>

          {/* Expense Types Tab */}
          <TabsContent value="expense-types">
            <ExpenseTypeManager onChange={fetchAllData} />
          </TabsContent>

          {/* Partners Tab */}
          <TabsContent value="partners">
            <PartnerManager onChange={fetchAllData} />
          </TabsContent>

          {/* Profit Split Tab */}
          <TabsContent value="profit-split">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ProfitSplitCard />
              <Card>
                <CardHeader>
                  <CardTitle>How Profit Split Works</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-semibold mb-2">Step 1: Add Partners</h4>
                    <p className="text-sm text-muted-foreground">
                      Add partners with their profit percentages. Total must equal 100%.
                    </p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-semibold mb-2">Step 2: Calculate Profit</h4>
                    <p className="text-sm text-muted-foreground">
                      Profit = Total Income - Total Expenses for the selected month.
                    </p>
                  </div>
                  <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                    <h4 className="font-semibold mb-2 text-blue-700">Example</h4>
                    <p className="text-sm text-muted-foreground">
                      If profit is Rs. 100,000 with 60%/40% split:
                      <br />• Partner A: Rs. 60,000
                      <br />• Partner B: Rs. 40,000
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Users Tab (Admin Only) */}
          {currentUser.is_admin && (
            <TabsContent value="users">
              <UserManager onChange={fetchAllData} />
            </TabsContent>
          )}
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t py-4 mt-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          Charcoal Station Business Manager &copy; {new Date().getFullYear()} - All data stored in Supabase (Sri Lankan Time - UTC+5:30)
        </div>
      </footer>
    </div>
  );
}
