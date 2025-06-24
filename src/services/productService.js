import { apiClient } from './apiService';

export const productService = {
    getAll: async () => {
        const response = await apiClient.get('/products');
        return response.data;
    },

    getById: async (id) => {
        const response = await apiClient.get(`/products/${id}`);
        return response.data;
    },

    create: async (data) => {
        // Si hay imagen, usar FormData
        if (data.image) {
            const formData = new FormData();
            formData.append('name', data.name);
            formData.append('price', data.price);
            formData.append('description', data.description || '');
            formData.append('category_id', data.category_id);
            formData.append('image', data.image);

            const response = await apiClient.post('/products', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } else {
            // Sin imagen, usar JSON normal
            const response = await apiClient.post('/products', data);
            return response.data;
        }
    },

    update: async (id, data) => {
        // Si hay imagen, usar FormData
        if (data.image) {
            const formData = new FormData();
            formData.append('name', data.name);
            formData.append('price', data.price);
            formData.append('description', data.description || '');
            formData.append('category_id', data.category_id);
            formData.append('image', data.image);

            const response = await apiClient.put(`/products/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } else {
            // Sin imagen, usar JSON normal
            const response = await apiClient.put(`/products/${id}`, data);
            return response.data;
        }
    },

    delete: async (id) => {
        const response = await apiClient.delete(`/products/${id}`);
        return response.data;
    }
};
