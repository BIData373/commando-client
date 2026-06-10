export async function downloadFromUrl(url: string, filename: string) {
	const response = await fetch(url)
	const blob = await response.blob()
	const objectUrl = URL.createObjectURL(blob)
	const anchor = document.createElement("a")
	anchor.href = objectUrl
	anchor.download = filename
	document.body.appendChild(anchor)
	anchor.click()
	document.body.removeChild(anchor)
	setTimeout(() => URL.revokeObjectURL(objectUrl), 100)
}
