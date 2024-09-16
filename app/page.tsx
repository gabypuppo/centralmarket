import Navbar from './components/layout/Navbar'
import { Poppins } from 'next/font/google'
import HeroSection from './sections/Hero'
import ServicesSection from './sections/Services'
import ClientsSection from './sections/Clients'
import ReviewsSection from './sections/Reviews'
import AboutSection from './sections/About'
import Footer from './components/layout/Footer'

const poppins = Poppins({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
  display: 'swap'
})

export default function Page() {
  return (
    <div className={poppins.className}>
      <Navbar />
      <main>
        <HeroSection />
        <ServicesSection />
        <ClientsSection />
        <ReviewsSection />
        <AboutSection />
      </main>
      <Footer />
    </div>
  )
}
