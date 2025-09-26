import About from "../components/About";
import Contact from "../components/Contact";
import Footer from "../components/Footer";
import HeroSection from "../components/HeroSection";
import Navbar from "../components/Navbar";
import Services from "../components/Services";
import Showcase from "../components/Showcase";

function Home() {
    return (
        <>
        <Navbar />
        <HeroSection />
        <About />
        <Services />
        <Showcase />
        <Contact />
        <Footer />
        </>
    )
}

export default Home;