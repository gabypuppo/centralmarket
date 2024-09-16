import type { SVGProps } from 'react'

const CheckedBoxIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={63}
    height={60}
    fill="none"
    {...props}
  >
    <path
      stroke="#19A863"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={5}
      d="M23.855 27.5 31.5 35l20.384-20"
    />
    <path
      stroke="#19A863"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={5}
      d="M51.885 30v15a4.952 4.952 0 0 1-1.493 3.535A5.146 5.146 0 0 1 46.788 50H16.211a5.146 5.146 0 0 1-3.603-1.465A4.952 4.952 0 0 1 11.115 45V15c0-1.326.537-2.598 1.493-3.536A5.146 5.146 0 0 1 16.21 10h22.933"
    />
  </svg>
)
export default CheckedBoxIcon
