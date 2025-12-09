import CategoriesSection from "../components/CategoriesSection"
import CTASection from "../components/CTASection"
import FeaturesSection from "../components/FeaturesSection"
import Footer from "../components/Footer"
import HeroSection from "../components/HeroSection"
import HowItWorksSection from "../components/HowItWorksSection"
import Navbar from "../components/Navbar"






const Home = () => {
    return (
        <div>
            <Navbar />
            <HeroSection />
            <CategoriesSection />
            <FeaturesSection />
            <HowItWorksSection />
            <CTASection />
            <Footer />
        </div>
    )
}

export default Home