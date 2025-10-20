import { useState } from "react";
import { Send, Mail, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));

    toast({
      title: "Message sent",
      description: "Thank you for reaching out. I'll respond thoughtfully soon.",
    });

    setFormData({ name: "", email: "", message: "" });
    setIsSubmitting(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div id="contact">
      <div className="mb-4 sm:mb-6">
        <div className="inline-flex items-center gap-2 mb-3 px-3 py-1.5 bg-dusk/10 border border-dusk/20 rounded-full">
          <Mail className="w-3.5 h-3.5 text-dusk" />
          <span className="text-xs font-mono text-dusk">Contact</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-bold mb-2">
          Send a Message
        </h2>
        <p className="text-sm text-muted-foreground">
          I read every message personally
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="name" className="text-xs font-medium text-foreground">
            Your Name
          </label>
          <Input
            id="name"
            name="name"
            type="text"
            required
            value={formData.name}
            onChange={handleChange}
            placeholder="How should I address you?"
            className="bg-card border-border focus:border-sage focus:ring-sage/20 transition-all duration-300 text-sm h-11 sm:h-10"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="email" className="text-xs font-medium text-foreground">
            Email Address
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="your@email.com"
            className="bg-card border-border focus:border-sage focus:ring-sage/20 transition-all duration-300 text-sm h-11 sm:h-10"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="message" className="text-xs font-medium text-foreground">
            Your Message
          </label>
          <Textarea
            id="message"
            name="message"
            required
            value={formData.message}
            onChange={handleChange}
            placeholder="Share what's on your mind..."
            rows={5}
            className="bg-card border-border focus:border-sage focus:ring-sage/20 transition-all duration-300 resize-none text-sm"
          />
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-11 sm:h-10 bg-dusk hover:bg-dusk/90 text-white text-sm font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-1.5" />
              Sending...
            </>
          ) : (
            <>
              <Send className="w-3.5 h-3.5 mr-1.5" />
              Send Message
            </>
          )}
        </Button>
      </form>
    </div>
  );
};

export default ContactForm;
