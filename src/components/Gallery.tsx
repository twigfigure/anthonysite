import { Image } from "lucide-react";

const Gallery = () => {
  return (
    <div>
      <div className="inline-flex items-center gap-2 mb-3 px-3 py-1.5 bg-sage/10 border border-sage/20 rounded-full">
        <Image className="w-3.5 h-3.5 text-sage" />
        <span className="text-xs font-mono text-sage">Gallery</span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Image 1 */}
        <div className="aspect-square bg-gradient-to-br from-sage/20 to-sage/5 rounded-lg border border-border hover:border-sage/50 transition-all duration-300 cursor-pointer overflow-hidden group">
          <div className="w-full h-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <Image className="w-8 h-8 text-sage/40" />
          </div>
        </div>

        {/* Image 2 */}
        <div className="aspect-square bg-gradient-to-br from-dusk/20 to-dusk/5 rounded-lg border border-border hover:border-dusk/50 transition-all duration-300 cursor-pointer overflow-hidden group">
          <div className="w-full h-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <Image className="w-8 h-8 text-dusk/40" />
          </div>
        </div>

        {/* Image 3 */}
        <div className="aspect-square bg-gradient-to-br from-amber/20 to-amber/5 rounded-lg border border-border hover:border-amber/50 transition-all duration-300 cursor-pointer overflow-hidden group">
          <div className="w-full h-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <Image className="w-8 h-8 text-amber/40" />
          </div>
        </div>

        {/* Image 4 */}
        <div className="aspect-square bg-gradient-to-br from-charcoal/20 to-charcoal/5 rounded-lg border border-border hover:border-charcoal/50 transition-all duration-300 cursor-pointer overflow-hidden group">
          <div className="w-full h-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <Image className="w-8 h-8 text-charcoal/40" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Gallery;
