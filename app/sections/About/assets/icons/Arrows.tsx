import type { SVGProps } from 'react'

const ArrowsIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={57}
    height={57}
    fill="none"
    {...props}
  >
    <g clipPath="url(#a)">
      <path
        fill="#fff"
        fillOpacity={0.2}
        d="M27.481 27.343H0A12.397 12.397 0 0 0 12.426 39.73h5.059v4.885A12.386 12.386 0 0 0 29.865 57V29.73a2.386 2.386 0 0 0-2.386-2.387h.002Zm13.592-13.67h-27.45a12.385 12.385 0 0 0 12.386 12.383h5.056v4.888a12.397 12.397 0 0 0 12.386 12.383V16.05a2.375 2.375 0 0 0-2.378-2.377ZM54.656 0h-27.45A12.385 12.385 0 0 0 39.59 12.386h5.057v4.885A12.386 12.386 0 0 0 57 29.647V2.387A2.375 2.375 0 0 0 54.656 0Z"
      />
    </g>
    <defs>
      <clipPath id="a">
        <path fill="#fff" d="M0 0h57v57H0z" />
      </clipPath>
    </defs>
  </svg>
)
export default ArrowsIcon
