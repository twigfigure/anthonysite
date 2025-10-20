import { Calendar, Clock, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const AvailabilityCalendar = () => {
  // Mock availability data
  const availableSlots = [
    { day: "Monday", time: "2:00 PM - 4:00 PM EST", available: true },
    { day: "Tuesday", time: "10:00 AM - 12:00 PM EST", available: true },
    { day: "Wednesday", time: "Unavailable", available: false },
    { day: "Thursday", time: "3:00 PM - 5:00 PM EST", available: true },
    { day: "Friday", time: "1:00 PM - 3:00 PM EST", available: true },
  ];

  return (
    <div id="availability">
      <div className="mb-4 sm:mb-6">
        <div className="inline-flex items-center gap-2 mb-3 px-3 py-1.5 bg-sage/10 border border-sage/20 rounded-full">
          <Calendar className="w-3.5 h-3.5 text-sage" />
          <span className="text-xs font-mono text-sage">Availability</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-bold mb-2">
          Book a Call
        </h2>
        <p className="text-sm text-muted-foreground">
          Specific windows for meaningful discussions
        </p>
      </div>

      <div className="space-y-3 mb-6">
        {availableSlots.map((slot, index) => (
          <Card
            key={slot.day}
            className={`p-4 transition-all duration-300 ${
              slot.available
                ? 'bg-card border-sage/30 hover:border-sage/50 hover:shadow-md hover:shadow-sage/20'
                : 'bg-muted/30 border-muted opacity-60'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-sm font-semibold mb-1">{slot.day}</h3>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Clock className="w-3.5 h-3.5" />
                  <span className="text-xs">{slot.time}</span>
                </div>
              </div>
              {slot.available && (
                <div className="w-2.5 h-2.5 bg-sage rounded-full animate-glow-pulse" />
              )}
            </div>
          </Card>
        ))}
      </div>

      <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <Video className="w-4 h-4 text-dusk" />
          <h3 className="text-sm font-semibold">Ready to connect?</h3>
        </div>
        <div className="flex flex-col gap-2">
          <Button
            className="h-11 sm:h-9 bg-sage hover:bg-sage/90 text-white text-xs sm:text-xs font-medium transition-all duration-300"
          >
            <Calendar className="w-3.5 h-3.5 mr-1.5" />
            Google Meet
          </Button>
          <Button
            variant="outline"
            className="h-11 sm:h-9 border-dusk/30 hover:border-dusk/50 hover:bg-dusk/5 text-xs sm:text-xs font-medium transition-all duration-300"
          >
            <Video className="w-3.5 h-3.5 mr-1.5" />
            Zoom
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AvailabilityCalendar;
