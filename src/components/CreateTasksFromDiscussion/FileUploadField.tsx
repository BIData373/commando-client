import styled from "@emotion/styled"
import { FileText, Inbox, Trash2 } from "lucide-react"
import { useRef, useState } from "react"

// ─── Types ──────────────────────────────────────────────────────────────────

interface FileUploadFieldProps {
	file: File | null;
	hasExistingFile?: boolean;
	existingFileName?: string;
	onFileChange: (file: File | null) => void;
}

// ─── Constants ──────────────────────────────────────────────────────────────

const ALLOWED_EXTENSIONS = [".pdf", ".doc", ".docx"]
const ALLOWED_MIME_TYPES = [
	"application/pdf",
	"application/msword",
	"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]
const MAX_FILE_SIZE = 30 * 1024 * 1024

// ─── Component ──────────────────────────────────────────────────────────────

function FileUploadField({ file, hasExistingFile, existingFileName, onFileChange }: FileUploadFieldProps) {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [isDragOver, setIsDragOver] = useState(false);
	const [fileError, setFileError] = useState("");
	const [existingFileRemoved, setExistingFileRemoved] = useState(false);

	const showExistingFile = hasExistingFile && !file && !existingFileRemoved;

	function validateFile(f: File): string | null {
		const ext = "." + f.name.split(".").pop()?.toLowerCase()
		if (
			!ALLOWED_EXTENSIONS.includes(ext) &&
			!ALLOWED_MIME_TYPES.includes(f.type)
		) {
			return "ניתן להעלות קבצי Word או PDF בלבד"
		}
		if (f.size > MAX_FILE_SIZE) {
			return "גודל הקובץ חורג מ-30MB"
		}
		return null
	}

	function handleFileSelect(f: File) {
		const error = validateFile(f)
		if (error) {
			setFileError(error)
			return
		}
		setFileError("")
		onFileChange(f)
	}

	function handleFileInputChange(e: React.ChangeEvent<HTMLInputElement>) {
		const f = e.target.files?.[0]
		if (f) handleFileSelect(f)
		e.target.value = ""
	}

	function handleDragOver(e: React.DragEvent) {
		e.preventDefault()
		setIsDragOver(true)
	}

	function handleDragLeave(e: React.DragEvent) {
		e.preventDefault()
		setIsDragOver(false)
	}

	function handleDrop(e: React.DragEvent) {
		e.preventDefault()
		setIsDragOver(false)
		const f = e.dataTransfer.files[0]
		if (f) handleFileSelect(f)
	}

	function handleUploadClick() {
		fileInputRef.current?.click()
	}

	function handleRemoveFile() {
		onFileChange(null);
		setExistingFileRemoved(true);
		setFileError("");
	}

	return (
		<FileUploadSection>
			<FormLabelRow>
				<LabelText>קובץ סיכום דיון</LabelText>
			</FormLabelRow>
			{file ? (
				<FilePreview>
					<FileRemoveButton onClick={handleRemoveFile}>
						<Trash2 size={22} />
					</FileRemoveButton>
					<FileName>{file.name}</FileName>
					<FileThumbnail>
						<FileText size={24} />
					</FileThumbnail>
				</FilePreview>
			) : showExistingFile ? (
				<FilePreview>
					<FileRemoveButton onClick={handleRemoveFile}>
						<Trash2 size={22} />
					</FileRemoveButton>
					<FileName>{existingFileName ?? "קובץ מצורף"}</FileName>
					<FileThumbnail>
						<FileText size={24} />
					</FileThumbnail>
				</FilePreview>
			) : (
				<UploadDropZone
					$isDragOver={isDragOver}
					onClick={handleUploadClick}
					onDragOver={handleDragOver}
					onDragLeave={handleDragLeave}
					onDrop={handleDrop}
				>
					<IconInbox size={48} strokeWidth={1} />
					<UploadTextsWrapper>
						<UploadMainText>
							לחץ או גרור את הקובץ לאזור זה כדי להעלות
						</UploadMainText>
						<UploadHintText>
							ניתן להעלות קבצי Word או PDF בלבד, עד גודל מקסימלי של 30MB לקובץ.
						</UploadHintText>
					</UploadTextsWrapper>
				</UploadDropZone>
			)}
			{fileError && <FileErrorText>{fileError}</FileErrorText>}
			<HiddenFileInput
				ref={fileInputRef}
				type="file"
				accept=".pdf,.doc,.docx"
				onChange={handleFileInputChange}
			/>
		</FileUploadSection>
	)
}

export default FileUploadField

// ─── Styled ─────────────────────────────────────────────────────────────────

const FileUploadSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  width: 100%;
`

const FormLabelRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-block-end: 8px;
  width: 100%;
`

const LabelText = styled.span`
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  color: var(--text-color-2);
  white-space: nowrap;
`

const UploadDropZone = styled.div<{ $isDragOver: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  width: 100%;
  padding: 16px;
  background: ${({ $isDragOver }) => ($isDragOver ? "rgba(5, 145, 255, 0.04)" : "var(--card-background)")};
  border: 1px dashed ${({ $isDragOver }) => ($isDragOver ? "var(--button-color-hover)" : "var(--card-border)")};
  border-radius: 8px;
  cursor: pointer;
  transition: border-color 200ms ease, background 200ms ease;
  color: rgba(0, 0, 0, 0.45);

  &:hover {
    border-color: var(--button-color-hover);
  }
`

const IconInbox = styled(Inbox)`
  color: #6866FF;
  flex-shrink: 0;
`

const UploadTextsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
`

const UploadMainText = styled.p`
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  color: var(--text-color-2);
  text-align: center;
  margin: 0;
`

const UploadHintText = styled.p`
  direction: rtl;
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  color: rgba(0, 0, 0, 0.45);
  text-align: center;
  margin: 0;
`

const FilePreview = styled.div`
  direction: ltr;
  display: flex;
  align-items: center;
  width: 100%;
  padding: 8px;
  border: 1px solid var(--card-border);
  border-radius: 8px;
`

const FileThumbnail = styled.div`
  width: 48px;
  height: 48px;
  border: 1px solid var(--line);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: rgba(0, 0, 0, 0.25);
`

const FileName = styled.span`
  direction: rtl;
  flex: 1;
  min-width: 0;
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  color: var(--Components-Upload-Global-colorPrimary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: start;
  padding-inline: 8px;
`

const FileRemoveButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border: none;
  background: transparent;
  cursor: pointer;
  color: rgba(0, 0, 0, 0.45);
  padding: 0;
  flex-shrink: 0;

  &:hover {
    color: var(--text-color-2);
  }
`

const FileErrorText = styled.span`
  direction: rtl;
  font-size: 14px;
  line-height: 22px;
  color: #ff4d4f;
  margin-block-start: 4px;
`

const HiddenFileInput = styled.input`
  display: none;
`
