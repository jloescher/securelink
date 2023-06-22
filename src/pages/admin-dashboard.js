import { useAuth } from '@/lib/auth';
import SignIn from "@/pages/signin";
import AdminDashboard from "@/components/AdminDashboard";

const AdminDashboardPage = () => {
    const { user, isAdmin, forgotPassword } = useAuth()

    return (
        <>
            {user ? (
                    <AdminDashboard user={user} isAdmin={isAdmin} forgotPassword={forgotPassword} />
                ) : (
                    <SignIn />
                )
            }
        </>
    )
};

export default AdminDashboardPage;
