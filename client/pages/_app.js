import "../styles/globals.css";
import "../styles/index.css";
import WrapperContexProvider from "../context/provider";
import Navbar from "../components/Navbar";
import { Toaster } from "react-hot-toast";
import Footer from "../components/Footer";

function MyApp({ Component, pageProps }) {
  return (
    <WrapperContexProvider>
      <div className="flex-col bg-[#97b5fe] min-h-screen min-w-screen">
        <Navbar />
        <div className="px-2">
          <Component {...pageProps} />
        </div>
      </div>
      <Footer />
      <Toaster position="top-right" />
    </WrapperContexProvider>
  );
}

export default MyApp;
