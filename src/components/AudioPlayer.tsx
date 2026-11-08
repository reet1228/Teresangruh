import React, { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX, Music, Disc } from "lucide-react";
import { WEDDING_DATA } from "../data/weddingData";

interface AudioPlayerProps {
  autoPlayTrigger?: boolean;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ autoPlayTrigger }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [hasInteracted, setHasInteracted] = useState<boolean>(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (autoPlayTrigger && !isPlaying && !hasInteracted) {
      audio.play().then(() => {
        setIsPlaying(true);
        setHasInteracted(true);
      }).catch((err) => {
        console.warn("Autoplay was prevented by browser policy:", err);
      });
    }
  }, [autoPlayTrigger, isPlaying, hasInteracted]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => {
        setIsPlaying(true);
        setHasInteracted(true);
      }).catch((e) => console.error("Audio playback error:", e));
    }
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2">
      <audio
        ref={audioRef}
        src={WEDDING_DATA.music.src}
        preload="auto"
        loop
      />

      <div className="flex items-center gap-2 px-3 py-2 bg-[#1B1510]/85 backdrop-blur-md rounded-full border border-[#D4AF37]/40 shadow-2xl transition-all duration-300 hover:border-[#D4AF37] hover:bg-[#1B1510]">
        {/* Disc / Music Note Icon */}
        <button
          onClick={togglePlay}
          className="relative flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-tr from-[#916E34] to-[#ECC880] text-[#1A1208] shadow-md hover:scale-105 active:scale-95 transition-transform"
          title={isPlaying ? "Pause Music" : "Play Wedding Music"}
          aria-label={isPlaying ? "Pause Wedding Music" : "Play Wedding Music"}
        >
          <Disc
            className={`w-5 h-5 transition-transform duration-1000 ${
              isPlaying ? "animate-spin" : ""
            }`}
            style={{ animationDuration: "3s" }}
          />
        </button>

        {/* Track info & visualizer */}
        <div 
          onClick={togglePlay} 
          className="cursor-pointer hidden sm:flex flex-col pr-1 select-none text-left"
        >
          <span className="text-[11px] font-cinzel font-semibold tracking-wider text-[#ECC880] whitespace-nowrap">
            #tereSAngRUh
          </span>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-stone-300 font-sans tracking-wide">
              {isPlaying ? "Playing Music" : "Music Paused"}
            </span>
            {/* Visualizer bars */}
            <div className="flex items-end gap-0.5 h-2.5">
              <span
                className={`w-0.5 bg-[#ECC880] rounded-full transition-all ${
                  isPlaying ? "h-2.5 animate-pulse" : "h-1"
                }`}
                style={{ animationDuration: "0.6s" }}
              />
              <span
                className={`w-0.5 bg-[#ECC880] rounded-full transition-all ${
                  isPlaying ? "h-3 animate-pulse" : "h-1.5"
                }`}
                style={{ animationDuration: "0.4s", animationDelay: "0.15s" }}
              />
              <span
                className={`w-0.5 bg-[#ECC880] rounded-full transition-all ${
                  isPlaying ? "h-2 animate-pulse" : "h-0.5"
                }`}
                style={{ animationDuration: "0.5s", animationDelay: "0.3s" }}
              />
            </div>
          </div>
        </div>

        {/* Mute/Unmute quick toggle */}
        <button
          onClick={toggleMute}
          className="p-1.5 text-stone-300 hover:text-[#ECC880] rounded-full hover:bg-white/10 transition-colors"
          title={isMuted ? "Unmute" : "Mute"}
          aria-label={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};
