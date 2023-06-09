import {useAuth} from "@/lib/auth";
import Link from 'next/link';

function Header() {
    const {user, signOut} = useAuth() || {};

    return (
        <header className="flex justify-between px-8 py-4 bg-gray-800 text-white">
            <div>
                <Link href="/" className="text-2xl font-bold">
                    SecureLink
                </Link>
            </div>
            <div>
                {user ? (
                    <>
                        <Link
                            href="editprofile"
                            className="text-sm font-semibold text-white bg-blue-500 px-4 py-[9px] mr-2 rounded hover:bg-blue-600"
                        >
                            Profile
                        </Link>
                        <button
                            className="text-sm font-semibold text-white bg-red-500 px-4 py-2 rounded hover:bg-red-600"
                            onClick={signOut}
                        >
                            Sign Out
                        </button>
                    </>
                ) : (
                    <>
                        <Link href="/signup"
                              className="text-sm font-semibold text-white bg-blue-500 px-4 py-2 mr-2 rounded hover:bg-blue-600">
                            Register
                        </Link>
                        <Link href="/signin"
                              className="text-sm font-semibold text-white bg-blue-500 px-4 py-2 rounded hover:bg-blue-600">
                            Sign In
                        </Link>
                    </>
                )}
            </div>
        </header>
    );
}

export default Header;
