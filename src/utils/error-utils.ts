export enum ErrorCode {
    BAD_REQUEST = 400,
    UNAUTHORIZED = 403,
    NOT_FOUND = 404,
    SERVER_ERROR = 500,
}

export const isErrorCode = (code: number) => Object.values(ErrorCode).includes(code)