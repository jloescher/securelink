import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { nanoid } from 'nanoid'
import Link from "next/link";

const getStaticProps = async () => {

}

export default function ShortenUrl({ user }) {
  const baseUrl = process.env.NEXT_PUBLIC_HOST_URL
  const [url, setUrl] = useState('')
  const [shortUrl, setShortUrl] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()

    let shortened;
    let unique = false;

    const { data: countData , count } = supabase.from('urls').select('*', { count: 'exact', head: true })

    if (!countData && !count) {
      unique = true
      shortened = nanoid(7)
    }

    // shortened = nanoid(7) // generates a 7-char unique identifier
    while (!unique) {
      shortened = nanoid(7)  // generates a 7-char unique identifier

      const { data, error } = await supabase
          .from('urls')
          .select('short_uri')
          .eq('short_uri', shortened)
          .limit(1)

      if (error) {
        console.error("Error: ", error.message)
        return;
      }

      // If no data is returned, then the shortened URL is unique
      unique = !data;
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
      setShortUrl(baseUrl + shortened)
      setUrl('')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Shorten your URL
        </h2>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="url" className="sr-only">URL</label>
              <input id="url" name="url" type="url" value={url} onChange={e => setUrl(e.target.value)} required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Enter your URL" />
            </div>
          </div>
          <div>
            <button type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Shorten URL
            </button>
          </div>
        </form>
        <div>
          {shortUrl ?
            <Link href={shortUrl} className="text-slate-600">{shortUrl}</Link> : <span></span>
          }
        </div>
      </div>
    </div>
  )
}
