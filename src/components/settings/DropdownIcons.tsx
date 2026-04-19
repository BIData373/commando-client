import styled from '@emotion/styled'
import { X } from 'lucide-react';
import { useState } from 'react';
import { type IMesibaIcon, useSearchMesibaIcons } from "#/hooks/useMesiba";
import { MesibaIcon } from './MesibaIcon';
import { SearchDropdown } from "./SearchDropdown";

interface DropdownIconsProps {
    onSelect(icon: IMesibaIcon): void
    onClearEmblem(): void
    emblemSrc: string
}

export function DropdownIcons({
    onSelect,
    onClearEmblem,
    emblemSrc
}: DropdownIconsProps) {
    const [iconSearch, setIconSearch] = useState('')


    const { data: icons = [], isFetching } = useSearchMesibaIcons(iconSearch)

    function handleImageNotFound(e: React.SyntheticEvent<HTMLImageElement, Event>) {
        e.currentTarget.onerror = null
        e.currentTarget.src = '/workspace-icon.png'
    }

    function handleIconSearchSelect(icon: IMesibaIcon) {
        onSelect(icon)
        setIconSearch('')
    }

    function handleIconSearchClear() {
        setIconSearch('')
    }

    return (
        <>
            <SearchDropdown<IMesibaIcon>
                items={icons}
                value={iconSearch}
                onChange={setIconSearch}
                onSelect={handleIconSearchSelect}
                onClear={handleIconSearchClear}
                isLoading={isFetching}
                placeholder="חפש סמל"
                renderItem={(item) => <MesibaIcon icon={item} />}
            />
            <EmblemPreview>
                <EmblemClearButton type="button" onClick={onClearEmblem}>
                    <X size={16} />
                </EmblemClearButton>
                {emblemSrc ? (
                    <img
                        src={emblemSrc}
                        alt='סמל לשכה'
                        onError={handleImageNotFound}
                    />
                ) : (
                    <EmblemPlaceholder>בחר סמל</EmblemPlaceholder>
                )}
            </EmblemPreview>
        </>
    )
}

const EmblemPreview = styled.div`
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 1px dashed var(--card-border);
  border-radius: 8px;
  padding: 16px;
  height: 166px;

  img {
    width: 48px;
    height: 48px;
    object-fit: contain;
    border-radius: 50%;
  }
`

const EmblemPlaceholder = styled.span`
  font-size: 13px;
  color: var(--sea-ink-soft);
`

const EmblemClearButton = styled.button`
  position: absolute;
  inset-block-start: 8px;
  inset-inline-end: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border: 1px solid var(--line);
  border-radius: 6px;
  background: transparent;
  color: var(--sea-ink-soft);
  cursor: pointer;

  &:hover {
    background: var(--link-bg-hover);
    color: var(--sea-ink);
  }
`