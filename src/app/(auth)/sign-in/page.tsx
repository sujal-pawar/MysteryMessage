"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { APIResponse } from "@/types/APIResponse"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { signinSchema } from "@/schemas/signinSchema"
import { signIn } from "next-auth/react"

const page = () => {

  const router = useRouter();

  //zod implementation 
  const form = useForm<z.infer<typeof signinSchema>>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      identifier: '',
      password: ''
    }
  })

  const onSubmit = async (data: z.infer<typeof signinSchema>) => {
    const result =await signIn('credentials',{
      redirect:false,
      identifier:data.identifier,
      password:data.password,
    })

    if(result?.error){
      toast("Incorrect username or password")
    }

    if(result?.url){
      router.replace('/dashboard')
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="flex justify-center">
          <h1 className="text-4xl text-gray-800 font-serif font-bold dark:text-gray-200">MystreyMessage </h1>          
        </div>

        <div className="text-center">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
                name="identifier"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="email"
                        {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="password"
                        {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" >
                Sign In
              </Button>
            </form>
            <div>
              <p>
                New member ?{' '}
                <Link href="/sign-up" className="text-blue-600 hover:text-blue-800">
                  Sign Up
                </Link>
              </p>
            </div>
           </Form>
        </div>
      </div>
    </div>
  )
}

export default page;