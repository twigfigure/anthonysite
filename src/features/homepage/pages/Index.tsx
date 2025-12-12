import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, Menu, X, MessageCircle, LogIn } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AuthModal } from "@/components/AuthModal";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import Hero from "../components/Hero";
import AvailabilityCalendar from "../components/AvailabilityCalendar";
import ContactForm from "../components/ContactForm";
import NowPlaying from "../components/NowPlaying";
import CreativeFeed from "../components/CreativeFeed";
import LivestreamSchedule from "../components/LivestreamSchedule";
import Gallery from "../components/Gallery";
import Footer from "../components/Footer";

const Index = () => {
  const [showProjectsMenu, setShowProjectsMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [chatModalOpen, setChatModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'availability' | 'feed' | 'connect'>('feed');
  const closeTimeoutRef = useRef<number | null>(null);
  const { user, signOut } = useAuth();

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
      {/* Mobile Action Buttons - Menu & Chat */}
      <div className="lg:hidden fixed top-4 right-4 z-50 flex gap-2">
        <button
          onClick={() => setChatModalOpen(true)}
          className="p-3 bg-sage/90 hover:bg-sage backdrop-blur-md border border-sage rounded-full shadow-lg transition-colors"
        >
          <MessageCircle className="w-5 h-5 text-white" />
        </button>
        <button
          onClick={() => user ? signOut() : setAuthModalOpen(true)}
          className="p-3 bg-card/80 hover:bg-card backdrop-blur-md border border-border rounded-full shadow-lg transition-colors"
        >
          <LogIn className="w-5 h-5" />
        </button>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-3 bg-card/80 backdrop-blur-md border border-border rounded-full shadow-lg"
        >
          {mobileMenuOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Chat Modal */}
      <Dialog open={chatModalOpen} onOpenChange={setChatModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-sage" />
              Send a Message
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <ContactForm />
          </div>
        </DialogContent>
      </Dialog>

      {/* Auth Modal */}
      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed top-16 right-4 z-50 w-64 bg-card/95 backdrop-blur-md border border-border rounded-lg shadow-xl overflow-hidden">
          <a
            href="#upray4me"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-3 text-sm text-muted-foreground hover:text-foreground hover:bg-sage/10 transition-colors border-b border-border"
          >
            UPray4Me
          </a>
          <a
            href="#ipray4u"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-3 text-sm text-muted-foreground hover:text-foreground hover:bg-sage/10 transition-colors border-b border-border"
          >
            IPray4U
          </a>
          <a
            href="#testimony"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-3 text-sm text-muted-foreground hover:text-foreground hover:bg-sage/10 transition-colors border-b border-border"
          >
            Testimony
          </a>

          {/* Projects Submenu - Always expanded on mobile */}
          <div className="border-b border-border">
            <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase bg-muted/30">
              Projects
            </div>
            <a
              href="#short-novels"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-3 text-sm text-muted-foreground hover:text-foreground hover:bg-sage/10 transition-colors"
            >
              <div className="font-semibold mb-0.5">Short Novel Collection</div>
              <div className="text-xs opacity-75">Fiction & stories</div>
            </a>
            <a
              href="#bible-abridge"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-3 text-sm text-muted-foreground hover:text-foreground hover:bg-dusk/10 transition-colors"
            >
              <div className="font-semibold mb-0.5">Bible Abridge Project</div>
              <div className="text-xs opacity-75">Faith & theology</div>
            </a>
            <a
              href="#digital-sanctuary"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-3 text-sm text-muted-foreground hover:text-foreground hover:bg-amber/10 transition-colors"
            >
              <div className="font-semibold mb-0.5">Digital Sanctuary</div>
              <div className="text-xs opacity-75">This website</div>
            </a>
            <a
              href="#soundscape"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-3 text-sm text-muted-foreground hover:text-foreground hover:bg-sage/10 transition-colors"
            >
              <div className="font-semibold mb-0.5">Ambient Soundscape</div>
              <div className="text-xs opacity-75">Generative audio</div>
            </a>
            <Link
              to="/kindred"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-3 text-sm text-muted-foreground hover:text-foreground hover:bg-amber/10 transition-colors"
            >
              <div className="font-semibold mb-0.5">Kindred</div>
              <div className="text-xs opacity-75">Generate your emotional creature</div>
            </Link>
            <Link
              to="/fantasy-basketball"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-3 text-sm text-muted-foreground hover:text-foreground hover:bg-orange/10 transition-colors"
            >
              <div className="font-semibold mb-0.5">Fantasy Basketball Auction</div>
              <div className="text-xs opacity-75">Dynamic auction draft tool</div>
            </Link>
            <Link
              to="/guild-manager"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-3 text-sm text-muted-foreground hover:text-foreground hover:bg-purple/10 transition-colors"
            >
              <div className="font-semibold mb-0.5">Guild Manager</div>
              <div className="text-xs opacity-75">Solo Leveling inspired guild game</div>
            </Link>
            <Link
              to="/manhua-tracker"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-3 text-sm text-muted-foreground hover:text-foreground hover:bg-teal/10 transition-colors"
            >
              <div className="font-semibold mb-0.5">PeakScroll</div>
              <div className="text-xs opacity-75">Track your manhua collection</div>
            </Link>
            <Link
              to="/detailstack"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-3 text-sm text-muted-foreground hover:text-foreground hover:bg-champagne-500/10 transition-colors"
            >
              <div className="font-semibold mb-0.5">DetailStack</div>
              <div className="text-xs opacity-75">Premium auto detailing studio</div>
            </Link>
          </div>

          <a
            href="#boba"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-3 text-sm text-muted-foreground hover:text-foreground hover:bg-sage/10 transition-colors"
          >
            Buy Me Boba
          </a>
        </div>
      )}

      {/* Desktop Floating Menu */}
      <nav className="hidden lg:block fixed top-6 left-1/2 -translate-x-1/2 z-50">
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
                  className="block px-4 py-3 text-sm text-muted-foreground hover:text-foreground hover:bg-amber/10 transition-colors border-b border-border"
                >
                  <div className="font-semibold mb-0.5">Kindred</div>
                  <div className="text-xs opacity-75">Generate your emotional creature</div>
                </Link>
                <Link
                  to="/fantasy-basketball"
                  className="block px-4 py-3 text-sm text-muted-foreground hover:text-foreground hover:bg-orange/10 transition-colors border-b border-border"
                >
                  <div className="font-semibold mb-0.5">Fantasy Basketball Auction</div>
                  <div className="text-xs opacity-75">Dynamic auction draft tool</div>
                </Link>
                <Link
                  to="/guild-manager"
                  className="block px-4 py-3 text-sm text-muted-foreground hover:text-foreground hover:bg-purple/10 transition-colors border-b border-border"
                >
                  <div className="font-semibold mb-0.5">Guild Manager</div>
                  <div className="text-xs opacity-75">Solo Leveling inspired guild game</div>
                </Link>
                <Link
                  to="/manhua-tracker"
                  className="block px-4 py-3 text-sm text-muted-foreground hover:text-foreground hover:bg-teal/10 transition-colors border-b border-border"
                >
                  <div className="font-semibold mb-0.5">PeakScroll</div>
                  <div className="text-xs opacity-75">Track your manhua collection</div>
                </Link>
                <Link
                  to="/detailstack"
                  className="block px-4 py-3 text-sm text-muted-foreground hover:text-foreground hover:bg-champagne-500/10 transition-colors"
                >
                  <div className="font-semibold mb-0.5">DetailStack</div>
                  <div className="text-xs opacity-75">Premium auto detailing studio</div>
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

          {/* Sign In/Out Button */}
          {user ? (
            <Button
              onClick={() => signOut()}
              variant="outline"
              size="sm"
              className="text-sm"
            >
              Sign Out
            </Button>
          ) : (
            <Button
              onClick={() => setAuthModalOpen(true)}
              size="sm"
              className="text-sm"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Sign In
            </Button>
          )}
        </div>
      </nav>

      <Hero />

      {/* Mobile Tab Navigation */}
      <div className="lg:hidden sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-[1600px] mx-auto px-4 py-3">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('availability')}
              className={`flex-1 px-4 py-2.5 text-sm font-medium rounded-lg transition-all ${
                activeTab === 'availability'
                  ? 'bg-sage text-white'
                  : 'bg-card text-muted-foreground hover:text-foreground'
              }`}
            >
              Availability
            </button>
            <button
              onClick={() => setActiveTab('feed')}
              className={`flex-1 px-4 py-2.5 text-sm font-medium rounded-lg transition-all ${
                activeTab === 'feed'
                  ? 'bg-sage text-white'
                  : 'bg-card text-muted-foreground hover:text-foreground'
              }`}
            >
              Feed
            </button>
            <button
              onClick={() => setActiveTab('connect')}
              className={`flex-1 px-4 py-2.5 text-sm font-medium rounded-lg transition-all ${
                activeTab === 'connect'
                  ? 'bg-sage text-white'
                  : 'bg-card text-muted-foreground hover:text-foreground'
              }`}
            >
              Connect
            </button>
          </div>
        </div>
      </div>

      {/* Three-column layout */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-6 sm:py-8 pb-12 sm:pb-16">
        {/* Mobile Tabbed View */}
        <div className="lg:hidden">
          {activeTab === 'availability' && (
            <div className="space-y-6">
              <AvailabilityCalendar />
            </div>
          )}
          {activeTab === 'feed' && (
            <div className="space-y-6">
              <CreativeFeed />
            </div>
          )}
          {activeTab === 'connect' && (
            <div className="space-y-6">
              <Gallery />
              <NowPlaying />
              <ContactForm />
              <LivestreamSchedule />
            </div>
          )}
        </div>

        {/* Desktop Three-column Grid */}
        <div className="hidden lg:grid lg:grid-cols-[450px,1fr,350px] gap-4 sm:gap-6">
          {/* Left Column - Sticky */}
          <aside className="space-y-6 sm:space-y-8 lg:sticky lg:top-8 lg:self-start lg:max-h-[calc(100vh-4rem)] lg:overflow-y-auto">
            <AvailabilityCalendar />
          </aside>

          {/* Center Content Area */}
          <main className="space-y-6 sm:space-y-8">
            <CreativeFeed />
          </main>

          {/* Right Column - Sticky */}
          <aside className="space-y-6 sm:space-y-8 lg:sticky lg:top-8 lg:self-start">
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
