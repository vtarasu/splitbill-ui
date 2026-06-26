import {axiosInstance} from './index';

export const getGroupExpenses = async(requestData) => {
    try {
        const response = await axiosInstance.get('/expense/group', { params: requestData });
        // console.log('Fetched group expenses:', response.data);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch expenses:', error);
        throw error;
    }
}

export const getNonGroupExpenses = async(requestData) => {
    try {
        const response = await axiosInstance.get('/expense/nongroup', { params: requestData });
        // console.log('Fetched non-group expenses:', response.data);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch expenses:', error);
        throw error;
    }
}

export const addExpense = async(requestData) => {
    try {
        const response = await axiosInstance.post('/expense/add', requestData);
        console.log('Added expense:', response.data);
        return response.data;
    } catch (error) {
        console.error('Failed to add expense:', error);
        throw error;
    }
}

export const updateExpense = async(requestData) => {
    try {
        const response = await axiosInstance.post('/expense/update', requestData);
        console.log('Updated expense:', response.data);
        return response.data;
    } catch (error) {
        console.error('Failed to update expense:', error);
        throw error;
    }
}

export const deleteExpense = async(request) => {
    try {
        const response = await axiosInstance.delete(`/expense/${request.expenseId}`);
        console.log('Deleted expense:', response.data);
        return response.data;
    } catch (error) {
        console.error('Failed to delete expense:', error);
        throw error;
    }
}