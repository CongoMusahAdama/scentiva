"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, ImagePlus, X, PackageX, CheckCircle } from "lucide-react";
import Image from "next/image";
import { AdminCard } from "@/components/admin/AdminCards";
import {
  AdminButton,
  AdminModal,
  AdminInput,
  AdminTextarea,
  AdminSelect,
  Badge,
  AdminPagination,
  AdminTable,
  AdminMobileCard,
  AdminTableRow,
  AdminTableCell,
} from "@/components/admin/AdminUI";
import { allProducts } from "@/lib/products";
import { showSuccess, showError, showConfirm } from "@/lib/swal";

interface Product {
  id: string | number;
  name: string;
  price: string;
  category: string;
  scentType: string;
  bestFor: string;
  stock: number;
  image: string;
  description: string;
  whenToWear: string;
  whyChoose: string;
  pros: string[];
  cons: string[];
  status: "in-stock" | "sold-out";
}

const emptyForm: Omit<Product, "id"> = {
  name: "", price: "", category: "mens", scentType: "", bestFor: "", stock: 0,
  image: "", description: "", whenToWear: "", whyChoose: "", pros: [], cons: [],
  status: "in-stock",
};

const categories = ["mens", "womens", "unisex", "gift"];

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(allProducts.map(p => ({
    id: p.id,
    name: p.name,
    price: `GHS ${p.actual}`,
    category: p.category,
    scentType: p.tag.split(" ")[0].replace("'", ""),
    bestFor: p.perfectOccasion,
    stock: 12,
    image: p.image,
    description: p.desc,
    whenToWear: p.whenToApply?.[0]?.label || "Daily",
    whyChoose: p.pros[0] || "",
    pros: p.pros,
    cons: p.cons,
    status: "in-stock",
  })));
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Product | null>(null);
  const [form, setForm] = useState<Omit<Product, "id">>(emptyForm);
  const [prosInput, setProsInput] = useState("");
  const [consInput, setConsInput] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const openAdd = () => {
    setEditTarget(null);
    setForm(emptyForm);
    setProsInput("");
    setConsInput("");
    setModalOpen(true);
  };

  const openEdit = (p: Product) => {
    setEditTarget(p);
    setForm({ ...p });
    setProsInput("");
    setConsInput("");
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!form.name.trim()) {
      showError("Validation Error", "Product name is required.");
      return;
    }
    if (!form.price.trim()) {
      showError("Validation Error", "Product price is required.");
      return;
    }

    if (editTarget) {
      setProducts((prev) => prev.map((p) => (p.id === editTarget.id ? { ...form, id: editTarget.id } : p)));
      showSuccess("Product Updated", `${form.name} has been successfully updated.`);
    } else {
      setProducts((prev) => [...prev, { ...form, id: Date.now() }]);
      showSuccess("Product Added", `${form.name} has been added to inventory.`);
    }
    setModalOpen(false);
  };

  const handleDelete = async (id: number | string, name: string) => {
    const result = await showConfirm(
      "Delete Product",
      `Are you sure you want to delete ${name}? This action cannot be undone.`,
      "Delete"
    );

    if (result.isConfirmed) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
      showSuccess("Deleted", "Product has been removed.");
    }
  };

  const toggleStatus = (id: string | number, currentStatus: string, name: string) => {
    const newStatus = currentStatus === "sold-out" ? "in-stock" : "sold-out";
    setProducts((prev) => prev.map((p) => 
      p.id === id ? { ...p, status: newStatus } : p
    ));
    showSuccess(
      newStatus === "sold-out" ? "Marked as Sold Out" : "Restocked",
      `${name} is now ${newStatus === "sold-out" ? "unavailable" : "back in stock"}.`
    );
  };

  const addPro = () => {
    if (prosInput.trim()) { setForm((f) => ({ ...f, pros: [...f.pros, prosInput.trim()] })); setProsInput(""); }
  };
  const addCon = () => {
    if (consInput.trim()) { setForm((f) => ({ ...f, cons: [...f.cons, consInput.trim()] })); setConsInput(""); }
  };

  return (
    <div className="flex flex-col gap-5 max-w-6xl">
      <div className="flex items-center justify-between">
        <p style={{ fontSize: "13px", color: "#6B7280", fontFamily: "var(--font-poppins, sans-serif)" }}>
          {products.length} products total
        </p>
        <AdminButton variant="primary" onClick={openAdd}>
          <Plus size={14} /> Add Product
        </AdminButton>
      </div>

      <AdminCard noPadding>
        <AdminTable 
          headers={["S/N", "Product", "Price", "Category", "Scent", "Best For", "Stock", "Actions"]}
          mobileCards={products.slice((currentPage - 1) * pageSize, currentPage * pageSize).map((p, idx) => (
             <AdminMobileCard
                key={p.id}
                title={p.name}
                subtitle={p.category}
                image={
                  <div className="relative w-12 h-12 overflow-hidden bg-[#F5F6FA] border border-[#E8E9EC]">
                    <Image src={p.image.startsWith("/") ? p.image : "/perfume1.jpg"} alt={p.name} fill className="object-cover" />
                  </div>
                }
                status={<Badge variant={p.status === "sold-out" ? "out-of-stock" : "active"} label={p.status} />}
                details={[
                  { label: "Price", value: p.price },
                  { label: "Stock", value: p.stock },
                  { label: "Scent", value: p.scentType },
                  { label: "Best For", value: p.bestFor },
                ]}
                actions={
                  <div className="flex items-center gap-2 w-full">
                    <AdminButton 
                       variant="outline" 
                       size="sm" 
                       className="flex-1"
                       onClick={() => toggleStatus(p.id, p.status, p.name)}
                    >
                      {p.status === "sold-out" ? <CheckCircle size={12} /> : <PackageX size={12} />}
                    </AdminButton>
                    <AdminButton variant="outline" size="sm" className="flex-1" onClick={() => openEdit(p)}>
                      <Pencil size={12} />
                    </AdminButton>
                    <AdminButton variant="danger" size="sm" className="flex-1" onClick={() => handleDelete(p.id, p.name)}>
                      <Trash2 size={12} />
                    </AdminButton>
                  </div>
                }
             />
          ))}
        >
          {products.slice((currentPage - 1) * pageSize, currentPage * pageSize).map((p, idx) => (
            <AdminTableRow key={p.id}>
              <AdminTableCell className="font-bold text-[#9CA3AF] text-[11px]">{(currentPage - 1) * pageSize + idx + 1}</AdminTableCell>
              <AdminTableCell>
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 overflow-hidden bg-[#F5F6FA] border border-[#E8E9EC]">
                    <Image src={p.image.startsWith("/") ? p.image : "/perfume1.jpg"} alt={p.name} fill className="object-cover" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-[#1A1B23]">{p.name}</span>
                    <span className="text-[10px] text-[#9CA3AF] uppercase">ID: {p.id}</span>
                  </div>
                </div>
              </AdminTableCell>
              <AdminTableCell className="font-bold text-[#1A1B23]">{p.price}</AdminTableCell>
              <AdminTableCell><Badge variant="neutral" label={p.category} /></AdminTableCell>
              <AdminTableCell className="text-[#6B7280]">{p.scentType}</AdminTableCell>
              <AdminTableCell className="text-[#6B7280]">{p.bestFor}</AdminTableCell>
               <AdminTableCell>
                <div className="flex flex-col">
                  <span className={`font-bold ${p.stock === 0 || p.status === "sold-out" ? "text-[#EF4444]" : p.stock < 10 ? "text-amber-500" : "text-emerald-500"}`}>
                    {p.stock}
                  </span>
                  <span className="text-[9px] text-[#9CA3AF] font-bold uppercase">{p.status === "sold-out" ? "Inactive" : "Units"}</span>
                </div>
              </AdminTableCell>
              <AdminTableCell>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => toggleStatus(p.id, p.status, p.name)}
                    className={`p-2 transition-colors ${p.status === "sold-out" ? "text-emerald-500 hover:bg-emerald-50" : "text-amber-500 hover:bg-amber-50"}`}
                    title={p.status === "sold-out" ? "Mark as In Stock" : "Mark as Sold Out"}
                  >
                    {p.status === "sold-out" ? <CheckCircle size={16} /> : <PackageX size={16} />}
                  </button>
                  <button onClick={() => openEdit(p)} className="p-2 hover:bg-[#F5F6FA] text-[#9CA3AF] hover:text-[#1A1B23] transition-colors"><Pencil size={16} /></button>
                  <button onClick={() => handleDelete(p.id, p.name)} className="p-2 hover:bg-[#F5F6FA] text-[#9CA3AF] hover:text-[#EF4444] transition-colors"><Trash2 size={16} /></button>
                </div>
              </AdminTableCell>
            </AdminTableRow>
          ))}
        </AdminTable>
        <AdminPagination 
          currentPage={currentPage}
          totalItems={products.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
        />
      </AdminCard>


      {/* Add / Edit Modal */}
      <AdminModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editTarget ? "Edit Product" : "Add Product"}
        width="640px"
      >
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <AdminInput label="Product Name" value={form.name} onChange={(val) => setForm((f) => ({ ...f, name: val }))} placeholder="e.g. Oud Royale" />
            <AdminInput label="Price" value={form.price} onChange={(val) => setForm((f) => ({ ...f, price: val }))} placeholder="e.g. GHS 420" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <AdminSelect
              label="Category"
              value={form.category}
              onChange={(val) => setForm((f) => ({ ...f, category: val }))}
              options={categories.map((c) => ({ value: c, label: c.charAt(0).toUpperCase() + c.slice(1) }))}
            />
            <AdminInput label="Scent Tag" value={form.scentType} onChange={(val) => setForm((f) => ({ ...f, scentType: val }))} placeholder="e.g. Woody" />
            <AdminInput label="Perfect Occasion" value={form.bestFor} onChange={(val) => setForm((f) => ({ ...f, bestFor: val }))} placeholder="e.g. Office Wear" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <AdminInput label="Stock Quantity" type="number" value={form.stock} onChange={(val) => setForm((f) => ({ ...f, stock: Number(val) }))} />
            <AdminSelect 
              label="Inventory Status" 
              value={form.status} 
              onChange={(val) => setForm((f) => ({ ...f, status: val as any }))}
              options={[
                { value: "in-stock", label: "In Stock" },
                { value: "sold-out", label: "Sold Out" },
              ]}
            />
            <AdminInput label="Image Path / URL" value={form.image} onChange={(val) => setForm((f) => ({ ...f, image: val }))} placeholder="e.g. /perfume1.jpg" />
          </div>
          <AdminTextarea label="Description" value={form.description} onChange={(val) => setForm((f) => ({ ...f, description: val }))} placeholder="Short product description…" />
          <div className="grid grid-cols-2 gap-4">
            <AdminInput label="When to Wear" value={form.whenToWear} onChange={(val) => setForm((f) => ({ ...f, whenToWear: val }))} placeholder="e.g. Evening events" />
            <AdminInput label="Why Choose This" value={form.whyChoose} onChange={(val) => setForm((f) => ({ ...f, whyChoose: val }))} placeholder="e.g. Timeless depth" />
          </div>

          {/* Upload placeholder */}
          <div
            className="flex flex-col items-center justify-center gap-2 rounded-xl cursor-pointer"
            style={{ border: "1px dashed #E8E9EC", padding: "24px", background: "#F9FAFB" }}
          >
            <ImagePlus size={20} style={{ color: "#9CA3AF" }} />
            <span style={{ fontSize: "12px", color: "#6B7280", fontFamily: "var(--font-poppins, sans-serif)" }}>
              Click to upload product images
            </span>
          </div>

          {/* Pros */}
          <div>
            <label style={{ fontSize: "11px", color: "#6B7280", fontFamily: "var(--font-poppins, sans-serif)", letterSpacing: "0.05em", textTransform: "uppercase" }}>Pros</label>
            <div className="flex gap-2 mt-1.5">
              <input
                value={prosInput}
                onChange={(e) => setProsInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addPro()}
                placeholder="Add a pro…"
                style={{ flex: 1, background: "#F9FAFB", border: "1px solid #E8E9EC", borderRadius: "8px", padding: "8px 12px", fontSize: "12px", color: "#1A1B23", outline: "none" }}
              />
              <AdminButton variant="secondary" size="sm" onClick={addPro}>Add</AdminButton>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {form.pros.map((pr, i) => (
                <span key={i} className="flex items-center gap-1" style={{ fontSize: "11px", color: "#059669", background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: "20px", padding: "3px 10px" }}>
                  {pr} <X size={10} className="cursor-pointer" onClick={() => setForm((f) => ({ ...f, pros: f.pros.filter((_, j) => j !== i) }))} />
                </span>
              ))}
            </div>
          </div>

          {/* Cons */}
          <div>
            <label style={{ fontSize: "11px", color: "#6B7280", fontFamily: "var(--font-poppins, sans-serif)", letterSpacing: "0.05em", textTransform: "uppercase" }}>Cons</label>
            <div className="flex gap-2 mt-1.5">
              <input
                value={consInput}
                onChange={(e) => setConsInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addCon()}
                placeholder="Add a con…"
                style={{ flex: 1, background: "#F9FAFB", border: "1px solid #E8E9EC", borderRadius: "8px", padding: "8px 12px", fontSize: "12px", color: "#1A1B23", outline: "none" }}
              />
              <AdminButton variant="secondary" size="sm" onClick={addCon}>Add</AdminButton>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {form.cons.map((con, i) => (
                <span key={i} className="flex items-center gap-1" style={{ fontSize: "11px", color: "#DC2626", background: "rgba(220,38,38,0.1)", border: "1px solid rgba(220,38,38,0.2)", borderRadius: "20px", padding: "3px 10px" }}>
                  {con} <X size={10} className="cursor-pointer" onClick={() => setForm((f) => ({ ...f, cons: f.cons.filter((_, j) => j !== i) }))} />
                </span>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2 justify-end">
            <AdminButton variant="secondary" onClick={() => setModalOpen(false)}>Cancel</AdminButton>
            <AdminButton variant="primary" onClick={handleSave}>{editTarget ? "Save Changes" : "Add Product"}</AdminButton>
          </div>
        </div>
      </AdminModal>
    </div>

  );
}
