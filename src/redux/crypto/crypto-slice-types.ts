export interface ICryptoTransaction{
    EV_Contract: string;
    EV_Event: string;
    EV_Fee: number;
    EV_Hash: string;
    EV_Time: string;
    EV_To: string;
    EV_Value: number;
    EV_Value2: number;
}

export interface ICryptoRates{
    exchangerate: string;
    message: string;
    result: boolean;
}

export interface ICryptoFee{
    fee: string;
    message: string;
    result: boolean;
}

export interface ICryptoFeePayload{
    op: string;
    crypto: string;
    name1: string;
    value1: string;
    name2: string;
    value2: string;
}

export interface ICryptoFeeResult{
    amount: string;
    message: string;
    result: boolean;
}

export interface ICryptoVerifyPayload{
    op: string;
    crypto?: string;
    params: {
        name: string;
        value: string;
    }[]
}

export interface IMintCryptoPayload{
    op: string;
    crypto?: string;
    params: {
        name: string;
        value: string;
    }[]
}

export type TCryptoState = {
    cryptoTransactionStatus: "idle" | "pending" | "succeeded" | "failed";
    linkedAddrStatus: "idle" | "pending" | "succeeded" | "failed";
    calculating: "idle" | "pending" | "succeeded" | "failed";
    verifying: "idle" | "pending" | "succeeded" | "failed";
    minting: "idle" | "pending" | "succeeded" | "failed";
    rateStatus: "idle" | "pending" | "succeeded" | "failed";
    rates: ICryptoRates | null;
    linkedAddrs: any;
    cryptoTransactions: ICryptoTransaction[];
    cryptoFee: ICryptoFee | null;
    cryptoResult: ICryptoFeeResult | null;
    error: any;
}

export interface IRequestError{
    message: string;
    statusCode: number;
}