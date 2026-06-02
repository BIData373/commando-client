const ERROR_CODES = [400, 403, 404, 500];

export const isErrorCode = (code: number) => ERROR_CODES.includes(code)