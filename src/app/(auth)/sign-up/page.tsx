"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { useDebounceCallback } from 'usehooks-ts'
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

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: '',
      email: '',
      password: ''
    }
  })

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    try {
      setisSubmiting(true);

      const usernameResponse = await axios.get<APIResponse>(`/api/check-username-unique?username=${data.username}`);
      if (!usernameResponse.data.success) {
        toast.error(usernameResponse.data.message || "Username is already taken or invalid");
        setisSubmiting(false);
        return;
      }

      const response = await axios.post<APIResponse>('/api/sign-up', data);

      if (response.data.success) {
        toast.success(
          "Account created successfully! Check your email for a verification code.",
          { duration: 5000 }
        );
        router.push(`/verify/${encodeURIComponent(data.username)}`);
      } else {
        toast.error(
          Array.isArray(response.data.message)
            ? response.data.message.join(", ")
            : response.data.message || "Failed to create account"
        );
      }
    } catch (error) {
      const axiosError = error as AxiosError<APIResponse>;
      const errorMessage = axiosError.response?.data.message || "Something went wrong";
      toast.error(Array.isArray(errorMessage) ? errorMessage.join(", ") : errorMessage);
      console.error("Sign up error:", error);
    } finally {
      setisSubmiting(false);
    }
  };

  useEffect(() => {
    const checkUserNameUnique = async () => {
      if (username) {
        setischeckingUserName(true);
        setusernameMessage('');
        try {
          const response = await axios.get(`/api/check-username-unique?username=${username}`);
          setusernameMessage(response.data.message);

          if (response.data.success && response.data.message === "Username is unique") {
            form.clearErrors("username");
          } else {
            form.setError("username", {
              type: "manual",
              message: "Username already taken"
            });
          }
        } catch (error) {
          const axiosError = error as AxiosError<APIResponse>;
          setusernameMessage(
            axiosError.response?.data.message ?? "Error checking username"
          );
          form.setError("username", {
            type: "manual",
            message: axiosError.response?.data.message ?? "Username validation failed"
          });
        } finally {
          setischeckingUserName(false);
        }
      }
    };

    checkUserNameUnique();
  }, [username, form]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
      <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-black/40 transition-colors">
        <div className="flex justify-center">
          <h1 className="text-4xl font-serif font-bold text-center text-gray-800 dark:text-gray-100">
            MysteryMessage
          </h1>
        </div>

        <div className="text-center">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                name="username"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 dark:text-gray-300">Username</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="username"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          debounced(e.target.value);
                        }}
                        className="placeholder-gray-400 dark:placeholder-gray-500"
                      />
                    </FormControl>
                    <div className="flex items-center h-6">
                      {ischeckingUserName ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2 text-gray-500 dark:text-gray-400" />
                      ) : username ? (
                        usernameMessage === "Username is unique" ? (
                          <p className="text-sm text-green-600 dark:text-green-400 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Username available
                          </p>
                        ) : (
                          <p className="text-sm text-red-600 dark:text-red-400 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            {usernameMessage}
                          </p>
                        )
                      ) : null}
                    </div>
                    <FormMessage className="text-red-600 dark:text-red-400" />
                  </FormItem>
                )}
              />
              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 dark:text-gray-300">Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="email"
                        {...field}
                        className="placeholder-gray-400 dark:placeholder-gray-500"
                      />
                    </FormControl>
                    <FormMessage className="text-red-600 dark:text-red-400" />
                  </FormItem>
                )}
              />
              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 dark:text-gray-300">Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="password"
                        {...field}
                        className="placeholder-gray-400 dark:placeholder-gray-500"
                      />
                    </FormControl>
                    <FormMessage className="text-red-600 dark:text-red-400" />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                disabled={isSubmiting}
                className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors"
              >
                {isSubmiting ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Please wait
                  </>
                ) : (
                  'Sign Up'
                )}
              </Button>
            </form>
            <div>
              <p className="text-gray-700 pt-4 dark:text-gray-300">
                Already a member?{' '}
                <Link
                  href="/sign-in"
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-600 transition-colors"
                >
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
