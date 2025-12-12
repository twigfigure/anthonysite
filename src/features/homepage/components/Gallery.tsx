import { Image } from "lucide-react";

const Gallery = () => {
  return (
    <div>
      <div className="inline-flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3 px-2.5 sm:px-3 py-1 sm:py-1.5 bg-sage/10 border border-sage/20 rounded-full">
        <Image className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-sage" />
        <span className="text-[10px] sm:text-xs font-mono text-sage">Gallery</span>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        {/* Image 1 */}
        <div className="aspect-square bg-gradient-to-br from-sage/20 to-sage/5 rounded-lg border border-border active:border-sage/50 sm:hover:border-sage/50 transition-all duration-200 cursor-pointer overflow-hidden group">
          <div className="w-full h-full flex items-center justify-center group-active:scale-110 sm:group-hover:scale-110 transition-transform duration-200">
            <Image className="w-6 sm:w-8 h-6 sm:h-8 text-sage/40" />
          </div>
        </div>

        {/* Image 2 */}
        <div className="aspect-square bg-gradient-to-br from-dusk/20 to-dusk/5 rounded-lg border border-border active:border-dusk/50 sm:hover:border-dusk/50 transition-all duration-200 cursor-pointer overflow-hidden group">
          <div className="w-full h-full flex items-center justify-center group-active:scale-110 sm:group-hover:scale-110 transition-transform duration-200">
            <Image className="w-6 sm:w-8 h-6 sm:h-8 text-dusk/40" />
          </div>
        </div>

        {/* Image 3 */}
        <div className="aspect-square bg-gradient-to-br from-amber/20 to-amber/5 rounded-lg border border-border active:border-amber/50 sm:hover:border-amber/50 transition-all duration-200 cursor-pointer overflow-hidden group">
          <div className="w-full h-full flex items-center justify-center group-active:scale-110 sm:group-hover:scale-110 transition-transform duration-200">
            <Image className="w-6 sm:w-8 h-6 sm:h-8 text-amber/40" />
          </div>
        </div>

        {/* Image 4 */}
        <div className="aspect-square bg-gradient-to-br from-charcoal/20 to-charcoal/5 rounded-lg border border-border active:border-charcoal/50 sm:hover:border-charcoal/50 transition-all duration-200 cursor-pointer overflow-hidden group">
          <div className="w-full h-full flex items-center justify-center group-active:scale-110 sm:group-hover:scale-110 transition-transform duration-200">
            <Image className="w-6 sm:w-8 h-6 sm:h-8 text-charcoal/40" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Gallery;
