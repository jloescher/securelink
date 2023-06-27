import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import {decrypt, verifyPassword} from "@/lib/crypto";

const MessagePage = ({ shortUri, encryptedMsg, passwordMsg }) => {
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isVerified, setIsVerified] = useState(!passwordMsg);

    useEffect(() => {
        if (isVerified) {
            // Decrypt the message and set it
            // Replace this with your decryption logic
            decrypt(encryptedMsg, shortUri).then(msg => setMessage(msg))
        }
    }, [encryptedMsg, shortUri, isVerified]);

    const checkPassword = async (e) => {
        e.preventDefault();
        try {
            const isValid = verifyPassword(passwordMsg, password)

            if (isValid) {
                setIsVerified(true);
            } else {
                alert('Invalid password.');
            }
        } catch (error) {
            alert('An error occurred. Please try again.');
        }
    };

    return (
        <div className="flex justify-center items-center align-middle my-4">
            <div className="relative inline-flex items-center">
                {isVerified ? (
                    <div>
                        <h1 className="text-2xl font-bold">Message:</h1>
                        <p>{message}</p>
                    </div>
                ) : (
                    <form onSubmit={checkPassword} className="space-y-4">
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            className="w-full p-3 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        <button
                            type="submit"
                            className="w-full p-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                            Verify Password
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export const getServerSideProps = async (context) => {
    const msguri = context.params.msguri;
    let shortUri = null
    let encryptedMsg = null;
    let passwordMsg = null;

    // Call the stored function to delete the expired or max visits reached rows, had to set function as a SECURITY DEFINER
    const { data: deleteData, error: deleteError } = await supabase.rpc('delete_expired_rows');

    try {
        const { data, error } = await supabase
            .from('urls')
            .select('encrypted_msg, password_msg, short_uri')
            .eq('msg_uri', msguri)
            .single();

        if (error) {
            throw error;
        }

        shortUri = data.short_uri
        encryptedMsg = data.encrypted_msg;
        passwordMsg = data.password_msg;
    } catch (error) {
        return {
            notFound: true,
        };
    }

    return {
        props: {
            shortUri,
            encryptedMsg,
            passwordMsg,
        },
    };
};

export default MessagePage;
