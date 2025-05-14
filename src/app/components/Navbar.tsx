"use client"
import { Link as LucideLink, Menu, X, User as UserIcon } from 'lucide-react'
import { useSession, signOut } from 'next-auth/react'
import React, { useState, useEffect } from 'react'
import { User } from 'next-auth'
import { Button } from './ui/button'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ThemeToggle } from './ThemeToggle'
import logo from "../assets/logo.png"
import Image from "next/image"

const Navbar = () => {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [mounted, setMounted] = useState(false)

    // Fix hydration errors by ensuring client-side initialization happens after mounting
    useEffect(() => {
        setMounted(true)
    }, [])

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen)
    }

    // Only render the complete UI after client-side mount
    if (!mounted) {
        return (
            <nav className='fixed w-full p-4 md:p-6 bg-white dark:bg-black z-50'>
                <div className='container mx-auto'>
                    <div className='flex justify-between items-center'>
                        <span className='text-xl font-bold'>MysteryMessage</span>
                    </div>
                </div>
            </nav>
        )
    }

    return (
        <nav className='fixed w-full p-2 md:p-4 bg-white dark:bg-black z-50'>
            <div className='container mx-auto'>
                {/* Desktop Navigation */}
                <div className='hidden md:flex justify-between items-center'>
                    <Link href="/" className=''>
                        <Image src={logo} alt="MysteryMessage logo" width={60} height={30} />
                    </Link>

                    <div className="flex items-center gap-6">

                        <div className="flex items-center gap-3">
                            <ThemeToggle />

                            {status === 'loading' ? (
                                <span className="text-sm">Loading...</span>
                            ) : session ? (
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2">
                                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                            <UserIcon className="h-4 w-4 text-primary" />
                                        </div>
                                        <span className="text-sm font-medium">{session.user.username}</span>
                                    </div>
                                    <Button
                                        size="sm"
                                        onClick={() => signOut({ callbackUrl: '/' })}
                                    >
                                        Log Out
                                    </Button>
                                </div>
                            ) : (
                                <Link href="/sign-in">
                                    <Button size="sm">Log in</Button>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>

                {/* Mobile Navigation */}
                <div className='flex md:hidden justify-between items-center'>
                <Link href="/" className=''>
                <Image src={logo} alt="MysteryMessage logo" width={50} height={30} />
                    </Link>

                    <div className="flex items-center gap-2">
                        <ThemeToggle />
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={toggleMobileMenu}
                            aria-label="Toggle menu"
                        >
                            {isMobileMenuOpen ? (
                                <X className="h-5 w-5" />
                            ) : (
                                <Menu className="h-5 w-5" />
                            )}
                        </Button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden pt-4 pb-2 px-2 space-y-4 border-t dark:border-gray-800 mt-4">

                        {status === 'loading' ? (
                            <span className="block py-2 text-sm">Loading...</span>
                        ) : session ? (
                            <>
                                <div className="flex items-center gap-2 py-2">
                                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                        <UserIcon className="h-4 w-4 text-primary" />
                                    </div>
                                    <span className="text-sm font-medium">{session.user.username}</span>
                                </div>
                                <Button
                                    className='w-full'
                                    onClick={() => {
                                        signOut({ callbackUrl: '/' })
                                        setIsMobileMenuOpen(false)
                                    }}
                                >
                                    Log Out
                                </Button>
                            </>
                        ) : (
                            <Link
                                href="/sign-in"
                                className="block"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                <Button className='w-full'>Log in</Button>
                            </Link>
                        )}
                    </div>
                )}
            </div>
        </nav>
    )
}

export default Navbar
