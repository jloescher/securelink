import React, { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { v4 as uuidv4 } from 'uuid';
import Shortener from "@/lib/shortener";
import encrypt from "@/lib/crypto";

const SecureMessage = ({ user }) => {
    const baseUrl = process.env.NEXT_PUBLIC_HOST_URL
    const [message, setMessage] = useState('');
    const [password, setPassword] = useState('');
    const [shortUrl, setShortUrl] = useState(null);

    const createMessage = async () => {
        const msgUri = uuidv4();
        const shortened = (await Shortener()).shortened
        const encryptedMessage = await encrypt(message, shortened);

        const { data, error } = await supabase.from('urls').insert([
            {
                long_url: `/message/${msgUri}`,
                short_uri: shortened,
                encrypted_msg: encryptedMessage,
                password_msg: password ? await hashPassword(password) : null,
                msg_uri: msgUri,
                user_id: user.id,
            },
        ]).select()

        if (error) {
            console.error('Error saving message:', error);
        } else {
            setShortUrl(baseUrl + shortened);
        }
    };

    const hashPassword = async (password) => {
        // ... hash password with argon2id ...
    };

    return (
        <div className="py-12 sm:px-6 lg:px-8">
            <div className="p-8 bg-white rounded shadow-md space-y-4">
                <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Enter your message"
                    className="w-full p-3 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    rows="4"
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password (optional)"
                    className="w-full p-3 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <button
                    onClick={createMessage}
                    className="w-full p-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                    Create Secure Message
                </button>
                {shortUrl && (
                    <p className="text-center text-blue-500">
                        Short URL: <a href={shortUrl} className="underline">{shortUrl}</a>
                    </p>
                )}
            </div>
        </div>
    );
};

export default SecureMessage;
