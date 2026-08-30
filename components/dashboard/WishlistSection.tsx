"use client";

import React from "react";
import Image from "next/image";
import { ShoppingBag, Eye, Trash2 } from "lucide-react";
import { useCart } from "@/context/CartContext";

import { WishlistService } from "@/lib/services/wishlist.service";

const WishlistSection = ({ onViewProduct }: { onViewProduct: (product: any) => void }) => {
  const { addToCart, showCartToast } = useCart();
  const [items, setItems] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const data = await WishlistService.getWishlist();
      setItems(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (e: React.MouseEvent, productId: string) => {
    e.stopPropagation();
    try {
      await WishlistService.toggleWishlist(productId);
      fetchWishlist();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddToCart = (e: React.MouseEvent, item: any) => {
    e.stopPropagation();
    addToCart(item);
    showCartToast({
      name: item.name,
      image: item.image,
      price: item.actual
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <h2 className="text-sm font-bold uppercase tracking-widest text-[#1A1B23]">Saved Fragrances</h2>
        <span className="text-[10px] text-[#9CA3AF] font-bold uppercase tracking-widest">{items.length} Items</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
           <div className="col-span-full py-10 text-center text-xs text-gray-400 uppercase tracking-widest">
              Syncing Wishlist...
           </div>
        ) : items.length === 0 ? (
          <div className="col-span-full py-10 text-center text-xs text-gray-400 uppercase tracking-widest bg-gray-50 border border-gray-100">
             Your wishlist is empty.
          </div>
        ) : items.map((item) => (
          <div key={item.id} className="bg-white border border-[#E8E9EC] flex flex-col group cursor-pointer" onClick={() => onViewProduct(item)}>
            <div className="relative h-64 w-full overflow-hidden bg-[#F5F6FA]">
              <Image 
                src={item.image} 
                alt={item.name} 
                fill 
                className="object-cover transition-transform duration-500 hover:scale-105" 
              />
              {/* Actions - Always Visible */}
              <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
                <button 
                  onClick={(e) => handleToggle(e, item.id)}
                  className="bg-white p-2 text-[#9CA3AF] hover:text-[#EF4444] border border-[#E8E9EC] transition-colors shadow-sm"
                >
                  <Trash2 size={14} />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); onViewProduct(item); }}
                  className="bg-white p-2 text-[#9CA3AF] hover:text-[#1A1B23] border border-[#E8E9EC] transition-colors shadow-sm"
                >
                  <Eye size={14} />
                </button>
              </div>
            </div>
            
            <div className="p-5 border-t border-[#F0F1F4]">
              <div className="flex justify-between items-start mb-1">
                <h4 className="text-[15px] font-bold text-[#1A1B23] uppercase tracking-tight">{item.name}</h4>
                <div className="text-[13px] font-bold text-[#D8B34B]">GH₵ {item.actual}</div>
              </div>
              <p className="text-[10px] uppercase tracking-widest text-[#9CA3AF] font-medium">{item.tag}</p>

              <button 
                onClick={(e) => handleAddToCart(e, item)}
                className="w-full mt-6 bg-[#1A1B23] text-white text-[10px] font-bold uppercase tracking-widest py-4 flex items-center justify-center gap-2 hover:bg-black transition-colors"
              >
                <ShoppingBag size={14} /> Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WishlistSection;

