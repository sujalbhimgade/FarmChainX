// api.js
const API_BASE_URL = import.meta.env?.VITE_API_BASE_URL || 'http://localhost:8080/api';

class ApiService {
    constructor() {
        this.baseURL = API_BASE_URL;
    }

    async request(endpoint, options = {}) {
        // inside ApiService.request before building headers
        const isAuthRoute = endpoint.startsWith('/auth/');
        const token = isAuthRoute ? null : localStorage.getItem('authToken'); // skip auth on /auth/*
        const headers = {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
            ...options.headers,
        };

        const res = await fetch(`${this.baseURL}${endpoint}`, { ...options, headers });
        if (!res.ok) {
            if (res.status === 403) throw new Error(`Authentication required: ${res.status}`);
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        const ct = res.headers.get('Content-Type');
        if (res.status === 204 || !ct || !ct.includes('application/json')) return null;
        return res.json();
    }

    // Auth
    async login(email, password) {
        return this.request('/auth/signin', { method: 'POST', body: JSON.stringify({ email, password }) });
    }
    async register(userData) {
        return this.request('/auth/signup', { method: 'POST', body: JSON.stringify(userData) });
    }
    async getProfile() {
        return this.request('/auth/profile');
    }

    // Public directory
    async getDistributors() {
        return this.request('/public/distributors', { method: 'GET' });
    }

    // Crops
    async getCrops() { return this.request('/crops'); }
    async createCrop(cropData) { return this.request('/crops', { method: 'POST', body: JSON.stringify(cropData) }); }
    async updateCrop(id, cropData) { return this.request(`/crops/${id}`, { method: 'PATCH', body: JSON.stringify(cropData) }); }
    async deleteCrop(id) { return this.request(`/crops/${id}`, { method: 'DELETE' }); }

    async getPublicCrop(publicId) {
        return this.request(`/public/crops/${encodeURIComponent(publicId)}`, { method: 'GET' });
    }
    // Expenses (optional)
    async getExpenses() { return this.request('/expenses', { method: 'GET' }); }
    async addExpense(expenseData) { return this.request('/expenses', { method: 'POST', body: JSON.stringify(expenseData) }); }
    async updateExpense(id, expenseData) { return this.request(`/expenses/${id}`, { method: 'PUT', body: JSON.stringify(expenseData) }); }

    // Shipments
    async getOutgoingShipments() { return this.request('/shipments/outgoing', { method: 'GET' }); }
    async getIncomingShipments() { return this.request('/shipments/incoming', { method: 'GET' }); }
    async createShipment(payload) { return this.request('/shipments', { method: 'POST', body: JSON.stringify(payload) }); }
    async updateShipmentStatus(id, status) {
        return this.request(`/shipments/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) });    
    }
    // Distributor inventory
    async getDistributorInventory() {
        return this.request('/distributor/inventory', { method: 'GET' });
    }

    async addDistributorInventory(payload) {
        // { batchCode, quantityKg, unitPrice, location }
        return this.request('/distributor/inventory', {
            method: 'POST',
            body: JSON.stringify(payload),
        });
    }
    // api.js

    // List current distributor's sales orders
    async getSalesOrders() {
        return this.request('/distributor/orders', { method: 'GET' });
    }

    // Create a new sales order (payload must match SalesOrderCreateRequest DTO)
    async createSalesOrder(payload) {
        return this.request('/distributor/orders', {
            method: 'POST',
            body: JSON.stringify(payload),
        });
    }

    // Update order status (payload must match SalesOrderStatusUpdateRequest DTO)
    async updateSalesOrderStatus(id, status) {
        return this.request(`/distributor/orders/${id}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ status }),
        });
    }

}

export default new ApiService();
