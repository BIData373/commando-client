import createCache from "@emotion/cache"
import logicalPropsMiddleware from "@rocket.chat/stylis-logical-props-middleware"

// Emits physical fallbacks only for logical properties the browser lacks (Chrome < 87)
export const emotionCache = createCache({
	key: "css",
	stylisPlugins: [logicalPropsMiddleware],
})
