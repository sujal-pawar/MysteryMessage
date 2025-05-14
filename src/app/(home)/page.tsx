"use client";

import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Mail, Sun, Moon, ShieldCheck, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Autoplay from 'embla-carousel-autoplay';
import messages from '@/message.json';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const currentYear = new Date().getFullYear();

  // Avoid hydration mismatch
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    // Prevent mismatches by delaying render until mounted
    return null;
  }

  return (
    <>
      <Head>
        <title>MysteryMessage • Anonymous Feedback Platform</title>
        <meta
          name="description"
          content="Dive into the world of anonymous feedback with MysteryMessage. Share and receive messages without revealing identity."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="pt-12 min-h-screen flex flex-col bg-white text-black dark:bg-gray-900 dark:text-white transition-colors">

        <main className="w-full flex flex-col items-center justify-center">

          {/* Hero Section */}
          <section className="text-center mb-12 max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
              Dive into the World of Anonymous Feedback
            </h1>
            <p className="mt-4 text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              MysteryMessage is a secure platform where your identity remains a secret while you share honest feedback.
              No usernames, no emails - just pure, unfiltered messages.
            </p>
            <div className="mt-8 flex flex-col md:flex-row gap-4 justify-center">
              <Link href="/sign-up" passHref>
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:text-white dark:hover:bg-blue-600"
                  aria-label="Get started with MysteryMessage"
                >
                  Get Started
                </Button>
              </Link>
              <Link href="/sign-in" passHref>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-black border-black hover:bg-gray-100 dark:text-white dark:border-white dark:hover:bg-gray-800"
                  aria-label="Sign in to MysteryMessage"
                >
                  Sign In
                </Button>
              </Link>
            </div>
          </section>

          {/* Features Section */}
          <section className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <Card className="bg-gray-100 dark:bg-gray-800">
              <CardHeader>
                <CardTitle>100% Anonymous</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-700 dark:text-gray-300">
                No usernames, emails, or any identifiers. Your messages remain completely private and untraceable.
              </CardContent>
            </Card>

            <Card className="bg-gray-100 dark:bg-gray-800">
              <CardHeader>
                <CardTitle>Instant Delivery</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-700 dark:text-gray-300">
                Messages are sent and received in real time through our secure channels.
              </CardContent>
            </Card>

            <Card className="bg-gray-100 dark:bg-gray-800">
              <CardHeader>
                <CardTitle>Easy Integration</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-700 dark:text-gray-300">
                Seamlessly integrate with your existing tech stack via API endpoints.
              </CardContent>
            </Card>
          </section>

          {/* How It Works Section */}
          <section className="w-full max-w-4xl mb-16 px-4 md:px-0">
            <h2 className="text-3xl font-bold mb-8 text-center">How MysteryMessage Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="p-6 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md">                
                <h3 className="text-xl font-semibold mb-2">Send Anonymously</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Write your message without revealing your identity. No usernames or emails are required.
                </p>
              </div>
              <div className="p-6 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md">
                <ShieldCheck className="mx-auto mb-4 h-12 w-12 text-blue-600 dark:text-blue-400" />
                <h3 className="text-xl font-semibold mb-2">Secure & Encrypted</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  All messages are encrypted and transmitted securely to protect your privacy.
                </p>
              </div>
              <div className="p-6 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md">
                <Users className="mx-auto mb-4 h-12 w-12 text-blue-600 dark:text-blue-400" />
                <h3 className="text-xl font-semibold mb-2">Receive & Respond</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Receive honest feedback without knowing the sender’s identity, fostering trust and openness.
                </p>
              </div>
            </div>
          </section>

          {/* Security Section */}
          <section className="w-full max-w-4xl mb-16 px-4 md:px-0 text-center">
            <h2 className="text-3xl font-bold mb-6">Your Privacy, Our Priority</h2>
            <p className="max-w-3xl mx-auto text-gray-700 dark:text-gray-300 mb-4">
              MysteryMessage uses state-of-the-art encryption protocols to ensure that your messages are safe from prying eyes.
              We never store personal identifiers and all data is handled with strict confidentiality.
            </p>
            
          </section>

          {/* Call to Action Section */}
          <section className="w-full max-w-4xl mb-16 px-4 md:px-0 text-center bg-blue-600 dark:bg-blue-700 rounded-lg py-12 text-white shadow-lg">
            <h2 className="text-4xl font-extrabold mb-4">Ready to Share Your Voice Anonymously?</h2>
            <p className="mb-8 max-w-3xl mx-auto">
              Join thousands of users who trust MysteryMessage to share honest feedback without fear or judgment.
            </p>
            <Link href="/sign-up" passHref>
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100" aria-label="Sign up now">
                Sign Up Now
              </Button>
            </Link>
          </section>

        </main>        
      </div>
    </>
  );
}
