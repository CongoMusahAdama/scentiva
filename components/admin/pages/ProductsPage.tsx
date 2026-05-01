"use client";

import { useState, useEffect } from "react";
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
import { ProductService } from "@/lib/services/product.service";

interface Product {
  id: string | number;
  name: string;
  price: string;
  costPrice: number;
  discount?: number;
  category: string;
  scentType: string;
  bestFor: string;
  stock: number;
  image: string;
  image2?: string;
  description: string;
  whenToWear: string;
  whyChoose: string;
  pros: string[];
  cons: string[];
  status: "in-stock" | "sold-out";
}

const emptyForm: Omit<Product, "id"> = {
  name: "", price: "", costPrice: 0, discount: 0, category: "mens", scentType: "", bestFor: "", stock: 0,
  image: "", image2: "", description: "", whenToWear: "", whyChoose: "", pros: [], cons: [],
  status: "in-stock",
};

const categories = ["mens", "womens", "unisex", "gift"];

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(allProducts.map(p => ({
    id: p.id,
    name: p.name,
    price: p.original ? p.original.toString() : p.actual.toString(),
    costPrice: (p as any).costPrice || 0,
    discount: p.original ? Math.round(((p.original - p.actual) / p.original) * 100) : 0,
    category: p.category,
    scentType: p.tag.split(" ")[0].replace("'", ""),
    bestFor: p.perfectOccasion,
    stock: 12,
    image: p.image,
    image2: (p as any).image2 || "",
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

  useEffect(() => {
    ProductService.fetchAll().then((data: any[]) => {
      // Merge DB products that aren't already in the mock list
      const newDbProducts = data.filter(dbP => !allProducts.find(ap => ap.id === dbP.id));
      if (newDbProducts.length > 0) {
        allProducts.unshift(...newDbProducts.reverse());
          
          setProducts(allProducts.map(p => ({
            id: p.id,
            name: p.name,
            price: p.original ? p.original.toString() : p.actual.toString(),
            costPrice: (p as any).costPrice || 0,
            discount: p.original && p.original > p.actual ? Math.round(((p.original - p.actual) / p.original) * 100) : 0,
            category: p.category,
            scentType: p.tag ? p.tag.split(" ")[0].replace("'", "") : "",
            bestFor: p.perfectOccasion,
            stock: 12,
            image: p.image,
            image2: (p as any).image2 || "",
            description: p.desc,
            whenToWear: p.whenToApply?.[0]?.label || "Daily",
            whyChoose: p.pros?.[0] || "",
            pros: p.pros || [],
            cons: p.cons || [],
            status: (p.status as any) || "in-stock",
          })));
        }
      });
  }, []);

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
      
      // Mutate global array for the frontend
      const idx = allProducts.findIndex(p => p.id === editTarget.id);
      if (idx !== -1) {
        const actualPrice = form.discount ? Math.round(Number(form.price) * (1 - form.discount / 100)) : Number(form.price);
        
        allProducts[idx] = { 
          ...allProducts[idx], 
          name: form.name, 
          actual: actualPrice,
          original: Number(form.price),
          tag: `${form.scentType} ${form.category}`,
          category: form.category,
          image: form.image,
          ...(form.image2 && { image2: form.image2 }),
          desc: form.description,
          pros: form.pros.length ? form.pros : (form.whyChoose ? [form.whyChoose] : []),
          cons: form.cons,
          whenToApply: form.whenToWear ? [{ icon: "Clock", label: form.whenToWear, detail: "Recommended" }] : [],
          perfectOccasion: form.bestFor,
          status: form.status as "in-stock" | "sold-out"
        };
        
        // Save to Live Backend
        ProductService.update(editTarget.id.toString(), allProducts[idx])
          .catch(err => console.error("Failed to update in DB:", err));
      }
      
      showSuccess("Product Updated", `${form.name} has been successfully updated.`);
    } else {
      const newId = `SA-NEW-${Date.now()}`;
      setProducts((prev) => [{ ...form, id: newId } as Product, ...prev]);
      
      const actualPrice = form.discount ? Math.round(Number(form.price) * (1 - form.discount / 100)) : Number(form.price);

      // Mutate global array for the frontend
      const newProd = {
        id: newId,
        name: form.name,
        actual: actualPrice,
        original: Number(form.price),
        tag: form.category === "mens" ? `${form.scentType} mens` : form.category === "womens" ? `${form.scentType} womens` : form.category === "gift" ? `${form.scentType} gift set` : form.scentType,
        costPrice: form.costPrice,
        category: form.category,
        image: form.image || "/perfume1.jpg",
        ...(form.image2 && { image2: form.image2 }),
        desc: form.description,
        pros: form.pros.length ? form.pros : (form.whyChoose ? [form.whyChoose] : []),
        cons: form.cons,
        whenToApply: form.whenToWear ? [{ icon: "Clock", label: form.whenToWear, detail: "Recommended" }] : [],
        perfectOccasion: form.bestFor,
        status: form.status as "in-stock" | "sold-out",
      };

      allProducts.unshift(newProd as any);

      // Save to Live Backend
      ProductService.create(newProd)
        .catch(err => console.error("Failed to save to DB:", err));

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
      
      // Mutate global array for the frontend
      const idx = allProducts.findIndex(p => p.id === id);
      if (idx !== -1) {
        allProducts.splice(idx, 1);
      }

      // Delete from Live Backend
      ProductService.delete(id.toString())
        .catch(err => console.error("Failed to delete from DB:", err));

      showSuccess("Deleted", "Product has been removed.");
    }
  };

  const toggleStatus = async (id: string | number, currentStatus: string, name: string) => {
    const newStatus = currentStatus === "sold-out" ? "in-stock" : "sold-out";
    
    if (newStatus === "sold-out") {
      const result = await showConfirm(
        "Mark as Sold Out?",
        `Are you sure you want to mark ${name} as sold out? Customers will only be able to pre-order this item.`,
        "Yes, Mark Sold Out"
      );
      if (!result.isConfirmed) return;
    }

    setProducts((prev) => prev.map((p) => 
      p.id === id ? { ...p, status: newStatus } : p
    ));

    // Mutate global array for the frontend
    const idx = allProducts.findIndex(p => p.id === id);
    if (idx !== -1) {
      allProducts[idx].status = newStatus as "in-stock" | "sold-out";
    }

    showSuccess(
      newStatus === "sold-out" ? "Marked as Sold Out" : "Restocked",
      `${name} is now ${newStatus === "sold-out" ? "unavailable" : "back in stock"}.`
    );
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, field: "image" | "image2") => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm(f => ({ ...f, [field]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
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
                    <Image src={p.image?.startsWith("data") || p.image?.startsWith("/") ? p.image : "/perfume1.jpg"} alt={p.name} fill className="object-cover" />
                  </div>
                }
                status={<Badge variant={p.status === "sold-out" ? "out-of-stock" : "active"} label={p.status} />}
                details={[
                  { label: "Price", value: `GHS ${p.price}` },
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
                    <Image src={p.image?.startsWith("data") || p.image?.startsWith("/") ? p.image : "/perfume1.jpg"} alt={p.name} fill className="object-cover" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-[#1A1B23]">{p.name}</span>
                    <span className="text-[10px] text-[#9CA3AF] uppercase">ID: {p.id}</span>
                  </div>
                </div>
              </AdminTableCell>
              <AdminTableCell className="font-bold text-[#1A1B23]">
                GHS {p.price}
                {p.discount ? <span className="text-rose-500 text-[10px] ml-1">-{p.discount}%</span> : null}
              </AdminTableCell>
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


      <AdminModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editTarget ? "Edit Product" : "Add Product"}
        width="900px"
        footer={
          <div className="flex gap-3 justify-end">
            <AdminButton variant="ghost" onClick={() => setModalOpen(false)}>Cancel</AdminButton>
            <AdminButton variant="primary" onClick={handleSave}>
              {editTarget ? "Save Changes" : "Add Product"}
            </AdminButton>
          </div>
        }
      >
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
            <AdminInput label="Product Name" value={form.name} onChange={(val) => setForm((f) => ({ ...f, name: val }))} placeholder="e.g. Oud Royale" />
            <AdminInput label="Selling Price (GHS)" type="number" value={form.price.toString().replace("GHS ", "")} onChange={(val) => setForm((f) => ({ ...f, price: val }))} placeholder="e.g. 420" />
            <AdminInput label="Cost Price (GHS)" type="number" value={form.costPrice.toString()} onChange={(val) => setForm((f) => ({ ...f, costPrice: Number(val) }))} placeholder="e.g. 200" />
            <div className="flex flex-col relative">
              <AdminInput label="Discount (%)" type="number" value={form.discount?.toString() || "0"} onChange={(val) => setForm((f) => ({ ...f, discount: Number(val) }))} placeholder="e.g. 10" />
              {Number(form.discount) > 0 && Number(form.price) > 0 && (
                <div className="absolute -bottom-5 left-1 text-[10px] font-bold text-emerald-500 tracking-wider flex items-center gap-1">
                  Final: <span className="text-emerald-600">GHS {Math.round(Number(form.price) * (1 - Number(form.discount) / 100))}</span>
                </div>
              )}
            </div>
            <AdminSelect
              label="Category"
              value={form.category}
              onChange={(val) => setForm((f) => ({ ...f, category: val }))}
              options={categories.map((c) => ({ value: c, label: c.charAt(0).toUpperCase() + c.slice(1) }))}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <AdminInput label="Scent Tag" value={form.scentType} onChange={(val) => setForm((f) => ({ ...f, scentType: val }))} placeholder="e.g. Woody" />
            <AdminInput label="Perfect Occasion" value={form.bestFor} onChange={(val) => setForm((f) => ({ ...f, bestFor: val }))} placeholder="e.g. Office Wear" />
            <AdminInput label="Stock" type="number" value={form.stock.toString()} onChange={(val) => setForm((f) => ({ ...f, stock: Number(val) }))} />
            <AdminSelect 
              label="Status" 
              value={form.status} 
              onChange={(val) => setForm((f) => ({ ...f, status: val as any }))}
              options={[
                { value: "in-stock", label: "In Stock" },
                { value: "sold-out", label: "Sold Out" },
              ]}
            />
          </div>

          <div className="flex flex-col gap-5">
             {/* Images Area */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
               {/* Primary Image */}
               <div className="flex flex-col gap-2">
                  <label style={{ fontSize: "11px", color: "#6B7280", fontFamily: "var(--font-poppins, sans-serif)", letterSpacing: "0.05em", textTransform: "uppercase", fontWeight: "bold" }}>
                    Primary Image (Front)
                  </label>
                  <div className="relative w-full h-48 border-2 border-dashed border-[#E8E9EC] rounded-xl overflow-hidden flex flex-col items-center justify-center bg-[#F9FAFB] hover:bg-[#F5F6FA] transition-colors group">
                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, "image")} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                    {!form.image ? (
                      <div className="flex flex-col items-center gap-2 text-[#9CA3AF]">
                        <ImagePlus size={24} className="group-hover:text-gold-oud transition-colors" />
                        <span style={{ fontSize: "12px", fontFamily: "var(--font-poppins, sans-serif)" }}>Upload Front Picture</span>
                      </div>
                    ) : (
                      <>
                        <Image src={form.image.startsWith("data") || form.image.startsWith("/") ? form.image : "/perfume1.jpg"} alt="Preview" fill className="object-contain p-2" />
                        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-0">
                           <span className="text-white text-xs font-bold uppercase tracking-widest bg-black/50 px-3 py-1 rounded-full">Change Image</span>
                        </div>
                      </>
                    )}
                  </div>
               </div>
               
               {/* Secondary Image */}
               <div className="flex flex-col gap-2">
                  <label style={{ fontSize: "11px", color: "#6B7280", fontFamily: "var(--font-poppins, sans-serif)", letterSpacing: "0.05em", textTransform: "uppercase", fontWeight: "bold" }}>
                    Secondary Image (Back / Side)
                  </label>
                  <div className="relative w-full h-48 border-2 border-dashed border-[#E8E9EC] rounded-xl overflow-hidden flex flex-col items-center justify-center bg-[#F9FAFB] hover:bg-[#F5F6FA] transition-colors group">
                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, "image2")} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                    {!form.image2 ? (
                      <div className="flex flex-col items-center gap-2 text-[#9CA3AF]">
                        <ImagePlus size={24} className="group-hover:text-gold-oud transition-colors" />
                        <span style={{ fontSize: "12px", fontFamily: "var(--font-poppins, sans-serif)" }}>Upload Back/Side Picture</span>
                      </div>
                    ) : (
                      <>
                        <Image src={form.image2.startsWith("data") || form.image2.startsWith("/") ? form.image2 : "/perfume1.jpg"} alt="Preview 2" fill className="object-contain p-2" />
                        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-0">
                           <span className="text-white text-xs font-bold uppercase tracking-widest bg-black/50 px-3 py-1 rounded-full">Change Image</span>
                        </div>
                      </>
                    )}
                  </div>
               </div>
             </div>

             <div className="grid grid-cols-2 gap-3">
                <AdminInput label="When to Wear" value={form.whenToWear} onChange={(val) => setForm((f) => ({ ...f, whenToWear: val }))} placeholder="e.g. Evening events" />
                <AdminInput label="Why Choose" value={form.whyChoose} onChange={(val) => setForm((f) => ({ ...f, whyChoose: val }))} placeholder="e.g. Timeless depth" />
             </div>
          </div>

          <AdminTextarea label="Description" value={form.description} onChange={(val) => setForm((f) => ({ ...f, description: val }))} placeholder="Short product description…" rows={3} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Pros */}
            <div className="bg-[#F9FAFB] p-4 rounded-xl border border-[#E8E9EC]">
              <label style={{ fontSize: "11px", color: "#6B7280", fontFamily: "var(--font-poppins, sans-serif)", letterSpacing: "0.05em", textTransform: "uppercase", fontWeight: "bold" }}>Pros</label>
              <div className="flex gap-2 mt-2">
                <input
                  value={prosInput}
                  onChange={(e) => setProsInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addPro()}
                  placeholder="Add a pro…"
                  style={{ flex: 1, background: "#FFFFFF", border: "1px solid #E8E9EC", borderRadius: "8px", padding: "8px 12px", fontSize: "12px", color: "#1A1B23", outline: "none" }}
                />
                <AdminButton variant="secondary" size="sm" onClick={addPro}>Add</AdminButton>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {form.pros.map((pr, i) => (
                  <span key={i} className="flex items-center gap-1.5" style={{ fontSize: "11px", color: "#059669", background: "white", border: "1px solid rgba(16,185,129,0.2)", borderRadius: "4px", padding: "4px 8px" }}>
                    {pr} <X size={10} className="cursor-pointer" onClick={() => setForm((f) => ({ ...f, pros: f.pros.filter((_, j) => j !== i) }))} />
                  </span>
                ))}
              </div>
            </div>

            {/* Cons */}
            <div className="bg-[#F9FAFB] p-4 rounded-xl border border-[#E8E9EC]">
              <label style={{ fontSize: "11px", color: "#6B7280", fontFamily: "var(--font-poppins, sans-serif)", letterSpacing: "0.05em", textTransform: "uppercase", fontWeight: "bold" }}>Cons</label>
              <div className="flex gap-2 mt-2">
                <input
                  value={consInput}
                  onChange={(e) => setConsInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addCon()}
                  placeholder="Add a con…"
                  style={{ flex: 1, background: "#FFFFFF", border: "1px solid #E8E9EC", borderRadius: "8px", padding: "8px 12px", fontSize: "12px", color: "#1A1B23", outline: "none" }}
                />
                <AdminButton variant="secondary" size="sm" onClick={addCon}>Add</AdminButton>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {form.cons.map((con, i) => (
                  <span key={i} className="flex items-center gap-1.5" style={{ fontSize: "11px", color: "#DC2626", background: "white", border: "1px solid rgba(220,38,38,0.2)", borderRadius: "4px", padding: "4px 8px" }}>
                    {con} <X size={10} className="cursor-pointer" onClick={() => setForm((f) => ({ ...f, cons: f.cons.filter((_, j) => j !== i) }))} />
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </AdminModal>


    </div>

  );
}
