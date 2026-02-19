/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, ChevronRight, ChevronLeft, Sparkles, Music, Volume2, VolumeX } from 'lucide-react';
import { Memory, AppState } from './types';

const INTRO_IMAGE = "IMAGE_1";

const MEMORIES: Memory[] = [
  { id: 1, title: "", description: "我終於的起心肝買戒指啦", imageUrl: "IMAGE_2" },
  { id: 2, title: "", description: "一直以黎可能你覺得我唔爹唔吊", imageUrl: "IMAGE_3" },
  { id: 3, title: "", description: "我自細得媽教 佢教唔到我咩係家庭", imageUrl: "IMAGE_4" },
  { id: 4, title: "", description: "佢令我覺得結完咪又係離婚", imageUrl: "IMAGE_5" },
  { id: 5, title: "", description: "佢識埋個衰男人 令佢痛苦左一世 最辛苦既野都要一個人承擔", imageUrl: "IMAGE_6" },
  { id: 6, title: "", description: "我覺得自己同媽都好慘 一直遭遇不幸", imageUrl: "IMAGE_7" },
  { id: 7, title: "", description: "我一開始打算搵個藉口等你唔要我", imageUrl: "IMAGE_8" },
  { id: 8, title: "", description: "因為我覺得不幸唔應該牽連到你", imageUrl: "IMAGE_9" },
  { id: 9, title: "", description: "我覺得自己唔係好男人 甚至唔係一個完整的人", imageUrl: "IMAGE_10" },
  { id: 10, title: "", description: "你成日話快d養", imageUrl: "IMAGE_11" },
  { id: 11, title: "", description: "但我好驚自己俾唔到幸福你", imageUrl: "IMAGE_12" },
  { id: 12, title: "", description: "因為我唔好既習慣導致浪費左好多年, 仲成日令b好傷心", imageUrl: "IMAGE_13" },
  { id: 13, title: "", description: "因為我既家庭由頭到尾都冇一家之主", imageUrl: "IMAGE_14" },
  { id: 14, title: "", description: "因為我背景唔知你爸媽會點諗", imageUrl: "IMAGE_15" },
  { id: 15, title: "", description: "但係", imageUrl: "" },
  { id: 16, title: "", description: "無論如何我都好多謝b 9年一直陪住我", imageUrl: "" },
  { id: 17, title: "", description: "度過一次又一次的難關", imageUrl: "" },
  { id: 18, title: "", description: "每一關我都好難過 但你都肯陪住我", imageUrl: "" },
  { id: 19, title: "", description: "我一直都唔明我係唔係咁值得信任", imageUrl: "" },
  { id: 20, title: "", description: "但係我覺得自己好彩生得高同靚仔", imageUrl: "" },
  { id: 21, title: "", description: "仲有守時同做野有交帶仲肯幫你做清潔", imageUrl: "" },
  { id: 22, title: "", description: "我都希望b多d聽我講野 因為我成日有道理你都唔肯聽", imageUrl: "" },
  { id: 23, title: "", description: "今次我都想你聽我講", imageUrl: "" },
  { id: 24, title: "", description: "如果你願意 我會承擔對b下半生的責任", imageUrl: "IMAGE_16" }
];

export default function App() {
  const [state, setState] = useState<AppState>('intro');
  const [currentMemoryIndex, setCurrentMemoryIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const playerRef = useRef<any>(null);

  useEffect(() => {
    // Define the global callback first
    (window as any).onYouTubeIframeAPIReady = () => {
      if (playerRef.current) return;
      console.log("Initializing YouTube Player...");
      playerRef.current = new (window as any).YT.Player('youtube-player', {
        height: '1',
        width: '1',
        videoId: '9E8pcmWavdQ',
        playerVars: {
          autoplay: 1,
          controls: 0,
          showinfo: 0,
          rel: 0,
          enablejsapi: 1,
          origin: window.location.origin,
          widget_referrer: window.location.href
        },
        events: {
          onReady: (event: any) => {
            console.log("YouTube Player Ready");
            event.target.setVolume(100);
            if (!isMuted) {
              event.target.unMute();
            } else {
              event.target.mute();
            }
            event.target.playVideo();
          },
          onStateChange: (event: any) => {
            console.log("YouTube Player State Change:", event.data);
            if (event.data === (window as any).YT.PlayerState.PLAYING) {
              setIsPlaying(true);
            } else {
              setIsPlaying(false);
            }
          },
          onError: (event: any) => {
            console.error("YouTube Player Error:", event.data);
          }
        }
      });
    };

    // Load YouTube API if not already present
    if (!(window as any).YT) {
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    } else if ((window as any).YT.Player) {
      // If API already loaded, call the ready function manually
      (window as any).onYouTubeIframeAPIReady();
    }
  }, []);

  useEffect(() => {
    if (playerRef.current && typeof playerRef.current.mute === 'function') {
      if (isMuted) {
        playerRef.current.mute();
      } else {
        playerRef.current.unMute();
      }
    }
  }, [isMuted]);

  const startApp = () => {
    console.log("Starting App and attempting to play music...");
    if (playerRef.current) {
      try {
        if (typeof playerRef.current.playVideo === 'function') {
          playerRef.current.playVideo();
          if (!isMuted) playerRef.current.unMute();
          playerRef.current.setVolume(100);
        }
      } catch (e) {
        console.error("Error playing video:", e);
      }
    }
    setState('memories');
  };

  const nextMemory = () => {
    if (currentMemoryIndex < MEMORIES.length - 1) {
      setCurrentMemoryIndex(currentMemoryIndex + 1);
    } else {
      setState('proposal');
    }
  };

  const prevMemory = () => {
    if (currentMemoryIndex > 0) {
      setCurrentMemoryIndex(currentMemoryIndex - 1);
    } else {
      setState('intro');
    }
  };

  return (
    <div className="min-h-screen font-sans selection:bg-rose-100 selection:text-rose-900">
      {/* Background Decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-rose-100/30 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-amber-50/40 rounded-full blur-3xl" />
      </div>

      <AnimatePresence mode="wait">
        {state === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="relative z-10 flex flex-col items-center justify-center min-h-screen p-6 text-center"
          >
            {INTRO_IMAGE && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1 }}
                className="mb-8 w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-white shadow-2xl"
              >
                <img src={INTRO_IMAGE} alt="Intro" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </motion.div>
            )}
            
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="mb-4"
            >
              <Heart className="w-12 h-12 text-rose-500 animate-heartbeat fill-rose-500" />
            </motion.div>
            
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-5xl md:text-7xl font-serif mb-12 text-stone-800"
            >
              Bshiへ
            </motion.h1>
            
            <motion.button
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.9 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startApp}
              className="bg-stone-800 text-white px-10 py-4 rounded-full text-lg tracking-widest uppercase flex items-center gap-3 shadow-xl hover:bg-stone-700 transition-colors"
            >
              我有野想同你講 <ChevronRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        )}

        {state === 'memories' && (
          <motion.div
            key="memories"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative z-10 min-h-screen flex flex-col"
          >
            {MEMORIES[currentMemoryIndex].imageUrl ? (
              <div className="flex-1 flex flex-col md:flex-row">
                {/* Image Section */}
                <div className="w-full md:w-1/2 h-[50vh] md:h-screen relative overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={MEMORIES[currentMemoryIndex].imageUrl}
                      src={MEMORIES[currentMemoryIndex].imageUrl}
                      alt={MEMORIES[currentMemoryIndex].title}
                      initial={{ scale: 1.1, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 1.05, opacity: 0 }}
                      transition={{ duration: 0.8 }}
                      className="absolute inset-0 w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </AnimatePresence>
                  <div className="absolute inset-0 bg-black/10" />
                </div>

                {/* Content Section */}
                <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center bg-white/50 backdrop-blur-sm">
                  <motion.div
                    key={currentMemoryIndex}
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <h2 className="text-4xl md:text-6xl font-serif mb-8 text-stone-800 leading-tight">
                      {MEMORIES[currentMemoryIndex].title}
                    </h2>
                    <p className="text-lg md:text-2xl text-stone-600 leading-relaxed mb-12 font-serif">
                      {MEMORIES[currentMemoryIndex].description}
                    </p>
                  </motion.div>

                  <div className="flex items-center justify-end mt-auto pt-8 border-t border-stone-200">
                    <button
                      onClick={nextMemory}
                      className="flex items-center gap-2 text-stone-800 font-medium hover:text-rose-600 transition-colors"
                    >
                      {currentMemoryIndex === MEMORIES.length - 1 ? '最後一頁' : '下一頁'} <ChevronRight className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* Text Only Layout */
              <div className="flex-1 flex flex-col items-center justify-center p-8 md:p-24 bg-white/30 backdrop-blur-sm">
                <motion.div
                  key={currentMemoryIndex}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="max-w-4xl text-center"
                >
                  <p className="text-2xl md:text-4xl text-stone-700 leading-relaxed mb-16 font-serif italic">
                    {MEMORIES[currentMemoryIndex].description}
                  </p>
                </motion.div>

                <div className="w-full max-w-4xl flex items-center justify-end pt-8 border-t border-stone-200/50">
                  <button
                    onClick={nextMemory}
                    className="flex items-center gap-2 text-stone-800 font-medium hover:text-rose-600 transition-colors text-xl"
                  >
                    {currentMemoryIndex === MEMORIES.length - 1 ? '最後一頁' : '下一頁'} <ChevronRight className="w-8 h-8" />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {state === 'proposal' && (
          <motion.div
            key="proposal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative z-10 min-h-screen flex flex-col items-center justify-center p-6 text-center bg-rose-50/30"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", damping: 12 }}
              className="mb-12"
            >
              <div className="relative">
                <Heart className="w-32 h-32 text-rose-500 fill-rose-500 animate-heartbeat" />
                <Sparkles className="absolute -top-4 -right-4 w-12 h-12 text-amber-400 animate-pulse" />
              </div>
            </motion.div>

            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-5xl md:text-8xl font-serif mb-12 text-stone-800 leading-tight"
            >
              你願意嗎?
            </motion.h2>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-6 w-full max-w-md"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setState('celebration')}
                className="flex-1 bg-rose-500 text-white px-8 py-5 rounded-2xl text-2xl font-serif shadow-xl hover:bg-rose-600 transition-colors"
              >
                我願意！
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setState('celebration')}
                className="flex-1 bg-white border-2 border-rose-200 text-rose-500 px-8 py-5 rounded-2xl text-2xl font-serif shadow-lg hover:bg-rose-50 transition-colors"
              >
                當然願意！
              </motion.button>
            </motion.div>
          </motion.div>
        )}

        {state === 'celebration' && (
          <motion.div
            key="celebration"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative z-10 min-h-screen flex flex-col items-center justify-center p-6 text-center bg-rose-100/20"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", damping: 10, stiffness: 100 }}
              className="mb-8"
            >
              <div className="relative inline-block">
                <Heart className="w-48 h-48 text-rose-500 fill-rose-500" />
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <Sparkles className="w-24 h-24 text-white" />
                </motion.div>
              </div>
            </motion.div>

            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-6xl md:text-9xl font-serif mb-8 text-rose-600"
            >
              YES!
            </motion.h1>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-2xl md:text-3xl text-stone-700 font-serif italic"
            >
              「從今天起，我們不再是兩個人，而是一個家。」
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="mt-16 text-stone-400 text-sm tracking-widest uppercase"
            >
              Forever & Always
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Elements */}
      <div className="fixed bottom-8 right-8 z-50 flex flex-col gap-4 items-center">
        <AnimatePresence>
          {isPlaying && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="p-3 bg-rose-500 rounded-full shadow-lg text-white flex items-center justify-center mb-2"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <Music className="w-6 h-6" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg text-stone-600 hover:text-rose-500 transition-colors"
        >
          {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
        </button>
      </div>

      {/* Hidden YouTube Player */}
      <div className="fixed -top-10 -left-10 w-1 h-1 opacity-0 pointer-events-none">
        <div id="youtube-player"></div>
      </div>
    </div>
  );
}
