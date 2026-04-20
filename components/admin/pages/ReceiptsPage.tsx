"use client";

import { useState } from "react";
import { Printer, Download, Search, CheckCircle2, FileText } from "lucide-react";
import { AdminCard } from "@/components/admin/AdminCards";
import { AdminButton, AdminInput, AdminSelect } from "@/components/admin/AdminUI";
import { allProducts } from "@/lib/products";
import Image from "next/image";
import { showSuccess } from "@/lib/swal";

export default function ReceiptsPage() {
  const [form, setForm] = useState({
    customerName: "",
    productId: allProducts[0].id,
    paymentMethod: "M-Pesa / Mobile Money",
    amount: allProducts[0].actual.toString(),
    receiptNumber: "SA-" + Math.floor(100000 + Math.random() * 900000),
    date: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }),
  });

  const [generated, setGenerated] = useState(false);

  const selectedProduct = allProducts.find(p => p.id === form.productId) || allProducts[0];

  const handleGenerate = () => {
    if (!form.customerName) return alert("Please enter customer name");
    setGenerated(true);
    showSuccess("Receipt Generated", "The receipt has been successfully created and is ready for the customer.");
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col gap-6 max-w-5xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Form */}
        <AdminCard title="Generate New Receipt">
          <div className="flex flex-col gap-4">
            <AdminInput 
              label="Customer Name" 
              value={form.customerName} 
              onChange={(val) => setForm({ ...form, customerName: val })}
              placeholder="e.g. John Doe"
            />
            <AdminSelect 
              label="Select Product"
              value={form.productId}
              onChange={(val) => {
                const prod = allProducts.find(p => p.id === val);
                setForm({ ...form, productId: val, amount: prod?.actual.toString() || "" });
              }}
              options={allProducts.map(p => ({ value: p.id, label: p.name + " (GHS " + p.actual + ")" }))}
            />
            <div className="grid grid-cols-2 gap-4">
              <AdminInput label="Amount (GHS)" value={form.amount} onChange={(val) => setForm({ ...form, amount: val })} />
              <AdminSelect 
                label="Payment Method"
                value={form.paymentMethod}
                onChange={(val) => setForm({ ...form, paymentMethod: val })}
                options={[
                  { value: "Mobile Money", label: "Mobile Money" },
                  { value: "Bank Transfer", label: "Bank Transfer" },
                  { value: "Cash on Delivery", label: "Cash on Delivery" },
                ]}
              />
            </div>
            <AdminInput label="Receipt Date" value={form.date} onChange={(val) => setForm({ ...form, date: val })} />
            
            <div className="pt-2">
              <AdminButton variant="primary" onClick={handleGenerate} style={{ width: "100%" }}>
                Generate Receipt
              </AdminButton>
            </div>
          </div>
        </AdminCard>

        {/* Preview */}
        {generated ? (
          <div className="flex flex-col gap-4">
             <div className="flex justify-between items-center px-2">
                <p style={{ fontSize: "12px", color: "#6B7280", fontWeight: 500 }}>Live Preview</p>
                <div className="flex gap-2">
                   <AdminButton variant="secondary" size="sm" onClick={handlePrint}><Printer size={14}/> Print</AdminButton>
                </div>
             </div>

             {/* The Receipt Document */}
             <div 
               id="printable-receipt"
               className="relative overflow-hidden shadow-2xl"
               style={{ 
                 background: "#FFFFFF", 
                 width: "100%", 
                 minHeight: "560px",
                 padding: "48px",
                 border: "1px solid #E8E9EC"
               }}
             >
                {/* Logo Watermark */}
                <div className="absolute inset-0 flex items-center justify-center opacity-[0.025] pointer-events-none select-none z-0">
                   <div style={{ position: "relative", width: "100%", height: "100%", maxWidth: "450px", maxHeight: "450px" }}>
                      <Image 
                        src="/01_primary_logo_transparent.png" 
                        alt="watermark" 
                        fill 
                        className="object-contain grayscale"
                        priority
                      />
                   </div>
                </div>

                {/* Content */}
                <div className="relative z-10 flex flex-col h-full">
                   {/* Header */}
                   <div className="flex justify-between items-start mb-12">
                      <div>
                        <div style={{ position: "relative", width: "120px", height: "40px", marginBottom: "8px" }}>
                           <Image src="/01_primary_logo_transparent.png" alt="logo" fill className="object-contain object-left" />
                        </div>
                        <p style={{ fontSize: "10px", color: "#6B7280", letterSpacing: "0.05em", textTransform: "uppercase" }}>Scentiva Aura Fragrances</p>
                      </div>
                      <div className="text-right">
                         <h2 style={{ fontFamily: "var(--font-lora, serif)", fontSize: "24px", color: "#1A1B23", fontWeight: 700 }}>RECEIPT</h2>
                         <p style={{ fontSize: "12px", color: "#9CA3AF" }}>{form.receiptNumber}</p>
                      </div>
                   </div>

                   {/* Info */}
                   <div className="grid grid-cols-2 gap-8 mb-12">
                      <div>
                        <p style={{ fontSize: "10px", color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "4px" }}>Billed To</p>
                        <p style={{ fontSize: "14px", color: "#1A1B23", fontWeight: 700 }}>{form.customerName}</p>
                        <p style={{ fontSize: "12px", color: "#6B7280" }}>Accra, Ghana</p>
                      </div>
                      <div className="text-right">
                        <p style={{ fontSize: "10px", color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "4px" }}>Date Issued</p>
                        <p style={{ fontSize: "14px", color: "#1A1B23", fontWeight: 700 }}>{form.date}</p>
                      </div>
                   </div>

                   {/* Table */}
                   <div className="flex-1">
                      <table className="w-full" style={{ borderCollapse: "collapse" }}>
                         <thead style={{ borderBottom: "2px solid #1A1B23" }}>
                            <tr>
                               <th align="left" style={{ padding: "12px 0", fontSize: "11px", color: "#9CA3AF", textTransform: "uppercase" }}>Description</th>
                               <th align="right" style={{ padding: "12px 0", fontSize: "11px", color: "#9CA3AF", textTransform: "uppercase" }}>Total</th>
                            </tr>
                         </thead>
                         <tbody style={{ borderBottom: "1px solid #E8E9EC" }}>
                            <tr>
                               <td style={{ padding: "20px 0" }}>
                                  <p style={{ fontSize: "14px", color: "#1A1B23", fontWeight: 600 }}>{selectedProduct.name}</p>
                                  <p style={{ fontSize: "11px", color: "#9CA3AF" }}>{selectedProduct.category.toUpperCase()} • {selectedProduct.tag}</p>
                               </td>
                               <td align="right" style={{ padding: "20px 0" }}>
                                  <p style={{ fontSize: "14px", color: "#1A1B23", fontWeight: 700 }}>GHS {form.amount}</p>
                               </td>
                            </tr>
                         </tbody>
                      </table>
                   </div>

                   {/* Totals */}
                   <div className="flex justify-end mt-6">
                      <div style={{ width: "200px" }}>
                         <div className="flex justify-between items-center py-2">
                            <span style={{ fontSize: "12px", color: "#6B7280" }}>Payment Method</span>
                            <span style={{ fontSize: "12px", color: "#1A1B23", fontWeight: 600 }}>{form.paymentMethod}</span>
                         </div>
                         <div className="flex justify-between items-center py-3 mt-2" style={{ borderTop: "2px solid #D8B34B" }}>
                            <span style={{ fontSize: "14px", color: "#1A1B23", fontWeight: 700 }}>Grand Total</span>
                            <span style={{ fontSize: "18px", color: "#D8B34B", fontWeight: 800 }}>GHS {form.amount}</span>
                         </div>
                      </div>
                   </div>

                   {/* Footer */}
                   <div className="mt-12 text-center">
                      <div className="inline-flex items-center gap-2 mb-3">
                         <CheckCircle2 size={16} className="text-emerald-500" />
                         <span style={{ fontSize: "12px", color: "#059669", fontWeight: 600 }}>Successfully Paid</span>
                      </div>
                      <p style={{ fontFamily: "var(--font-lora, serif)", fontSize: "14px", color: "#1A1B23", fontStyle: "italic" }}>
                        "Thank you for choosing Scentiva Aura. May your essence always be captivating."
                      </p>
                      <p style={{ fontSize: "10px", color: "#9CA3AF", marginTop: "16px" }}>scentivaaura.com • Accra, Ghana</p>
                   </div>
                </div>
             </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full border border-dashed border-[#E8E9EC] rounded-2xl p-12 bg-white/50">
             <div className="w-16 h-16 rounded-full bg-[#F5F6FA] flex items-center justify-center mb-4">
                <FileText size={32} className="text-[#9CA3AF]" />
             </div>
             <p style={{ fontSize: "14px", color: "#1A1B23", fontWeight: 600 }}>No Receipt Generated</p>
             <p style={{ fontSize: "12px", color: "#6B7280", textAlign: "center", marginTop: "4px" }}>
                Fill in the customer details on the left to create a professional receipt.
             </p>
          </div>
        )}
      </div>

      <style jsx global>{`
        @media print {
          body * { visibility: hidden; }
          #printable-receipt, #printable-receipt * { visibility: visible; }
          #printable-receipt {
            position: absolute;
            left: 0;
            top: 0;
            width: 100% !important;
            border: none !important;
            box-shadow: none !important;
          }
        }
      `}</style>
    </div>
  );
}
