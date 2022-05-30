export interface IBalances{
    bal_dollar: string;
    bal_egp: string;
    bal_espees: string;
    bal_eth: string;
    bal_euro: string;
    bal_ksh: string;
    bal_naira: string;
    bal_plast: string;
    bal_pound: string;
    bal_toro: string;
    bal_zar: string;
};

export interface IExchangeRates{
    rate_dollar: string;
    rate_egp: string;
    rate_espees: string;
    rate_eth: string;
    rate_euro: string;
    rate_ksh: string;
    rate_naira: string;
    rate_plast: string;
    rate_pound: string;
    rate_zar: string;
}

export interface IBalance{
    balance: string;
    message: string;
    result: boolean;
}

export type TBalanceState = {
    balancesStatus: "idle" | "pending" | "succeeded" | "failed";
    balanceStatus: "idle" | "pending" | "succeeded" | "failed";
    rateStatus: "idle" | "pending" | "succeeded" | "failed";
    currencyStatus: "idle" | "pending" | "succeeded" | "failed";
    cryptoStatus: "idle" | "pending" | "succeeded" | "failed";
    balances: IBalances | null;
    balance: IBalance | null;
    currBalance: IBalance | null;
    cryptoBalance: IBalance | null;
    rates: IExchangeRates | null;
    error: any;
}

export interface IRequestError{
    message: string;
    statusCode: number;
}