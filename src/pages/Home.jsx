import About from "../components/About";
import Contact from "../components/Contact";
import HeroSection from "../components/HeroSection";
import Services from "../components/Services";
import Showcase from "../components/Showcase";
import JournalPage from "../components/JournalPage";

import { Routes, Route } from 'react-router-dom';

function Home() {
    return (
        <>
        <HeroSection />
        <About />
        <Services />
        <Routes>
        <Route path="/" element={<Showcase />} />
        <Route path="/journal/:id" element={<JournalPage />} />
        </Routes>
        <Contact />
        </>
        
    )
}

export default Home;


