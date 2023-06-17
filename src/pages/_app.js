import Header from "@/components/Header";
import "../css/globals.css"
import { AuthProvider } from "@/lib/auth";
import {useState} from "react";

export default function SecureLink({ Component, pageProps }) {
    const [headerHeight, setHeaderHeight] = useState(0);
  // // Use the layout defined at the page level, if available
  // const getLayout = Component.getLayout || ((page) => page);

  if (Component.name === 'ShortUriPage') {
    return (
      <>
        <Header setHeaderHeight={setHeaderHeight} />
          <main
              style={{ height: `calc(100vh - ${headerHeight}px)` }}
              className="overflow-auto"
          >
              <Component {...pageProps} />
          </main>
      </>
    )
  }

  return (
    <AuthProvider>
        <Header />
        <main
            style={{ height: `calc(100vh - ${headerHeight}px)` }}
            className="overflow-auto"
        >
            <Component {...pageProps} />
        </main>
    </AuthProvider>
  );
}