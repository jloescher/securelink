import {useEffect, useState} from 'react'
import { supabase } from '@/lib/supabaseClient'
import { nanoid } from 'nanoid'
import Link from "next/link";
import Shortener from "@/lib/shortener";

export default function ShortenUrl({ user }) {
  const baseUrl = process.env.NEXT_PUBLIC_HOST_URL
  const [url, setUrl] = useState('')
  const [shortUrl, setShortUrl] = useState('')
  const [customUri, setCustomUri] = useState(false)

  useEffect(() => {
    !customUri ? setShortUrl('') : null
  }, [customUri])

  const handleSubmit = async (e) => {
    e.preventDefault()

    let shortened;

    if (customUri && shortUrl.length > 4) {
      shortened = shortUrl
    } else {
      shortened = (await Shortener()).shortened
    }

    const { data, error } = await supabase
      .from('urls')
      .insert([
        { long_url: url, short_uri: shortened, user_id: user.id }
      ])
      .select()

    if (error) {
      console.error("Error: ", error.message)
    } else {
      setShortUrl(shortened)
      setUrl('')
    }
  }

  return (
    <div className="py-12 sm:px-6 lg:px-8 w-full">
      <div className="p-8 bg-white rounded shadow-md space-y-4">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Shorten your URL
        </h2>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="mb-2">
              <label htmlFor="url" className="sr-only">URL</label>
              <input id="url" name="url" type="url" value={url} onChange={e => setUrl(e.target.value)} required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Enter your URL" />
            </div>
            <div className="flex items-center space-x-2 mb-2">
              <input
                  type="checkbox"
                  checked={customUri}
                  onChange={(e) => setCustomUri(e.target.checked)}
                  className="h-5 w-5 text-blue-600 rounded"
              />
              <label htmlFor="custom_uri" className="font-medium text-gray-700">Use Custom URI</label>
            </div>
            <div>
            {customUri && (
                <div className="mt-2">
                  <input
                      type="text"
                      placeholder="Enter custom URI"
                      className="border border-gray-300 p-2 w-full rounded text-gray-700"
                      value={shortUrl}
                      onChange={(e) => setShortUrl(e.target.value)}
                  />
                </div>
            )}
            </div>
          </div>
          <div>
            <button type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Shorten URL
            </button>
          </div>
        </form>
        <div className="text-center mt-2">
          {shortUrl && (
            <Link href={baseUrl + shortUrl} className="text-red-600" target="_blank">{baseUrl + shortUrl}</Link>
          )}
        </div>
      </div>
    </div>
  )
}
