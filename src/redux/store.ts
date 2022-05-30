import {configureStore} from '@reduxjs/toolkit';

import authReducer from './auth/auth-slice';
import coinReducer from './coins/coins-slice';
import cryptoReducer from './crypto/crypto-slice';
import balanceReducer from './balances/balance-slice';
import transactionsReducer from './transactions/transactions-slice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        coins: coinReducer,
        crypto: cryptoReducer,
        balances: balanceReducer,
        transactions: transactionsReducer,
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;