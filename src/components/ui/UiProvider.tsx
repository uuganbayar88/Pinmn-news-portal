"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import toastStyles from "./Toast.module.css";
import AudioPlayerBar, { type AudioState } from "@/components/audio/AudioPlayerBar";
import SearchOverlay from "@/components/search/SearchOverlay";

interface UiApi {
  toast: (msg: string) => void;
  playAudio: (title: string, duration: string) => void;
  openSearch: () => void;
}

const UiContext = createContext<UiApi | null>(null);

export function useUi(): UiApi {
  const ctx = useContext(UiContext);
  if (!ctx) throw new Error("useUi must be used inside <UiProvider>");
  return ctx;
}

function parseDur(d: string): number {
  const [m, s] = d.split(":").map(Number);
  return m * 60 + s;
}

export default function UiProvider({ children }: { children: ReactNode }) {
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [audio, setAudio] = useState<AudioState | null>(null);
  const tick = useRef<ReturnType<typeof setInterval> | null>(null);

  const [searchOpen, setSearchOpen] = useState(false);

  const toast = useCallback((msg: string) => {
    setToastMsg(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastMsg(null), 2000);
  }, []);

  const stopTick = () => {
    if (tick.current) clearInterval(tick.current);
    tick.current = null;
  };

  const startTick = useCallback(() => {
    stopTick();
    tick.current = setInterval(() => {
      setAudio((a) => {
        if (!a || !a.playing) return a;
        const cur = a.cur + 1;
        if (cur >= a.dur) {
          stopTick();
          return { ...a, cur: a.dur, playing: false };
        }
        return { ...a, cur };
      });
    }, 1000);
  }, []);

  const playAudio = useCallback(
    (title: string, duration: string) => {
      setAudio({ title, dur: parseDur(duration), cur: 0, playing: true, open: true });
      startTick();
    },
    [startTick],
  );

  const togglePlay = useCallback(() => {
    setAudio((a) => {
      if (!a) return a;
      const cur = a.cur >= a.dur ? 0 : a.cur;
      const playing = !a.playing;
      if (playing) startTick();
      else stopTick();
      return { ...a, cur, playing };
    });
  }, [startTick]);

  const closePlayer = useCallback(() => {
    stopTick();
    setAudio((a) => (a ? { ...a, playing: false, open: false } : a));
  }, []);

  useEffect(() => () => stopTick(), []);

  const openSearch = useCallback(() => setSearchOpen(true), []);

  return (
    <UiContext.Provider value={{ toast, playAudio, openSearch }}>
      {children}
      <AudioPlayerBar state={audio} onToggle={togglePlay} onClose={closePlayer} />
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} onOpen={openSearch} toast={toast} />
      <div role="status" aria-live="polite" className={`${toastStyles.toast} ${toastMsg ? toastStyles.show : ""}`}>{toastMsg}</div>
    </UiContext.Provider>
  );
}
