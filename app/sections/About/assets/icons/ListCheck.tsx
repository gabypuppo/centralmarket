import type { SVGProps } from 'react'

const ListCheckIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={15}
    fill="none"
    {...props}
  >
    <path
      fill="#979797"
      d="M22 1.794H1.693 22ZM10.055 7.766H1.693h8.362Zm0 5.973H1.693h8.362Z"
    />
    <path
      stroke="#fff"
      strokeLinecap="round"
      strokeWidth={2.4}
      d="M22 1.794H1.693m8.362 5.972H1.693m8.362 5.973H1.693"
    />
    <path fill="#979797" d="m14.832 10.753 2.508 2.986L22 7.767" />
    <path
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2.4}
      d="m14.832 10.753 2.508 2.986L22 7.767"
    />
  </svg>
)
export default ListCheckIcon
