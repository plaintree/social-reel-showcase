import { useState, useEffect } from "react";
import type { AppProps } from "next/app";
import { GoogleOAuthProvider } from "@react-oauth/google";

import "../styles/globals.css";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

function MyApp({ Component, pageProps }: AppProps) {
  const [isSSR, setIsSSR] = useState(true);

  useEffect(() => {
    setIsSSR(false);
  }, []);
  if (isSSR) return;

  return (
    <GoogleOAuthProvider
      clientId={`${process.env.NEXT_PUBLIC_GOOGLE_API_TOKEN}`}>
      <div className='xl:w-screen m-auto overflow-hidden h-screen '>
        <Navbar />

        <div className='flex gap-6 md:gap-20 bg-lime-50'>
          <div className='h-[92vh] overflow-hidden xl:hover:overflow-auto'>
            <Sidebar />
          </div>
          <div className='mt-4 flex flex-col gap-10 overflow-auto video flex-1 h-[80vh]'>
            <Component {...pageProps} />
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}

export default MyApp;
