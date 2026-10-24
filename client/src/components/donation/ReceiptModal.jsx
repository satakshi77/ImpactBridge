import React from 'react';
import { X, Printer, Download, CheckCircle, ShieldCheck } from 'lucide-react';

export const ReceiptModal = ({ receipt, isOpen, onClose }) => {
  if (!isOpen || !receipt) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
        {/* Modal Actions Header */}
        <div className="bg-slate-900 px-6 py-3 text-white flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-semibold text-emerald-300">Official Donation Receipt</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium flex items-center gap-1.5 transition cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Sheet */}
        <div id="printable-receipt" className="p-8 overflow-y-auto space-y-6 text-slate-800 bg-white">
          {/* Header */}
          <div className="border-b-2 border-emerald-600 pb-5 flex items-start justify-between">
            <div>
              <span className="text-xl font-extrabold text-slate-900 font-heading">
                Impact<span className="text-emerald-600">Bridge</span>
              </span>
              <p className="text-xs text-slate-500 mt-0.5">Social Impact & Transparency Foundation</p>
              <p className="text-[11px] text-slate-400">Reg. Section 12A / 80G Certified Non-Profit</p>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full uppercase tracking-wider">
                80G Tax Exemption
              </span>
              <p className="text-xs font-mono font-semibold text-slate-700 mt-2">
                Receipt #{receipt.receiptNumber || 'RCP-2026-00918'}
              </p>
              <p className="text-[11px] text-slate-500">
                Date: {new Date(receipt.date || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
            </div>
          </div>

          {/* Donor & Transaction Info */}
          <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs">
            <div>
              <span className="text-slate-400 uppercase font-semibold text-[10px] block">Donor Details</span>
              <p className="font-bold text-slate-900 text-sm mt-0.5">{receipt.donorName || 'Supporter'}</p>
              <p className="text-slate-500">PAN: <span className="font-mono font-semibold text-slate-700">{receipt.panNumber || 'NOT PROVIDED'}</span></p>
              <p className="text-slate-500">Status: <span className="text-emerald-600 font-semibold">Payment Completed</span></p>
            </div>
            <div>
              <span className="text-slate-400 uppercase font-semibold text-[10px] block">Beneficiary Organization</span>
              <p className="font-bold text-slate-900 text-sm mt-0.5">{receipt.organizationName || 'Impact Partner'}</p>
              <p className="text-slate-500">Txn Ref: <span className="font-mono text-slate-600 text-[11px]">{receipt.transactionId || 'TXN-IB-992144'}</span></p>
            </div>
          </div>

          {/* Contribution Breakdown */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 uppercase font-bold text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-4">Campaign Description</th>
                  <th className="py-2.5 px-4 text-center">Tax Eligibility</th>
                  <th className="py-2.5 px-4 text-right">Amount (INR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-3 px-4 font-semibold text-slate-900">
                    {receipt.campaignTitle || 'Community Development Campaign'}
                    <span className="block text-[11px] text-slate-400 font-normal">Tracked via ImpactBridge Project Timeline</span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded-md">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" /> 50% Deductible
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-slate-900 text-sm font-mono">
                    ₹{Number(receipt.amount || 0).toLocaleString('en-IN')}
                  </td>
                </tr>
                <tr className="bg-slate-50 font-bold">
                  <td colSpan="2" className="py-2.5 px-4 text-right uppercase text-[10px] text-slate-600">Total Contribution Received</td>
                  <td className="py-2.5 px-4 text-right text-emerald-700 text-base font-mono">
                    ₹{Number(receipt.amount || 0).toLocaleString('en-IN')}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Certification Note */}
          <div className="text-[11px] text-slate-500 leading-relaxed space-y-1.5 border-t border-slate-100 pt-4">
            <p>
              • Donations made to this accredited project are eligible for tax deduction under Section 80G of the Indian Income Tax Act 1961.
            </p>
            <p>
              • This is a system-generated electronic receipt with verifiable audit trail on the ImpactBridge network.
            </p>
          </div>

          {/* Signatures */}
          <div className="pt-4 flex items-center justify-between border-t border-slate-200">
            <div className="flex items-center gap-2">
              <div className="w-12 h-12 bg-slate-100 border border-slate-200 rounded-lg flex items-center justify-center p-1">
                {/* QR code mockup */}
                <div className="grid grid-cols-4 gap-0.5 w-full h-full p-1 bg-white">
                  <div className="bg-slate-900 col-span-2 row-span-2"></div>
                  <div className="bg-slate-400"></div>
                  <div className="bg-slate-900"></div>
                  <div className="bg-slate-900"></div>
                  <div className="bg-slate-400 col-span-2 row-span-2"></div>
                  <div className="bg-slate-900"></div>
                </div>
              </div>
              <span className="text-[10px] text-slate-400 leading-tight">
                Scan to verify on<br />impactbridge.org/verify
              </span>
            </div>

            <div className="text-right">
              <div className="font-serif italic text-base text-slate-700 font-semibold">Authorized Signatory</div>
              <p className="text-[10px] text-slate-400 -mt-1">ImpactBridge Audit & Compliance</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
