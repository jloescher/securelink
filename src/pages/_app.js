import Header from "@/components/Header";
import "../css/globals.css"
import { AuthProvider } from "@/lib/auth";

export default function SecureLink({ Component, pageProps }) {
  // // Use the layout defined at the page level, if available
  // const getLayout = Component.getLayout || ((page) => page);

  if (Component.name === 'ShortUriPage') {
    return (
      <>
        <Header />
        <Component {...pageProps} />
      </>
    )
  }

  return (
    <AuthProvider>
      <Header />
      <Component {...pageProps} />
    </AuthProvider>
  );
}