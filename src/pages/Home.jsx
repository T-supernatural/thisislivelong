import About from "../components/About";
import Contact from "../components/Contact";
import HeroSection from "../components/HeroSection";
import Services from "../components/Services";
import Showcase from "../components/Showcase";



function Home() {
    return (
        <div id="home">
        <HeroSection />
        <About />
        <Services />
        <Showcase />
        <Contact />
        </div>
        
    )
}

export default Home;


