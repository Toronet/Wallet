export interface ICoinsTransaction{
    EV_Contract: string;
    EV_Event: string;
    EV_Fee: number;
    EV_Hash: string;
    EV_Time: string;
    EV_To: string;
    EV_Value: number;
    EV_Value2: number;
}

export interface ICoinsRates{
    exchangerate: string;
    message: string;
    result: boolean;
}

export interface ICoinFee{
    fee: string;
    message: string;
    result: boolean;
}

export interface ICoinFeePayload{
    op: string;
    currency: string;
    name1: string;
    value1: string;
    name2: string;
    value2: string;
}

export interface ICoinFeeResult{
    amount: string;
    message: string;
    result: boolean;
}

export interface ICoinVerifyPayload{
    op: string;
    currency?: string;
    params: {
        name: string;
        value: string;
    }[]
}

export interface IMintCoinPayload{
    op: string;
    currency?: string;
    params: {
        name: string;
        value: string;
    }[]
}

export type TCoinState = {
    coinTransactionStatus: "idle" | "pending" | "succeeded" | "failed";
    calculating: "idle" | "pending" | "succeeded" | "failed";
    verifying: "idle" | "pending" | "succeeded" | "failed";
    minting: "idle" | "pending" | "succeeded" | "failed";
    rateStatus: "idle" | "pending" | "succeeded" | "failed";
    rates: ICoinsRates | null;
    coinTransactions: ICoinsTransaction[];
    coinFee: ICoinFee | null;
    coinResult: ICoinFeeResult | null;
    error: any;
}

export interface IRequestError{
    message: string;
    statusCode: number;
}