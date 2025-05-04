"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { useDebounceValue, useDebounceCallback } from 'usehooks-ts'
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { signUpSchema } from "@/schemas/signupSchema"
import axios, { AxiosError } from 'axios'
import { APIResponse } from "@/types/APIResponse"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

const page = () => {
  const [username, setUsername] = useState('')
  const [usernameMessage, setusernameMessage] = useState('')
  const [ischeckingUserName, setischeckingUserName] = useState(false)
  const [isSubmiting, setisSubmiting] = useState(false)

  const router = useRouter();

  const debounced = useDebounceCallback(setUsername, 300)

  //zod implementation 
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: '',
      email: '',
      password: ''
    }
  })

  useEffect(() => {
    const checkUserNameUnique = async () => {
      if (username) {
        setischeckingUserName(true);
        setusernameMessage('');
        try {
          const response = await axios.get(`/api/check-username-unique?username=${username}`);
          setusernameMessage(response.data.message);
        } catch (error) {
          const axiosError = error as AxiosError<APIResponse>
          setusernameMessage(
            axiosError.response?.data.message ?? "Error checking message"
          )
        } finally {
          setischeckingUserName(false)
        }
      }
    }
    checkUserNameUnique();
  }, [username])

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setisSubmiting(true)
    try {
      const response = await axios.post<APIResponse>('/api/sign-up', data)
      toast.success(String(response.data.messages?.[0] || "Operation successful"))
      router.replace(`/verify/${username}`)
      setisSubmiting(false)
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
      setisSubmiting(false)
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
                name="username"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="username"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e)
                          debounced(e.target.value)
                        }}
                      />
                    </FormControl>
                    {ischeckingUserName && <Loader2 className="animate-spin" />}
                    {/* <p className={`text-sm ${usernameMessage === "Username is unique" ? "text-green-500" : "text-red-500"}`}>
                      test {usernameMessage}
                    </p> */}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="email"
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
              <Button type="submit" disabled={isSubmiting}>
                {
                  isSubmiting ? (<><Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait</>) : ('Sign Up')
                }
              </Button>
            </form>
            <div>
              <p>
                Already a member ?{' '}
                <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
                  Sign in
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