"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type { Language } from "@/lib/duLieuGiaLap";

export type SpeechLocale = "vi-VN" | "en-US";

type BrowserSpeechRecognitionAlternative = {
  transcript: string;
  confidence: number;
};

type BrowserSpeechRecognitionResult = {
  isFinal: boolean;
  length: number;
  [index: number]: BrowserSpeechRecognitionAlternative;
};

type BrowserSpeechRecognitionResultList = {
  length: number;
  [index: number]: BrowserSpeechRecognitionResult;
};

type BrowserSpeechRecognitionEvent = Event & {
  resultIndex: number;
  results: BrowserSpeechRecognitionResultList;
};

type BrowserSpeechRecognitionErrorEvent = Event & {
  error: string;
  message?: string;
};

type BrowserSpeechRecognition = EventTarget & {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onstart: ((event: Event) => void) | null;
  onend: ((event: Event) => void) | null;
  onerror: ((event: BrowserSpeechRecognitionErrorEvent) => void) | null;
  onresult: ((event: BrowserSpeechRecognitionEvent) => void) | null;
};

declare global {
  interface Window {
    SpeechRecognition?: new () => BrowserSpeechRecognition;
    webkitSpeechRecognition?: new () => BrowserSpeechRecognition;
  }
}

interface UseNhanDangGiongNoiOptions {
  language: Language;
  onFinalText: (text: string) => void;
}

function getDefaultSpeechLocale(language: Language): SpeechLocale {
  return language === "en" ? "en-US" : "vi-VN";
}

function getSpeechErrorMessage(error: string) {
  switch (error) {
    case "not-allowed":
    case "service-not-allowed":
      return "Trình duyệt đang chặn quyền microphone. Hãy cấp quyền mic rồi thử lại.";
    case "no-speech":
      return "Mình chưa nghe thấy giọng nói. Hãy thử nói gần micro hơn.";
    case "audio-capture":
      return "Không tìm thấy microphone trên thiết bị.";
    case "network":
      return "Lỗi mạng khi nhận diện giọng nói. Hãy kiểm tra kết nối.";
    case "language-not-supported":
      return "Ngôn ngữ này chưa được trình duyệt hỗ trợ.";
    default:
      return "Không thể nhận diện giọng nói. Hãy thử lại.";
  }
}

export function useNhanDangGiongNoi({
  language,
  onFinalText,
}: UseNhanDangGiongNoiOptions) {
  const recognitionRef = useRef<BrowserSpeechRecognition | null>(null);
  const finalTranscriptRef = useRef("");

  const [isSupported, setIsSupported] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechLocale, setSpeechLocale] = useState<SpeechLocale>(
    getDefaultSpeechLocale(language),
  );
  const [interimTranscript, setInterimTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const supported =
      typeof window !== "undefined" &&
      Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);

    setIsSupported(supported);
  }, []);

  useEffect(() => {
    setSpeechLocale(getDefaultSpeechLocale(language));
  }, [language]);

  useEffect(() => {
    return () => {
      recognitionRef.current?.abort();
      recognitionRef.current = null;
    };
  }, []);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
  }, []);

  const abortListening = useCallback(() => {
    recognitionRef.current?.abort();
    recognitionRef.current = null;
    finalTranscriptRef.current = "";
    setInterimTranscript("");
    setIsListening(false);
  }, []);

  const startListening = useCallback(() => {
    if (typeof window === "undefined") return;

    const RecognitionConstructor =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!RecognitionConstructor) {
      setError(
        "Trình duyệt này chưa hỗ trợ nhận diện giọng nói. Hãy thử bằng Chrome hoặc Edge.",
      );
      return;
    }

    if (isListening) return;

    setError(null);
    setInterimTranscript("");
    finalTranscriptRef.current = "";

    const recognition = new RecognitionConstructor();

    recognition.lang = speechLocale;
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 3;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onerror = (event) => {
      setError(getSpeechErrorMessage(event.error));
      setIsListening(false);
    };

    recognition.onresult = (event) => {
      let interim = "";
      let final = "";

      for (
        let index = event.resultIndex;
        index < event.results.length;
        index++
      ) {
        const result = event.results[index];
        const transcript = result[0]?.transcript ?? "";

        if (result.isFinal) {
          final += ` ${transcript}`;
        } else {
          interim += ` ${transcript}`;
        }
      }

      if (final.trim()) {
        finalTranscriptRef.current =
          `${finalTranscriptRef.current} ${final}`.trim();
      }

      setInterimTranscript(interim.trim());
    };

    recognition.onend = () => {
      const finalText = finalTranscriptRef.current.trim();

      setIsListening(false);
      setInterimTranscript("");
      recognitionRef.current = null;

      if (finalText) {
        onFinalText(finalText);
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [isListening, onFinalText, speechLocale]);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  const toggleSpeechLocale = useCallback(() => {
    setSpeechLocale((current) => (current === "vi-VN" ? "en-US" : "vi-VN"));
  }, []);

  return {
    isSupported,
    isListening,
    speechLocale,
    interimTranscript,
    error,
    setSpeechLocale,
    toggleSpeechLocale,
    startListening,
    stopListening,
    abortListening,
    toggleListening,
  };
}
