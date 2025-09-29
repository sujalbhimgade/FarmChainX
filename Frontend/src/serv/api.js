import API_BASE_URL from '../lib/api';

class ApiService {
    constructor() {
        this.baseURL = API_BASE_URL;
    }

    async request(endpoint, options = {}) {
        const token = localStorage.getItem('authToken');
        const headers = {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
            ...options.headers,
        };

        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                headers,
                ...options,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error(`API request failed: ${endpoint}`, error);
            throw error;
        }
    }

    // Authentication
    async login(email, password) {
        return this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
    }

    async register(userData) {
        return this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData),
        });
    }

    // Crops
    async getCrops(farmerId) {
        return this.request(`/crops/farmer/${farmerId}`);
    }

    async createCrop(cropData) {
        return this.request('/crops', {
            method: 'POST',
            body: JSON.stringify(cropData),
        });
    }

    async updateCrop(id, cropData) {
        return this.request(`/crops/${id}`, {
            method: 'PUT',
            body: JSON.stringify(cropData),
        });
    }

    async deleteCrop(id) {
        return this.request(`/crops/${id}`, {
            method: 'DELETE',
        });
    }

    // Shipments
    async getShipments(userId, role) {
        return this.request(`/shipments/${role}/${userId}`);
    }

    async createShipment(shipmentData) {
        return this.request('/shipments', {
            method: 'POST',
            body: JSON.stringify(shipmentData),
        });
    }

    async updateShipmentStatus(id, status) {
        return this.request(`/shipments/${id}/status`, {
            method: 'PUT',
            body: JSON.stringify({ status }),
        });
    }

    // Inventory (for retailers/distributors)
    async getInventory(userId) {
        return this.request(`/inventory/${userId}`);
    }

    async addInventoryItem(inventoryData) {
        return this.request('/inventory', {
            method: 'POST',
            body: JSON.stringify(inventoryData),
        });
    }

    async updateInventoryItem(id, inventoryData) {
        return this.request(`/inventory/${id}`, {
            method: 'PUT',
            body: JSON.stringify(inventoryData),
        });
    }

    async deleteInventoryItem(id) {
        return this.request(`/inventory/${id}`, {
            method: 'DELETE',
        });
    }

    // Sales/Orders
    async getSalesOrders(userId, role) {
        return this.request(`/orders/${role}/${userId}`);
    }

    async createOrder(orderData) {
        return this.request('/orders', {
            method: 'POST',
            body: JSON.stringify(orderData),
        });
    }

    async updateOrderStatus(id, status) {
        return this.request(`/orders/${id}/status`, {
            method: 'PUT',
            body: JSON.stringify({ status }),
        });
    }

    // Users (Admin)
    async getUsers() {
        return this.request('/users');
    }

    async updateUserStatus(id, status) {
        return this.request(`/users/${id}/status`, {
            method: 'PUT',
            body: JSON.stringify({ status }),
        });
    }

    async verifyUser(id) {
        return this.request(`/users/${id}/verify`, {
            method: 'POST',
        });
    }

    // Retailers (for distributors)
    async getRetailers(distributorUserId) {
        return this.request(`/retailers/distributor/${distributorUserId}`);
    }

    async addRetailer(retailerData) {
        return this.request('/retailers', {
            method: 'POST',
            body: JSON.stringify(retailerData),
        });
    }

    // Expenses
    async getExpenses(userId) {
        return this.request(`/expenses/${userId}`);
    }

    async addExpense(expenseData) {
        return this.request('/expenses', {
            method: 'POST',
            body: JSON.stringify(expenseData),
        });
    }

    // Analytics/Dashboard Stats
    async getDashboardStats(userId, role) {
        return this.request(`/dashboard/stats/${role}/${userId}`);
    }

    // System Issues (Admin)
    async getSystemIssues() {
        return this.request('/admin/issues');
    }

    async updateIssueStatus(id, status) {
        return this.request(`/admin/issues/${id}/status`, {
            method: 'PUT',
            body: JSON.stringify({ status }),
        });
    }

    // Platform Config (Admin)
    async getPlatformConfigs() {
        return this.request('/admin/configs');
    }

    async updatePlatformConfig(id, value) {
        return this.request(`/admin/configs/${id}`, {
            method: 'PUT',
            body: JSON.stringify({ configValue: value }),
        });
    }
}

export default new ApiService();
