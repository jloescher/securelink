import { supabase } from '@/lib/supabaseClient'

export default function SignOut() {
  const handleSignOut = async () => {
    let { error } = await supabase.auth.signOut()
    if (error) console.log('Error signing out: ', error.message)
  }

  return (
    <button onClick={handleSignOut} className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
      Sign Out
    </button>
  )
}
