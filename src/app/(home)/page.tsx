"use client";

import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Mail, Sun, Moon } from 'lucide-react';
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
        <meta name="description" content="Dive into the world of anonymous feedback with MysteryMessage. Share and receive messages without revealing identity." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="pt-12 min-h-screen flex flex-col bg-white text-black dark:bg-gray-900 dark:text-white transition-colors">

        <main className=" flex-grow w-full flex flex-col items-center justify-center px-4 md:px-24">
          {/* Hero Section */}
          <section className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
              Dive into the World of Anonymous Feedback
            </h1>
            <p className="mt-4 text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              MysteryMessage is a secure platform where your identity remains a secret while you share honest feedback.
            </p>
            <div className="mt-8 flex flex-col md:flex-row gap-4 justify-center">
              <Link href="/sign-up">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600">
                  Get Started
                </Button>
              </Link>
              <Link href="/sign-in">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-black border-black hover:bg-gray-100 dark:text-white dark:border-white dark:hover:bg-gray-800"
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
                No personal data, no tracking. Your messages remain completely private.
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

          {/* Carousel Section */}
          <section className="w-full max-w-xl mb-16">
            <Carousel plugins={[Autoplay({ delay: 5000 })]} className="w-full">
              <CarouselContent>
                {messages.map((message, idx) => (
                  <CarouselItem key={idx} className="p-4">
                    <Card className="bg-gray-100 dark:bg-gray-800">
                      <CardHeader>
                        <CardTitle className="text-black dark:text-white">{message.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="flex items-start space-x-4 text-gray-700 dark:text-gray-300">
                        <Mail className="flex-shrink-0 h-6 w-6" />
                        <div>
                          <p>{message.content}</p>
                          <p className="mt-2 text-xs italic">{message.received}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="flex justify-between mt-2">
                <CarouselPrevious className="text-black dark:text-white hover:text-blue-500 dark:hover:text-blue-400" aria-label="Previous" />
                <CarouselNext className="text-black dark:text-white hover:text-blue-500 dark:hover:text-blue-400" aria-label="Next" />
              </div>
            </Carousel>
          </section>
        </main>

        {/* Footer */}
        <footer className="w-full py-6 text-center text-gray-600 dark:text-gray-400">
          &copy; {currentYear} MysteryMessage. All rights reserved.
        </footer>
      </div>
    </>
  );
}
