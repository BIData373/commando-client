export const IS_DEV = import.meta.env.VITE_ENVIRONMENT === "development"

export const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API === "true"
export const USE_SSO = import.meta.env.VITE_USE_SSO === "true"

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
export const API_PREFIX = import.meta.env.VITE_API_PREFIX ?? ""
export const MESIBA_BASE_API_URL = import.meta.env.VITE_MESIBA_BASE_URL_API

export const CHAT_LINK = import.meta.env.VITE_CHAT_LINK

export const STATIC_TOKEN = import.meta.env.VITE_STATIC_TOKEN
export const IS_BI = (import.meta.env.VITE_IS_BI ?? "true") === "true"
export const MATOMO_ENABLED = import.meta.env.VITE_MATOMO_ENABLED === "true"
export const REQUEST_USERNAME = import.meta.env.VITE_REQUEST_USERNAME

export const MESIBA_S3_URL = import.meta.env.VITE_MESIBA_S3_URL

export const AUTH_SERVER_URL = import.meta.env.VITE_SSO_URL ?? ""
