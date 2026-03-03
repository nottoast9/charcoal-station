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
import { Plus, Pencil, Trash2, Star } from 'lucide-react';
import { toast } from 'sonner';
import { formatCurrency } from '@/lib/currency';

interface ExpenseType {
  id: string;
  name: string;
  created_at: string;
  is_active: string;
  is_quick_access: boolean;
  default_amount: number;
}

interface ExpenseTypeManagerProps {
  onChange?: () => void;
}

export default function ExpenseTypeManager({ onChange }: ExpenseTypeManagerProps) {
  const [expenseTypes, setExpenseTypes] = useState<ExpenseType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<ExpenseType | null>(null);
  
  // Form states
  const [newName, setNewName] = useState('');
  const [newDefaultAmount, setNewDefaultAmount] = useState('');
  const [editName, setEditName] = useState('');
  const [editDefaultAmount, setEditDefaultAmount] = useState('');

  useEffect(() => {
    fetchExpenseTypes();
  }, []);

  const fetchExpenseTypes = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/expense-types');
      const json = await res.json();
      if (json.success) {
        setExpenseTypes(json.data);
      }
    } catch (error) {
      console.error('Error fetching expense types:', error);
      toast.error('Failed to fetch expense types');
    } finally {
      setLoading(false);
    }
  };

  const handleAddExpenseType = async () => {
    if (!newName.trim()) {
      toast.error('Please enter a name');
      return;
    }

    try {
      const res = await fetch('/api/expense-types', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: newName.trim(),
          default_amount: parseFloat(newDefaultAmount) || 0
        }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success('Expense type added successfully');
        setNewName('');
        setNewDefaultAmount('');
        setIsAddDialogOpen(false);
        fetchExpenseTypes();
        onChange?.();
      } else {
        toast.error(json.error || 'Failed to add expense type');
      }
    } catch (error) {
      console.error('Error adding expense type:', error);
      toast.error('Failed to add expense type');
    }
  };

  const handleUpdateExpenseType = async () => {
    if (!selectedType || !editName.trim()) {
      toast.error('Please enter a name');
      return;
    }

    try {
      const res = await fetch('/api/expense-types', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'update', 
          id: selectedType.id, 
          name: editName.trim(),
          default_amount: parseFloat(editDefaultAmount) || 0
        }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success('Expense type updated successfully');
        setIsEditDialogOpen(false);
        setSelectedType(null);
        setEditName('');
        setEditDefaultAmount('');
        fetchExpenseTypes();
        onChange?.();
      } else {
        toast.error(json.error || 'Failed to update expense type');
      }
    } catch (error) {
      console.error('Error updating expense type:', error);
      toast.error('Failed to update expense type');
    }
  };

  const handleToggleQuickAccess = async (expenseType: ExpenseType) => {
    try {
      const res = await fetch('/api/expense-types', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'quick_access',
          id: expenseType.id,
          is_quick_access: !expenseType.is_quick_access,
          default_amount: expenseType.default_amount
        }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success(expenseType.is_quick_access ? 'Removed from quick access' : 'Added to quick access');
        fetchExpenseTypes();
        onChange?.();
      } else {
        toast.error(json.error || 'Failed to update');
      }
    } catch (error) {
      console.error('Error updating quick access:', error);
      toast.error('Failed to update');
    }
  };

  const handleDeactivateExpenseType = async (id: string, name: string) => {
    try {
      const res = await fetch('/api/expense-types', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'deactivate', id }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success('Expense type deactivated successfully');
        fetchExpenseTypes();
        onChange?.();
      } else {
        toast.error(json.error || 'Failed to deactivate expense type');
      }
    } catch (error) {
      console.error('Error deactivating expense type:', error);
      toast.error('Failed to deactivate expense type');
    }
  };

  const formatDate = (dateString: string) => 
    new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Expense Types</CardTitle>
            <CardDescription>Manage your expense categories. Star items for quick access on the dashboard.</CardDescription>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Type
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Expense Type</DialogTitle>
                <DialogDescription>Add a new expense category</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Type Name</Label>
                  <Input
                    id="name"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g., Supplies, Rent, Utilities"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="defaultAmount">Default Amount (Rs.) - Optional</Label>
                  <Input
                    id="defaultAmount"
                    type="number"
                    step="0.01"
                    min="0"
                    value={newDefaultAmount}
                    onChange={(e) => setNewDefaultAmount(e.target.value)}
                    placeholder="0.00"
                  />
                  <p className="text-xs text-muted-foreground">
                    Pre-fill amount for quick access
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddExpenseType}>Add Type</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8 text-muted-foreground">Loading expense types...</div>
        ) : expenseTypes.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No expense types yet. Add your first category!
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Default Amount</TableHead>
                  <TableHead>Quick Access</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenseTypes.map((type) => (
                  <TableRow key={type.id}>
                    <TableCell className="font-medium">{type.name}</TableCell>
                    <TableCell>
                      {type.default_amount > 0 ? formatCurrency(type.default_amount) : '-'}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant={type.is_quick_access ? "default" : "outline"}
                        size="sm"
                        className={type.is_quick_access ? "bg-yellow-500 hover:bg-yellow-600" : ""}
                        onClick={() => handleToggleQuickAccess(type)}
                      >
                        <Star className={`h-4 w-4 ${type.is_quick_access ? "fill-current" : ""}`} />
                      </Button>
                    </TableCell>
                    <TableCell>{formatDate(type.created_at)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedType(type);
                            setEditName(type.name);
                            setEditDefaultAmount(type.default_amount?.toString() || '0');
                            setIsEditDialogOpen(true);
                          }}
                          title="Edit"
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
                              <AlertDialogTitle>Deactivate Expense Type</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to deactivate &quot;{type.name}&quot;? 
                                This will hide it from the list but preserve historical data.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeactivateExpenseType(type.id, type.name)}
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

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Expense Type</DialogTitle>
            <DialogDescription>Update the expense type details</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="editName">Name</Label>
              <Input
                id="editName"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="editDefaultAmount">Default Amount (Rs.)</Label>
              <Input
                id="editDefaultAmount"
                type="number"
                step="0.01"
                min="0"
                value={editDefaultAmount}
                onChange={(e) => setEditDefaultAmount(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateExpenseType}>Update</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
