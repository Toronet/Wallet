import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {message} from 'antd';
import {AxiosError} from 'axios';

import {axiosRequest} from '../../helpers/request';
import {ICryptoTransaction, ICryptoRates, ICryptoFee, ICryptoFeeResult, ICryptoVerifyPayload, ICryptoFeePayload, IMintCryptoPayload, TCryptoState, IRequestError} from './crypto-slice-types';

export const getCryptoTransactions = createAsyncThunk<
    ICryptoTransaction[],
    {op:string; name1: string; value1: string; name2: string; value2: string;},
    {rejectValue: IRequestError}
>(
    "CRYPTO/TRANSACTIONS", async (payload, thunkApi) => {
        try {
            const config = {headers: {"Content-Type": "application/json"}};
            const res = await axiosRequest.get(`/query?op=${payload.op}&params[0][name]=${payload.name1}&params[0][value]=${payload.value1}&params[1][name]=${payload.name2}&params[1][value]=${payload.value2}`, config);
            return res.data.data;
        } 
        catch (err:any) {
            let error: AxiosError<IRequestError> = err;
            if(!error.response){
                throw err;
            }
            return thunkApi.rejectWithValue(error.response.data)
        }
    }
);

export const getCryptoLinkedAddresses = createAsyncThunk<
    any,
    {crypto: string; name1: string; value1: string;},
    {rejectValue: IRequestError}
>(
    "CRYPTO/LINKED-ADDRESSES", async (payload, thunkApi) => {
        try {
            const config = {headers: {"Content-Type": "application/json"}};
            const res = await axiosRequest.get(`/crypto/${payload.crypto}?op=getallextlinks&params[0][name]=${payload.name1}&params[0][value]=${payload.value1}`, config);
            return res.data.data;
        } 
        catch (err:any) {
            let error: AxiosError<IRequestError> = err;
            if(!error.response){
                throw err;
            }
            return thunkApi.rejectWithValue(error.response.data)
        }
    }
);

export const calculateCryptoFee = createAsyncThunk<
    ICryptoFee,
    ICryptoFeePayload,
    {rejectValue: IRequestError}
>(
    "CRYPTO/FEE", async (payload, thunkApi) => {
        try {
            const config = {headers: {"Content-Type": "application/json"}};
            const res = await axiosRequest.get(`/crypto/${payload.crypto}/cl?op=${payload.op}&params[0][name]=${payload.name1}&params[0][value]=${payload.value1}&params[1][name]=${payload.name2}&params[1][value]=${payload.value2}`, config);
            return res.data;
        } 
        catch (err:any) {
            let error: AxiosError<IRequestError> = err;
            if(!error.response){
                throw err;
            }
            return thunkApi.rejectWithValue(error.response.data)
        }
    }
);

export const calculateCryptoFeeResult = createAsyncThunk<
    ICryptoFeeResult,
    ICryptoFeePayload,
    {rejectValue: IRequestError}
>(
    "CRYPTO/FEE-RESULT", async (payload, thunkApi) => {
        try {
            const config = {headers: {"Content-Type": "application/json"}};
            const res = await axiosRequest.get(`/crypto/${payload.crypto}/cl?op=${payload.op}&params[0][name]=${payload.name1}&params[0][value]=${payload.value1}&params[1][name]=${payload.name2}&params[1][value]=${payload.value2}`, config);
            return res.data;
        } 
        catch (err:any) {
            let error: AxiosError<IRequestError> = err;
            if(!error.response){
                throw err;
            }
            return thunkApi.rejectWithValue(error.response.data)
        }
    }
);

export const verifyCryptoTransaction = createAsyncThunk<
    any,
    ICryptoVerifyPayload,
    {rejectValue: IRequestError}
>(
    "CRYPTO/VERIFY-USER", async (userPayload, thunkApi) => {
        try {
            const payload = {...userPayload};
            delete payload.crypto;
            const config = {headers: {"Content-Type": "application/json"}};
            const res = await axiosRequest.post(`/crypto/${userPayload.crypto}/cl`, payload, config);
            return res.data;
        } 
        catch (err:any) {
            let error: AxiosError<IRequestError> = err;
            if(!error.response){
                throw err;
            }
            return thunkApi.rejectWithValue(error.response.data)
        }
    }
);

export const getCryptoExchangeRates = createAsyncThunk<
    ICryptoRates,
    string,
    {rejectValue: IRequestError}
>(
    "CRYPTO/RATES", async (crypto, thunkApi) => {
        try {
            const config = {headers: {"Content-Type": "application/json"}};
            const res = await axiosRequest.get(`/crypto/${crypto}?op=getexchangerate`, config);
            return res.data;
        } 
        catch (err:any) {
            let error: AxiosError<IRequestError> = err;
            if(!error.response){
                throw err;
            }
            return thunkApi.rejectWithValue(error.response.data)
        }
    }
);

export const mintCryptos = createAsyncThunk<
    any,
    IMintCryptoPayload,
    {rejectValue: IRequestError}
>(
    "CRYPTO/MINT", async (userPayload, thunkApi) => {
        try {
            const payload = {...userPayload};
            delete payload.crypto;
            const config = {headers: {"Content-Type": "application/json"}};
            const res = await axiosRequest.post(`/crypto/${userPayload.crypto}/ad`, payload, config);
            return res.data;
        } 
        catch (err:any) {
            let error: AxiosError<IRequestError> = err;
            if(!error.response){
                throw err;
            }
            return thunkApi.rejectWithValue(error.response.data)
        }
    }
);

const cryptoSlice = createSlice({
    name: 'crypto',
    initialState: {
        cryptoTransactionStatus: 'idle',
        linkedAddrStatus: 'idle',
        calculating: 'idle',
        verifying: 'idle',
        minting: 'idle',
        rateStatus: 'idle',
        cryptoTransactions: [],
        linkedAddrs: [],
        rates: null,
        cryptoFee: null,
        cryptoResult: null,
        error: null
    } as TCryptoState,
    reducers: {},
    extraReducers: (builder) => {
        //@: get crypto transactions
        builder.addCase(getCryptoTransactions.pending, (state, _) => {
            state.cryptoTransactionStatus = 'pending';
            state.error = '';
        })
        builder.addCase(getCryptoTransactions.fulfilled, (state, {payload}) => {
            state.cryptoTransactions = payload
            state.cryptoTransactionStatus = 'succeeded';
        })
        builder.addCase(getCryptoTransactions.rejected, (state, {payload, error}) => {
            state.cryptoTransactionStatus = 'failed';
            state.cryptoTransactions = [];

            if(payload?.message){
                state.error = payload.message;
                message.error(payload.message);
            }else{
                state.error = error.message;
                message.error(error.message)
            }
        })

        //@: get crypto linked addresses
        builder.addCase(getCryptoLinkedAddresses.pending, (state, _) => {
            state.linkedAddrStatus = 'pending';
            state.error = '';
        })
        builder.addCase(getCryptoLinkedAddresses.fulfilled, (state, {payload}) => {
            state.linkedAddrs = payload
            state.linkedAddrStatus = 'succeeded';
        })
        builder.addCase(getCryptoLinkedAddresses.rejected, (state, {payload, error}) => {
            state.linkedAddrStatus = 'failed';
            state.linkedAddrs = [];

            if(payload?.message){
                state.error = payload.message;
                message.error(payload.message);
            }else{
                state.error = error.message;
                message.error(error.message)
            }
        })

        //@: calculate crypto fee
        builder.addCase(calculateCryptoFee.pending, (state, _) => {
            state.calculating = 'pending';
            state.error = '';
        })
        builder.addCase(calculateCryptoFee.fulfilled, (state, {payload}) => {
            state.cryptoFee = payload
            state.calculating = 'succeeded';
        })
        builder.addCase(calculateCryptoFee.rejected, (state, {payload, error}) => {
            state.calculating = 'failed';
            state.cryptoFee = null;

            if(payload?.message){
                state.error = payload.message;
                message.error(payload.message);
            }else{
                state.error = error.message;
                message.error(error.message)
            }
        })

        //@: calculate crypto fee result
        builder.addCase(calculateCryptoFeeResult.pending, (state, _) => {
            state.calculating = 'pending';
            state.error = '';
        })
        builder.addCase(calculateCryptoFeeResult.fulfilled, (state, {payload}) => {
            state.cryptoResult = payload
            state.calculating = 'succeeded';
        })
        builder.addCase(calculateCryptoFeeResult.rejected, (state, {payload, error}) => {
            state.calculating = 'failed';
            state.cryptoResult = null;

            if(payload?.message){
                state.error = payload.message;
                message.error(payload.message);
            }else{
                state.error = error.message;
                message.error(error.message)
            }
        })

        //@: verify crypto user
        builder.addCase(verifyCryptoTransaction.pending, (state, _) => {
            state.verifying = 'pending';
            state.error = '';
        })
        builder.addCase(verifyCryptoTransaction.fulfilled, (state, {payload}) => {
            state.verifying = 'succeeded';
        })
        builder.addCase(verifyCryptoTransaction.rejected, (state, {payload, error}) => {
            state.verifying = 'failed';

            if(payload?.message){
                state.error = payload.message;
                message.error(payload.message);
            }else{
                state.error = error.message;
                message.error(error.message)
            }
        })

        //@: get crypto rates transactions
        builder.addCase(getCryptoExchangeRates.pending, (state, _) => {
            state.rateStatus = 'pending';
            state.error = '';
        })
        builder.addCase(getCryptoExchangeRates.fulfilled, (state, {payload}) => {
            state.rates = payload
            state.rateStatus = 'succeeded';
        })
        builder.addCase(getCryptoExchangeRates.rejected, (state, {payload, error}) => {
            state.rateStatus = 'failed';
            state.rates = null;

            if(payload?.message){
                state.error = payload.message;
                message.error(payload.message);
            }else{
                state.error = error.message;
                message.error(error.message)
            }
        })

        //@: crypto mint reducer
        builder.addCase(mintCryptos.pending, (state, _) => {
            state.minting = 'pending';
            state.error = '';
        })
        builder.addCase(mintCryptos.fulfilled, (state, _) => {
            state.minting = 'succeeded';
        })
        builder.addCase(mintCryptos.rejected, (state, {payload, error}) => {
            state.minting = 'failed';

            if(payload?.message){
                state.error = payload.message;
                message.error(payload.message);
            }else{
                state.error = error.message;
                message.error(error.message)
            }
        });
    },
});

export default cryptoSlice.reducer;