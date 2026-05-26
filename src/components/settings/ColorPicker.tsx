import styled from "@emotion/styled";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

export const PRESET_COLORS = [
	"#00474f",
	"#006d75",
	"#08979c",
	"#5cdbd3",
	"#135200",
	"#237804",
	"#7cb305",
	"#95de64",
	"#2f54eb",
	"#85a5ff",
	"#531dab",
	"#9254de",
	"#ad4e00",
	"#d48806",
	"#d4b106",
	"#faad14",
	"#d4380d",
	"#fa541c",
	"#ff7a45",
	"#ffec3d",
	"#9e1068",
	"#eb2f96",
	"#ff85c0",
	"#8c8c8c",
];

interface ColorPickerProps {
	selectedColor: string;
	onChange(color: string): void;
}

export function ColorPicker({ selectedColor, onChange }: ColorPickerProps) {
	return (
		<Popover>
			<PopoverTrigger asChild>
				<ColorSwatchContainer>
					<ColorSwatch $color={selectedColor} />
				</ColorSwatchContainer>
			</PopoverTrigger>
			<StyledPopoverContent side="top" align="start">
				<ColorPickerPopup>
					<ColorGrid>
						{PRESET_COLORS.map((color) => (
							<ColorOption
								key={color}
								$color={color}
								$selected={selectedColor === color}
								onClick={() => onChange(color)}
							/>
						))}
					</ColorGrid>
					<OtherColorLabel>
						<HiddenColorInput
							type="color"
							value={selectedColor}
							onChange={(e) => onChange(e.target.value)}
						/>
						אחר
					</OtherColorLabel>
				</ColorPickerPopup>
			</StyledPopoverContent>
		</Popover>
	);
}

const StyledPopoverContent = styled(PopoverContent)`
    max-width: max-content;
    z-index: 1000;
`;

const ColorSwatchContainer = styled.div`
  background: var(--background);
  border: 1px solid var(--card-border);
  border-radius: 100px;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ColorSwatch = styled.div<{ $color: string }>`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
  cursor: pointer;
  flex-shrink: 0;
  position: relative;
`;

const ColorPickerPopup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 12px;
  width: 144px;
  align-items: flex-start;
  align-content: flex-start;
`;

const ColorGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  width: 100%;
`;

const ColorOption = styled.div<{ $color: string; $selected: boolean }>`
  width: 24px;
  height: 24px;
  border-radius: 40px;
  background: ${({ $color }) => $color};
  cursor: pointer;
  flex-shrink: 0;
  outline: ${({ $selected }) => ($selected ? "2px solid var(--sea-ink)" : "none")};
  outline-offset: 2px;

  &:hover {
    opacity: 0.85;
  }
`;

const OtherColorLabel = styled.label`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 24px;
  padding-inline: 7px;
  border-radius: 4px;
  background: var(--chip-bg);
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  color: var(--sea-ink);
  cursor: pointer;
  white-space: nowrap;
  position: relative;
`;

const HiddenColorInput = styled.input`
  position: absolute;
  width: 0;
  height: 0;
  opacity: 0;
  pointer-events: none;
`;
