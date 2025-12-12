import { Heart, Code } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-6 sm:py-8 px-4 sm:px-6 border-t border-border bg-card/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center space-y-1.5 sm:space-y-2">
          <p className="text-[10px] sm:text-xs text-muted-foreground font-mono flex items-center justify-center gap-1.5 sm:gap-2">
            <Code className="w-2.5 sm:w-3 h-2.5 sm:h-3" />
            Built with intention, not haste
          </p>

          <p className="text-[10px] sm:text-xs text-muted-foreground flex items-center justify-center gap-1.5 sm:gap-2">
            Made with <Heart className="w-2.5 sm:w-3 h-2.5 sm:h-3 text-destructive fill-destructive" /> in quiet solitude
          </p>

          <div className="pt-1.5 sm:pt-2 border-t border-border/50">
            <p className="text-[10px] sm:text-xs text-muted-foreground/80">
              © {currentYear} — A digital sanctuary
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
