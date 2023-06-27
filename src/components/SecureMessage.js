import React, {useEffect, useState} from 'react';
import { supabase } from '@/lib/supabaseClient';
import { v4 as uuidv4 } from 'uuid';
import Shortener from "@/lib/shortener";
import {encrypt, hashPassword} from "@/lib/crypto";
import Link from "next/link";

const SecureMessage = ({ user }) => {
    const baseUrl = process.env.NEXT_PUBLIC_HOST_URL
    const [message, setMessage] = useState('');
    const [password, setPassword] = useState('');
    const [shortUrl, setShortUrl] = useState(null);
    const [useExpireOn, setUseExpireOn] = useState(false)
    const [expireOn, setExpireOn] = useState(null)
    const [useMaxVisits, setUseMaxVisits] = useState(false)
    const [maxVisits, setMaxVisits] = useState(null)
    const [expireOnTimestampz, setExpireOnTimestampz] = useState(null)

    useEffect(() => {
        !useExpireOn ? setExpireOn(null) : null
        !useMaxVisits ? setMaxVisits(null) : null
        // Convert local date time to timestampz format
        if (expireOn) {
            const dateTime = new Date(expireOn);
            const timestampz = dateTime.toISOString()
            setExpireOnTimestampz(timestampz)
        }
    }, [expireOn, useExpireOn, useMaxVisits])

    const createMessage = async () => {
        const msgUri = uuidv4();
        const shortened = (await Shortener()).shortened
        const encryptedMessage = await encrypt(message, shortened);

        const { data, error } = await supabase.from('urls').insert([
            {
                long_url: `${baseUrl}message/${msgUri}`,
                short_uri: shortened,
                msg_uri: msgUri,
                encrypted_msg: encryptedMessage,
                password_msg: password ? await hashPassword(password) : null,
                max_visits: maxVisits ? maxVisits : null,
                expire_on: expireOnTimestampz ? expireOnTimestampz : null,
                user_id: user.id,
            },
        ]).select()

        if (error) {
            console.error('Error saving message:', error);
        } else {
            setMessage('')
            setPassword('')
            setUseMaxVisits(false)
            setUseExpireOn(false)
            setMaxVisits(null)
            setExpireOn(null)
            setShortUrl(baseUrl + shortened);
        }
    }

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
                <div className="flex items-center space-x-2 mb-2">
                    <input
                        type="checkbox"
                        checked={useExpireOn}
                        onChange={(e) => setUseExpireOn(e.target.checked)}
                        className="h-5 w-5 text-blue-600 rounded"
                    />
                    <label htmlFor="custom_uri" className="font-medium text-gray-700">Use Expire On</label>
                </div>
                <div className="flex items-center space-x-2 mb-2">
                    <input
                        type="checkbox"
                        checked={useMaxVisits}
                        onChange={(e) => setUseMaxVisits(e.target.checked)}
                        className="h-5 w-5 text-blue-600 rounded"
                    />
                    <label htmlFor="custom_uri" className="font-medium text-gray-700">Use Max Visits</label>
                </div>
                <div>
                    {useExpireOn && (
                        <div className="mt-2">
                            <input
                                type="datetime-local"
                                className="border border-gray-300 p-2 w-full rounded text-gray-700"
                                value={expireOn}
                                onChange={(e) => setExpireOn(e.target.value)}
                            />
                        </div>
                    )}
                </div>
                <div>
                    {useMaxVisits && (
                        <div className="mt-2">
                            <input
                                type="number"
                                placeholder="Enter max visits."
                                className="border border-gray-300 p-2 w-full rounded text-gray-700"
                                value={maxVisits}
                                onChange={(e) => setMaxVisits(e.target.value)}
                            />
                        </div>
                    )}
                </div>
                <button
                    onClick={createMessage}
                    className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                    Create Secure Message
                </button>
                {shortUrl && (
                    <p className="text-center text-blue-500">
                        Short URL: <Link href={shortUrl} className="underline" target="_blank">{shortUrl}</Link>
                    </p>
                )}
            </div>
        </div>
    );
};

export default SecureMessage;
