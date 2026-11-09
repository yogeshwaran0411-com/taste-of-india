import React, { useRef } from 'react';
import { useApp } from '../context/AppContext';
import { jsPDF } from 'jspdf';
import { 
  X, 
  Printer, 
  Download, 
  CheckCircle2, 
  ShieldCheck, 
  Mail, 
  MapPin, 
  Calendar, 
  Receipt, 
  Check, 
  ArrowDownToLine,
  FileText
} from 'lucide-react';

export const PaymentInvoiceModal: React.FC = () => {
  const { isInvoiceModalOpen, setIsInvoiceModalOpen, invoiceData, showToast } = useApp();
  const printRef = useRef<HTMLDivElement>(null);

  if (!isInvoiceModalOpen || !invoiceData) return null;

  const handlePrint = () => {
    const originalTitle = document.title;
    document.title = `TASTEOFINDIA_Receipt_${invoiceData.invoiceNumber}`;
    window.print();
    setTimeout(() => {
      document.title = originalTitle;
    }, 1200);
    showToast('Preparing TASTEOFINDIA receipt PDF for download / print...');
  };

  const handleDownloadPDF = () => {
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      doc.setProperties({
        title: `TASTEOFINDIA Receipt ${invoiceData.invoiceNumber}`,
        subject: `Payment Receipt - ${invoiceData.planName}`,
        author: 'TASTEOFINDIA',
        creator: 'TASTEOFINDIA'
      });

      // Header Banner
      doc.setFillColor(43, 27, 23); // #2B1B17
      doc.rect(0, 0, 210, 32, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(18);
      doc.setTextColor(255, 255, 255);
      doc.text('TASTEOFINDIA', 15, 18);

      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(245, 158, 11);
      doc.text('HERITAGE FOOD PRESERVATION & DIGITAL RECIPE ARCHIVE', 15, 25);

      doc.setFontSize(13);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(255, 255, 255);
      doc.text('OFFICIAL PAYMENT RECEIPT', 195, 18, { align: 'right' });

      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(200, 200, 200);
      doc.text(`REC: ${invoiceData.invoiceNumber}`, 195, 25, { align: 'right' });

      // Receipt Details Block
      let y = 44;
      doc.setFontSize(8.5);
      doc.setTextColor(120, 100, 90);
      doc.text('BILLED TO:', 15, y);
      doc.text('RECEIPT METRICS:', 120, y);

      y += 6;
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(43, 27, 23);
      doc.text(invoiceData.customerName, 15, y);

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text(`Date of Issue: ${invoiceData.date}`, 120, y);

      y += 5;
      doc.setTextColor(80, 70, 60);
      doc.text(invoiceData.customerEmail, 15, y);
      doc.text(`Payment ID: ${invoiceData.transactionId}`, 120, y);

      y += 5;
      doc.text('Registration: Cultural Digital Recipe Archive', 15, y);
      doc.text(`Payment Channel: ${invoiceData.paymentMethod}`, 120, y);

      // Items Table
      y += 14;
      doc.setFillColor(250, 246, 240);
      doc.roundedRect(15, y, 180, 8, 1, 1, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(80, 60, 50);
      doc.text('DESCRIPTION / SUBSCRIPTION PLAN', 20, y + 5.5);
      doc.text('DURATION', 110, y + 5.5);
      doc.text('STATUS', 145, y + 5.5);
      doc.text('AMOUNT (INR)', 190, y + 5.5, { align: 'right' });

      y += 14;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(43, 27, 23);
      doc.text(invoiceData.planName, 20, y);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.text(invoiceData.durationText, 110, y);

      doc.setTextColor(43, 138, 62);
      doc.setFont('helvetica', 'bold');
      doc.text('PAID (Direct Contribution)', 145, y);

      doc.setTextColor(43, 27, 23);
      doc.text(`₹${invoiceData.amount}.00`, 190, y, { align: 'right' });

      // Total Box
      y += 16;
      doc.setDrawColor(230, 220, 200);
      doc.line(15, y, 195, y);

      y += 8;
      doc.setFontSize(9);
      doc.setTextColor(100, 90, 80);
      doc.text('Membership Value:', 130, y);
      doc.text(`₹${invoiceData.amount}.00`, 190, y, { align: 'right' });

      y += 6;
      doc.text('Platform Fee (Waived):', 130, y);
      doc.text('₹0.00', 190, y, { align: 'right' });

      y += 8;
      doc.setFillColor(240, 253, 244);
      doc.roundedRect(125, y - 5, 70, 10, 1.5, 1.5, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(22, 101, 52);
      doc.text('TOTAL PAID:', 130, y + 2);
      doc.text(`₹${invoiceData.amount}.00 INR`, 190, y + 2, { align: 'right' });

      // Verification seal
      y += 24;
      doc.setDrawColor(34, 197, 94);
      doc.setLineWidth(0.5);
      doc.roundedRect(15, y, 180, 24, 2, 2, 'D');

      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(22, 101, 52);
      doc.text('✓ DIGITAL PAYMENT RECEIPT AUTHORIZED · GREEN TICK CONFIRMED', 22, y + 8);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(80, 80, 80);
      doc.text(`Valid until ${invoiceData.validUntil} · Full Heritage Recipe Access & Offline PDF Archives`, 22, y + 14);
      doc.text(`Support: ${invoiceData.supportEmail}  |  Office: ${invoiceData.editorialOffice}`, 22, y + 19);

      // Save PDF with requested TASTEOFINDIA file name
      const fileName = `TASTEOFINDIA_Receipt_${invoiceData.invoiceNumber}.pdf`;
      doc.save(fileName);
      showToast(`Downloaded ${fileName}!`);
    } catch (e) {
      console.error(e);
      window.print();
    }
  };

  return (
    <div className="fixed inset-0 z-70 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div 
        className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-stone-200 transition-all my-6 max-h-[92vh] flex flex-col print:m-0 print:p-0 print:shadow-none print:border-none print:max-h-none print:w-full"
        onClick={e => e.stopPropagation()}
      >
        {/* Top Header Actions (Hidden in Print) */}
        <div className="bg-[#2B1B17] text-white p-4 sm:px-6 flex items-center justify-between shrink-0 print:hidden">
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-amber-400" />
            <span className="font-serif-title font-bold text-base text-white">
              Official Payment Receipt &amp; Membership Voucher (PDF)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPDF}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              title="Download PDF as TASTEOFINDIA_Receipt_...pdf"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-[#E8590C] hover:bg-[#D9480F] text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save</span>
            </button>
            <button
              onClick={() => setIsInvoiceModalOpen(false)}
              className="text-stone-400 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Close Receipt Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Document Body */}
        <div ref={printRef} className="p-6 sm:p-10 space-y-6 overflow-y-auto flex-1 bg-white print:p-8 text-stone-800">
          
          {/* Header Row: Taste of India Official Logo & Receipt Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b-2 border-stone-100 pb-6">
            <div className="space-y-2">
              <div className="bg-[#FAF6F0] p-2.5 rounded-2xl border border-amber-200/80 inline-flex items-center shadow-xs">
                <img
                  src="/assets/aistudio/file_00000000fb9482119cbfd58d08ef92d6_70233663.png"
                  alt="TASTE OF INDIA"
                  className="h-12 sm:h-14 w-auto object-contain"
                />
              </div>
              <div className="text-xs text-stone-500 font-medium">
                Bharatiya Regional Heritage &amp; Culinary Archive
              </div>
            </div>

            <div className="text-left sm:text-right space-y-1">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 fill-emerald-100" />
                <span>PAYMENT VERIFIED (✓)</span>
              </span>
              <h2 className="font-serif-title text-xl sm:text-2xl font-black text-[#2B1B17]">
                OFFICIAL RECEIPT
              </h2>
              <div className="font-mono text-xs text-stone-600 font-bold">
                {invoiceData.invoiceNumber}
              </div>
            </div>
          </div>

          {/* Issuer & Customer Meta Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs border-b border-stone-100 pb-6">
            {/* Editorial Office & Platform Info */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-black uppercase text-stone-400 tracking-wider block">
                Issued By &amp; Editorial Office:
              </span>
              <div className="font-bold text-sm text-[#2B1B17]">TASTE OF INDIA Digital Archives</div>
              <div className="text-stone-600 leading-relaxed flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#E8590C] shrink-0 mt-0.5" />
                <span>{invoiceData.editorialOffice}</span>
              </div>
              <div className="text-stone-600 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#E8590C] shrink-0" />
                <span className="font-mono text-[11px]">{invoiceData.supportEmail}</span>
              </div>
            </div>

            {/* Billed To Customer */}
            <div className="space-y-1.5 sm:text-right">
              <span className="text-[10px] font-black uppercase text-stone-400 tracking-wider block">
                Billed To Subscriber:
              </span>
              <div className="font-bold text-sm text-[#2B1B17]">{invoiceData.customerName}</div>
              <div className="text-stone-600 font-mono text-[11px]">{invoiceData.customerEmail}</div>
              <div className="text-stone-500 pt-1">
                <strong>Date of Issue:</strong> {invoiceData.date}
              </div>
              <div className="text-stone-500">
                <strong>Access Period:</strong> Valid until {invoiceData.validUntil}
              </div>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="border border-stone-200 rounded-2xl overflow-hidden shadow-xs">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200 text-stone-600 uppercase text-[10px] font-black tracking-wider">
                  <th className="p-3 sm:p-4">Subscription Description</th>
                  <th className="p-3 sm:p-4 text-center">Duration</th>
                  <th className="p-3 sm:p-4 text-center">Processing Fee</th>
                  <th className="p-3 sm:p-4 text-right">Amount (INR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                <tr>
                  <td className="p-3 sm:p-4 space-y-1">
                    <div className="font-bold text-stone-900 text-sm">
                      {invoiceData.planName}
                    </div>
                    <div className="text-[11px] text-stone-500 leading-relaxed">
                      Unlimited high-definition recipe PDF downloads, ad-free heritage archive, culinary masterclasses, and priority support across all 36 Indian states &amp; union territories.
                    </div>
                  </td>
                  <td className="p-3 sm:p-4 text-center font-semibold text-stone-700 whitespace-nowrap">
                    {invoiceData.durationText}
                  </td>
                  <td className="p-3 sm:p-4 text-center whitespace-nowrap">
                    <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      ₹0.00 (Waived)
                    </span>
                  </td>
                  <td className="p-3 sm:p-4 text-right font-black text-sm text-[#2B1B17] whitespace-nowrap">
                    ₹{invoiceData.amount}.00
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Totals & Fee Waiver Note */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
            <div className="bg-amber-50/80 border border-amber-200/80 p-3.5 rounded-xl text-[11px] text-amber-950 max-w-sm space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-[#E8590C]">
                <ShieldCheck className="w-4 h-4" />
                <span>Direct Cultural Heritage Contribution</span>
              </div>
              <p className="text-stone-600 leading-tight">
                No extra processing fees, razorpay cut, or convenience charges added. All payments directly support heritage recipe preservation and creator archives.
              </p>
            </div>

            <div className="w-full sm:w-64 space-y-2 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>Subtotal:</span>
                <span className="font-semibold text-stone-900">₹{invoiceData.amount}.00</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Platform Fee (Waived):</span>
                <span className="font-semibold text-emerald-700">₹0.00</span>
              </div>
              <div className="border-t-2 border-stone-200 pt-2 flex justify-between font-black text-base text-[#2B1B17]">
                <span>Total Paid:</span>
                <span className="text-[#E8590C] font-black text-lg">₹{invoiceData.amount}.00 INR</span>
              </div>
            </div>
          </div>

          {/* Payment Method & Bank Authorization Seal */}
          <div className="bg-[#FAF6F0] p-4 rounded-2xl border border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-xs">
              <div className="text-[10px] uppercase font-bold text-stone-400">Transaction Details</div>
              <div className="text-stone-700">
                <strong>Payment Channel:</strong> {invoiceData.paymentMethod}
              </div>
              <div className="text-stone-700 font-mono text-[11px]">
                <strong>Reference ID:</strong> {invoiceData.transactionId}
              </div>
            </div>

            {/* Official Digital Authorization Stamp */}
            <div className="border-2 border-emerald-600 rounded-2xl p-2.5 px-4 bg-emerald-50 text-emerald-950 text-center flex items-center gap-3 shrink-0 shadow-xs">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-black text-base shadow-xs">
                ✓
              </div>
              <div className="text-left">
                <div className="text-[10px] font-black uppercase tracking-wider text-emerald-800">
                  PAYMENT AUTHORIZED
                </div>
                <div className="text-xs font-black text-emerald-950">
                  Digitally Authorized Receipt
                </div>
              </div>
            </div>
          </div>

          {/* Footer note */}
          <div className="text-center text-[10px] text-stone-400 pt-2 border-t border-stone-100">
            Taste of India Archives · This is a computer-generated official subscription receipt · Questions? Contact {invoiceData.supportEmail}
          </div>

        </div>

        {/* Bottom Modal Actions (Hidden in Print) */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between gap-3 shrink-0 print:hidden">
          <div className="text-xs text-stone-500 font-medium">
            Saved as <strong className="text-stone-800">TASTEOFINDIA_Receipt_{invoiceData.invoiceNumber}.pdf</strong>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPDF}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-[#E8590C] hover:bg-[#D9480F] text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save</span>
            </button>
            <button
              onClick={() => setIsInvoiceModalOpen(false)}
              className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold text-xs rounded-xl transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
