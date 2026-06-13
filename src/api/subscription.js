import { axiosInstance } from './index';

export const getCustomer = async () => {
    try {
        const response = await axiosInstance.post('/stripe/customer');
        return response.data;
    } catch (error) {
        console.error('Failed to fetch customer:', error);
        throw error;
    }
}

export const setupIntent = async () => {
    try {
        const response = await axiosInstance.post('/stripe/setup-intent');
        return response.data;
    } catch (error) {
        console.error('Failed to create setup intent:', error);
        throw error;
    }
}

export const subscription = async (requestBody) => {
    try {
        const response = await axiosInstance.post('/stripe/subscribe', requestBody);
        console.log('Subscription response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Failed to create subscription:', error);
        throw error;
    }
}

export const cancelSubscription = async () => {
    try {
        const response = await axiosInstance.post('/stripe/cancel');
        console.log('Cancel subscription response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Failed to cancel subscription:', error);
        throw error;
    }
}