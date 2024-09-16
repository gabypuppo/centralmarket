import type { SVGProps } from 'react'

const MapIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={64}
    height={64}
    fill="none"
    {...props}
  >
    <path
      fill="#19A863"
      d="M32 48 19.82 30.8A16.28 16.28 0 0 1 32 4a16.16 16.16 0 0 1 16 16.26 16.4 16.4 0 0 1-3.6 10.26L32 48Zm0-40a12.14 12.14 0 0 0-12 12.26 12.4 12.4 0 0 0 2.98 8L32 41.04 41.26 28A12.48 12.48 0 0 0 44 20.26 12.14 12.14 0 0 0 32 8Z"
    />
    <path
      fill="#19A863"
      d="M32 22a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM56 24h-4v4h4v28H8V28h4v-4H8a4 4 0 0 0-4 4v28a4 4 0 0 0 4 4h48a4 4 0 0 0 4-4V28a4 4 0 0 0-4-4Z"
    />
  </svg>
)
export default MapIcon
