import Navigation from "@/components/Navigation";
import AppContextProvider from "@/context/AppContext";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <AppContextProvider>
        <div>
          <Navigation />
          <Component {...pageProps} />
        </div>
      </AppContextProvider>
    </SessionProvider>
  );
}
