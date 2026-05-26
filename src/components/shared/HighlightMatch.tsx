import styled from "@emotion/styled";

interface HighlightMatchProps {
	text: string;
	query: string;
	variant?: "mark" | "bold";
}

const HighlightMatch = ({
	text,
	query,
	variant = "bold",
}: HighlightMatchProps) => {
	const index = text.indexOf(query);
	if (!query || index === -1) return <>{text}</>;

	const Highlight = variant === "mark" ? HighlightMark : HighlightBold;

	return (
		<>
			{text.slice(0, index)}
			<Highlight>{text.slice(index, index + query.length)}</Highlight>
			{text.slice(index + query.length)}
		</>
	);
};

export default HighlightMatch;

// ─── Styles ──────────────────────────────────────────────────────────────────

const HighlightMark = styled.mark`
  background: rgba(255, 235, 130, 0.7);
  color: inherit;
  border-radius: 2px;
  padding: 0 1px;
`;

const HighlightBold = styled.span`
  font-weight: 700;
`;
