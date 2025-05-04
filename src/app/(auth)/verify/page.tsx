"use client";
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { verifySchema } from '@/schemas/verifySchema'
import { APIResponse } from '@/types/APIResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { useParams, useRouter } from 'next/navigation'
import React from 'react'
import { useForm } from 'react-hook-form'
import { toast } from "sonner"
import * as z from 'zod'

const VerifyAccount = () => {
    const router = useRouter()
    const params = useParams<{ username: string }>()


    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),
    })

    const onSubmit = async (data: z.infer<typeof verifySchema>) => {
        try {
            const response = await axios.post('/api/verify-code', {
                username: params.username,
                code: data.code
            })

            toast.success(response.data.message)
            router.replace('/sign-in')
        } catch (error) {
            console.log(error)
            const axiosError = error as AxiosError<APIResponse>
            let errorMessage = axiosError.response?.data.message
            toast(
                errorMessage ?? "An unexpected error occurred",
                {
                    style: {
                        backgroundColor: "red",
                        color: "white",
                    },
                    duration: 4000,
                }
            )
        }
    }


    return (

        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className='text-center'>
                    <h1 className='text-2xl font-extrabold tracking-tight lg:text-4xl mb-6'>Verify Your Account</h1>
                    <p className='mb-4'> Enter the verification code, sent on your email</p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            name="code"
                            control={form.control}                            
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Verification Code</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Code" {...field} />
                                    </FormControl>                                    
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit">Submit</Button>
                    </form>
                </Form>
            </div>
        </div>
    )
}

export default VerifyAccount
