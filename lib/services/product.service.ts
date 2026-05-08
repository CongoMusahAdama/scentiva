const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3001';

export const ProductService = {
  async fetchAll() {
    try {
      const res = await fetch(`${API_URL}/products`);
      if (!res.ok) throw new Error('Failed to fetch products');
      return await res.json();
    } catch (error) {
      console.error('ProductService.fetchAll Error:', error);
      return [];
    }
  },

  async create(productData: any) {
    try {
      const res = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });
      if (!res.ok) throw new Error('Failed to create product');
      return await res.json();
    } catch (error) {
      console.error('ProductService.create Error:', error);
      throw error;
    }
  },

  async update(id: string, productData: any) {
    try {
      const res = await fetch(`${API_URL}/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });
      if (!res.ok) throw new Error('Failed to update product');
      return await res.json();
    } catch (error) {
      console.error('ProductService.update Error:', error);
      throw error;
    }
  },

  async delete(id: string) {
    try {
      const res = await fetch(`${API_URL}/products/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete product');
      return true;
    } catch (error) {
      console.error('ProductService.delete Error:', error);
      throw error;
    }
  }
};
