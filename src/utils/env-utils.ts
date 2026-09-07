export const IS_DEV = import.meta.env.VITE_ENVIRONMENT === "development"

export const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API === "true"
export const USE_SSO = import.meta.env.VITE_USE_SSO === "true"

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
export const API_PREFIX = import.meta.env.VITE_API_PREFIX ?? ""
export const MESIBA_BASE_API_URL = import.meta.env.VITE_MESIBA_BASE_URL_API

export const CHAT_URL = import.meta.env.VITE_CHAT_URL
export const CHAT_SUPPORT_PATH = import.meta.env.VITE_CHAT_SUPPORT_PATH
export const CHAT_CHANNEL_URL =
	CHAT_URL && CHAT_SUPPORT_PATH && new URL(CHAT_SUPPORT_PATH, CHAT_URL)

export const USER_GUIDE_URL = import.meta.env.VITE_USER_GUIDE_URL
export const PORTAL_CATALOG_URL = import.meta.env.VITE_PORTAL_CATALOG_URL

export const STATIC_TOKEN = import.meta.env.VITE_STATIC_TOKEN

export const MESIBA_S3_URL = import.meta.env.VITE_MESIBA_S3_URL

export const AUTH_SERVER_URL = import.meta.env.VITE_SSO_URL ?? ""

export const MATOMO_ENABLED = import.meta.env.VITE_MATOMO_ENABLED === "true"
export const MATOMO_SITE_ID = import.meta.env.VITE_MATOMO_SITE_ID

export const AI_ENABLED = import.meta.env.VITE_AI_ENABLED === "true"

export const SOCKET_ENABLED = import.meta.env.VITE_SOCKET_ENABLED === "true"
