import { useAuth } from '@/lib/auth'
import EditProfile from '../components/EditProfile'
import SignIn from "@/pages/signin";

export default function EditProfilePage () {
    const { user } = useAuth()

    return (
        <>
            {user ? (
                <EditProfile user={user} />
            ) : (
            <SignIn />
                )
            }
        </>
    )
}