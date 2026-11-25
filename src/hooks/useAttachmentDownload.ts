import { useState } from "react"
import type { SourceAttachmentDto } from "../api/model"
import { getSourceAttachmentSignedUrl } from "../api/source-attachment/source-attachment"
import { downloadFromUrl } from "../functions/download-utils"

export function useAttachmentDownload() {
	const [isDownloading, setIsDownloading] = useState(false)

	async function download(
		attachment?: Pick<SourceAttachmentDto, "id" | "name"> | null,
	) {
		if (!attachment || isDownloading) {
			return
		}

		setIsDownloading(true)

		try {
			const { url } = await getSourceAttachmentSignedUrl({ id: attachment.id })

			if (url) {
				await downloadFromUrl(url, attachment.name)
			}
		} catch (error) {
			console.error("Failed to download attachment", error)
		} finally {
			setIsDownloading(false)
		}
	}

	return { isDownloading, download }
}
