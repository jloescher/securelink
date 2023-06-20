import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient'; // Assuming you're using Supabase
import { useAuth } from '@/lib/auth';

const AdminDashboard = () => {
    const { user, isAdmin } = useAuth()
    const [users, setUsers] = useState([])

    useEffect(() => {

        // Fetch all user accounts
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        // Fetch user data from the database
        // Note: Ensure that only admins can fetch this data
        const { data: users } = await supabase.from('auth.users').select('*');
        setUsers(users);
    };

    const deleteUser = async (userId) => {
        // Delete a user by user id
        // Ensure you have checks on the server-side
        await supabase.from('auth.users').delete().match({ id: userId });
        fetchUsers();
    };

    const sendPasswordReset = async (email) => {
        // Send password reset email
        // This is just a placeholder, integrate with your email sending logic
    };

    const toggleAdminStatus = async (userId, currentStatus) => {
        // Toggle admin status for a user
        await supabase.from('profiles').update({ is_admin: !currentStatus }).eq('user_id', userId);
        fetchUsers();
    };

    if (!isAdmin) {
        return <div>You must be an admin to view this page</div>;
    }

    return (
        <div>
            <h1>Admin Dashboard</h1>
            <table>
                <thead>
                    <tr>
                        <th>Email</th>
                        <th>Is Admin</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td>{user.email}</td>
                            <td>{user.is_admin ? 'Yes' : 'No'}</td>
                            <td>
                                <button onClick={() => deleteUser(user.id)}>Delete User</button>
                                <button onClick={() => sendPasswordReset(user.email)}>Send Password Reset</button>
                                <button onClick={() => toggleAdminStatus(user.id, user.is_admin)}>Toggle Admin</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminDashboard;
