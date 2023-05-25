import { useUser } from '../lib/auth'
import ShortenUrl from '../components/ShortenUrl'
import SignIn from '@/components/SignIn'

export default function Home() {
  const { user } = useUser()

  return (
    <div>
      {user ? (
        <ShortenUrl user={user} />
      ) : (
        <SignIn />
      )}
    </div>
  )
}