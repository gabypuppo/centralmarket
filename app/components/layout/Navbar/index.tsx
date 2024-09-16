'use client'
import Image from 'next/image'
import logo from '@/assets/images/logo.png'
import Button from '../../ui/Button'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'

export default function Navbar() {
  const [scrollYPosition, setScrollYPosition] = useState(0)
  const [isOpen, setIsOpen] = useState(false)

  const handleScroll = () => {
    const newScrollYPosition = window.scrollY
    setScrollYPosition(newScrollYPosition)
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <>
      <header
        className={`px-3 sm:px-6 md:px-10 lg:px-40 w-full py-4 fixed top-0 text-white font-light z-50 duration-300 ${
          scrollYPosition === 0 ? 'bg-transparent' : 'bg-black'
        }`}
      >
        <div className="w-full flex items-center">
          <div className="h-full flex gap-0.5 items-end">
            <Image src={logo} alt="Logo de Central Market" className="h-10 w-auto invert" />
            <h1 className="pb-1.5 text-nowrap">Central Market</h1>
          </div>
          <nav className="hidden ml-auto md:flex items-center gap-8 text-sm">
            <Link href="/auth/register">
              <Button variant="register">Registrarse</Button>
            </Link>
            <Link href="/auth/login">Ingresar</Link>
          </nav>
          <button className="ml-auto md:hidden" onClick={() => setIsOpen((isOpen) => !isOpen)}>
            {!isOpen ? <Menu fill="#FFFFFF" size={32} /> : <X fill="#FFFFFF" size={32} />}
          </button>
        </div>
      </header>
      <nav
        className={`fixed inset-0 bg-black z-40 md:hidden flex flex-col items-end gap-4 px-3 sm:px-6 md:px-10 lg:px-40 duration-200 ${
          isOpen ? 'h-full' : 'h-0'
        } overflow-hidden`}
      >
        <Link href="/auth/register" className="mt-20 text-lg text-white underline">
          Registrarse
        </Link>
        <Link href="/auth/login" className="text-lg text-white underline">
          Ingresar
        </Link>
      </nav>
    </>
  )
}
