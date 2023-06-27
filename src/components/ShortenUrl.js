import React, {useEffect, useState} from 'react'
import { supabase } from '@/lib/supabaseClient'
import { nanoid } from 'nanoid'
import Link from "next/link";
import Shortener from "@/lib/shortener";

export default function ShortenUrl({ user }) {
  const baseUrl = process.env.NEXT_PUBLIC_HOST_URL
  const [url, setUrl] = useState('')
  const [shortUrl, setShortUrl] = useState('')
  const [customUri, setCustomUri] = useState(false)
  const [useExpireOn, setUseExpireOn] = useState(false)
  const [expireOn, setExpireOn] = useState(null)
  const [useMaxVisits, setUseMaxVisits] = useState(false)
  const [maxVisits, setMaxVisits] = useState(null)
  const [expireOnTimestampz, setExpireOnTimestampz] = useState(null)

  useEffect(() => {
    // !customUri ? setShortUrl('') : null
    !useExpireOn ? setExpireOn(null) : null
    !useMaxVisits ? setMaxVisits(null) : null

    // Convert local date time to timestampz format
    if (expireOn) {
      const dateTime = new Date(expireOn);
      const timestampz = dateTime.toISOString()
      setExpireOnTimestampz(timestampz)
    }
  }, [expireOn, customUri, useExpireOn, useMaxVisits])

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
      .insert([{
        long_url: url,
        short_uri: shortened,
        max_visits: maxVisits ? maxVisits : null,
        expire_on: expireOnTimestampz ? expireOnTimestampz : null,
        user_id: user.id
      }])
      .select()

    if (error) {
      console.error("Error: ", error.message)
    } else {
      setShortUrl(baseUrl+shortened)
      setUrl('')
      setMaxVisits(null)
      setExpireOn(null)
      setCustomUri(false)
      setUseMaxVisits(false)
      setUseExpireOn(false)
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
            <div className="flex items-center space-x-2 mb-2">
              <input
                  type="checkbox"
                  checked={useExpireOn}
                  onChange={(e) => setUseExpireOn(e.target.checked)}
                  className="h-5 w-5 text-blue-600 rounded"
              />
              <label htmlFor="custom_uri" className="font-medium text-gray-700">Use Expire On</label>
            </div>
            <div className="flex items-center space-x-2 mb-2">
              <input
                  type="checkbox"
                  checked={useMaxVisits}
                  onChange={(e) => setUseMaxVisits(e.target.checked)}
                  className="h-5 w-5 text-blue-600 rounded"
              />
              <label htmlFor="custom_uri" className="font-medium text-gray-700">Use Max Visits</label>
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
            <div>
              {useExpireOn && (
                  <div className="mt-2">
                    <input
                        type="datetime-local"
                        className="border border-gray-300 p-2 w-full rounded text-gray-700"
                        value={expireOn}
                        onChange={(e) => setExpireOn(e.target.value)}
                    />
                  </div>
              )}
            </div>
            <div>
              {useMaxVisits && (
                  <div className="mt-2">
                    <input
                        type="number"
                        placeholder="Enter max visits."
                        className="border border-gray-300 p-2 w-full rounded text-gray-700"
                        value={maxVisits}
                        onChange={(e) => setMaxVisits(e.target.value)}
                    />
                  </div>
              )}
            </div>
          </div>
          <div>
            <button type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400">
              Shorten URL
            </button>
          </div>
        </form>
        <div className="text-center mt-2">
          {shortUrl && (
              <p className="text-center text-blue-500">
                Short URL: <Link href={shortUrl} className="underline" target="_blank">{shortUrl}</Link>
              </p>
          )}
        </div>
      </div>
    </div>
  )
}
