import styled from "@emotion/styled"
import rotatePhone from "../../assets/rotate-phone.svg"

export function RotateDeviceScreen() {
	return (
		<Overlay
			role="alertdialog"
			aria-modal="true"
			aria-labelledby="rotate-device-title"
		>
			<Illustration src={rotatePhone} alt="" />
			<Title id="rotate-device-title">כדי להמשיך, סובבו את הטלפון</Title>
			<Description>התצוגה זמינה במצב אנכי בלבד</Description>
		</Overlay>
	)
}

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: var(--z-orientation-lock);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-inline: 16px;
  background: var(--background-mobile);
  text-align: center;
  overflow: hidden;
  touch-action: none;
`

const Illustration = styled.img`
  width: 123px;
  height: 123px;
`

const Title = styled.h2`
  max-width: 372px;
  margin: 0;
  font-size: var(--fs-xl);
  font-weight: 500;
  line-height: 28px;
  color: var(--sea-ink);
`

const Description = styled.p`
  max-width: 372px;
  margin: 0;
  font-size: var(--fs-btn);
  line-height: 22px;
  color: var(--sea-ink-soft);
`
