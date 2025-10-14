import { useState } from "react";
import { Calendar, MessageSquare, Send, Smile, Fish, Beef, Mouse, Bird, Beer, Pizza } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import antAvatar from "@/assets/antavatar1.png";
import pixelGem from "@/assets/pixelgem.png";

const Hero = () => {
  const [showChat, setShowChat] = useState(false);
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [showEmojis, setShowEmojis] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [catThoughtIndex, setCatThoughtIndex] = useState(0);

  const dialogues = [
    {
      badge: "Offline, but not unreachable",
      title: "I've stepped off the grid.",
      subtitle: "This is where you can still reach me.",
      description: "Traded noise for intentional communication. This is my digital sanctuary — a quiet signal in the chaos."
    },
    {
      badge: "Living intentionally",
      title: "Slow down. Think deeper.",
      subtitle: "Quality over quantity, always.",
      description: "In a world obsessed with instant, I choose thoughtful. Every interaction here is deliberate and meaningful."
    },
    {
      badge: "Building in solitude",
      title: "Creating without distraction.",
      subtitle: "Focus is my superpower.",
      description: "Away from the endless scroll, I craft with clarity. This space is where real work happens."
    },
    {
      badge: "Embracing the quiet",
      title: "Silence speaks volumes.",
      subtitle: "Not all who are quiet are lost.",
      description: "Sometimes the most profound conversations happen in stillness. Welcome to my corner of peace."
    }
  ];

  const handleAvatarClick = () => {
    setDialogueIndex((prev) => (prev + 1) % dialogues.length);
  };

  const handleCatClick = () => {
    setCatThoughtIndex((prev) => (prev + 1) % catThoughts.length);
  };

  const currentDialogue = dialogues[dialogueIndex];

  const catThoughts = [
    { icon: Fish, color: "text-amber" },
    { icon: Beef, color: "text-red-500" },
    { icon: Mouse, color: "text-gray-500" },
    { icon: Bird, color: "text-blue-500" },
    { icon: Beer, color: "text-yellow-600" },
    { icon: Pizza, color: "text-orange-500" },
  ];

  const currentCatThought = catThoughts[catThoughtIndex];

  const emojis = ["😊", "👍", "❤️", "🙏", "😂", "🎉", "✨", "🔥"];

  const handleEmojiClick = (emoji: string) => {
    setChatMessage(prev => prev + emoji);
    setShowEmojis(false);
  };

  return (
    <section className="relative min-h-[60vh] flex items-center overflow-hidden border-b border-border">
      {/* Ambient background */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20 dark:opacity-15"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/90 to-background" />

      {/* Breathing glow orb */}
      <div className="absolute top-1/4 left-1/3 w-64 h-64 bg-sage/20 rounded-full blur-3xl breathing-glow" />
      <div className="absolute bottom-1/4 right-1/3 w-64 h-64 bg-dusk/20 rounded-full blur-3xl breathing-glow" style={{ animationDelay: '2s' }} />

      {/* 3 Column Grid */}
      <div className="relative z-10 w-full max-w-[1600px] mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-[450px,1fr,350px] gap-6">
          {/* First Column - Avatar & Speech Bubble */}
          <div className="col-span-1 fade-in relative pl-8 lg:pl-12">
            {/* Comic Book Style Speech Bubble - Top Right */}
            <div className="absolute -top-4 right-[4.25rem] lg:right-[5.25rem] z-10 w-60 lg:w-76" style={{ filter: 'drop-shadow(0 10px 25px rgba(0, 0, 0, 0.15))' }}>
              {/* Speech bubble content with CSS tail */}
              <div className="relative bg-card border-2 border-foreground/20 rounded-2xl p-4 transition-all duration-300 h-[240px] lg:h-[220px] flex flex-col
                before:content-[''] before:absolute before:bottom-[-1.125rem] before:left-4 before:z-0
                before:w-0 before:h-0 before:border-l-[0.75rem] before:border-l-transparent
                before:border-r-[0.75rem] before:border-r-transparent before:border-t-[1.125rem] before:border-t-foreground/20
                after:content-[''] after:absolute after:bottom-[-0.96rem] after:left-[1.025rem] after:z-10
                after:w-0 after:h-0 after:border-l-[0.7rem] after:border-l-transparent
                after:border-r-[0.7rem] after:border-r-transparent after:border-t-[1rem] after:border-t-card">
                <div className="inline-block mb-2 px-2 py-1 bg-sage/10 border border-sage/20 rounded-full self-start">
                  <p className="text-[0.65rem] font-mono text-sage truncate">
                    {currentDialogue.badge}
                  </p>
                </div>

                <h1 className="text-lg lg:text-xl font-bold mb-2 bg-gradient-to-r from-foreground via-sage to-foreground bg-clip-text text-transparent line-clamp-2">
                  {currentDialogue.title}
                </h1>

                <p className="text-xs text-muted-foreground mb-2 leading-relaxed line-clamp-1">
                  {currentDialogue.subtitle}
                </p>

                <p className="text-[0.7rem] text-muted-foreground/80 leading-relaxed line-clamp-3 flex-1">
                  {currentDialogue.description}
                </p>
              </div>
            </div>

            {/* Avatar - Free Standing */}
            <div className="flex flex-col items-center lg:items-start gap-6 pt-48 lg:pt-52">
              <div className="flex items-end gap-4 relative">
                {/* Wife's Dialogue Box - Smaller, pointing right */}
                <div className="absolute -top-20 -left-20 lg:-left-28 z-20 w-32 lg:w-40" style={{ filter: 'drop-shadow(0 5px 15px rgba(0, 0, 0, 0.15))' }}>
                  <div className="relative bg-card border-2 border-foreground/20 rounded-xl p-3 h-[120px] lg:h-[110px] flex flex-col
                    before:content-[''] before:absolute before:bottom-[-0.75rem] before:right-4 before:z-0
                    before:w-0 before:h-0 before:border-l-[0.5rem] before:border-l-transparent
                    before:border-r-[0.5rem] before:border-r-transparent before:border-t-[0.75rem] before:border-t-foreground/20
                    after:content-[''] after:absolute after:bottom-[-0.64rem] after:right-[1.025rem] after:z-10
                    after:w-0 after:h-0 after:border-l-[0.475rem] after:border-l-transparent
                    after:border-r-[0.475rem] after:border-r-transparent after:border-t-[0.66rem] after:border-t-card">
                    <div className="inline-block mb-2 px-2 py-1 bg-dusk/10 border border-dusk/20 rounded-full self-start">
                      <p className="text-[0.6rem] font-mono text-dusk truncate">
                        Supporting from afar
                      </p>
                    </div>

                    <p className="text-[0.65rem] text-muted-foreground leading-relaxed line-clamp-4 flex-1">
                      Proud of you for creating this space. Keep building with intention.
                    </p>
                  </div>
                </div>

                <img
                  src={antAvatar}
                  alt="Avatar"
                  onClick={handleAvatarClick}
                  className="w-48 h-auto lg:w-40 object-contain cursor-pointer hover:scale-105 transition-transform duration-300"
                  style={{ transform: 'scaleY(0.9)' }}
                />
                <div className="relative w-16 lg:w-14 mb-6 -ml-4">
                  <img
                    src={pixelGem}
                    alt="Pixel Gem"
                    onClick={handleCatClick}
                    className="w-full h-auto object-contain cursor-pointer hover:scale-105 transition-transform duration-300"
                  />

                  {/* Thought Bubble */}
                  <div className="absolute -top-20 left-1/2 translate-x-0 z-20">
                    {/* Main thought bubble */}
                    <div className="w-12 h-12 bg-card border-2 border-foreground/20 rounded-full flex items-center justify-center shadow-lg">
                      {(() => {
                        const IconComponent = currentCatThought.icon;
                        return <IconComponent className={`w-6 h-6 ${currentCatThought.color}`} />;
                      })()}
                    </div>

                    {/* Small connecting circles */}
                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-3 h-3 bg-card border-2 border-foreground/20 rounded-full"></div>
                    <div className="absolute -bottom-5 left-1/2 -translate-x-3 w-2 h-2 bg-card border border-foreground/20 rounded-full"></div>
                  </div>
                </div>

                {/* Health, Mood, Energy, Faith Dots and Contact Button */}
                <div className="mb-8 flex flex-col items-center gap-2 ml-8">
                  <span className="text-xs font-medium text-muted-foreground">Health</span>
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-destructive rounded-full"></div>
                    <div className="w-2 h-2 bg-destructive rounded-full"></div>
                    <div className="w-2 h-2 bg-destructive rounded-full"></div>
                    <div className="w-2 h-2 bg-destructive rounded-full"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  </div>

                  <span className="text-xs font-medium text-muted-foreground mt-1">Mood</span>
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  </div>

                  <span className="text-xs font-medium text-muted-foreground mt-1">Energy</span>
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  </div>

                  <span className="text-xs font-medium text-muted-foreground mt-1">Faith</span>
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  </div>
                </div>
              </div>

              {/* Action Buttons - Archived for future use
              <div className="flex flex-col gap-3 w-full">
                <a
                  href="#availability"
                  className="group px-6 py-2.5 bg-sage hover:bg-sage/90 text-white rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-sage/30 text-center"
                >
                  Book a Conversation
                </a>
                <a
                  href="#contact"
                  className="group px-6 py-2.5 bg-card hover:bg-card/80 border border-border text-foreground rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105 text-center"
                >
                  Send a Message
                </a>
              </div>
              */}
            </div>
          </div>

          {/* Middle Column - Streaming Screen */}
          <div className="hidden lg:block pt-12">
            <div className="bg-black rounded-lg overflow-hidden border-2 border-sage/30 shadow-xl">
              <div className="aspect-video bg-gradient-to-br from-charcoal to-black flex items-center justify-center relative">
                {/* Streaming UI Overlay */}
                <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-destructive rounded-full">
                  <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                  <span className="text-white text-xs font-bold">LIVE</span>
                </div>

                {/* Center Content */}
                <div className="text-center">
                  <div className="w-16 h-16 border-4 border-sage/30 border-t-sage rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-sage/60 text-sm font-mono">Stream Starting Soon...</p>
                </div>

                {/* Bottom Info Bar */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <h3 className="text-white font-semibold">Creative Coding Session</h3>
                  <p className="text-gray-400 text-sm">Building in public</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Schedule/Chat Toggle */}
          <div className="hidden lg:block pt-12">
            <div className="bg-card/50 backdrop-blur-sm border-2 border-border rounded-xl overflow-hidden">
              {/* Toggle Tabs */}
              <div className="flex border-b border-border">
                <button
                  onClick={() => setShowChat(true)}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                    showChat
                      ? "bg-card text-foreground border-b-2 border-sage"
                      : "text-muted-foreground hover:text-foreground hover:bg-card/50"
                  }`}
                >
                  <MessageSquare className="w-4 h-4" />
                  Chat
                </button>
                <button
                  onClick={() => setShowChat(false)}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                    !showChat
                      ? "bg-card text-foreground border-b-2 border-sage"
                      : "text-muted-foreground hover:text-foreground hover:bg-card/50"
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  Schedule
                </button>
              </div>

              {/* Content */}
              <div className="p-5">
                {!showChat ? (
                  <>
                    {/* Schedule View */}
                    <div className="space-y-4 h-[309px] flex flex-col">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-sage rounded-full animate-pulse"></div>
                        <h3 className="text-lg font-bold">Upcoming Schedule</h3>
                      </div>

                      <div className="space-y-4 flex-1">
                        {/* Event 1 */}
                        <div className="border-l-2 border-sage/30 pl-3">
                          <div className="text-xs text-muted-foreground font-mono mb-1">Oct 18 • 7:00 PM EST</div>
                          <h4 className="text-sm font-semibold">Creative Coding Stream</h4>
                          <p className="text-xs text-muted-foreground">Live on Twitch</p>
                        </div>

                        {/* Event 2 */}
                        <div className="border-l-2 border-amber/30 pl-3">
                          <div className="text-xs text-muted-foreground font-mono mb-1">Oct 20 • 4:00 PM EST</div>
                          <h4 className="text-sm font-semibold">Music Production</h4>
                          <p className="text-xs text-muted-foreground">Ambient session</p>
                        </div>

                        {/* Event 3 */}
                        <div className="border-l-2 border-dusk/30 pl-3">
                          <div className="text-xs text-muted-foreground font-mono mb-1">Oct 22 • 2:00 PM EST</div>
                          <h4 className="text-sm font-semibold">Office Hours</h4>
                          <p className="text-xs text-muted-foreground">Book a call slot</p>
                        </div>

                        {/* Event 4 */}
                        <div className="border-l-2 border-sage/30 pl-3">
                          <div className="text-xs text-muted-foreground font-mono mb-1">Oct 25 • 6:00 PM EST</div>
                          <h4 className="text-sm font-semibold">Q&A Session</h4>
                          <p className="text-xs text-muted-foreground">Ask me anything</p>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-border">
                        <p className="text-xs text-muted-foreground/80 text-center font-mono">
                          Times shown in EST
                        </p>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Chat View */}
                    <div className="space-y-4">
                      {/* Chat Messages Area */}
                      <div className="h-[255px] overflow-y-auto overflow-x-hidden space-y-3 mb-4 pr-2 scrollbar-thin scrollbar-thumb-sage/30 scrollbar-track-transparent">
                        <div className="text-xs text-center text-muted-foreground/60 font-mono py-2">
                          Start a conversation
                        </div>
                      </div>

                      {/* Chat Input */}
                      <div className="relative">
                        {/* Emoji Picker */}
                        {showEmojis && (
                          <div className="absolute bottom-full mb-2 left-0 bg-card border border-border rounded-lg p-2 shadow-lg">
                            <div className="grid grid-cols-4 gap-2">
                              {emojis.map((emoji, index) => (
                                <button
                                  key={index}
                                  onClick={() => handleEmojiClick(emoji)}
                                  className="text-xl hover:bg-muted rounded p-1 transition-colors"
                                >
                                  {emoji}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="flex gap-2">
                          <button
                            onClick={() => setShowEmojis(!showEmojis)}
                            className="px-3 py-2 bg-background border border-border hover:bg-muted rounded-lg transition-colors"
                          >
                            <Smile className="w-4 h-4 text-muted-foreground" />
                          </button>
                          <input
                            type="text"
                            value={chatMessage}
                            onChange={(e) => setChatMessage(e.target.value)}
                            placeholder="Type a message..."
                            className="flex-1 px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sage/50"
                          />
                          <button className="px-3 py-2 bg-sage hover:bg-sage/90 text-white rounded-lg transition-colors">
                            <Send className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
