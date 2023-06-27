import { useState } from 'react'
import { useAuth } from '@/lib/auth'
import Link from 'next/link'

export default function SignIn() {
  const { signIn, signInError, loading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault();
    const error = await signIn({ email, password, redirectTo: '/' });
  };

  return (
      <div className='relative flex flex-col justify-center items-center min-h-screen overflow-hidden'>
        <div className="flex min-h-full flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
          <div className="w-[20rem] max-w-sm space-y-10">
            <div>
              <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                Sign in to your account
              </h2>
            </div>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="relative -space-y-px rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-0 z-10 rounded-md ring-1 ring-inset ring-gray-300" />
                <div>
                  <label htmlFor="email-address" className="sr-only">
                    Email address
                  </label>
                  <input
                      id="email-address"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className="relative block w-full rounded-t-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-100 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      placeholder="Email address"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="password" className="sr-only">
                    Password
                  </label>
                  <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      className="relative block w-full rounded-b-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-100 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      placeholder="Password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <div className="text-sm leading-6">
                <Link className="font-semibold text-indigo-600 hover:text-indigo-500" href="/forgot">
                  Forgot Password?
                </Link>
              </div>

              <div>
                <button
                    type="submit"
                    className="flex w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                >
                  {loading ? "Signing In..." : "Sign In"}
                </button>
              </div>
            </form>

            <span className="text-sm text-red-700 w-fit">
              {signInError}
            </span>

            <p className="text-center text-sm leading-6 text-gray-500">
              Not a member?{' '}
              <Link href="/signup" className="font-semibold text-blue-600 hover:text-blue-500">
                Sign up here
              </Link>
            </p>
          </div>
        </div>
      </div>
  )

}