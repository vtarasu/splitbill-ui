import {axiosInstance} from './index';


export const getGroups = async() => {
    try {
        const response = await axiosInstance.get('/user/groups');
        return response.data;
    } catch (error) {
        console.error('Failed to fetch user groups:', error);
        throw error;
    }
}

export const deleteGroup = async(groupId) => {
    try {
        const response = await axiosInstance.delete(`/group/${groupId}`);
        return response.data;
    } catch (error) {
        console.error('Failed to delete group:', error);
        throw error;
    }
}

export const createGroup = async (groupData) => {
    try {
        const response = await axiosInstance.post('/group/create', groupData);
        return response.data;
    } catch (error) {
        console.error('Failed to create group:', error);
        throw error;
    }
}