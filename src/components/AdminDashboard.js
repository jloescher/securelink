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
        await fetchUsers()
    };

    if (!isAdmin) {
        return <div>You must be an admin to view this page</div>;
    }

    return (
        <div className="px-4 sm:px-6 lg:px-8">
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-base font-semibold leading-6 text-gray-900">Users</h1>
                    <p className="mt-2 text-sm text-gray-700">
                        A list of all the users in your account including their name, title, email and role.
                    </p>
                </div>
                <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">

                </div>
            </div>
            <div className="mt-8 flow-root">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-300">
                                <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                        Name
                                    </th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                        Email
                                    </th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                        Role
                                    </th>
                                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                        Action
                                    </th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {users.map(user => (
                                        <tr key={user.id} className="border-b border-gray-200 text-gray-900">
                                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                                {`${user.first_name} ${user.last_name}`}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{user.email}</td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{user.is_admin ? 'Admin' : 'User'}</td>
                                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                <button className="bg-yellow-500 text-white rounded px-4 py-2 mr-2" onClick={() => sendPasswordReset(user.email)}>Send Password Reset</button>
                                                <button className="bg-green-500 text-white rounded px-4 py-2" onClick={() => toggleAdminStatus(user.id, user.is_admin)}>Toggle Admin</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

}

export default AdminDashboard