import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { LoginData } from '../Models/models';
// import { refreshAuthToken } from '../utils/refresh-token';


const api = axios.create({
    baseURL: `http://181.214.10.5/api`
});

api.interceptors.request.use(async (config) => {
    console.log('Calling URL ===> ' + config.url);
    if (config.url?.includes('ValidateUser') && !config.url?.includes('ValidateUserTPin')) {
        return config;
    } else {
        const token = await AsyncStorage.getItem('token');
        config.headers.Authorization = `Bearer ${token}`;
        return config;
    }
});

export const loginUser = (loginPayload: LoginData) => {
   return api.post(`/Auth/login`, loginPayload);
}
