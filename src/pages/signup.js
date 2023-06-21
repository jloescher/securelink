import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth'

export default function SignUp() {
  const { signUp, signUpError, loading } = useAuth()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isPasswordMismatch, setIsPasswordMismatch] = useState(false);

  useEffect(() => {
    setIsPasswordMismatch(password !== confirmPassword);
  }, [password, confirmPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password === confirmPassword) signUp({ email, password, firstName, lastName, redirectTo: '/' });
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign up to your account
          </h2>
          <p>{ signUpError }</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor='first-name' className='sr-only'>First Name</label>
              <input id='first-name' name='firstName' type='text' className='rounded-t-md appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm' placeholder='First Name' value={firstName} onChange={e => setFirstName(e.target.value)} />
            </div>
            <div>
              <label htmlFor='last-name' className='sr-only'>Last Name</label>
              <input id='last-name' name='lastName' type='text' className='appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm' placeholder='Last Name' value={lastName} onChange={e => setLastName(e.target.value)} />
            </div>
            <div>
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <input id="email-address" name="email" type="email" required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input id="password" name="password" type="password" required className={isPasswordMismatch ? 'ring-red-500 border-red-500 ' + 'appearance-none rounded-none relative block w-full px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-500 border text-gray-900 focus:outline-none focus:z-10 sm:text-sm' : 'border-gray-300 ' + 'appearance-none rounded-none relative block w-full px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500 border placeholder-gray-500 text-gray-900 focus:outline-none focus:z-10 sm:text-sm'} placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
            </div>
            <div>
              <label htmlFor="confirm_password" className="sr-only">Confirm Password</label>
              <input id="confirm_password" name="confirm_password" type="password" required className={isPasswordMismatch ? 'ring-red-500 border-red-500 ' + 'appearance-none rounded-none relative block w-full px-3 py-2 border  focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:z-10 sm:text-sm' : 'border-gray-300 ' + 'appearance-none rounded-none relative block w-full px-3 py-2 border focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:z-10 sm:text-sm'} placeholder="Confirm Password" onChange={e => setConfirmPassword(e.target.value)} />
            </div>
            <p>{isPasswordMismatch ? 'Passwords do not match.' : ''}</p>
          </div>

          <div>
            <button type="submit" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" disabled={loading && isPasswordMismatch}>
              {loading ? "Signing Up..." : "Sign Up"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
