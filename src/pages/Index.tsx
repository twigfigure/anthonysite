import Hero from "@/components/Hero";
import AvailabilityCalendar from "@/components/AvailabilityCalendar";
import ContactForm from "@/components/ContactForm";
import NowPlaying from "@/components/NowPlaying";
import CreativeFeed from "@/components/CreativeFeed";
import LivestreamSchedule from "@/components/LivestreamSchedule";
import Gallery from "@/components/Gallery";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Floating Menu */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
        <div className="flex items-center gap-6 px-6 py-3 bg-card/80 backdrop-blur-md border border-border rounded-full shadow-lg">
          <a
            href="#upray4me"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            UPray4Me
          </a>
          <a
            href="#ipray4u"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            IPray4U
          </a>
          <a
            href="#testimony"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Testimony
          </a>
          <a
            href="#boba"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Buy Me Boba
          </a>
        </div>
      </nav>

      <Hero />
      
      {/* Three-column layout */}
      <div className="max-w-[1600px] mx-auto px-6 py-8 pb-16">
        <div className="grid lg:grid-cols-[450px,1fr,350px] gap-6">
          {/* Left Column - Sticky */}
          <aside className="space-y-8 lg:sticky lg:top-8 lg:self-start lg:max-h-[calc(100vh-4rem)] lg:overflow-y-auto">
            <AvailabilityCalendar />
          </aside>

          {/* Center Content Area */}
          <main className="space-y-8">
            <CreativeFeed />
          </main>

          {/* Right Column - Sticky */}
          <aside className="space-y-8 lg:sticky lg:top-8 lg:self-start">
            <Gallery />
            <NowPlaying />
            <ContactForm />
            <LivestreamSchedule />
          </aside>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Index;
