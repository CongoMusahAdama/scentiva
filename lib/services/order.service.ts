const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3001';

export const OrderService = {
  async fetchAll(phone?: string) {
    try {
      const url = phone ? `${API_URL}/orders?phone=${phone}` : `${API_URL}/orders`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch orders');
      return await res.json();
    } catch (error) {
      console.error('OrderService.fetchAll Error:', error);
      return [];
    }
  },

  async create(orderData: any) {
    try {
      const res = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });
      if (!res.ok) throw new Error('Failed to create order');
      return await res.json();
    } catch (error) {
      console.error('OrderService.create Error:', error);
      throw error;
    }
  },

  async updateStatus(id: string, status: string) {
    try {
      const res = await fetch(`${API_URL}/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error('Failed to update order status');
      return await res.json();
    } catch (error) {
      console.error('OrderService.updateStatus Error:', error);
      throw error;
    }
  },

  async deleteOrder(id: string) {
    try {
      const res = await fetch(`${API_URL}/orders/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete order');
      return true;
    } catch (error) {
      console.error('OrderService.deleteOrder Error:', error);
      throw error;
    }
  }
};
