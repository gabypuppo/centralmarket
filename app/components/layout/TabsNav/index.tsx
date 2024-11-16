import StyledLink from './StyledLink'

interface Props {
  tabs: ({ label: string; href: string })[]
}

export default function TabsNav({ tabs }: Props) {
  return (
    <nav
      className={`h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground grid w-full grid-cols-${tabs.length}`}
    >
      {tabs.map((tab, i) => (
        <StyledLink key={`${tab.href}-${i}`} href={tab.href}>
          {tab.label}
        </StyledLink>
      ))}
    </nav>
  )
}
