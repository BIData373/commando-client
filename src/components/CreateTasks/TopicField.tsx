import { useState, useRef } from 'react'
import styled from '@emotion/styled'
import { ChevronDown, Tag, X } from 'lucide-react'

// ─── Types ───────────────────────────────────────────────────────────────────

interface TopicFieldProps {
  topics: string[]
  lockedTopics: string[]
  onTopicSelect: (topic: string) => void
  onTopicRemove: (topic: string) => void
}

// ─── Mock Data ───────────────────────────────────────────────────────────────

const ALL_TOPICS = ['חרבות ברזל', 'חרבו דרבו', 'קפ"ק', 'עם כלביא', 'חרמונית', 'שאגת הארי', 'ביטחון', 'מבצעים', 'סיורים', 'לוגיסטיקה']

// ─── Helpers ─────────────────────────────────────────────────────────────────

  // Highlights the matching substring in the dropdown search results
  function highlightMatch(text: string, query: string) {
    const index = text.indexOf(query)
    if (index === -1) return text
    return (
      <>
        {text.slice(0, index)}
        <HighlightedText>{query}</HighlightedText>
        {text.slice(index + query.length)}
      </>
    )
  }

// ─── Component ───────────────────────────────────────────────────────────────

function TopicField({ topics, lockedTopics, onTopicSelect, onTopicRemove }: TopicFieldProps) {
  const [topicQuery, setTopicQuery] = useState('')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const filteredTopics = ALL_TOPICS.filter(
    (t) => t.includes(topicQuery) && !topics.includes(t),
  )

  const isNewTopic = topicQuery.trim() !== '' && !ALL_TOPICS.includes(topicQuery.trim())
  const showDropdown = isDropdownOpen && (filteredTopics.length > 0 || isNewTopic)

  function handleSelect(topic: string) {
    onTopicSelect(topic)
    setTopicQuery('')
  }

  function handleCreateNew() {
    if (topicQuery.trim() && !topics.includes(topicQuery.trim())) {
      onTopicSelect(topicQuery.trim())
    }
    setTopicQuery('')
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (topicQuery.trim()) {
        const existing = filteredTopics.find((t) => t === topicQuery.trim())
        if (existing) {
          handleSelect(existing)
        } else {
          handleCreateNew()
        }
      }
    }
  }

  function handleRemoveTopic(e: React.MouseEvent, topic: string) {
    e.preventDefault()
    onTopicRemove(topic)
  }

  function handleSelectMouseDown(e: React.MouseEvent, topic: string) {
    e.preventDefault()
    handleSelect(topic)
  }

  function handleCreateNewMouseDown(e: React.MouseEvent) {
    e.preventDefault()
    handleCreateNew()
  }

  function handleInputBoxClick() {
    inputRef.current?.focus()
  }

  function handleQueryChange(e: React.ChangeEvent<HTMLInputElement>) {
    setTopicQuery(e.target.value)
  }

  function handleFocus() {
    setIsDropdownOpen(true)
  }

  function handleBlur() {
    setTimeout(() => setIsDropdownOpen(false), 200)
  }

  return (
    <FormItem>
      <FormLabelRow>
        <LabelText>נושא</LabelText>
      </FormLabelRow>
      <TopicFieldWrapper>
        <TopicInputBox onClick={handleInputBoxClick}>
          <StyledChevronDown size={16} />
          <InputContent>
            {topics.map((topic) => (
              <TopicTag key={topic}>
                <TagText>{topic}</TagText>
                {!lockedTopics.includes(topic) && (
                  <TagRemoveButton
                    onMouseDown={(e) => handleRemoveTopic(e, topic)}
                  >
                    <X size={12} />
                  </TagRemoveButton>
                )}
              </TopicTag>
            ))}
            <TopicInputField
              ref={inputRef}
              value={topicQuery}
              onChange={handleQueryChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              placeholder={topics.length === 0 ? "מאמץ/מבצע/קטגוריה (לדוג': 'שאגת הארי' , הגנה במרחב)" : ''}
              dir="rtl"
            />
          </InputContent>
          {topics.length === 0 &&
            <StyledTag size={16} />
          }
        </TopicInputBox>
        {showDropdown && (
          <DropdownMenu>
            {filteredTopics.length > 0 && topicQuery && (
              <SuggestionsHeader>הצעות</SuggestionsHeader>
            )}
            {filteredTopics.map((topic) => (
              <TopicOption
                key={topic}
                onMouseDown={(e) => handleSelectMouseDown(e, topic)}
              >
                {topicQuery ? highlightMatch(topic, topicQuery) : topic}
              </TopicOption>
            ))}
            {isNewTopic && (
              <>
                {filteredTopics.length > 0 && <Divider />}
                <TopicOption
                  onMouseDown={handleCreateNewMouseDown}
                >
                  <HighlightedText>{topicQuery}</HighlightedText>
                  <span> (חדש)</span>
                </TopicOption>
              </>
            )}
          </DropdownMenu>
        )}
      </TopicFieldWrapper>
    </FormItem>
  )
}

export default TopicField

// ─── Styled ─────────────────────────────────────────────────────────────────

const FormItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  width: 100%;
`

const FormLabelRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0px;
  padding-block-end: 8px;
  width: 100%;
`

const LabelText = styled.span`
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  color: rgba(0, 0, 0, 0.88);
  white-space: nowrap;
`

const TopicFieldWrapper = styled.div`
position: relative;
width: 100%;
`

const TopicInputBox = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  min-height: 40px;
  padding-inline: 11px;
  background: white;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  gap: 4px;
  cursor: text;

  &:focus-within {
    border-color: #1677ff;
    box-shadow: 0 0 0 2px rgba(5, 145, 255, 0.1);
  }
`

const InputContent = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  max-height: 40px;
  overflow-y: auto;
  overflow-x: hidden;
  padding-block: 2px;
  min-width: 0;
  direction: rtl;
`

const TopicInputField = styled.input`
  direction: rtl;
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: 16px;
  font-weight: 400;
  line-height: 18px;
  color: rgba(0, 0, 0, 0.88);
  min-width: 60px;
  text-align: start;

  &::placeholder {
    color: rgba(0, 0, 0, 0.25);
  }
`

const TopicTag = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 1px 8px;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 4px;
  flex-shrink: 0;
`

const TagText = styled.span`
  font-size: 12px;
  font-weight: 400;
  line-height: 20px;
  color: rgba(0, 0, 0, 0.88);
  white-space: nowrap;
`

const TagRemoveButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  cursor: pointer;
  color: rgba(0, 0, 0, 0.45);
  padding: 0;

  &:hover {
    color: rgba(0, 0, 0, 0.88);
  }
`

const DropdownMenu = styled.div`
  position: absolute;
  inset-block-start: calc(100% + 4px);
  inset-inline: 0;
  z-index: 40;
  background: white;
  border-radius: 8px;
  box-shadow:
    0px 6px 16px rgba(0, 0, 0, 0.08),
    0px 3px 6px rgba(0, 0, 0, 0.12),
    0px 9px 28px rgba(0, 0, 0, 0.05);
  max-height: 168px;
  overflow-y: auto;
  padding: 4px;
  direction: rtl;
`

const SuggestionsHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  height: 32px;
  padding-inline: 12px;
  padding-block: 5px;
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  color: rgba(0, 0, 0, 0.45);
  white-space: nowrap;
`

const TopicOption = styled.button`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  height: 32px;
  padding-inline: 12px;
  padding-block: 5px;
  border: none;
  background: transparent;
  cursor: pointer;
  border-radius: 4px;
  font-size: 14px;
  line-height: 22px;
  color: rgba(0, 0, 0, 0.88);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: start;

  &:hover {
    background: rgba(0, 0, 0, 0.04);
  }
`

const HighlightedText = styled.span`
  font-weight: 700;
`

const StyledChevronDown = styled(ChevronDown)`
  color: rgba(0, 0, 0, 0.25);
`
const StyledTag = styled(Tag)`
  color: rgba(0, 0, 0, 0.25);
`
const Divider = styled.div`
  height: 1px;
  background: rgba(0, 0, 0, 0.06);
  margin-block: 4px;
`
