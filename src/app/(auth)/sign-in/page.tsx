"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/app/components/ui/form";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { signinSchema } from "@/schemas/signinSchema";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { Loader2 } from "lucide-react";

const SignInPage = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof signinSchema>>({
    resolver: zodResolver(signinSchema),
    defaultValues: { identifier: "", password: "" }
  });

  const onSubmit = async (data: z.infer<typeof signinSchema>) => {
    try {
      setIsSubmitting(true);
      const result = await signIn("credentials", {
        redirect: false,
        identifier: data.identifier,
        password: data.password
      });

      if (result?.error) {
        toast(result.error || "Incorrect username or password");
        return;
      }

      toast("Login successful!");
      router.push("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      toast("An error occurred during login. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-black transition-colors">
      <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-black/40 transition-colors">
        <h1 className="text-4xl font-serif font-bold text-center text-gray-800 dark:text-gray-100">
          MysteryMessage
        </h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="identifier"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 dark:text-gray-300">Email or Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="email or username"
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
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </Form>
        <p className="text-center text-gray-700 dark:text-gray-300">
          New member?{" "}
          <Link href="/sign-up" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-600 transition-colors">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignInPage;
