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
      {/* Mobile Action Buttons - Menu & Chat - Refined floating buttons */}
      <div className="lg:hidden fixed top-3 right-3 z-50 flex gap-1.5">
        <button
          onClick={() => setChatModalOpen(true)}
          className="p-2.5 bg-sage/95 active:bg-sage backdrop-blur-md border border-sage/80 rounded-xl shadow-lg transition-all duration-200 active:scale-95"
        >
          <MessageCircle className="w-4 h-4 text-white" />
        </button>
        <button
          onClick={() => user ? signOut() : setAuthModalOpen(true)}
          className="p-2.5 bg-card/90 active:bg-card backdrop-blur-md border border-border/80 rounded-xl shadow-lg transition-all duration-200 active:scale-95"
        >
          <LogIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2.5 bg-card/90 active:bg-card backdrop-blur-md border border-border/80 rounded-xl shadow-lg transition-all duration-200 active:scale-95"
        >
          {mobileMenuOpen ? (
            <X className="w-4 h-4" />
          ) : (
            <Menu className="w-4 h-4" />
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

      {/* Mobile Menu Dropdown - Refined slide-in menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed top-14 right-3 z-50 w-56 bg-card/98 backdrop-blur-xl border border-border/60 rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-top-2 duration-200">
          <div className="max-h-[70vh] overflow-y-auto overscroll-contain">
            <a
              href="#upray4me"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-3 text-sm text-muted-foreground active:text-foreground active:bg-sage/10 transition-colors border-b border-border/50"
            >
              UPray4Me
            </a>
            <a
              href="#ipray4u"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-3 text-sm text-muted-foreground active:text-foreground active:bg-sage/10 transition-colors border-b border-border/50"
            >
              IPray4U
            </a>
            <a
              href="#testimony"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-3 text-sm text-muted-foreground active:text-foreground active:bg-sage/10 transition-colors border-b border-border/50"
            >
              Testimony
            </a>

            {/* Projects Submenu - Collapsible style on mobile */}
            <div className="border-b border-border/50">
              <div className="px-4 py-2 text-[10px] font-semibold text-sage uppercase tracking-wider bg-sage/5">
                Projects
              </div>
              <div className="divide-y divide-border/30">
                <Link
                  to="/kindred"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2.5 active:bg-amber/10 transition-colors"
                >
                  <div className="text-sm font-medium">Kindred</div>
                  <div className="text-[10px] text-muted-foreground">Generate emotional creatures</div>
                </Link>
                <Link
                  to="/fantasy-basketball"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2.5 active:bg-orange/10 transition-colors"
                >
                  <div className="text-sm font-medium">Fantasy Basketball</div>
                  <div className="text-[10px] text-muted-foreground">Auction draft tool</div>
                </Link>
                <Link
                  to="/guild-manager"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2.5 active:bg-purple/10 transition-colors"
                >
                  <div className="text-sm font-medium">Guild Manager</div>
                  <div className="text-[10px] text-muted-foreground">Solo Leveling guild game</div>
                </Link>
                <Link
                  to="/manhua-tracker"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2.5 active:bg-teal/10 transition-colors"
                >
                  <div className="text-sm font-medium">PeakScroll</div>
                  <div className="text-[10px] text-muted-foreground">Track your manhua</div>
                </Link>
                <Link
                  to="/detailstack"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2.5 active:bg-champagne-500/10 transition-colors"
                >
                  <div className="text-sm font-medium">DetailStack</div>
                  <div className="text-[10px] text-muted-foreground">Auto detailing studio</div>
                </Link>
                <Link
                  to="/otexam"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2.5 active:bg-amber-600/10 transition-colors"
                >
                  <div className="text-sm font-medium">OTexam</div>
                  <div className="text-[10px] text-muted-foreground">NBCOT exam prep</div>
                </Link>
              </div>
            </div>

            <a
              href="#boba"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-3 text-sm text-muted-foreground active:text-foreground active:bg-sage/10 transition-colors"
            >
              Buy Me Boba
            </a>
          </div>
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
                  className="block px-4 py-3 text-sm text-muted-foreground hover:text-foreground hover:bg-champagne-500/10 transition-colors border-b border-border"
                >
                  <div className="font-semibold mb-0.5">DetailStack</div>
                  <div className="text-xs opacity-75">Premium auto detailing studio</div>
                </Link>
                <Link
                  to="/otexam"
                  className="block px-4 py-3 text-sm text-muted-foreground hover:text-foreground hover:bg-amber-600/10 transition-colors"
                >
                  <div className="font-semibold mb-0.5">OTexam</div>
                  <div className="text-xs opacity-75">NBCOT exam prep & analytics</div>
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

      {/* Mobile Tab Navigation - Refined pill-style tabs */}
      <div className="lg:hidden sticky top-0 z-40 bg-background/98 backdrop-blur-md border-b border-border/50 shadow-sm">
        <div className="max-w-[1600px] mx-auto px-3 py-2.5">
          <div className="flex gap-1 p-1 bg-muted/50 rounded-xl">
            <button
              onClick={() => setActiveTab('availability')}
              className={`flex-1 px-3 py-2.5 text-xs font-medium rounded-lg transition-all duration-200 ${
                activeTab === 'availability'
                  ? 'bg-sage text-white shadow-sm'
                  : 'text-muted-foreground active:bg-muted/80'
              }`}
            >
              Availability
            </button>
            <button
              onClick={() => setActiveTab('feed')}
              className={`flex-1 px-3 py-2.5 text-xs font-medium rounded-lg transition-all duration-200 ${
                activeTab === 'feed'
                  ? 'bg-sage text-white shadow-sm'
                  : 'text-muted-foreground active:bg-muted/80'
              }`}
            >
              Feed
            </button>
            <button
              onClick={() => setActiveTab('connect')}
              className={`flex-1 px-3 py-2.5 text-xs font-medium rounded-lg transition-all duration-200 ${
                activeTab === 'connect'
                  ? 'bg-sage text-white shadow-sm'
                  : 'text-muted-foreground active:bg-muted/80'
              }`}
            >
              Connect
            </button>
          </div>
        </div>
      </div>

      {/* Three-column layout */}
      <div className="max-w-[1600px] mx-auto px-3 sm:px-6 py-4 sm:py-8 pb-8 sm:pb-16">
        {/* Mobile Tabbed View - Smooth transitions */}
        <div className="lg:hidden">
          {activeTab === 'availability' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <AvailabilityCalendar />
            </div>
          )}
          {activeTab === 'feed' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <CreativeFeed />
            </div>
          )}
          {activeTab === 'connect' && (
            <div className="space-y-5 animate-in fade-in duration-200">
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
