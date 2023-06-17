import { useState, useEffect } from "react";
import {decrypt, encrypt} from "@/lib/crypto";
import {supabase} from "@/lib/supabaseClient";

const Modal = ({ url, onClose }) => {
    const [urlId, setUrlId] = useState(url.id)
    const [shortUri, setShortUri] = useState(url.short_uri)
    const [longUrl, setLongUrl] = useState(url.long_url);
    const [encryptedMsg, setEncryptedMsg] = useState(url.encrypted_msg);
    const [message, setMessage] = useState('')

    useEffect(() => {
        setUrlId(url.id)
        setShortUri(url.short_uri)
        setLongUrl(url.long_url);
        setEncryptedMsg(url.encrypted_msg);

        if (shortUri && encryptedMsg) {
         decrypt(encryptedMsg, shortUri).then(msg => setMessage(msg))
        }
    }, [encryptedMsg, shortUri, url]);

    const updateUrl = async (id, longUrl, encryptedMsg) => {
        try {
            const { data, error } = await supabase
                .from('urls')
                .update({
                    long_url: longUrl,
                    encrypted_msg: encryptedMsg,
                })
                .eq('id', id)
                .select()

            console.error(error)
            console.log(data)

            if (error) {
                throw error;
            }

            return data
        } catch (error) {
            console.error('Error updating URL:', error.message);
        }
    };

    const handleSave = async () => {
        // Update the url in the database
        setEncryptedMsg(encrypt(message, shortUri)) //TODO: debug why this update is not saving to the DB
        const url = await updateUrl(urlId, longUrl, encryptedMsg)

        // Call onClose and pass the updated url back
        onClose({ ...url, long_url: longUrl, encrypted_msg: encryptedMsg });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center">
            <div className="bg-white flex flex-col min-h-[30vh] p-4 rounded">
                <div>
                    <label className="m-2">
                        Long URL:
                    </label>
                    <input
                        type="text"
                        value={longUrl}
                        onChange={e => setLongUrl(e.target.value)}
                        className="m-2 border border-gray-300 p-2 w-full rounded text-gray-700"
                    />
                </div>
                {encryptedMsg &&
                    <div className="flex flex-col">
                        <label className="m-2">
                            Encrypted Message:
                        </label>
                        <textarea
                            value={message}
                            onChange={e => setMessage(e.target.value)}
                            className="m-2 p-3 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            rows="5"
                        >
                        </textarea>
                    </div>
                }
                <button onClick={handleSave} className="bg-green-500 text-white px-4 py-2 m-2">
                    Save
                </button>
                <button onClick={() => onClose()} className="bg-red-500 text-white px-4 py-2 m-2">
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default Modal;
