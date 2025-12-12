import Navigation from '../components/Navigation'
import Hero from '../components/Hero'
import Stats from '../components/Stats'
import Services from '../components/Services'
import Testimonials from '../components/Testimonials'
import FAQ from '../components/FAQ'
import Locations from '../components/Locations'
import CTA from '../components/CTA'
import Footer from '../components/Footer'

export default function DetailStack() {
  return (
    <main className="relative ds-page">
      <Navigation />
      <Hero />
      <Stats />
      <Services />
      <Testimonials />
      <FAQ />
      <Locations />
      <CTA />
      <Footer />
    </main>
  )
}
