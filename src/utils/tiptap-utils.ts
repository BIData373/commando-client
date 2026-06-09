import Placeholder from "@tiptap/extension-placeholder"
import UnderlineExtension from "@tiptap/extension-underline"
import StarterKit from "@tiptap/starter-kit"

export const editorExtensions = {
	extensions: [
		StarterKit.configure({
			bulletList: false,
			blockquote: false,
			codeBlock: false,
			code: false,
			heading: false,
			horizontalRule: false,
			strike: false,
		}),
		UnderlineExtension,
		Placeholder.configure({
			placeholder: "הערות ודגשים",
		}),
	],
}
