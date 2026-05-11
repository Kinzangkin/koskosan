import { MapPin } from "lucide-react";

export function RoomMap() {
  return (
    <div className="w-full h-full min-h-[600px] bg-[#E5E9F0] rounded-[2rem] relative overflow-hidden flex items-center justify-center">
      {/* Real Map Preview Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat" 
        style={{ backgroundImage: "url('/map_preview.png')" }}
      >
        {/* Overlay to keep the glassmorphism feel */}
        <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px]"></div>
      </div>

      {/* Main Map Marker Area */}
      <div className="relative z-10">
        {/* Radar Effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-emerald-400/20 rounded-full animate-ping"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-emerald-400/30 rounded-full"></div>
        
        {/* Map Card Info */}
        <div className="bg-white p-4 rounded-xl shadow-xl w-64 absolute top-1/2 left-1/2 transform translate-x-4 -translate-y-1/2">
          <h4 className="font-bold text-slate-800 text-sm">Kost Anzelly</h4>
          <div className="flex items-center gap-1 text-[10px] text-slate-500 mb-2">
            <span className="text-orange-400">★★★★★</span> (5.0)
          </div>
          <p className="text-[10px] text-slate-500 leading-tight mb-2">
            Perumahan Buha Griya Permai, Buha, Mapanget, Manado
          </p>
          <a 
            href="https://maps.app.goo.gl/Gjk2weZ2n81MeDzz9" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-emerald-600 text-xs font-medium hover:underline flex items-center gap-1"
          >
            Lihat Lokasi <span className="text-[10px]">▶</span>
          </a>
        </div>

        {/* The Pin */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full pb-2">
          <MapPin className="w-8 h-8 text-red-500 fill-red-100" />
        </div>
      </div>
    </div>
  );
}
