import axios from 'axios';

export const BASE_URL:string = process.env.NODE_ENV === 'development' ? 'http://testnet.toronet.org/api' : 'https://testnet.toronet.org/api';

export const axiosRequest = axios.create({
    baseURL: BASE_URL,
    headers: {}
});
