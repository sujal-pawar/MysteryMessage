"use client"
import { Link as LucideLink } from 'lucide-react'
import { useSession, signOut } from 'next-auth/react'
import React from 'react'
import { User } from 'next-auth'
import { Button } from './ui/button'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const Navbar = () => {
    const { data: session, status } = useSession()
    const router = useRouter()

    return (
        <nav className='w-full p-4 md:p-6 shadow-md '>
            <div className='container mx-auto flex flex-col
            md:flex-row justify-between items-center'>
                <Link href="/" className='text-xl font-bold mb-4 md:mb-0'>
                    MysteryMessage
                </Link>
                
                {status === 'loading' ? (
                    <span>Loading...</span>
                ) : session ? (
                    <div className="flex items-center gap-4">                        
                        <Button 
                            className='w-full md:w-auto' 
                            onClick={() => signOut({ callbackUrl: '/' })}
                        >
                            Log Out
                        </Button>
                    </div>
                ) : (                    
                    <Link href="/sign-in">
                        <Button className='w-full md:w-auto'>Log in</Button>
                    </Link>                      
                )}
            </div>
        </nav>
    )
}

export default Navbar
