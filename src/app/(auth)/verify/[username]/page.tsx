"use client";
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { verifySchema } from '@/schemas/verifySchema'
import { APIResponse } from '@/types/APIResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { useParams, useRouter } from 'next/navigation'
import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from "sonner"
import * as z from 'zod'
import { Loader2, AlertCircle } from 'lucide-react'

const VerifyAccount = () => {
    const router = useRouter()
    const params = useParams<{ username: string }>()
    const username = params.username || ''
    
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isResending, setIsResending] = useState(false)
    const [devVerificationCode, setDevVerificationCode] = useState<string | null>(null)
    const [isDevMode, setIsDevMode] = useState(false)

    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),
        defaultValues: {
            code: ''
        }
    })

    // Check local storage for saved verification code
    useEffect(() => {
        try {
            // Check if we're in development mode
            if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                setIsDevMode(true);
                
                // Try to retrieve verification code from localStorage
                const storedCode = localStorage.getItem(`verification_${username}`);
                if (storedCode) {
                    setDevVerificationCode(storedCode);
                    form.setValue('code', storedCode);
                }
            }
        } catch (e) {
            console.error("Error accessing localStorage:", e);
        }
    }, [username, form]);

    const onSubmit = async (values: z.infer<typeof verifySchema>) => {
        setIsSubmitting(true)
        try {
            const decodedUsername = decodeURIComponent(username)
            const response = await axios.post<APIResponse>('/api/verify-code', {
                username: decodedUsername,
                code: values.code
            })

            if (response.data.success) {
                toast.success("Account verified successfully!")
                
                // Clean up any stored verification code for this user
                try {
                    localStorage.removeItem(`verification_${username}`);
                } catch (e) {
                    console.error("Could not clear localStorage", e);
                }
                
                // Redirect to sign-in page 
                router.push('/sign-in')
            } else {
                toast.error(response.data.message || "Verification failed")
            }
        } catch (error) {
            const axiosError = error as AxiosError<APIResponse>
            toast.error(axiosError.response?.data.message || "Verification failed")
        } finally {
            setIsSubmitting(false)
        }
    }

    const resendVerificationCode = async () => {
        try {
            setIsResending(true)
            const response = await axios.post<APIResponse>('/api/sign-up', {
                username: decodeURIComponent(username),
                resendCode: true
            })
            
            if (response.data.success) {
                // For development or free tier restrictions: If there's a verification code in the response, store it
                if (response.data.verificationCode) {
                    setDevVerificationCode(response.data.verificationCode);
                    form.setValue('code', response.data.verificationCode);
                    
                    try {
                        localStorage.setItem(`verification_${username}`, response.data.verificationCode);
                    } catch (e) {
                        console.error("Could not store in localStorage", e);
                    }
                }
                
                toast.success(response.data.message || "Verification code resent. Please check your email.")
            } else {
                toast.error(response.data.message || "Failed to resend verification code")
            }
        } catch (error) {
            const axiosError = error as AxiosError<APIResponse>
            toast.error(axiosError.response?.data.message || "Failed to resend verification code")
        } finally {
            setIsResending(false)
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-2xl font-bold">Verify Your Account</h1>
                    <p className="mt-2 text-gray-600">
                        Please enter the verification code sent to your email
                    </p>
                </div>

                {devVerificationCode && (
                    <div className="bg-blue-50 border border-blue-200 rounded-md p-4 my-4">
                        <div className="flex items-start">
                            <AlertCircle className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                            <div>
                                <h3 className="text-sm font-medium text-blue-800">Development Mode</h3>
                                <p className="text-sm text-blue-700 mt-1">
                                    Verification code: <span className="font-mono font-semibold">{devVerificationCode}</span>
                                </p>
                                <p className="text-xs text-blue-600 mt-1">
                                    This code is being displayed due to free tier limitations or development mode
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            name="code"
                            control={form.control}                            
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Verification Code</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter 6-digit code" {...field} />
                                    </FormControl>                                    
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        
                        <div className="flex flex-col space-y-4">
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Verifying...
                                    </>
                                ) : (
                                    "Verify Account"
                                )}
                            </Button>
                            
                            <Button 
                                type="button" 
                                variant="outline"
                                onClick={resendVerificationCode}
                                disabled={isResending}
                            >
                                {isResending ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Resending...
                                    </>
                                ) : (
                                    "Resend Verification Code"
                                )}
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    )
}

export default VerifyAccount 