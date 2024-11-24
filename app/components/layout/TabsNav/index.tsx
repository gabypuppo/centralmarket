import StyledLink from './StyledLink'

interface Props {
  tabs: ({ label: string; href: string })[]
}

export default function TabsNav({ tabs }: Props) {
  return (
    <nav
      className={`h-10 items-center rounded-md bg-muted p-1 text-muted-foreground w-full grid grid-flow-col grid-cols-${tabs.length}`}
    >
      {tabs.map((tab, i) => (
        <StyledLink key={`${tab.href}-${i}`} href={tab.href}>
          {tab.label}
        </StyledLink>
      ))}
    </nav>
  )
}
