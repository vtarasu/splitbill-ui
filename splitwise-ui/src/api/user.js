import { axiosInstance } from './index';

export const loginUser = async (credentials) => {
    try {
        const response = await axiosInstance.post('/user/login', credentials);
        return response.data;
    } catch (error) {
        console.error('Login failed:', error);
        throw error;
    }
}

export const getUserProfile = async () => {
    try {
        const response = await axiosInstance.get('/user/me');
        return response.data;
    } catch (error) {
        console.error('Failed to fetch user profile:', error);
        throw error;
    }
}

export const registerUser = async (userDetails) => {
    try {
        const response = await axiosInstance.post('/user/register', userDetails);
        return response.data;
    } catch (error) {
        console.error('Registration failed:', error);
        throw error;
    }
}

export const updateUserProfile = async (userDetails) => {
    try {
        const response = await axiosInstance.post('/user/update', {emailId: userDetails.email, mobileNumber: userDetails.mobile });
        return response.data;
    } catch (error) {
        console.error('Failed to update user profile:', error);
        throw error;
    }
}

export const updatePassword = async (passwordDetails) => {
    try {
        const response = await axiosInstance.post('/user/updatePassword', passwordDetails);
        return response.data;
    } catch (error) {
        console.error('Failed to update user password:', error);
        throw error;
    }
}

export const userSettlement = async (pageno, size) => {
    try {
        const response = await axiosInstance.get('/user/settlements', { params: { pageno, size } });
        return response.data;
    } catch (error) {
        console.error('Unable to fetch settlements:', error);
        throw error;
    }
}

export const fetchUserDetails = async (requestBody) => {
    try {
        const response = await axiosInstance.post('/user/details', requestBody );
        return response.data;
    } catch (error) {
        console.error('Unable to fetch user details:', error);
        throw error;
    }
}