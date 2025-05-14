"use client";
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { APIResponse } from '@/types/APIResponse';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const UserMessagePage = () => {
  const params = useParams<{ username: string }>();
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [userExists, setUserExists] = useState(true);
  const [isAcceptingMessages, setIsAcceptingMessages] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  const username = params.username;

  useEffect(() => {
    // Check if user exists and is accepting messages
    const checkUser = async () => {
      try {
        const response = await axios.get<APIResponse>(`/api/suggested-messages?username=${username}`);
        setUserExists(true);
        setIsAcceptingMessages(response.data.isAcceptingMessages || false);
      } catch (error) {
        console.error('Error checking user:', error);
        setUserExists(false);
      }
    };

    if (username) {
      checkUser();
    }
  }, [username]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      toast.error('Please enter a message');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post<APIResponse>('/api/send-message', {
        username,
        content: message
      });

      if (response.data.success) {
        setSubmitted(true);
        toast.success('Message sent successfully!');
        setMessage('');
      } else {
        toast.error(response.data.message || 'Failed to send message');
      }
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast.error(error.response?.data?.message || 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  if (!userExists) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-md">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">User Not Found</h1>
          <p className="text-gray-600">
            The user you are looking for does not exist or has deleted their account.
          </p>
        </div>
      </div>
    );
  }

  if (!isAcceptingMessages) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-md">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-700 mb-4">Messages Disabled</h1>
          <p className="text-gray-600">
            This user is not currently accepting messages.
          </p>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-md">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h1 className="text-2xl font-bold text-green-600 mb-4">Message Sent!</h1>
          <p className="text-gray-600 mb-6">
            Your anonymous message has been delivered successfully.
          </p>
          <Button onClick={() => setSubmitted(false)}>Send Another Message</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 container mx-auto px-4 py-8 max-w-md">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-center mb-6">
          Send a message to @{username}
        </h1>
        <p className="text-gray-500 text-sm mb-6 text-center">
          This message will be completely anonymous. The recipient will not know who sent it.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Textarea
              value={message}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setMessage(e.target.value)}
              placeholder="Type your anonymous message here..."
              className="min-h-32"
              disabled={loading}
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...
              </>
            ) : (
              'Send Anonymous Message'
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default UserMessagePage; 