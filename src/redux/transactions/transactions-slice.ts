import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {message} from 'antd';
import {AxiosError} from 'axios';

import {axiosRequest} from '../../helpers/request';
import {ITransaction, ITransactionFee, ITransactionFeePayload, ITransactionResult, IVerifyTransactionPayload, IVerifyExTransactionPayload, IMintToroPayload, TTransactionState, IRequestError} from './transactions-slice-types';

export const getAddrTransactions = createAsyncThunk<
    ITransaction[],
    {op:string; name1: string; value1: string; name2: string; value2: string;},
    {rejectValue: IRequestError}
>(
    "TRANSACTIONS/ADDRESS", async (payload, thunkApi) => {
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

export const getToroAddrTransactions = createAsyncThunk<
    ITransaction[],
    {name1: string; value1: string; name2: string; value2: string;},
    {rejectValue: IRequestError}
>(
    "TRANSACTIONS/TORO", async (payload, thunkApi) => {
        try {
            const config = {headers: {"Content-Type": "application/json"}};
            const res = await axiosRequest.get(`/query?op=getaddrtransactions_toro&params[0][name]=${payload.name1}&params[0][value]=${payload.value1}&params[1][name]=${payload.name2}&params[1][value]=${payload.value2}`, config);
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

export const calculateToroFee = createAsyncThunk<
    ITransactionFee,
    {name1: string; value1: string; name2: string; value2: string;},
    {rejectValue: IRequestError}
>(
    "TRANSACTIONS/TORO-FEE", async (payload, thunkApi) => {
        try {
            const config = {headers: {"Content-Type": "application/json"}};
            const res = await axiosRequest.get(`/token/toro/cl?op=calculatetxfee&params[0][name]=${payload.name1}&params[0][value]=${payload.value1}&params[1][name]=${payload.name2}&params[1][value]=${payload.value2}`, config);
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

export const calculateFee = createAsyncThunk<
    ITransactionFee,
    ITransactionFeePayload,
    {rejectValue: IRequestError}
>(
    "TRANSACTION/FEE", async (payload, thunkApi) => {
        try {
            const config = {headers: {"Content-Type": "application/json"}};
            const res = await axiosRequest.get(`/currency/${payload.currency}/cl?op=calculatebuyfee&params[0][name]=${payload.name1}&params[0][value]=${payload.value1}&params[1][name]=${payload.name2}&params[1][value]=${payload.value2}`, config);
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

export const calculateFeeResult = createAsyncThunk<
    ITransactionResult,
    ITransactionFeePayload,
    {rejectValue: IRequestError}
>(
    "TRANSACTION/RESULT", async (payload, thunkApi) => {
        try {
            const config = {headers: {"Content-Type": "application/json"}};
            const res = await axiosRequest.get(`/currency/${payload.currency}/cl?op=calculatebuyresult&params[0][name]=${payload.name1}&params[0][value]=${payload.value1}&params[1][name]=${payload.name2}&params[1][value]=${payload.value2}`, config);
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

export const verifyToroTransaction = createAsyncThunk<
    any,
    IVerifyTransactionPayload,
    {rejectValue: IRequestError}
>(
    "TRANSACTIONS/VERIFY-TORO", async (payload, thunkApi) => {
        try {
            const config = {headers: {"Content-Type": "application/json"}};
            const res = await axiosRequest.post(`/token/toro/cl`, payload, config);
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

export const verifyExTransaction = createAsyncThunk<
    any,
    IVerifyExTransactionPayload,
    {rejectValue: IRequestError}
>(
    "TRANSACTIONS/VERIFY-EXCHANGE", async (userPayload, thunkApi) => {
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

export const mintToro = createAsyncThunk<
    any,
    IMintToroPayload,
    {rejectValue: IRequestError}
>(
    "TRANSACTIONS/MINT-TORO", async (payload, thunkApi) => {
        try {
            const config = {headers: {"Content-Type": "application/json"}};
            const res = await axiosRequest.post(`/token/toro/ad`, payload, config);
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

const transactionSlice = createSlice({
    name: 'transactions',
    initialState: {
        transactionStatus: 'idle',
        calculating: 'idle',
        verifying: 'idle',
        minting: 'idle',
        transactions: [],
        calcFee: null,
        calcResult: null,
        error: null
    } as TTransactionState,
    reducers: {},
    extraReducers: (builder) => {
        //@: transactions reducer
        builder.addCase(getAddrTransactions.pending, (state, _) => {
            state.transactionStatus = 'pending';
            state.error = '';
        })
        builder.addCase(getAddrTransactions.fulfilled, (state, {payload}) => {
            state.transactions = payload
            state.transactionStatus = 'succeeded';
        })
        builder.addCase(getAddrTransactions.rejected, (state, {payload, error}) => {
            state.transactionStatus = 'failed';
            state.transactions = [];

            if(payload?.message){
                state.error = payload.message;
                message.error(payload.message);
            }else{
                state.error = error.message;
                message.error(error.message)
            }
        })

        //@: TORO transactions reducer
        builder.addCase(getToroAddrTransactions.pending, (state, _) => {
            state.transactionStatus = 'pending';
            state.error = '';
        })
        builder.addCase(getToroAddrTransactions.fulfilled, (state, {payload}) => {
            state.transactions = payload
            state.transactionStatus = 'succeeded';
        })
        builder.addCase(getToroAddrTransactions.rejected, (state, {payload, error}) => {
            state.transactionStatus = 'failed';
            state.transactions = [];

            if(payload?.message){
                state.error = payload.message;
                message.error(payload.message);
            }else{
                state.error = error.message;
                message.error(error.message)
            }
        })

        //@: transactions toro fee reducer
        builder.addCase(calculateToroFee.pending, (state, _) => {
            state.calculating = 'pending';
            state.error = '';
        })
        builder.addCase(calculateToroFee.fulfilled, (state, {payload}) => {
            state.calcFee = payload
            state.calculating = 'succeeded';
        })
        builder.addCase(calculateToroFee.rejected, (state, {payload, error}) => {
            state.calculating = 'failed';
            state.calcFee = null;

            if(payload?.message){
                state.error = payload.message;
                message.error(payload.message);
            }else{
                state.error = error.message;
                message.error(error.message)
            }
        })

        //@: transactions buy fee reducer
        builder.addCase(calculateFee.pending, (state, _) => {
            state.calculating = 'pending';
            state.error = '';
        })
        builder.addCase(calculateFee.fulfilled, (state, {payload}) => {
            state.calcFee = payload
            state.calculating = 'succeeded';
        })
        builder.addCase(calculateFee.rejected, (state, {payload, error}) => {
            state.calculating = 'failed';
            state.calcFee = null;

            if(payload?.message){
                state.error = payload.message;
                message.error(payload.message);
            }else{
                state.error = error.message;
                message.error(error.message)
            }
        })

        //@: transactions buy result reducer
        builder.addCase(calculateFeeResult.pending, (state, _) => {
            state.calculating = 'pending';
            state.error = '';
        })
        builder.addCase(calculateFeeResult.fulfilled, (state, {payload}) => {
            state.calcResult = payload
            state.calculating = 'succeeded';
        })
        builder.addCase(calculateFeeResult.rejected, (state, {payload, error}) => {
            state.calculating = 'failed';
            state.calcResult = null;

            if(payload?.message){
                state.error = payload.message;
                message.error(payload.message);
            }else{
                state.error = error.message;
                message.error(error.message)
            }
        })

        //@: transactions verify toro reducer
        builder.addCase(verifyToroTransaction.pending, (state, _) => {
            state.verifying = 'pending';
            state.error = '';
        })
        builder.addCase(verifyToroTransaction.fulfilled, (state, _) => {
            state.verifying = 'succeeded';
        })
        builder.addCase(verifyToroTransaction.rejected, (state, {payload, error}) => {
            state.verifying = 'failed';

            if(payload?.message){
                state.error = payload.message;
                message.error(payload.message);
            }else{
                state.error = error.message;
                message.error(error.message)
            }
        })

        //@: transactions verify exchange reducer
        builder.addCase(verifyExTransaction.pending, (state, _) => {
            state.verifying = 'pending';
            state.error = '';
        })
        builder.addCase(verifyExTransaction.fulfilled, (state, _) => {
            state.verifying = 'succeeded';
        })
        builder.addCase(verifyExTransaction.rejected, (state, {payload, error}) => {
            state.verifying = 'failed';

            if(payload?.message){
                state.error = payload.message;
                message.error(payload.message);
            }else{
                state.error = error.message;
                message.error(error.message)
            }
        })

        //@: mint toro reducer
        builder.addCase(mintToro.pending, (state, _) => {
            state.minting = 'pending';
            state.error = '';
        })
        builder.addCase(mintToro.fulfilled, (state, _) => {
            state.minting = 'succeeded';
        })
        builder.addCase(mintToro.rejected, (state, {payload, error}) => {
            state.minting = 'failed';

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

export default transactionSlice.reducer;