/** Layers a translucent fill over a base background, so the base shows through the fill */
export function layerFill(fill: string, base: string): string {
	return `linear-gradient(${fill}, ${fill}), ${base}`
}
