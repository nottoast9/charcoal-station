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
import { Plus, Pencil, Trash2, Users, Percent, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface Partner {
  id: string;
  name: string;
  percentage: number;
  created_at: string;
  is_active: string;
}

interface PartnerManagerProps {
  onChange?: () => void;
}

export default function PartnerManager({ onChange }: PartnerManagerProps) {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);

  // Form states
  const [newName, setNewName] = useState('');
  const [newPercentage, setNewPercentage] = useState('');
  const [editName, setEditName] = useState('');
  const [editPercentage, setEditPercentage] = useState('');

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/partners');
      const json = await res.json();
      if (json.success) {
        setPartners(json.data);
      }
    } catch (error) {
      console.error('Error fetching partners:', error);
      toast.error('Failed to fetch partners');
    } finally {
      setLoading(false);
    }
  };

  const totalPercentage = partners.reduce((sum, p) => sum + p.percentage, 0);

  const handleAddPartner = async () => {
    if (!newName.trim() || !newPercentage) {
      toast.error('Please fill in all fields');
      return;
    }

    const percentage = parseFloat(newPercentage);
    if (isNaN(percentage) || percentage <= 0 || percentage > 100) {
      toast.error('Please enter a valid percentage (0-100)');
      return;
    }

    try {
      const res = await fetch('/api/partners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName.trim(), percentage }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success('Partner added successfully');
        setNewName('');
        setNewPercentage('');
        setIsAddDialogOpen(false);
        fetchPartners();
        onChange?.();
      } else {
        toast.error(json.error || 'Failed to add partner');
      }
    } catch (error) {
      console.error('Error adding partner:', error);
      toast.error('Failed to add partner');
    }
  };

  const handleUpdatePartner = async () => {
    if (!selectedPartner || !editName.trim() || !editPercentage) {
      toast.error('Please fill in all fields');
      return;
    }

    const percentage = parseFloat(editPercentage);
    if (isNaN(percentage) || percentage < 0 || percentage > 100) {
      toast.error('Please enter a valid percentage (0-100)');
      return;
    }

    try {
      const res = await fetch('/api/partners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update',
          id: selectedPartner.id,
          name: editName.trim(),
          percentage,
        }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success('Partner updated successfully');
        setIsEditDialogOpen(false);
        setSelectedPartner(null);
        setEditName('');
        setEditPercentage('');
        fetchPartners();
        onChange?.();
      } else {
        toast.error(json.error || 'Failed to update partner');
      }
    } catch (error) {
      console.error('Error updating partner:', error);
      toast.error('Failed to update partner');
    }
  };

  const handleDeactivatePartner = async (id: string, name: string) => {
    try {
      const res = await fetch('/api/partners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'deactivate', id }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success('Partner deactivated successfully');
        fetchPartners();
        onChange?.();
      } else {
        toast.error(json.error || 'Failed to deactivate partner');
      }
    } catch (error) {
      console.error('Error deactivating partner:', error);
      toast.error('Failed to deactivate partner');
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
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Partners
            </CardTitle>
            <CardDescription>Manage profit-sharing partners and their percentages</CardDescription>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button disabled={totalPercentage >= 100}>
                <Plus className="mr-2 h-4 w-4" />
                Add Partner
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Partner</DialogTitle>
                <DialogDescription>Add a new profit-sharing partner</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Partner Name</Label>
                  <Input
                    id="name"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g., John Smith"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="percentage">Profit Percentage (%)</Label>
                  <Input
                    id="percentage"
                    type="number"
                    step="0.01"
                    min="0.01"
                    max="100"
                    value={newPercentage}
                    onChange={(e) => setNewPercentage(e.target.value)}
                    placeholder="e.g., 25"
                  />
                </div>
                <div className="p-3 bg-muted rounded-lg text-sm">
                  <div className="flex justify-between items-center">
                    <span>Current Total:</span>
                    <span className="font-medium">{totalPercentage.toFixed(2)}%</span>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <span>Available:</span>
                    <span className="font-medium text-green-600">
                      {(100 - totalPercentage).toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddPartner}>Add Partner</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {/* Total Percentage Banner */}
        <div className={`p-4 rounded-lg mb-4 flex items-center gap-3 ${
          totalPercentage === 100 
            ? 'bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800' 
            : totalPercentage > 100 
              ? 'bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800'
              : 'bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800'
        }`}>
          <Percent className={`h-5 w-5 ${
            totalPercentage === 100 
              ? 'text-green-600' 
              : totalPercentage > 100 
                ? 'text-red-600'
                : 'text-blue-600'
          }`} />
          <div>
            <div className="font-medium">Total Percentage: {totalPercentage.toFixed(2)}%</div>
            {totalPercentage !== 100 && (
              <div className="text-sm text-muted-foreground">
                {100 - totalPercentage > 0 
                  ? `${(100 - totalPercentage).toFixed(2)}% unallocated`
                  : 'Exceeds 100% - please adjust'}
              </div>
            )}
            {totalPercentage === 100 && (
              <div className="text-sm text-green-600">
                ✓ All profit is allocated
              </div>
            )}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8 text-muted-foreground">Loading partners...</div>
        ) : partners.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No partners yet. Add partners to enable profit splitting.
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="text-center">Percentage</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {partners.map((partner) => (
                  <TableRow key={partner.id}>
                    <TableCell className="font-medium">{partner.name}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant={partner.percentage >= 50 ? 'default' : 'secondary'}>
                        {partner.percentage.toFixed(2)}%
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(partner.created_at)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedPartner(partner);
                            setEditName(partner.name);
                            setEditPercentage(partner.percentage.toString());
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
                              <AlertDialogTitle>Deactivate Partner</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to deactivate &quot;{partner.name}&quot;?
                                This will hide them from the partner list but preserve historical data.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeactivatePartner(partner.id, partner.name)}
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

        {/* Info Box */}
        <div className="mt-4 p-4 bg-muted rounded-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5" />
            <div className="text-sm text-muted-foreground">
              <p className="font-medium text-foreground mb-1">How Profit Splitting Works</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Add partners and allocate percentages (total must equal 100%)</li>
                <li>When you split profits, each partner receives their percentage</li>
                <li>Partner splits are recorded in the profit history</li>
                <li>You can adjust percentages at any time</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Partner</DialogTitle>
            <DialogDescription>Update partner name and percentage</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="editName">Partner Name</Label>
              <Input
                id="editName"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="editPercentage">Profit Percentage (%)</Label>
              <Input
                id="editPercentage"
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={editPercentage}
                onChange={(e) => setEditPercentage(e.target.value)}
              />
            </div>
            <div className="p-3 bg-muted rounded-lg text-sm">
              <div className="flex justify-between items-center">
                <span>Current Partner:</span>
                <span className="font-medium">{selectedPartner?.percentage.toFixed(2)}%</span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdatePartner}>Update Partner</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
