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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, History, Zap, Star } from 'lucide-react';
import { toast } from 'sonner';
import { formatCurrency } from '@/lib/currency';

interface Product {
  id: string;
  name: string;
  price: number;
  created_at: string;
  is_active: string;
  is_quick_access: boolean;
}

interface PriceHistory {
  id: string;
  product_id: string;
  old_price: number;
  new_price: number;
  changed_at: string;
}

interface ProductManagerProps {
  onChange?: () => void;
}

export default function ProductManager({ onChange }: ProductManagerProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isHistoryDialogOpen, setIsHistoryDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [priceHistory, setPriceHistory] = useState<PriceHistory[]>([]);
  
  // Form states
  const [newName, setNewName] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [editPrice, setEditPrice] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/products');
      const json = await res.json();
      if (json.success) {
        setProducts(json.data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async () => {
    if (!newName.trim() || !newPrice) {
      toast.error('Please fill in all fields');
      return;
    }

    const price = parseFloat(newPrice);
    if (isNaN(price) || price < 0) {
      toast.error('Please enter a valid price');
      return;
    }

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName.trim(), price }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success('Product added successfully');
        setNewName('');
        setNewPrice('');
        setIsAddDialogOpen(false);
        fetchProducts();
        onChange?.();
      } else {
        toast.error(json.error || 'Failed to add product');
      }
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error('Failed to add product');
    }
  };

  const handleUpdatePrice = async () => {
    if (!selectedProduct || !editPrice) {
      toast.error('Please enter a price');
      return;
    }

    const price = parseFloat(editPrice);
    if (isNaN(price) || price < 0) {
      toast.error('Please enter a valid price');
      return;
    }

    try {
      const res = await fetch(`/api/products/${selectedProduct.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ price }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success('Price updated successfully');
        setIsEditDialogOpen(false);
        setSelectedProduct(null);
        setEditPrice('');
        fetchProducts();
        onChange?.();
      } else {
        toast.error(json.error || 'Failed to update price');
      }
    } catch (error) {
      console.error('Error updating price:', error);
      toast.error('Failed to update price');
    }
  };

  const handleToggleQuickAccess = async (product: Product) => {
    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'quick_access',
          is_quick_access: !product.is_quick_access 
        }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success(product.is_quick_access ? 'Removed from quick access' : 'Added to quick access');
        fetchProducts();
        onChange?.();
      } else {
        toast.error(json.error || 'Failed to update');
      }
    } catch (error) {
      console.error('Error updating quick access:', error);
      toast.error('Failed to update');
    }
  };

  const handleDeactivateProduct = async (productId: string) => {
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'deactivate' }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success('Product deactivated successfully');
        fetchProducts();
        onChange?.();
      } else {
        toast.error(json.error || 'Failed to deactivate product');
      }
    } catch (error) {
      console.error('Error deactivating product:', error);
      toast.error('Failed to deactivate product');
    }
  };

  const handleViewHistory = async (product: Product) => {
    setSelectedProduct(product);
    try {
      const res = await fetch(`/api/products/${product.id}`);
      const json = await res.json();
      if (json.success) {
        setPriceHistory(json.data);
        setIsHistoryDialogOpen(true);
      }
    } catch (error) {
      console.error('Error fetching price history:', error);
      toast.error('Failed to fetch price history');
    }
  };

  const formatDate = (dateString: string) => 
    new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Products</CardTitle>
            <CardDescription>Manage your charcoal products and prices. Star items for quick access on the dashboard.</CardDescription>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Product</DialogTitle>
                <DialogDescription>Add a new charcoal product to your inventory</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Product Name</Label>
                  <Input
                    id="name"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g., Premium Charcoal Bag"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="price">Price (Rs.)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    placeholder="0.00"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddProduct}>Add Product</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8 text-muted-foreground">Loading products...</div>
        ) : products.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No products yet. Add your first product!
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Quick Access</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">
                      {product.name}
                    </TableCell>
                    <TableCell>{formatCurrency(product.price)}</TableCell>
                    <TableCell>
                      <Button
                        variant={product.is_quick_access ? "default" : "outline"}
                        size="sm"
                        className={product.is_quick_access ? "bg-yellow-500 hover:bg-yellow-600" : ""}
                        onClick={() => handleToggleQuickAccess(product)}
                      >
                        <Star className={`h-4 w-4 ${product.is_quick_access ? "fill-current" : ""}`} />
                      </Button>
                    </TableCell>
                    <TableCell>{formatDate(product.created_at)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleViewHistory(product)}
                          title="View Price History"
                        >
                          <History className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedProduct(product);
                            setEditPrice(product.price.toString());
                            setIsEditDialogOpen(true);
                          }}
                          title="Edit Price"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" title="Deactivate">
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Deactivate Product</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to deactivate &quot;{product.name}&quot;? 
                                This will hide it from the product list but preserve historical data.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeactivateProduct(product.id)}
                                className="bg-red-500 hover:bg-red-600"
                              >
                                Deactivate
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>

      {/* Edit Price Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Price</DialogTitle>
            <DialogDescription>
              Update price for &quot;{selectedProduct?.name}&quot;
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Current Price</Label>
              <div className="text-lg font-semibold">
                {selectedProduct && formatCurrency(selectedProduct.price)}
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="editPrice">New Price (Rs.)</Label>
              <Input
                id="editPrice"
                type="number"
                step="0.01"
                min="0"
                value={editPrice}
                onChange={(e) => setEditPrice(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdatePrice}>Update Price</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Price History Dialog */}
      <Dialog open={isHistoryDialogOpen} onOpenChange={setIsHistoryDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Price History</DialogTitle>
            <DialogDescription>
              Price changes for &quot;{selectedProduct?.name}&quot;
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-96 overflow-y-auto">
            {priceHistory.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">
                No price history yet
              </div>
            ) : (
              <div className="space-y-2">
                {priceHistory.map((history) => (
                  <div
                    key={history.id}
                    className="flex items-center justify-between p-3 bg-muted rounded-lg"
                  >
                    <div>
                      <div className="text-sm">
                        {formatCurrency(history.old_price)} → {formatCurrency(history.new_price)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatDate(history.changed_at)}
                      </div>
                    </div>
                    <Badge variant={history.new_price > history.old_price ? 'destructive' : 'default'}>
                      {history.new_price > history.old_price ? '↑' : '↓'}
                      {formatCurrency(Math.abs(history.new_price - history.old_price))}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button onClick={() => setIsHistoryDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
