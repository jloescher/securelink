import Header from "@/components/Header";
import "../css/globals.css"
import {AuthProvider} from "@/lib/auth";

export default function SecureLink({Component, pageProps}) {
    // Use the layout defined at the page level, if available
    // const getLayout = Component.getLayout || ((page) => page);

    if (Component.name === 'ShortUriPage') {
        return (
            <div className="h-screen">
                <Header/>
                <main
                    className="bg-gray-100 h-[calc(100vh-64px)] overflow-auto lg:rounded-tl-3xl my-auto"
                >
                    <Component {...pageProps} />
                </main>
            </div>
        )
    }

    return (
        <AuthProvider>
            <div className="h-screen">
            <Header/>
            <main
                className="bg-gray-100 h-[calc(100vh-64px)] overflow-auto lg:rounded-tl-3xl"
            >
                <Component {...pageProps} />
            </main>
            </div>
        </AuthProvider>
    );
}