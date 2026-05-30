import {axiosInstance} from './index';

export const loginUser = async(credentials) => {
    try {
        const response = await axiosInstance.post('/user/login', credentials);
        return response.data;
    } catch (error) {
        console.error('Login failed:', error);
        throw error;
    }
}

export const getUserProfile = async() => {
    try {
        const response = await axiosInstance.get('/user/me');
        return response.data;
    } catch (error) {
        console.error('Failed to fetch user profile:', error);
        throw error;
    }
}

export const registerUser = async(userDetails) => {
    try {
        const response = await axiosInstance.post('/user/register', userDetails);
        return response.data;
    } catch (error) {
        console.error('Registration failed:', error);
        throw error;
    }
}