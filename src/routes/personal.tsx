import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/personal')({
  component: Personal,
  staticData: {
    header: {
      title: 'אזור אישי',
      navigation: false,
      user: true
    }
  }
})

function Personal() {
  return <div>Personal</div>
}
