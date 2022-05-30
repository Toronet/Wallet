export interface ITransaction{
    EV_Contract: string;
    EV_Event: string;
    EV_Fee: number;
    EV_Hash: string;
    EV_Time: string;
    EV_To: string;
    EV_Value: number;
    EV_Value2: number;
}

export interface ITransactionFee{
    fee: string;
    message: string;
    result: boolean;
}

export interface ITransactionFeePayload{
    op: string;
    currency: string;
    name1: string;
    value1: string;
    name2: string;
    value2: string;
}

export interface ITransactionResult{
    amount: string;
    message: string;
    result: boolean;
}

export interface IVerifyTransactionPayload{
    op: string;
    params: {
        name: string;
        value: string;
    }[]
}

export interface IVerifyExTransactionPayload{
    currency?: string;
    op: string;
    params: {
        name: string;
        value: string;
    }[]
}

export interface IMintToroPayload{
    op: string;
    params: {
        name: string;
        value: string;
    }[]
}

export type TTransactionState = {
    transactionStatus: "idle" | "pending" | "succeeded" | "failed";
    calculating: "idle" | "pending" | "succeeded" | "failed";
    verifying: "idle" | "pending" | "succeeded" | "failed";
    minting: "idle" | "pending" | "succeeded" | "failed";
    transactions: ITransaction[];
    calcFee: ITransactionFee | null,
    calcResult: ITransactionResult | null,
    error: any;
}

export interface IRequestError{
    message: string;
    statusCode: number;
}