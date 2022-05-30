import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {message} from 'antd';
import {AxiosError} from 'axios';

import {axiosRequest} from '../../helpers/request';
import {IBalances, IBalance, IExchangeRates, TBalanceState, IRequestError} from './balance-slice-types';

export const getBalances = createAsyncThunk<
    IBalances,
    {name: string; value: string;},
    {rejectValue: IRequestError}
>(
    "BALANCE/LIST", async (payload, thunkApi) => {
        try {
            const config = {headers: {"Content-Type": "application/json"}};
            const res = await axiosRequest.get(`/query?op=getaddrbalance&params[0][name]=${payload.name}&params[0][value]=${payload.value}`, config);
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

export const getToroBalance = createAsyncThunk<
    IBalance,
    {name: string; value: string;},
    {rejectValue: IRequestError}
>(
    "BALANCE/ITEM", async (payload, thunkApi) => {
        try {
            const config = {headers: {"Content-Type": "application/json"}};
            const res = await axiosRequest.get(`/token/toro?op=getbalance&params[0][name]=${payload.name}&params[0][value]=${payload.value}`, config);
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

export const getCurrencyBalance = createAsyncThunk<
    IBalance,
    {currency: string; address: string;},
    {rejectValue: IRequestError}
>(
    "BALANCE/CURRENCY", async (payload, thunkApi) => {
        try {
            const config = {headers: {"Content-Type": "application/json"}};
            const res = await axiosRequest.get(`/currency/${payload.currency}?op=getbalance&params[0][name]=addr&params[0][value]=${payload.address}`, config);
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

export const getCryptoBalance = createAsyncThunk<
    IBalance,
    {crypto: string; address: string;},
    {rejectValue: IRequestError}
>(
    "BALANCE/CRYPTO", async (payload, thunkApi) => {
        try {
            const config = {headers: {"Content-Type": "application/json"}};
            const res = await axiosRequest.get(`/crypto/${payload.crypto}?op=getbalance&params[0][name]=addr&params[0][value]=${payload.address}`, config);
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

export const getExchangeRates = createAsyncThunk<
    IExchangeRates,
    undefined,
    {rejectValue: IRequestError}
>(
    "BALANCE/RATES", async (_, thunkApi) => {
        try {
            const config = {headers: {"Content-Type": "application/json"}};
            const res = await axiosRequest.get(`/query?op=getexchangerates`, config);
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

const balanceSlice = createSlice({
    name: 'balances',
    initialState: {
        balancesStatus: 'idle',
        balanceStatus: 'idle',
        rateStatus: 'idle',
        currencyStatus: 'idle',
        cryptoStatus: 'idle',
        balances: null,
        balance: null,
        currBalance: null,
        cryptoBalance: null,
        rates: null,
        error: null
    } as TBalanceState,
    reducers: {},
    extraReducers: (builder) => {
        //@: balances reducer
        builder.addCase(getBalances.pending, (state, _) => {
            state.balancesStatus = 'pending';
            state.error = '';
        })
        builder.addCase(getBalances.fulfilled, (state, {payload}) => {
            state.balances = payload
            state.balancesStatus = 'succeeded';
        })
        builder.addCase(getBalances.rejected, (state, {payload, error}) => {
            state.balancesStatus = 'failed';
            state.balances = null;

            if(payload?.message){
                state.error = payload.message;
                message.error(payload.message);
            }else{
                state.error = error.message;
                message.error(error.message)
            }
        })

        //@: balance toro reducer
        builder.addCase(getToroBalance.pending, (state, _) => {
            state.balanceStatus = 'pending';
            state.error = '';
        })
        builder.addCase(getToroBalance.fulfilled, (state, {payload}) => {
            state.balance = payload
            state.balanceStatus = 'succeeded';
        })
        builder.addCase(getToroBalance.rejected, (state, {payload, error}) => {
            state.balanceStatus = 'failed';
            state.balance = null;

            if(payload?.message){
                state.error = payload.message;
                message.error(payload.message);
            }else{
                state.error = error.message;
                message.error(error.message)
            }
        })

        //@: currency balance reducer
        builder.addCase(getCurrencyBalance.pending, (state, _) => {
            state.currencyStatus = 'pending';
            state.error = '';
        })
        builder.addCase(getCurrencyBalance.fulfilled, (state, {payload}) => {
            state.currBalance = payload
            state.currencyStatus = 'succeeded';
        })
        builder.addCase(getCurrencyBalance.rejected, (state, {payload, error}) => {
            state.currencyStatus = 'failed';
            state.currBalance = null;

            if(payload?.message){
                state.error = payload.message;
                message.error(payload.message);
            }else{
                state.error = error.message;
                message.error(error.message)
            }
        })

        //@: crypto balance reducer
        builder.addCase(getCryptoBalance.pending, (state, _) => {
            state.cryptoStatus = 'pending';
            state.error = '';
        })
        builder.addCase(getCryptoBalance.fulfilled, (state, {payload}) => {
            state.cryptoBalance = payload
            state.cryptoStatus = 'succeeded';
        })
        builder.addCase(getCryptoBalance.rejected, (state, {payload, error}) => {
            state.cryptoStatus = 'failed';
            state.cryptoBalance = null;

            if(payload?.message){
                state.error = payload.message;
                message.error(payload.message);
            }else{
                state.error = error.message;
                message.error(error.message)
            }
        })

        //@: exchange rates reducer
        builder.addCase(getExchangeRates.pending, (state, _) => {
            state.rateStatus = 'pending';
            state.error = '';
        })
        builder.addCase(getExchangeRates.fulfilled, (state, {payload}) => {
            state.rates = payload
            state.rateStatus = 'succeeded';
        })
        builder.addCase(getExchangeRates.rejected, (state, {payload, error}) => {
            state.rateStatus = 'failed';
            state.rates = null;

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

export default balanceSlice.reducer;