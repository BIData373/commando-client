import { useState } from "react"
import { getAttachmentSignedUrl } from "../api/s3/s3"
import { downloadFromUrl } from "../functions/download-utils"

export function useAttachmentDownload() {
	const [isDownloading, setIsDownloading] = useState(false)

	async function download(key?: string | null, filename?: string | null) {
		if (!key || !filename || isDownloading) {
			return
		}

		setIsDownloading(true)

		try {
			const { url } = await getAttachmentSignedUrl({ key, filename })

			if (url) {
				await downloadFromUrl(url, filename)
			}
		} catch (error) {
			console.error("Failed to download attachment", error)
		} finally {
			setIsDownloading(false)
		}
	}

	return { isDownloading, download }
}
