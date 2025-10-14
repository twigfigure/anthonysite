import { Radio, Clock, ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const LivestreamSchedule = () => {
  const upcomingStreams = [
    {
      title: "Creative Coding Session",
      description: "Building generative art with p5.js and exploring algorithmic patterns",
      date: "Friday, Oct 18",
      time: "7:00 PM EST",
      platform: "Twitch",
      isLive: false,
    },
    {
      title: "Ambient Music Production",
      description: "Live composition session using modular synthesis and field recordings",
      date: "Sunday, Oct 20",
      time: "4:00 PM EST",
      platform: "YouTube",
      isLive: false,
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 mb-3 px-3 py-1.5 bg-destructive/10 border border-destructive/20 rounded-full">
          <Radio className="w-3.5 h-3.5 text-destructive" />
          <span className="text-xs font-mono text-destructive">Livestreams</span>
        </div>

        <h2 className="text-2xl font-bold mb-2">
          Creating in Public
        </h2>
        <p className="text-sm text-muted-foreground">
          Unfiltered creative work sessions
        </p>
      </div>

      <div className="space-y-4">
        {upcomingStreams.map((stream, index) => (
          <Card
            key={index}
            className="p-4 bg-card border-border hover:border-destructive/30 transition-all duration-300 hover:shadow-md hover:shadow-destructive/10"
          >
            <div className="flex items-start gap-2 mb-2">
              <h3 className="text-base font-semibold flex-1">{stream.title}</h3>
              {stream.isLive && (
                <span className="flex items-center gap-1 px-2 py-0.5 bg-destructive text-white text-xs font-bold rounded-full">
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                  LIVE
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground mb-3">{stream.description}</p>
            <div className="flex flex-wrap gap-3 text-xs mb-3">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span className="font-mono">{stream.date} • {stream.time}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-destructive" />
                <span className="font-medium text-destructive">{stream.platform}</span>
              </div>
            </div>

            <Button
              size="sm"
              variant="outline"
              className="w-full border-destructive/30 hover:border-destructive/50 hover:bg-destructive/5 text-xs font-medium"
            >
              <ExternalLink className="w-3 h-3 mr-1.5" />
              {stream.isLive ? 'Watch Now' : 'Set Reminder'}
            </Button>
          </Card>
        ))}
      </div>

      <Card className="mt-6 p-4 bg-muted/50 border-border text-center">
        <p className="text-xs text-muted-foreground font-mono">
          Streams happen spontaneously — when creativity calls
        </p>
      </Card>
    </div>
  );
};

export default LivestreamSchedule;
