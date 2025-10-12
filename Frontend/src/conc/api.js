const API_BASE_URL = import.meta.env?.VITE_API_BASE_URL || 'http://localhost:8080/api';

class ApiService {
    constructor() { this.baseURL = API_BASE_URL; }

    async request(endpoint, options = {}) {
        const isAuthRoute = endpoint.startsWith('/auth/');
        const token = isAuthRoute ? null : localStorage.getItem('authToken');

        const baseHeaders = {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
            ...options.headers,
        };

        const doFetch = (headers) =>
            fetch(`${this.baseURL}${endpoint}`, { ...options, headers });

        let res = await doFetch(baseHeaders);

        if (res.status === 401 && !options._retried && !isAuthRoute) {
            const newToken = await this.refresh();
            if (newToken) {
                const retryHeaders = { ...baseHeaders, Authorization: `Bearer ${newToken}` };
                res = await doFetch(retryHeaders);
                options._retried = true;
            }
        }

        if (!res.ok) {
            if (res.status === 403) throw new Error(`Authentication required: ${res.status}`);
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        const ct = res.headers.get('Content-Type');
        if (res.status === 204 || !ct || !ct.includes('application/json')) return null;
        return res.json();
    }

    async login(email, password) {
        const resp = await this.request('/auth/signin', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
        if (resp?.accessToken) localStorage.setItem('authToken', resp.accessToken);
        if (resp?.refreshToken) localStorage.setItem('refreshToken', resp.refreshToken);
        return resp;
    }

    async refresh() {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) return null;
        const r = await fetch(`${this.baseURL}/auth/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken }),
        });
        if (!r.ok) { localStorage.removeItem('authToken'); localStorage.removeItem('refreshToken'); return null; }
        const j = await r.json();
        if (j?.accessToken) localStorage.setItem('authToken', j.accessToken);
        if (j?.refreshToken) localStorage.setItem('refreshToken', j.refreshToken);
        return j?.accessToken || null;
    }

    

    async getProfile() {
        return this.request('/auth/profile');
    }
    async getDistributors() {
        return this.request('/public/distributors', { method: 'GET' });
    }
    async getCrops() { return this.request('/crops'); }
    async createCrop(cropData) { return this.request('/crops', { method: 'POST', body: JSON.stringify(cropData) }); }
    async updateCrop(id, cropData) { return this.request(`/crops/${id}`, { method: 'PATCH', body: JSON.stringify(cropData) }); }
    async deleteCrop(id) { return this.request(`/crops/${id}`, { method: 'DELETE' }); }

    async getPublicCrop(publicId) {
        return this.request(`/public/crops/${encodeURIComponent(publicId)}`, { method: 'GET' });
    }
    async getExpenses() { return this.request('/expenses', { method: 'GET' }); }
    async addExpense(expenseData) { return this.request('/expenses', { method: 'POST', body: JSON.stringify(expenseData) }); }
    async updateExpense(id, expenseData) { return this.request(`/expenses/${id}`, { method: 'PUT', body: JSON.stringify(expenseData) }); }
    async getOutgoingShipments() { return this.request('/shipments/outgoing', { method: 'GET' }); }
    async getIncomingShipments() { return this.request('/shipments/incoming', { method: 'GET' }); }
    async createShipment(payload) { return this.request('/shipments', { method: 'POST', body: JSON.stringify(payload) }); }
    async updateShipmentStatus(id, status) {
        return this.request(`/shipments/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) });    
    }
    async getDistributorInventory() {
        return this.request('/distributor/inventory', { method: 'GET' });
    }

    async addDistributorInventory({ batchCode, quantityKg, pricePerKg, location, grade = null, expiryDate = null, qualityChecked = true, notes = '' }) {
        return this.request('/distributor/inventory', {
            method: 'POST',
            body: JSON.stringify({ batchCode, quantityKg, pricePerKg, location, grade, expiryDate, qualityChecked, notes }),
        });
    }
    async getSalesOrders() {
        return this.request('/distributor/orders', { method: 'GET' });
    }
    async createSalesOrder(payload) {
        return this.request('/distributor/orders', {
            method: 'POST',
            body: JSON.stringify(payload),
        });
    }
    async updateSalesOrderStatus(id, status) {
        return this.request(`/distributor/orders/${id}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ status }),
        });
    }

    async createDistributorShipmentToRetailer(payload) {
        return this.request('/distributor/shipments/to-retailer', {
            method: 'POST',
            body: JSON.stringify(payload),
        });
    }


    async getPublicRetailers() {
        return this.request('/public/retailers', { method: 'GET' });
    }
    // Retailer
    async getInventory() { return this.request('/retailer/inventory', { method: 'GET' }); }
    async addInventory(payload) { return this.request('/retailer/inventory', { method: 'POST', body: JSON.stringify(payload) }); }
    async getShipments() { return this.request('/retailer/shipments', { method: 'GET' }); }
    async addShipment(payload) { return this.request('/retailer/shipments', { method: 'POST', body: JSON.stringify(payload) }); }
    async getSales() { return this.request('/retailer/sales', { method: 'GET' }); }
    async getSalesOrderById(id) {
        return this.request(`/distributor/orders/${id}`, { method: 'GET' });
    }

    async addSale(payload) { return this.request('/retailer/sales', { method: 'POST', body: JSON.stringify(payload) }); }
    async retailerReceiveShipment(payload) {
        return this.request('/retailer/shipments/receive', {
            method: 'POST',
            body: JSON.stringify(payload),
        });
    }


}

export default new ApiService();
