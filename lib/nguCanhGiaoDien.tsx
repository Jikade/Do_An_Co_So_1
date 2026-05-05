"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import type { SongTheme, Emotion, Language, Song } from "./duLieuGiaLap";
import { mockSongs, translations, layBaiHatTuBackend } from "./duLieuGiaLap";

interface ThemeContextType {
  currentTheme: SongTheme;
  setCurrentTheme: (theme: SongTheme) => void;
  currentEmotion: Emotion;
  setCurrentEmotion: (emotion: Emotion) => void;
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (collapsed: boolean) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof translations.vi) => string;

  songs: Song[];
  isLoadingSongs: boolean;
  songError: string | null;

  nowPlaying: Song | null;
  setNowPlaying: (song: Song | null) => void;
  currentSong: Song | null;
  setCurrentSong: (song: Song | null) => void;

  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  togglePlayPause: () => void;
  playNext: () => void;
  playPrevious: () => void;

  currentTime: number;
  totalDuration: number;
  progress: number;
  setProgress: (value: number) => void;

  volume: number;
  setVolume: (value: number) => void;
  isMuted: boolean;
  setIsMuted: (value: boolean) => void;

  fusionScore: number;
  setFusionScore: (score: number) => void;
  faceConfidence: number;
  voiceConfidence: number;
  textConfidence: number;
  setConfidences: (face: number, voice: number, text: number) => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [currentTheme, setCurrentTheme] = useState<SongTheme>("pink");
  const [currentEmotion, setCurrentEmotion] = useState<Emotion>("happy");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [language, setLanguage] = useState<Language>("vi");

  const [isLoadingSongs, setIsLoadingSongs] = useState(true);
  const [songError, setSongError] = useState<string | null>(null);

  const [isPlaying, setIsPlayingState] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  const [songs, setSongs] = useState<Song[]>([]);

  const [nowPlaying, setNowPlayingState] = useState<Song | null>(null);

  const [totalDuration, setTotalDuration] = useState(0);

  const [progress, setProgressState] = useState(0);
  const [volume, setVolumeState] = useState(80);
  const [isMuted, setIsMutedState] = useState(false);

  const [fusionScore, setFusionScore] = useState(87);
  const [faceConfidence, setFaceConfidence] = useState(92);
  const [voiceConfidence, setVoiceConfidence] = useState(78);
  const [textConfidence, setTextConfidence] = useState(85);

  const t = useCallback(
    (key: keyof typeof translations.vi) => translations[language][key],
    [language],
  );

  const setNowPlaying = useCallback((song: Song | null) => {
    setNowPlayingState(song);

    setCurrentTime(0);
    setProgressState(0);

    if (song) {
      setCurrentTheme(song.theme);
      setCurrentEmotion(song.emotion);
      setTotalDuration(song.duration || 0);
    } else {
      setIsPlayingState(false);
      setTotalDuration(0);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function taiDanhSachBaiHat() {
      try {
        setIsLoadingSongs(true);
        setSongError(null);

        const data = await layBaiHatTuBackend();

        if (cancelled) return;

        setSongs(data);

        setNowPlayingState((current) => {
          if (!current) return null;

          const updatedSong = data.find((song) => song.id === current.id);

          if (!updatedSong) {
            setIsPlayingState(false);
            setCurrentTime(0);
            setProgressState(0);
            setTotalDuration(0);
            return null;
          }

          setCurrentTheme(updatedSong.theme);
          setCurrentEmotion(updatedSong.emotion);
          setTotalDuration(updatedSong.duration || 0);

          return updatedSong;
        });
      } catch (error) {
        if (cancelled) return;

        setSongs(mockSongs);
        setNowPlayingState(null);
        setIsPlayingState(false);
        setCurrentTime(0);
        setProgressState(0);
        setTotalDuration(0);

        setSongError(
          error instanceof Error
            ? error.message
            : "Không tải được bài hát từ backend",
        );
      } finally {
        if (!cancelled) {
          setIsLoadingSongs(false);
        }
      }
    }

    taiDanhSachBaiHat();

    return () => {
      cancelled = true;
    };
  }, []);

  const timViTriBaiHat = useCallback(
    (id?: string | null) => {
      if (!id) return 0;

      const index = songs.findIndex((song) => song.id === id);

      return index >= 0 ? index : 0;
    },
    [songs],
  );

  const setIsPlaying = useCallback((playing: boolean) => {
    setIsPlayingState(playing);
  }, []);

  const togglePlayPause = useCallback(() => {
    setIsPlayingState((current) => !current);
  }, []);

  const playNext = useCallback(() => {
    if (songs.length === 0) return;

    const currentIndex = timViTriBaiHat(nowPlaying?.id);
    const nextIndex = currentIndex >= songs.length - 1 ? 0 : currentIndex + 1;
    const nextSong = songs[nextIndex];

    if (!nextSong) return;

    setNowPlaying(nextSong);
    setIsPlayingState(true);
  }, [songs, nowPlaying?.id, timViTriBaiHat, setNowPlaying]);

  const playPrevious = useCallback(() => {
    if (songs.length === 0) return;

    const currentIndex = timViTriBaiHat(nowPlaying?.id);
    const prevIndex = currentIndex <= 0 ? songs.length - 1 : currentIndex - 1;
    const previousSong = songs[prevIndex];

    if (!previousSong) return;

    setNowPlaying(previousSong);
    setIsPlayingState(true);
  }, [songs, nowPlaying?.id, timViTriBaiHat, setNowPlaying]);

  const setProgress = useCallback(
    (value: number) => {
      const audio = audioRef.current;

      if (!audio) {
        setProgressState(value);
        return;
      }

      const thoiLuong = audio.duration || nowPlaying?.duration || 0;
      if (!thoiLuong) return;

      const thoiGianMoi = (value / 100) * thoiLuong;

      audio.currentTime = thoiGianMoi;
      setCurrentTime(thoiGianMoi);
      setProgressState(value);
    },
    [nowPlaying?.duration],
  );

  const setVolume = useCallback((value: number) => {
    const giaTri = Math.max(0, Math.min(100, value));

    setVolumeState(giaTri);

    if (giaTri > 0) {
      setIsMutedState(false);
    }
  }, []);

  const setIsMuted = useCallback((value: boolean) => {
    setIsMutedState(value);
  }, []);

  const setConfidences = useCallback(
    (face: number, voice: number, text: number) => {
      setFaceConfidence(face);
      setVoiceConfidence(voice);
      setTextConfidence(text);

      const fusion = Math.round(face * 0.4 + voice * 0.35 + text * 0.25);

      setFusionScore(fusion);
    },
    [],
  );

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) return;

    if (!nowPlaying) {
      audio.pause();
      audio.removeAttribute("src");
      audio.load();

      setCurrentTime(0);
      setTotalDuration(0);
      setProgressState(0);

      return;
    }

    audio.src = nowPlaying.audioUrl;
    audio.load();

    setCurrentTheme(nowPlaying.theme);
    setCurrentEmotion(nowPlaying.emotion);
    setTotalDuration(nowPlaying.duration || 0);
    setCurrentTime(0);
    setProgressState(0);
  }, [nowPlaying]);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) return;

    if (isMuted) {
      audio.muted = true;
      return;
    }

    audio.muted = false;
    audio.volume = volume / 100;
  }, [volume, isMuted]);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) return;

    if (isPlaying) {
      audio.play().catch(() => {
        setIsPlayingState(false);
      });
    } else {
      audio.pause();
    }
  }, [isPlaying, nowPlaying?.id]);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) return;

    const capNhatThoiGian = () => {
      const thoiLuong = audio.duration || nowPlaying?.duration || 0;
      const hienTai = audio.currentTime || 0;

      setCurrentTime(hienTai);
      setTotalDuration(thoiLuong || 0);
      setProgressState(thoiLuong > 0 ? (hienTai / thoiLuong) * 100 : 0);
    };

    const khiTaiXong = () => {
      setTotalDuration(audio.duration || nowPlaying?.duration || 0);
    };

    const khiKetThuc = () => {
      playNext();
    };

    audio.addEventListener("timeupdate", capNhatThoiGian);
    audio.addEventListener("loadedmetadata", khiTaiXong);
    audio.addEventListener("ended", khiKetThuc);

    return () => {
      audio.removeEventListener("timeupdate", capNhatThoiGian);
      audio.removeEventListener("loadedmetadata", khiTaiXong);
      audio.removeEventListener("ended", khiKetThuc);
    };
  }, [nowPlaying?.id, nowPlaying?.duration, playNext]);

  const giaTri = useMemo<ThemeContextType>(
    () => ({
      currentTheme,
      setCurrentTheme,
      currentEmotion,
      setCurrentEmotion,
      isSidebarCollapsed,
      setIsSidebarCollapsed,
      language,
      setLanguage,
      t,

      songs,
      isLoadingSongs,
      songError,

      nowPlaying,
      setNowPlaying,
      currentSong: nowPlaying,
      setCurrentSong: setNowPlaying,

      isPlaying,
      setIsPlaying,
      togglePlayPause,
      playNext,
      playPrevious,

      currentTime,
      totalDuration,
      progress,
      setProgress,

      volume,
      setVolume,
      isMuted,
      setIsMuted,

      fusionScore,
      setFusionScore,
      faceConfidence,
      voiceConfidence,
      textConfidence,
      setConfidences,
    }),
    [
      currentTheme,
      currentEmotion,
      isSidebarCollapsed,
      language,
      t,

      songs,
      isLoadingSongs,
      songError,

      nowPlaying,
      setNowPlaying,

      isPlaying,
      setIsPlaying,
      togglePlayPause,
      playNext,
      playPrevious,

      currentTime,
      totalDuration,
      progress,
      setProgress,

      volume,
      setVolume,
      isMuted,
      setIsMuted,

      fusionScore,
      faceConfidence,
      voiceConfidence,
      textConfidence,
      setConfidences,
    ],
  );

  return (
    <ThemeContext.Provider value={giaTri}>
      <div
        data-song-theme={currentTheme}
        data-emotion={currentEmotion}
        className="theme-transition min-h-screen"
      >
        {children}
        <audio ref={audioRef} preload="metadata" />
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
}
