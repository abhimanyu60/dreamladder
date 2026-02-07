import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { financialAPI } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import { FileText, Plus, Eye, Trash2, Download } from "lucide-react";
import { toast } from "sonner";

const PAYMENT_METHODS = [
  { value: "cash", label: "Cash" },
  { value: "bank_transfer", label: "Bank Transfer" },
  { value: "cheque", label: "Cheque" },
  { value: "upi", label: "UPI" },
  { value: "card", label: "Card" },
  { value: "other", label: "Other" },
];

export default function AdminReceipts() {
  const [receipts, setReceipts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [viewingReceipt, setViewingReceipt] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    customer_name: "",
    customer_phone: "",
    customer_email: "",
    customer_address: "",
    amount: "",
    description: "",
    payment_method: "cash",
    issue_date: new Date().toISOString().split('T')[0],
    notes: "",
  });

  useEffect(() => {
    loadReceipts();
  }, []);

  const loadReceipts = async () => {
    try {
      const data = await financialAPI.receipts.list();
      setReceipts(data);
    } catch (error) {
      toast.error("Failed to load receipts");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const data = {
        ...formData,
        amount: parseFloat(formData.amount),
      };

      await financialAPI.receipts.create(data);
      toast.success("Receipt generated successfully");
      setShowDialog(false);
      resetForm();
      loadReceipts();
    } catch (error: any) {
      toast.error(error.message || "Failed to generate receipt");
    }
  };

  const handleView = async (id: string) => {
    try {
      const receipt = await financialAPI.receipts.get(id);
      setViewingReceipt(receipt);
    } catch (error) {
      toast.error("Failed to load receipt");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this receipt?")) return;
    
    try {
      await financialAPI.receipts.delete(id);
      toast.success("Receipt deleted successfully");
      loadReceipts();
    } catch (error) {
      toast.error("Failed to delete receipt");
    }
  };

  const resetForm = () => {
    setFormData({
      customer_name: "",
      customer_phone: "",
      customer_email: "",
      customer_address: "",
      amount: "",
      description: "",
      payment_method: "cash",
      issue_date: new Date().toISOString().split('T')[0],
      notes: "",
    });
  };

  const printReceipt = () => {
    window.print();
  };

  const downloadReceipt = () => {
    if (!viewingReceipt) return;
    
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    // Generate HTML content
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Receipt - ${viewingReceipt.receipt_number}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              max-width: 800px;
              margin: 40px auto;
              padding: 20px;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              border-bottom: 2px solid #333;
              padding-bottom: 20px;
            }
            .company-name {
              font-size: 28px;
              font-weight: bold;
              color: #333;
            }
            .receipt-info {
              display: flex;
              justify-content: space-between;
              margin-bottom: 30px;
            }
            .customer-details {
              background: #f5f5f5;
              padding: 15px;
              border-radius: 5px;
              margin-bottom: 30px;
            }
            .payment-details {
              margin-bottom: 30px;
            }
            .detail-row {
              display: flex;
              justify-content: space-between;
              padding: 10px 0;
              border-bottom: 1px solid #ddd;
            }
            .amount-row {
              display: flex;
              justify-content: space-between;
              padding: 15px 0;
              border-top: 2px dashed #333;
              font-size: 18px;
              font-weight: bold;
            }
            .amount-words {
              background: #f5f5f5;
              padding: 10px;
              border-radius: 5px;
              margin: 10px 0;
              font-weight: bold;
            }
            .footer {
              margin-top: 40px;
              text-align: center;
              color: #666;
              font-size: 12px;
              border-top: 1px solid #ddd;
              padding-top: 20px;
            }
            h3 {
              margin-bottom: 10px;
              color: #333;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="company-name">DreamLadder</div>
            <div style="color: #666;">Real Estate Solutions</div>
          </div>

          <div class="receipt-info">
            <div>
              <div style="color: #666; font-size: 14px;">Receipt Number</div>
              <div style="font-weight: bold; font-size: 18px;">${viewingReceipt.receipt_number}</div>
            </div>
            <div style="text-align: right;">
              <div style="color: #666; font-size: 14px;">Date</div>
              <div style="font-weight: bold;">${new Date(viewingReceipt.issue_date).toLocaleDateString()}</div>
            </div>
          </div>

          <div class="customer-details">
            <h3>Customer Details</h3>
            <div style="font-weight: bold; margin-bottom: 5px;">${viewingReceipt.customer_name}</div>
            ${viewingReceipt.customer_address ? `<div>${viewingReceipt.customer_address}</div>` : ''}
            ${viewingReceipt.customer_phone ? `<div>Phone: ${viewingReceipt.customer_phone}</div>` : ''}
            ${viewingReceipt.customer_email ? `<div>Email: ${viewingReceipt.customer_email}</div>` : ''}
          </div>

          <div class="payment-details">
            <div class="detail-row">
              <span style="color: #666;">Description:</span>
              <span style="font-weight: bold;">${viewingReceipt.description}</span>
            </div>
            <div class="detail-row">
              <span style="color: #666;">Payment Method:</span>
              <span style="font-weight: bold; text-transform: capitalize;">${(viewingReceipt.payment_method || '').replace('_', ' ')}</span>
            </div>
            <div class="amount-row">
              <span>Amount Paid:</span>
              <span style="color: #16a34a;">₹${viewingReceipt.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
            <div class="amount-words">
              <div style="font-size: 12px; color: #666;">In Words:</div>
              ${viewingReceipt.amount_in_words}
            </div>
          </div>

          ${viewingReceipt.notes ? `
            <div style="border-top: 1px solid #ddd; padding-top: 20px; margin-bottom: 20px;">
              <div style="color: #666; font-size: 14px; margin-bottom: 5px;">Notes:</div>
              <div>${viewingReceipt.notes}</div>
            </div>
          ` : ''}

          <div class="footer">
            <p>This is a computer-generated receipt and does not require a signature.</p>
            <p style="margin-top: 5px;">Thank you for your business!</p>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();

    // Trigger print dialog
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Receipts</h1>
          <p className="text-muted-foreground mt-2">Generate and manage receipts</p>
        </div>
        <Button onClick={() => { resetForm(); setShowDialog(true); }} className="text-white">
          <Plus className="mr-2 h-4 w-4" />
          Generate Receipt
        </Button>
      </div>

      {/* Receipts Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Receipts</CardTitle>
          <CardDescription>View and manage all generated receipts</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Receipt No.</TableHead>
                <TableHead>Issue Date</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {receipts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    No receipts found
                  </TableCell>
                </TableRow>
              ) : (
                receipts.map((receipt) => (
                  <TableRow key={receipt.id}>
                    <TableCell className="font-medium">{receipt.receipt_number}</TableCell>
                    <TableCell>{new Date(receipt.issue_date).toLocaleDateString()}</TableCell>
                    <TableCell>{receipt.customer_name}</TableCell>
                    <TableCell>{receipt.description}</TableCell>
                    <TableCell className="text-right font-medium text-green-600">
                      {formatCurrency(receipt.amount)}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleView(receipt.id)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(receipt.id)}>
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Generate Receipt Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Generate Receipt</DialogTitle>
            <DialogDescription>Create a new advance receipt for a customer</DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="customer_name">Customer Name *</Label>
                <Input
                  id="customer_name"
                  value={formData.customer_name}
                  onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="customer_phone">Phone</Label>
                <Input
                  id="customer_phone"
                  value={formData.customer_phone}
                  onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="customer_email">Email</Label>
                <Input
                  id="customer_email"
                  type="email"
                  value={formData.customer_email}
                  onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="amount">Amount *</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="payment_method">Payment Method</Label>
                <Select value={formData.payment_method} onValueChange={(value) => setFormData({ ...formData, payment_method: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PAYMENT_METHODS.map(p => (
                      <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="issue_date">Issue Date *</Label>
                <Input
                  id="issue_date"
                  type="date"
                  value={formData.issue_date}
                  onChange={(e) => setFormData({ ...formData, issue_date: e.target.value })}
                  required
                />
              </div>

              <div className="col-span-2">
                <Label htmlFor="customer_address">Customer Address</Label>
                <Textarea
                  id="customer_address"
                  value={formData.customer_address}
                  onChange={(e) => setFormData({ ...formData, customer_address: e.target.value })}
                  rows={2}
                />
              </div>

              <div className="col-span-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  placeholder="e.g., Advance payment for Plot No. 123, Sector 5"
                  required
                />
              </div>

              <div className="col-span-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={2}
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowDialog(false)}>
                Cancel
              </Button>
              <Button type="submit" className="text-white">
                Generate Receipt
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Receipt Dialog */}
      <Dialog open={!!viewingReceipt} onOpenChange={() => setViewingReceipt(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {viewingReceipt && (
            <div className="space-y-6" id="receipt-print">
              {/* Header */}
              <div className="text-center border-b pb-4">
                <h2 className="text-2xl font-bold">DreamLadder</h2>
                <p className="text-sm text-muted-foreground">Real Estate Solutions</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Contact: info@dreamladder.com | Phone: +91-XXXXXXXXXX
                </p>
              </div>

              {/* Receipt Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Receipt No.</p>
                  <p className="font-bold text-lg">{viewingReceipt.receipt_number}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-medium">{new Date(viewingReceipt.issue_date).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Customer Details */}
              <div className="border rounded-lg p-4 bg-muted/50">
                <h3 className="font-semibold mb-2">Customer Details</h3>
                <p className="font-medium">{viewingReceipt.customer_name}</p>
                {viewingReceipt.customer_address && <p className="text-sm">{viewingReceipt.customer_address}</p>}
                {viewingReceipt.customer_phone && <p className="text-sm">Phone: {viewingReceipt.customer_phone}</p>}
                {viewingReceipt.customer_email && <p className="text-sm">Email: {viewingReceipt.customer_email}</p>}
              </div>

              {/* Payment Details */}
              <div className="space-y-2">
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">Description:</span>
                  <span className="font-medium text-right flex-1 ml-4">{viewingReceipt.description}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">Payment Method:</span>
                  <span className="font-medium capitalize">{viewingReceipt.payment_method?.replace('_', ' ')}</span>
                </div>
                <div className="flex justify-between py-2 border-t-2 border-dashed">
                  <span className="font-semibold text-lg">Amount Paid:</span>
                  <span className="font-bold text-2xl text-green-600">{formatCurrency(viewingReceipt.amount)}</span>
                </div>
                <div className="flex justify-between py-2 bg-muted/50 px-4 rounded">
                  <span className="text-sm font-medium">In Words:</span>
                  <span className="text-sm font-medium">{viewingReceipt.amount_in_words}</span>
                </div>
              </div>

              {viewingReceipt.notes && (
                <div className="border-t pt-4">
                  <p className="text-sm text-muted-foreground">Notes:</p>
                  <p className="text-sm">{viewingReceipt.notes}</p>
                </div>
              )}

              {/* Footer */}
              <div className="border-t pt-4 text-center text-sm text-muted-foreground">
                <p>This is a computer-generated receipt and does not require a signature.</p>
                <p className="mt-1">Thank you for your business!</p>
              </div>

              <DialogFooter className="print:hidden">
                <Button variant="outline" onClick={() => setViewingReceipt(null)}>
                  Close
                </Button>
                <Button variant="outline" onClick={downloadReceipt}>
                  <Download className="mr-2 h-4 w-4" />
                  Download PDF
                </Button>
                <Button onClick={printReceipt}>
                  <Download className="mr-2 h-4 w-4" />
                  Print Receipt
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #receipt-print, #receipt-print * {
            visibility: visible;
          }
          #receipt-print {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
