import { useAuth } from '@/lib/auth'
import ShortenUrl from '../components/ShortenUrl'
import SignIn from './signin'

export default function Home() {
  const { user } = useAuth()

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