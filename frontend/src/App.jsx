import { Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Fakedata from "./pages/Fakedata";
import Signin from "./pages/Signin";
import Signuphost from "./pages/Signuphost";
import Signupguest from "./pages/Signupguest";
import Contactus from "./pages/Contactus";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AboutUs from "./pages/Aboutus";
import Services from "./pages/Services";
import Gallery from "./pages/Gallerry";
import Blogs from "./pages/Blogs";
import Events from "./pages/Events";
import MyEvents from "./pages/Myevents";
import ChatWidget from "./components/ChatWidget";

export default function App() {
  return (
    <div className="min-h-screen bg-white text-gray-800 flex flex-col">
      {/* Header */}
      <Header />

      {/* Main Routes */}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/fakedata" element={<Fakedata />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/signuphost" element={<Signuphost />} />
          <Route path="/signupguest" element={<Signupguest />} />
          <Route path="/contactus" element={<Contactus />} />
          <Route path="/aboutus" element={<AboutUs/>}/>
          <Route path="/services" element={<Services/>}/>
          <Route path="/gallery" element={<Gallery/>}/>
          <Route path="/blogs" element={<Blogs/>}/>
          <Route path="/events" element={<Events/>}/>
          <Route path="/myevents" element={<MyEvents/>}/>
          
        </Routes>
      </main>

      {/* Footer */}
      <Footer />

      {/* React Toastify Notifications */}
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <ChatWidget />
    </div>
  );
}

