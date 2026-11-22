import createCache from "@emotion/cache"
import logicalPropsMiddleware from "@rocket.chat/stylis-logical-props-middleware"
import { flexGapMiddleware } from "./flex-gap"

// Emotion runs at runtime, so build tools never see its CSS. These middlewares add
// fallbacks for Chrome 83 and pass everything through in browsers that support it.
export const emotionCache = createCache({
	key: "css",
	stylisPlugins: [flexGapMiddleware, logicalPropsMiddleware],
})
