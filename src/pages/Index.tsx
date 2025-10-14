import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import Hero from "@/components/Hero";
import AvailabilityCalendar from "@/components/AvailabilityCalendar";
import ContactForm from "@/components/ContactForm";
import NowPlaying from "@/components/NowPlaying";
import CreativeFeed from "@/components/CreativeFeed";
import LivestreamSchedule from "@/components/LivestreamSchedule";
import Gallery from "@/components/Gallery";
import Footer from "@/components/Footer";

const Index = () => {
  const [showProjectsMenu, setShowProjectsMenu] = useState(false);
  const closeTimeoutRef = useRef<number | null>(null);

  const handleMouseEnter = () => {
    // Clear any pending close timeout
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setShowProjectsMenu(true);
  };

  const handleMouseLeave = () => {
    // Add a delay before closing to allow mouse movement to submenu
    closeTimeoutRef.current = window.setTimeout(() => {
      setShowProjectsMenu(false);
    }, 300); // 300ms delay gives comfortable time to reach submenu
  };

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

          {/* Projects Dropdown */}
          <div
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <button className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Projects
              <ChevronDown className="w-3 h-3" />
            </button>

            {showProjectsMenu && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-56 bg-card/95 backdrop-blur-md border border-border rounded-lg shadow-xl overflow-hidden">
                <a
                  href="#short-novels"
                  className="block px-4 py-3 text-sm text-muted-foreground hover:text-foreground hover:bg-sage/10 transition-colors border-b border-border"
                >
                  <div className="font-semibold mb-0.5">Short Novel Collection</div>
                  <div className="text-xs opacity-75">Fiction & stories</div>
                </a>
                <a
                  href="#bible-abridge"
                  className="block px-4 py-3 text-sm text-muted-foreground hover:text-foreground hover:bg-dusk/10 transition-colors border-b border-border"
                >
                  <div className="font-semibold mb-0.5">Bible Abridge Project</div>
                  <div className="text-xs opacity-75">Faith & theology</div>
                </a>
                <a
                  href="#digital-sanctuary"
                  className="block px-4 py-3 text-sm text-muted-foreground hover:text-foreground hover:bg-amber/10 transition-colors border-b border-border"
                >
                  <div className="font-semibold mb-0.5">Digital Sanctuary</div>
                  <div className="text-xs opacity-75">This website</div>
                </a>
                <a
                  href="#soundscape"
                  className="block px-4 py-3 text-sm text-muted-foreground hover:text-foreground hover:bg-sage/10 transition-colors border-b border-border"
                >
                  <div className="font-semibold mb-0.5">Ambient Soundscape</div>
                  <div className="text-xs opacity-75">Generative audio</div>
                </a>
                <Link
                  to="/kindred"
                  className="block px-4 py-3 text-sm text-muted-foreground hover:text-foreground hover:bg-amber/10 transition-colors"
                >
                  <div className="font-semibold mb-0.5">Kindred</div>
                  <div className="text-xs opacity-75">Generate your emotional creature</div>
                </Link>
              </div>
            )}
          </div>

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
