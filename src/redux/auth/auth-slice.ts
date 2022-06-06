import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {message} from 'antd';
import {AxiosError} from 'axios';
import ls from 'localstorage-slim';

import {axiosRequest} from '../../helpers/request';
import {IAuthUser, IAuthUserPayload, TAuthState, IRequestError} from './auth-slice-types';

const key:string = '@toronet-user';

export const loginUser = createAsyncThunk<
    IAuthUser,
    {op: string; name: string; value: string;},
    {rejectValue: IRequestError}
>(
    "AUTH/LOGIN", async (payload, thunkApi) => {
        try {
            const config = {headers: {"Content-Type": "application/json"}};
            const res = await axiosRequest.get(`/util?op=${payload.op}&params[0][name]=${payload.name}&params[0][value]=${payload.value}`, config);
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

export const verifyUser = createAsyncThunk<
    IAuthUser,
    {name: string; value: string; name2: string; value2: string;},
    {rejectValue: IRequestError}
>(
    "AUTH/VERIFY-USER", async (payload, thunkApi) => {
        try {
            const config = {headers: {"Content-Type": "application/json"}};
            const res = await axiosRequest.get(`/keystore?op=verifykey&params[0][name]=${payload.name}&params[0][value]=${payload.value}&params[1][name]=${payload.name2}&params[1][value]=${payload.value2}`, config);
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

export const registerUser = createAsyncThunk<
    {address: string; message: string; result: boolean;},
    IAuthUserPayload,
    {rejectValue: IRequestError}
>(
    "AUTH/REGISTER", async (userInfo, thunkApi) => {
        try {
            const config = {headers: {"Content-Type": "application/json"}};
            const res = await axiosRequest.post(`/keystore`, userInfo, config);
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

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        status: 'idle',
        verifying: 'idle',
        registering: 'idle',
        user: ls.get(key, {decrypt: true}),
        error: null
    } as TAuthState,
    reducers: {
        saveUserData: (state, {payload}) => {
            state.user = payload;
            ls.set(key, payload, {encrypt: true});
        },
        logoutUser: (state) => {
            state.user = null;
            ls.remove(key);
        }
    },
    extraReducers: (builder) => {
        //@: login user
        builder.addCase(loginUser.pending, (state, _) => {
            state.status = 'pending';
            state.error = '';
        })
        builder.addCase(loginUser.fulfilled, (state, _) => {
            //state.user = payload
            state.status = 'succeeded';
        })
        builder.addCase(loginUser.rejected, (state, {payload, error}) => {
            state.status = 'failed';
            state.user = null;

            if(payload?.message){
                state.error = payload.message;
                message.error(payload.message);
            }else{
                state.error = error.message;
                message.error(error.message)
            }
        })

        //@: register user
        builder.addCase(registerUser.pending, (state, _) => {
            state.registering = 'pending';
            state.error = '';
        })
        builder.addCase(registerUser.fulfilled, (state, _) => {
            state.registering = 'succeeded';
        })
        builder.addCase(registerUser.rejected, (state, {payload, error}) => {
            state.registering = 'failed';
            
            if(payload?.errors){
                state.error = payload.errors;
            }
            else if(payload?.message){
                state.error = payload.message;
                message.error(payload.message);
            }
            else{
                state.error = error.message;
                message.error(error.message)
            }
        })

        //@: verify user
        builder.addCase(verifyUser.pending, (state, _) => {
            state.verifying = 'pending';
            state.error = '';
        })
        builder.addCase(verifyUser.fulfilled, (state, {payload}) => {
            state.verifying = 'succeeded';
        })
        builder.addCase(verifyUser.rejected, (state, {payload, error}) => {
            state.verifying = 'failed';
            
            if(payload?.errors){
                state.error = payload.errors;
            }
            else if(payload?.message){
                state.error = payload.message;
                message.error(payload.message);
            }
            else{
                state.error = error.message;
                message.error(error.message)
            }
        })
    },
});

export const {logoutUser, saveUserData} = authSlice.actions;

export default authSlice.reducer;