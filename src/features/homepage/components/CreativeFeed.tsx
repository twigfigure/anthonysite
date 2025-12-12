import { useState } from "react";
import { Sparkles, Calendar, ArrowRight, Heart, Briefcase, Bookmark, ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/card";

const CreativeFeed = () => {
  const [activeTab, setActiveTab] = useState<'thoughts' | 'prayers' | 'projects' | 'bookmarks'>('thoughts');

  const posts = [
    {
      date: "Oct 12, 2025",
      type: "Reflection",
      title: "On digital minimalism",
      excerpt: "Three months without social media. The signal-to-noise ratio in my life has never been clearer. Solitude is not loneliness — it's clarity.",
      tags: ["philosophy", "digital life"],
    },
    {
      date: "Oct 8, 2025",
      type: "Project",
      title: "Building in the quiet",
      excerpt: "Started a new creative coding experiment exploring generative soundscapes. Mixing JavaScript with ambient field recordings.",
      tags: ["code", "music", "experiment"],
    },
    {
      date: "Oct 3, 2025",
      type: "Music",
      title: "October playlist",
      excerpt: "Curated a collection of ambient works perfect for deep focus: Brian Eno, Nils Frahm, and some hidden gems from Bandcamp.",
      tags: ["music", "curation"],
    },
    {
      date: "Sep 28, 2025",
      type: "Note",
      title: "Thoughts on async communication",
      excerpt: "Real-time isn't always better. Asynchronous communication respects time and attention. It's intentional, not reactive.",
      tags: ["communication", "productivity"],
    },
  ];

  const prayerRequests = [
    {
      date: "Oct 14, 2025",
      category: "Health",
      title: "Healing for a friend",
      request: "Praying for complete healing and restoration. May peace and comfort be with them during this difficult time.",
      tags: ["healing", "comfort"],
    },
    {
      date: "Oct 10, 2025",
      category: "Wisdom",
      title: "Guidance for life decisions",
      request: "Seeking clarity and wisdom for the path ahead. Trusting in divine timing and direction for major life choices.",
      tags: ["wisdom", "guidance"],
    },
    {
      date: "Oct 6, 2025",
      category: "Gratitude",
      title: "Thankful for community",
      request: "Grateful for the connections and conversations that have brought light and perspective. Praying for continued growth together.",
      tags: ["gratitude", "community"],
    },
    {
      date: "Oct 2, 2025",
      category: "Strength",
      title: "Peace in uncertainty",
      request: "Asking for strength and peace during times of transition. May faith remain steady when circumstances feel unclear.",
      tags: ["peace", "faith"],
    },
  ];

  const projects = [
    {
      date: "Oct 2025",
      status: "In Progress",
      title: "Short Novel Collection",
      description: "Writing a series of interconnected short stories exploring themes of faith, identity, and modern disconnection.",
      tags: ["writing", "fiction"],
      progress: 65,
    },
    {
      date: "Sep 2025",
      status: "Active",
      title: "Bible Abridge Project",
      description: "Creating an accessible, condensed version of the Bible that preserves core narratives and teachings while making it approachable for modern readers.",
      tags: ["faith", "writing", "theology"],
      progress: 40,
    },
    {
      date: "Aug 2025",
      status: "Active",
      title: "Personal Website & Digital Sanctuary",
      description: "Building this off-grid hub as an alternative to social media. A space for intentional connection and creative expression.",
      tags: ["code", "design", "web"],
      progress: 80,
    },
    {
      date: "Oct 2025",
      status: "Planning",
      title: "Ambient Soundscape Generator",
      description: "Developing a creative coding tool that generates ambient soundscapes based on real-time data and user interaction.",
      tags: ["code", "music", "generative"],
      progress: 20,
    },
  ];

  const bookmarks = [
    {
      title: "Claude AI",
      url: "https://claude.ai",
      description: "Anthropic's AI assistant for thoughtful conversations and coding help",
      category: "AI Tools",
    },
    {
      title: "Hacker News",
      url: "https://news.ycombinator.com",
      description: "Tech news and discussion community",
      category: "News",
    },
    {
      title: "GitHub",
      url: "https://github.com",
      description: "Code hosting and collaboration platform",
      category: "Development",
    },
    {
      title: "MDN Web Docs",
      url: "https://developer.mozilla.org",
      description: "Comprehensive web development documentation",
      category: "Development",
    },
    {
      title: "Tailwind CSS",
      url: "https://tailwindcss.com",
      description: "Utility-first CSS framework",
      category: "Design",
    },
    {
      title: "Bible Gateway",
      url: "https://www.biblegateway.com",
      description: "Read and study the Bible in multiple translations",
      category: "Faith",
    },
  ];

  return (
    <div>
      {/* Toggle Pills - Horizontal scroll on mobile */}
      <div className="flex gap-2 sm:gap-3 mb-4 sm:mb-6 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-none sm:flex-wrap sm:overflow-visible">
        <button
          onClick={() => setActiveTab('thoughts')}
          className={`flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-full text-[11px] sm:text-xs font-medium transition-all duration-200 whitespace-nowrap flex-shrink-0 ${
            activeTab === 'thoughts'
              ? "bg-foreground/10 border border-foreground/20 text-foreground"
              : "bg-transparent border border-border text-muted-foreground active:text-foreground"
          }`}
        >
          <Sparkles className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
          Thoughts
        </button>
        <button
          onClick={() => setActiveTab('prayers')}
          className={`flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-full text-[11px] sm:text-xs font-medium transition-all duration-200 whitespace-nowrap flex-shrink-0 ${
            activeTab === 'prayers'
              ? "bg-foreground/10 border border-foreground/20 text-foreground"
              : "bg-transparent border border-border text-muted-foreground active:text-foreground"
          }`}
        >
          <Heart className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
          Prayers
        </button>
        <button
          onClick={() => setActiveTab('projects')}
          className={`flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-full text-[11px] sm:text-xs font-medium transition-all duration-200 whitespace-nowrap flex-shrink-0 ${
            activeTab === 'projects'
              ? "bg-foreground/10 border border-foreground/20 text-foreground"
              : "bg-transparent border border-border text-muted-foreground active:text-foreground"
          }`}
        >
          <Briefcase className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
          Projects
        </button>
        <button
          onClick={() => setActiveTab('bookmarks')}
          className={`flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-full text-[11px] sm:text-xs font-medium transition-all duration-200 whitespace-nowrap flex-shrink-0 ${
            activeTab === 'bookmarks'
              ? "bg-foreground/10 border border-foreground/20 text-foreground"
              : "bg-transparent border border-border text-muted-foreground active:text-foreground"
          }`}
        >
          <Bookmark className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
          Bookmarks
        </button>
      </div>

      {activeTab === 'thoughts' ? (
        <>
          <div className="mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-bold mb-1.5 sm:mb-2">
              Notes from the Cabin
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Updates, experiments, and observations
            </p>
          </div>

          <div className="space-y-3 sm:space-y-4">
            {posts.map((post, index) => (
          <Card
            key={index}
            className="group p-3 sm:p-4 bg-card border-border active:border-sage/30 sm:hover:border-sage/30 transition-all duration-200 sm:hover:shadow-md sm:hover:shadow-sage/10 cursor-pointer"
          >
            <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2 text-[10px] sm:text-xs text-muted-foreground">
              <Calendar className="w-2.5 sm:w-3 h-2.5 sm:h-3" />
              <span className="font-mono">{post.date}</span>
              <span className="w-1 h-1 rounded-full bg-sage" />
              <span className="text-sage font-medium">{post.type}</span>
            </div>

            <h3 className="text-sm sm:text-base font-semibold mb-1.5 sm:mb-2 group-active:text-sage sm:group-hover:text-sage transition-colors duration-200">
              {post.title}
            </h3>

            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-2 sm:mb-3">
              {post.excerpt}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex gap-1 sm:gap-1.5 flex-wrap">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] sm:text-xs px-1.5 py-0.5 bg-muted rounded font-mono text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <ArrowRight className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-sage opacity-50 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200" />
            </div>
          </Card>
        ))}
          </div>
        </>
      ) : activeTab === 'prayers' ? (
        <>
          <div className="mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-bold mb-1.5 sm:mb-2">
              Prayers
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Prayers, gratitude, and seeking guidance
            </p>
          </div>

          <div className="space-y-3 sm:space-y-4">
            {prayerRequests.map((prayer, index) => (
              <Card
                key={index}
                className="group p-3 sm:p-4 bg-card border-border active:border-dusk/30 sm:hover:border-dusk/30 transition-all duration-200 sm:hover:shadow-md sm:hover:shadow-dusk/10 cursor-pointer"
              >
                <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2 text-[10px] sm:text-xs text-muted-foreground">
                  <Calendar className="w-2.5 sm:w-3 h-2.5 sm:h-3" />
                  <span className="font-mono">{prayer.date}</span>
                  <span className="w-1 h-1 rounded-full bg-dusk" />
                  <span className="text-dusk font-medium">{prayer.category}</span>
                </div>

                <h3 className="text-sm sm:text-base font-semibold mb-1.5 sm:mb-2 group-active:text-dusk sm:group-hover:text-dusk transition-colors duration-200">
                  {prayer.title}
                </h3>

                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-2 sm:mb-3">
                  {prayer.request}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex gap-1 sm:gap-1.5 flex-wrap">
                    {prayer.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] sm:text-xs px-1.5 py-0.5 bg-muted rounded font-mono text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <ArrowRight className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-dusk opacity-50 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200" />
                </div>
              </Card>
            ))}
          </div>
        </>
      ) : activeTab === 'projects' ? (
        <>
          <div className="mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-bold mb-1.5 sm:mb-2">
              Projects
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Things I'm building and working on
            </p>
          </div>

          <div className="space-y-3 sm:space-y-4">
            {projects.map((project, index) => (
              <Card
                key={index}
                className="group p-3 sm:p-4 bg-card border-border active:border-amber/30 sm:hover:border-amber/30 transition-all duration-200 sm:hover:shadow-md sm:hover:shadow-amber/10 cursor-pointer"
              >
                <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2 text-[10px] sm:text-xs text-muted-foreground">
                  <Calendar className="w-2.5 sm:w-3 h-2.5 sm:h-3" />
                  <span className="font-mono">{project.date}</span>
                  <span className="w-1 h-1 rounded-full bg-amber" />
                  <span className="text-amber font-medium">{project.status}</span>
                </div>

                <h3 className="text-sm sm:text-base font-semibold mb-1.5 sm:mb-2 group-active:text-amber sm:group-hover:text-amber transition-colors duration-200">
                  {project.title}
                </h3>

                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-2 sm:mb-3">
                  {project.description}
                </p>

                {/* Progress Bar */}
                <div className="mb-2 sm:mb-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] sm:text-xs text-muted-foreground">Progress</span>
                    <span className="text-[10px] sm:text-xs font-medium text-amber">{project.progress}%</span>
                  </div>
                  <div className="w-full h-1 sm:h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber rounded-full transition-all duration-500"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex gap-1 sm:gap-1.5 flex-wrap">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] sm:text-xs px-1.5 py-0.5 bg-muted rounded font-mono text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <ArrowRight className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-amber opacity-50 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200" />
                </div>
              </Card>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-bold mb-1.5 sm:mb-2">
              Bookmarks
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Useful links and resources
            </p>
          </div>

          <div className="space-y-3 sm:space-y-4">
            {bookmarks.map((bookmark, index) => (
              <a
                key={index}
                href={bookmark.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Card className="group p-3 sm:p-4 bg-card border-border active:border-sage/30 sm:hover:border-sage/30 transition-all duration-200 sm:hover:shadow-md sm:hover:shadow-sage/10 cursor-pointer">
                  <div className="flex items-start justify-between gap-2 sm:gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
                        <span className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 bg-sage/10 border border-sage/20 rounded-full text-sage font-mono">
                          {bookmark.category}
                        </span>
                      </div>

                      <h3 className="text-sm sm:text-base font-semibold mb-1.5 sm:mb-2 group-active:text-sage sm:group-hover:text-sage transition-colors duration-200 flex items-center gap-1.5 sm:gap-2">
                        {bookmark.title}
                        <ExternalLink className="w-3 sm:w-3.5 h-3 sm:h-3.5 opacity-50 flex-shrink-0" />
                      </h3>

                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                        {bookmark.description}
                      </p>

                      <p className="text-[10px] sm:text-xs text-muted-foreground/60 mt-1.5 sm:mt-2 font-mono truncate">
                        {bookmark.url}
                      </p>
                    </div>

                    <ArrowRight className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-sage opacity-50 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200 flex-shrink-0 mt-1" />
                  </div>
                </Card>
              </a>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default CreativeFeed;
