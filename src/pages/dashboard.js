import {useAuth} from "@/lib/auth";
import SignIn from "@/pages/signin";
import Dashboard from "@/components/Dashboard";

export default function DashboardPage ({ headerHeight }) {
    const { user } = useAuth()
    const scrollableHeight = `calc(100vh - ${headerHeight}px)`;

    return (
        <>
            {user ? (
                    <Dashboard user={user} scrollableHeight={scrollableHeight} />
                ) : (
                    <SignIn />
                )
            }
        </>
    )
}