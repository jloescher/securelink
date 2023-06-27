import { useState } from 'react';
import { useAuth } from '@/lib/auth'
import ShortenUrl from '../components/ShortenUrl'
import SignIn from './signin'
import SecureMessage from "@/components/SecureMessage";

export default function Home() {
  const { user } = useAuth()
  const [selectedOption, setSelectedOption] = useState('shorten_url');

  return (
    <>
      {user ? (
        <div>
          <div className="flex justify-center items-center align-middle my-4">
            <div className="relative inline-flex items-center">
              <input
                  type="radio"
                  id="shorten_url"
                  name="option"
                  value="shorten_url"
                  checked={selectedOption === 'shorten_url'}
                  onChange={(e) => setSelectedOption(e.target.value)}
                  className="sr-only"
              />
              <label
                  htmlFor="shorten_url"
                  className={`cursor-pointer px-6 py-2 text-sm font-medium rounded-l-lg 
              ${selectedOption === 'shorten_url' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                Shorten URL
              </label>
            </div>
            <div className="relative inline-flex items-center">
              <input
                  type="radio"
                  id="message_encryption"
                  name="option"
                  value="message_encryption"
                  checked={selectedOption === 'message_encryption'}
                  onChange={(e) => setSelectedOption(e.target.value)}
                  className="sr-only"
              />
              <label
                  htmlFor="message_encryption"
                  className={`cursor-pointer px-6 py-2 text-sm font-medium rounded-r-lg 
              ${selectedOption === 'message_encryption' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                Message Encryption
              </label>
            </div>
          </div>
          {selectedOption === 'shorten_url' ?
              <ShortenUrl user={user} /> : <SecureMessage user={user} />
          }
        </div>
      ) : (
        <SignIn />
      )}
    </>
  )
}