import type { SVGProps } from 'react'

const ClockIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={72}
    height={72}
    fill="none"
    {...props}
  >
    <path
      stroke="#19A863"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={5}
      d="M25.128 9c-.644.24-1.275.501-1.893.783m38.919 39.12c.306-.664.588-1.34.846-2.028m-7.503 11.22a27.7 27.7 0 0 0 1.49-1.497m-11.18 7.518c.582-.22 1.155-.457 1.719-.711m-11.058 2.577c-.692.024-1.386.024-2.082 0M23.36 63.42a27.63 27.63 0 0 0 1.653.684m-10.995-7.341c.408.434.83.856 1.269 1.266m-7.39-11.034c.227.592.47 1.175.73 1.749M6.015 37.515c-.02-.626-.02-1.252 0-1.878m1.86-9.426c.222-.586.462-1.163.72-1.731m5.373-8.04c.434-.464.883-.913 1.347-1.347M40.5 36a4.5 4.5 0 1 1-4.5-4.5m4.5 4.5a4.5 4.5 0 0 0-4.5-4.5m4.5 4.5H48m-12-4.5V18m30 18C66 19.431 52.569 6 36 6"
    />
  </svg>
)
export default ClockIcon