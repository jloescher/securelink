import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import SignIn from "@/pages/signin";

export default function UpdatePassword() {
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [error, setError] = useState(null);
    const [isCompleted, setIsCompleted] = useState(false);

    const handlePasswordChange = async event => {
        event.preventDefault();
        if (password !== passwordConfirmation) {
            setError('Passwords do not match');
            return;
        }

        const { error } = await supabase.auth.updateUser({ password: password })


        if (error) {
            setError(error.message);
        } else {
            setIsCompleted(true);
        }
    };

    return (
        <div className="container mx-auto py-8 px-4">
            {isCompleted ? (
                <div className="text-center">
                    <h1 className="text-3xl mb-4">Password Updated Successfully</h1>
                    <p>You can now login with your new password.</p>
                    <SignIn />
                </div>
            ) : (
                <form onSubmit={handlePasswordChange} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                    <h1 className="mb-4 text-2xl">Update Password</h1>
                    {error && <p className="text-red-500 text-xs italic">{error}</p>}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                            Password
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="password"
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="passwordConfirmation">
                            Confirm Password
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="passwordConfirmation"
                            type="password"
                            value={passwordConfirmation}
                            onChange={e => setPasswordConfirmation(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            type="submit"
                        >
                            Update Password
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}
