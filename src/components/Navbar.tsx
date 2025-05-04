"use client"
import { Link } from 'lucide-react'
import { useSession, signOut } from 'next-auth/react'
import React from 'react'
import { User } from 'next-auth'
import { Button } from './ui/button'
import { redirect } from 'next/navigation'
import { render } from '@react-email/components'

const Navbar = () => {

    const { data: session, status } = useSession()

    const user: User = session?.user as User

    return (
        <nav className=' w-full p-4 md:p-6 shadow-md'>
            <div className='container mx-auto flex flex-col
            md:flex-row justify-between items-center'>
                <a href="/" className='text-xl fond-bold mb-4 md:mb-0'> MysteryMessage </a>
                {
                    session ? (<><span className='mr-4'>Welcome, {user.username || user.email}</span>
                        <Button className='w-full md:w-auto' onClick={() => signOut()}> Log Out</Button>
                    </>) : (                    
                        <Button onClick={()=>{redirect('/sign-in')}} className='w-full md:w-auto'>Log in</Button>                        
                    )
                }
            </div>
        </nav>
    )
}

export default Navbar
