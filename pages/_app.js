import "../styles/globals.css";
import "../styles/index.css";
import WrapperContexProvider from "../context/provider";
import Navbar from "../components/Layout/Navbar";
import { Toaster } from "react-hot-toast";
import Footer from "../components/Layout/Footer";
import Head from "next/head";

function MyApp({ Component, pageProps }) {
  return (
    <WrapperContexProvider>
      <Head>
        <title>MeDiDataBlock - a enviornment for medical data privacy using blockchain</title>
        <link rel="shortcut icon" href="/favicon.jpg" />
      </Head>
      <div className="flex-col bg-blue-200 min-h-screen min-w-screen">
        <Navbar />
        <div className="px-2 max-w-6xl mx-auto">
          <Component {...pageProps} />
        </div>
      </div>
      <Footer />
      <Toaster position="top-right" />
    </WrapperContexProvider>
  );
}

export default MyApp;
