'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { PiggyBank, Split, TrendingUp, TrendingDown, Calendar, Users, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface PartnerSplit {
  id: string;
  profit_split_id: string;
  partner_id: string;
  partner_name: string;
  percentage: number;
  amount: number;
  created_at: string;
}

interface ProfitSplit {
  id: string;
  month: number;
  year: number;
  total_income: number;
  total_expenses: number;
  net_profit: number;
  split_date: string;
  created_at: string;
  partner_splits?: PartnerSplit[];
}

interface Partner {
  id: string;
  name: string;
  percentage: number;
}

export default function ProfitSplitCard() {
  const [profitSplits, setProfitSplits] = useState<ProfitSplit[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [splitting, setSplitting] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<string>((new Date().getMonth() + 1).toString());
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [splitsRes, partnersRes] = await Promise.all([
        fetch('/api/profit-split'),
        fetch('/api/partners'),
      ]);
      
      const splitsJson = await splitsRes.json();
      const partnersJson = await partnersRes.json();
      
      if (splitsJson.success) {
        setProfitSplits(splitsJson.data);
      }
      if (partnersJson.success) {
        setPartners(partnersJson.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSplitProfit = async () => {
    if (partners.length === 0) {
      toast.error('Please add partners first before splitting profits');
      return;
    }

    const totalPercentage = partners.reduce((sum, p) => sum + p.percentage, 0);
    if (totalPercentage !== 100) {
      toast.error(`Total partner percentage must equal 100% (currently ${totalPercentage.toFixed(2)}%)`);
      return;
    }

    setSplitting(true);
    try {
      const res = await fetch('/api/profit-split', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          month: parseInt(selectedMonth),
          year: parseInt(selectedYear),
        }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success('Profit split recorded successfully');
        fetchData();
      } else {
        toast.error(json.error || 'Failed to record profit split');
      }
    } catch (error) {
      console.error('Error splitting profit:', error);
      toast.error('Failed to record profit split');
    } finally {
      setSplitting(false);
    }
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

  const formatMonthYear = (month: number, year: number) => {
    const date = new Date(year, month - 1, 1);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

  const months = [
    { value: '1', label: 'January' },
    { value: '2', label: 'February' },
    { value: '3', label: 'March' },
    { value: '4', label: 'April' },
    { value: '5', label: 'May' },
    { value: '6', label: 'June' },
    { value: '7', label: 'July' },
    { value: '8', label: 'August' },
    { value: '9', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
  ];

  const years = [];
  const currentYear = new Date().getFullYear();
  for (let y = currentYear; y >= currentYear - 5; y--) {
    years.push({ value: y.toString(), label: y.toString() });
  }

  const isMonthSplit = (month: number, year: number) => {
    return profitSplits.some(s => s.month === month && s.year === year);
  };

  const totalPercentage = partners.reduce((sum, p) => sum + p.percentage, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PiggyBank className="h-5 w-5" />
          Profit Split
        </CardTitle>
        <CardDescription>Record profit distribution for a specific month</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Partners Summary */}
        {partners.length > 0 ? (
          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <span className="font-medium flex items-center gap-2">
                <Users className="h-4 w-4" />
                Partners ({partners.length})
              </span>
              <Badge variant={totalPercentage === 100 ? 'default' : 'destructive'}>
                Total: {totalPercentage.toFixed(2)}%
              </Badge>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {partners.map(partner => (
                <div key={partner.id} className="flex items-center justify-between p-2 bg-background rounded">
                  <span className="text-sm truncate">{partner.name}</span>
                  <span className="text-sm font-medium">{partner.percentage.toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-4 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <div className="flex items-center gap-2 text-yellow-700 dark:text-yellow-300">
              <AlertCircle className="h-5 w-5" />
              <span className="font-medium">No partners configured</span>
            </div>
            <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-1">
              Add partners in the Partners tab before splitting profits.
            </p>
          </div>
        )}

        {/* Split Form */}
        <div className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="space-y-2 flex-1 w-full">
            <label className="text-sm font-medium">Month</label>
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {months.map(m => (
                  <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 flex-1 w-full">
            <label className="text-sm font-medium">Year</label>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {years.map(y => (
                  <SelectItem key={y.value} value={y.value}>{y.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                disabled={splitting || isMonthSplit(parseInt(selectedMonth), parseInt(selectedYear)) || partners.length === 0 || totalPercentage !== 100}
              >
                <Split className="mr-2 h-4 w-4" />
                Split Profit
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirm Profit Split</AlertDialogTitle>
                <AlertDialogDescription>
                  This will record the profit split for {formatMonthYear(parseInt(selectedMonth), parseInt(selectedYear))}.
                  Each partner will receive their allocated percentage of the net profit.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleSplitProfit}>Confirm Split</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        {isMonthSplit(parseInt(selectedMonth), parseInt(selectedYear)) && (
          <div className="text-sm text-muted-foreground bg-muted p-2 rounded">
            ✓ Profit for this month has already been split.
          </div>
        )}

        {partners.length > 0 && totalPercentage !== 100 && (
          <div className="text-sm text-red-500 bg-red-50 dark:bg-red-950 p-2 rounded border border-red-200 dark:border-red-800">
            ⚠️ Total partner percentage must equal 100% before splitting.
          </div>
        )}

        {/* History */}
        <div className="mt-6">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Split History
          </h3>

          {loading ? (
            <div className="text-center py-4 text-muted-foreground">Loading history...</div>
          ) : profitSplits.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">No profit splits recorded yet.</div>
          ) : (
            <div className="space-y-3 max-h-[500px] overflow-y-auto">
              {profitSplits.map((split) => (
                <div
                  key={split.id}
                  className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-medium">{formatMonthYear(split.month, split.year)}</div>
                    <Badge variant="outline">{formatDate(split.split_date)}</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                    <div>
                      <span className="text-muted-foreground">Income:</span>{' '}
                      <span className="text-green-600 font-medium">{formatCurrency(split.total_income)}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Expenses:</span>{' '}
                      <span className="text-red-600 font-medium">{formatCurrency(split.total_expenses)}</span>
                    </div>
                  </div>
                  <div className="pt-2 border-t flex items-center justify-between">
                    <span className="text-muted-foreground">Net Profit:</span>
                    <div className={`flex items-center gap-1 font-bold ${split.net_profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {split.net_profit >= 0 ? (
                        <TrendingUp className="h-4 w-4" />
                      ) : (
                        <TrendingDown className="h-4 w-4" />
                      )}
                      {formatCurrency(split.net_profit)}
                    </div>
                  </div>

                  {/* Partner Splits */}
                  {split.partner_splits && split.partner_splits.length > 0 && (
                    <div className="mt-3 pt-3 border-t">
                      <div className="text-sm font-medium mb-2 flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        Partner Shares
                      </div>
                      <div className="space-y-1">
                        {split.partner_splits.map((ps) => (
                          <div key={ps.id} className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground">
                              {ps.partner_name} ({ps.percentage}%)
                            </span>
                            <span className={`font-medium ${ps.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {formatCurrency(ps.amount)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
