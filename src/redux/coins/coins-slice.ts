import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {message} from 'antd';
import {AxiosError} from 'axios';

import {axiosRequest} from '../../helpers/request';
import {ICoinsTransaction, ICoinsRates, IMintCoinPayload, ICoinFee, ICoinFeePayload, ICoinVerifyPayload, TCoinState, IRequestError, ICoinFeeResult} from './coins-slice-types';

export const getCoinsTransaction = createAsyncThunk<
    ICoinsTransaction[],
    {op:string; name1: string; value1: string; name2: string; value2: string;},
    {rejectValue: IRequestError}
>(
    "COINS/TRANSACTIONS", async (payload, thunkApi) => {
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

export const calculateCoinFee = createAsyncThunk<
    ICoinFee,
    ICoinFeePayload,
    {rejectValue: IRequestError}
>(
    "COINS/FEE", async (payload, thunkApi) => {
        try {
            const config = {headers: {"Content-Type": "application/json"}};
            const res = await axiosRequest.get(`/currency/${payload.currency}/cl?op=${payload.op}&params[0][name]=${payload.name1}&params[0][value]=${payload.value1}&params[1][name]=${payload.name2}&params[1][value]=${payload.value2}`, config);
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

export const calculatePlatCoinFee = createAsyncThunk<
    ICoinFee,
    ICoinFeePayload,
    {rejectValue: IRequestError}
>(
    "COINS/FEE-PLATFORM", async (payload, thunkApi) => {
        try {
            const config = {headers: {"Content-Type": "application/json"}};
            const res = await axiosRequest.get(`/coin/${payload.currency}/cl?op=${payload.op}&params[0][name]=${payload.name1}&params[0][value]=${payload.value1}&params[1][name]=${payload.name2}&params[1][value]=${payload.value2}`, config);
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

export const calculateBuyCoinResult = createAsyncThunk<
    ICoinFeeResult,
    ICoinFeePayload,
    {rejectValue: IRequestError}
>(
    "COINS/BUY-RESULT", async (payload, thunkApi) => {
        try {
            const config = {headers: {"Content-Type": "application/json"}};
            const res = await axiosRequest.get(`/currency/${payload.currency}/cl?op=${payload.op}&params[0][name]=${payload.name1}&params[0][value]=${payload.value1}&params[1][name]=${payload.name2}&params[1][value]=${payload.value2}`, config);
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

export const calculateBuyPlatCoinResult = createAsyncThunk<
    ICoinFeeResult,
    ICoinFeePayload,
    {rejectValue: IRequestError}
>(
    "COINS/BUY-PLAT-RESULT", async (payload, thunkApi) => {
        try {
            const config = {headers: {"Content-Type": "application/json"}};
            const res = await axiosRequest.get(`/coin/${payload.currency}/cl?op=${payload.op}&params[0][name]=${payload.name1}&params[0][value]=${payload.value1}&params[1][name]=${payload.name2}&params[1][value]=${payload.value2}`, config);
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

export const verifyCoinTransaction = createAsyncThunk<
    any,
    ICoinVerifyPayload,
    {rejectValue: IRequestError}
>(
    "COINS/VERIFY-USER", async (userPayload, thunkApi) => {
        try {
            const payload = {...userPayload};
            delete payload.currency;
            const config = {headers: {"Content-Type": "application/json"}};
            const res = await axiosRequest.post(`/currency/${userPayload.currency}/cl`, payload, config);
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

export const verifyPlatCoinTransaction = createAsyncThunk<
    any,
    ICoinVerifyPayload,
    {rejectValue: IRequestError}
>(
    "COINS/VERIFY-PLAT-USER", async (userPayload, thunkApi) => {
        try {
            const payload = {...userPayload};
            delete payload.currency;
            const config = {headers: {"Content-Type": "application/json"}};
            const res = await axiosRequest.post(`/coin/${userPayload.currency}/cl`, payload, config);
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

export const mintCoins = createAsyncThunk<
    any,
    IMintCoinPayload,
    {rejectValue: IRequestError}
>(
    "COINS/MINT", async (userPayload, thunkApi) => {
        try {
            const payload = {...userPayload};
            delete payload.currency;
            const config = {headers: {"Content-Type": "application/json"}};
            const res = await axiosRequest.post(`/currency/${userPayload.currency}/ad`, payload, config);
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

export const mintPlatformCoins = createAsyncThunk<
    any,
    IMintCoinPayload,
    {rejectValue: IRequestError}
>(
    "COINS/MINT-PLATFORM-COIN", async (userPayload, thunkApi) => {
        try {
            const payload = {...userPayload};
            delete payload.currency;
            const config = {headers: {"Content-Type": "application/json"}};
            const res = await axiosRequest.post(`/coin/${userPayload.currency}/ad`, payload, config);
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

export const getCoinExchangeRates = createAsyncThunk<
    ICoinsRates,
    string,
    {rejectValue: IRequestError}
>(
    "COINS/RATES", async (currency, thunkApi) => {
        try {
            const config = {headers: {"Content-Type": "application/json"}};
            const res = await axiosRequest.get(`/currency/${currency}?op=getexchangerate`, config);
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

const coinSlice = createSlice({
    name: 'coins',
    initialState: {
        coinTransactionStatus: 'idle',
        calculating: 'idle',
        verifying: 'idle',
        minting: 'idle',
        rateStatus: 'idle',
        coinTransactions: [],
        rates: null,
        coinFee: null,
        coinResult: null,
        error: null
    } as TCoinState,
    reducers: {},
    extraReducers: (builder) => {
        //@: currency transactions reducer
        builder.addCase(getCoinsTransaction.pending, (state, _) => {
            state.coinTransactionStatus = 'pending';
            state.error = '';
        })
        builder.addCase(getCoinsTransaction.fulfilled, (state, {payload}) => {
            state.coinTransactions = payload
            state.coinTransactionStatus = 'succeeded';
        })
        builder.addCase(getCoinsTransaction.rejected, (state, {payload, error}) => {
            state.coinTransactionStatus = 'failed';
            state.coinTransactions = [];

            if(payload?.message){
                state.error = payload.message;
                message.error(payload.message);
            }else{
                state.error = error.message;
                message.error(error.message)
            }
        })

        //@: calculate coin fee reducer
        builder.addCase(calculateCoinFee.pending, (state, _) => {
            state.calculating = 'pending';
            state.error = '';
        })
        builder.addCase(calculateCoinFee.fulfilled, (state, {payload}) => {
            state.coinFee = payload
            state.calculating = 'succeeded';
        })
        builder.addCase(calculateCoinFee.rejected, (state, {payload, error}) => {
            state.calculating = 'failed';
            state.coinFee = null;

            if(payload?.message){
                state.error = payload.message;
                message.error(payload.message);
            }else{
                state.error = error.message;
                message.error(error.message)
            }
        })

        //@: calculate platform coin fee reducer
        builder.addCase(calculatePlatCoinFee.pending, (state, _) => {
            state.calculating = 'pending';
            state.error = '';
        })
        builder.addCase(calculatePlatCoinFee.fulfilled, (state, {payload}) => {
            state.coinFee = payload
            state.calculating = 'succeeded';
        })
        builder.addCase(calculatePlatCoinFee.rejected, (state, {payload, error}) => {
            state.calculating = 'failed';
            state.coinFee = null;

            if(payload?.message){
                state.error = payload.message;
                message.error(payload.message);
            }else{
                state.error = error.message;
                message.error(error.message)
            }
        })

        //@: calculate buy coin fee reducer
        builder.addCase(calculateBuyCoinResult.pending, (state, _) => {
            state.calculating = 'pending';
            state.error = '';
        })
        builder.addCase(calculateBuyCoinResult.fulfilled, (state, {payload}) => {
            state.coinResult = payload
            state.calculating = 'succeeded';
        })
        builder.addCase(calculateBuyCoinResult.rejected, (state, {payload, error}) => {
            state.calculating = 'failed';
            state.coinResult = null;

            if(payload?.message){
                state.error = payload.message;
                message.error(payload.message);
            }else{
                state.error = error.message;
                message.error(error.message)
            }
        })

        //@: calculate buy plat coin result reducer
        builder.addCase(calculateBuyPlatCoinResult.pending, (state, _) => {
            state.calculating = 'pending';
            state.error = '';
        })
        builder.addCase(calculateBuyPlatCoinResult.fulfilled, (state, {payload}) => {
            state.coinResult = payload
            state.calculating = 'succeeded';
        })
        builder.addCase(calculateBuyPlatCoinResult.rejected, (state, {payload, error}) => {
            state.calculating = 'failed';
            state.coinResult = null;

            if(payload?.message){
                state.error = payload.message;
                message.error(payload.message);
            }else{
                state.error = error.message;
                message.error(error.message)
            }
        })

        //@: verify coin fee reducer
        builder.addCase(verifyCoinTransaction.pending, (state, _) => {
            state.verifying = 'pending';
            state.error = '';
        })
        builder.addCase(verifyCoinTransaction.fulfilled, (state, _) => {
            state.verifying = 'succeeded';
        })
        builder.addCase(verifyCoinTransaction.rejected, (state, {payload, error}) => {
            state.verifying = 'failed';

            if(payload?.message){
                state.error = payload.message;
                message.error(payload.message);
            }else{
                state.error = error.message;
                message.error(error.message)
            }
        })

        //@: verify platform coin fee reducer
        builder.addCase(verifyPlatCoinTransaction.pending, (state, _) => {
            state.verifying = 'pending';
            state.error = '';
        })
        builder.addCase(verifyPlatCoinTransaction.fulfilled, (state, _) => {
            state.verifying = 'succeeded';
        })
        builder.addCase(verifyPlatCoinTransaction.rejected, (state, {payload, error}) => {
            state.verifying = 'failed';

            if(payload?.message){
                state.error = payload.message;
                message.error(payload.message);
            }else{
                state.error = error.message;
                message.error(error.message)
            }
        })

        //@: coin mint reducer
        builder.addCase(mintCoins.pending, (state, _) => {
            state.minting = 'pending';
            state.error = '';
        })
        builder.addCase(mintCoins.fulfilled, (state, _) => {
            state.minting = 'succeeded';
        })
        builder.addCase(mintCoins.rejected, (state, {payload, error}) => {
            state.minting = 'failed';

            if(payload?.message){
                state.error = payload.message;
                message.error(payload.message);
            }else{
                state.error = error.message;
                message.error(error.message)
            }
        });

        //@: mint platform coins reducer
        builder.addCase(mintPlatformCoins.pending, (state, _) => {
            state.minting = 'pending';
            state.error = '';
        })
        builder.addCase(mintPlatformCoins.fulfilled, (state, _) => {
            state.minting = 'succeeded';
        })
        builder.addCase(mintPlatformCoins.rejected, (state, {payload, error}) => {
            state.minting = 'failed';

            if(payload?.message){
                state.error = payload.message;
                message.error(payload.message);
            }else{
                state.error = error.message;
                message.error(error.message)
            }
        });

        //@: coin exchange rate reducer
        builder.addCase(getCoinExchangeRates.pending, (state, _) => {
            state.rateStatus = 'pending';
            state.error = '';
        })
        builder.addCase(getCoinExchangeRates.fulfilled, (state, {payload}) => {
            state.rateStatus = 'succeeded';
            state.rates = payload
        })
        builder.addCase(getCoinExchangeRates.rejected, (state, {payload, error}) => {
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
    },
});

export default coinSlice.reducer;