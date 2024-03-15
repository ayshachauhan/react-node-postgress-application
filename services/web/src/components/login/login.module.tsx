'use client';
import { AzentiaLogo } from '@utils/constants';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { publicRuntimeConfig } from '../../../next.config';

export default function LoginPage() {
  const { API_BASE_URL } = publicRuntimeConfig;

  const [email, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      const result = await response.json();

      if (response.ok) {
        localStorage.setItem('access_token', result.access_token);
        result.is_super_admin
          ? router.push('/practices')
          : router.push('/dashboard');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full items-center shadow-xl rounded-2xl justify-center py-8">
        <div className=" flex flex-col justify-center items-center">
          <div className="text-3xl mt-10">Login</div>
          <div
            className="mt3"
            dangerouslySetInnerHTML={{ __html: AzentiaLogo }}
          />
        </div>
        <div className="mt-16 mx-16">
          <form className="w-full" onSubmit={handleSubmit}>
            <input type="hidden" name="remember" defaultValue="true" />
            <div className="rounded-l shadow-l space-y-px">
              <div className="sm:col-span-4">
                <label
                  htmlFor="email"
                  className="text-sm pl-1"
                  style={{ fontWeight: 300 }}
                >
                  Email
                </label>
                <div className="mt-1">
                  <div className="flex rounded-lg shadow-lg  focus-within:ring-2 focus-within:ring-inset focus-within:ring-gray-300 sm:max-w-md bg-gray-50">
                    <input
                      id="email"
                      name="email"
                      type="text"
                      required
                      autoComplete="email"
                      className="block flex-1 border-0 bg-transparent py-1.5 pl-1  focus:ring-0 sm:text-sm sm:leading-6"
                      placeholder=""
                      value={email}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className="pt-3">
                <label
                  htmlFor="password"
                  className="text-sm pl-1"
                  style={{ fontWeight: 300 }}
                >
                  Password
                </label>
                <div className="mt-1">
                  <div className="flex rounded-lg shadow-lg  focus-within:ring-2 focus-within:ring-inset focus-within:ring-gray-300 sm:max-w-md bg-gray-50">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      className="block flex-1 border-0 bg-transparent py-1.5 pl-1  focus:ring-0 sm:text-sm sm:leading-6"
                      placeholder=""
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6 flex flex-col sm:flex-row sm:justify-between items-center">
              <div className="">
                <button
                  type="submit"
                  className="group relative w-full flex justify-center item-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-br from-teal-600 to-green-500 hover:from-teal-700 hover:to-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2"
                >
                  Login
                </button>
              </div>
              <div className="">
                <div className="text-sm">
                  <a
                    href="#"
                    className="font-medium text-blue-400 hover:text-blue-500 sm:pt-3"
                  >
                    Forgot Password
                  </a>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
