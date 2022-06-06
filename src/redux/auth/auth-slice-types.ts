export interface IAuthUser{
    addr: string;
}

export interface IAuthUserPayload{
    op: string;
    params: {name: string; value: string;}[]
}

export type TAuthState = {
    status: "idle" | "pending" | "succeeded" | "failed";
    verifying: "idle" | "pending" | "succeeded" | "failed";
    registering: "idle" | "pending" | "succeeded" | "failed";
    user: IAuthUser | null;
    error: any;
}

export interface IRequestError{
    errors: any;
    message: string;
    statusCode: number;
}