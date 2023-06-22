import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";


const AdminDashboard = ({ user, isAdmin, forgotPassword }) => {
    const [users, setUsers] = useState([])

    useEffect(() => {
        fetchUsers();
    }, [user]);

    // Fetch all user accounts
    const fetchUsers = async () => {
        // Fetch user data from the database
        // Note: Ensure that only admins can fetch this data
        const { data: users, error } = await supabase
            .from('user_info')
            .select('*');
        setUsers(users);
    };

    const sendPasswordReset = async (email) => {
        // Send password reset email
        forgotPassword(email)
        await fetchUsers()
    };

    const toggleAdminStatus = async (userId, userAdmin) => {
        // Toggle admin status for a user

        const { data, error } = await supabase.from('profiles').update({ is_admin: !userAdmin }).eq('user_id', userId);
        alert(error.message)
        await fetchUsers()
    };

    if (!isAdmin) {
        return <div>You must be an admin to view this page</div>;
    }

    return (
        <div className="p-8 bg-gray-100 min-h-screen">
            <h1 className="text-4xl font-semibold mb-6">Admin Dashboard</h1>
            <table className="w-full bg-white rounded-lg shadow-md">
                <thead className="bg-blue-500 text-white">
                    <tr>
                        <th className="py-2 px-4 text-left">Email</th>
                        <th className="py-2 px-4 text-left">Is Admin</th>
                        <th className="py-2 px-4 text-left">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id} className="border-b border-gray-200 text-gray-900">
                            <td className="py-2 px-4">{user.email}</td>
                            <td className="py-2 px-4">{user.is_admin ? 'Yes' : 'No'}</td>
                            <td className="py-2 px-4">
                                <button className="bg-yellow-500 text-white rounded px-4 py-2 mr-2" onClick={() => sendPasswordReset(user.email)}>Send Password Reset</button>
                                <button className="bg-green-500 text-white rounded px-4 py-2" onClick={() => toggleAdminStatus(user.id, user.is_admin)}>Toggle Admin</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

}

export default AdminDashboard