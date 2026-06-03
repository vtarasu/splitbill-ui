import {axiosInstance} from './index';

export const getBalances = async() => {
    try {
        const response = await axiosInstance.get('/user/balances');
        return response.data;
    } catch (error) {
        console.error('Failed to fetch balances:', error);
        throw error;
    }
}

export const settleBalance = async(settlementDetails) => {
    try {
        const response = await axiosInstance.post('/user/settle', settlementDetails);
        return response.data;
    } catch (error) {
        console.error('Settlement failed:', error);
        throw error;
    }
}

export const settleGroupBalance = async(settlementDetails) => {
    try {
        const response = await axiosInstance.post('/user/settle/group', settlementDetails);
        return response.data;
    } catch (error) {
        console.error('Settlement failed:', error);
        throw error;
    }
}