"use client";

import Settings from "@/lib/Settings";
import { SpeechSynthesisAdapter } from "@assistant-ui/react";

interface TTSRequest {
  input: string;
  language: string;
  voice: string;
  response_format: "mp3";
  stream: boolean;
  speed: number;
}

interface CacheEntry {
  blob: Blob;
  url: string;
}

export class ApiSpeechSynthesisAdapter implements SpeechSynthesisAdapter {
  private baseUrl: string;
  private cache: Map<string, CacheEntry>;

  constructor(baseUrl: string = process.env["NEXT_PUBLIC_ASSISTANT_URL"]!) {
    this.baseUrl = baseUrl;
    this.cache = new Map();
  }

  private createAudioFromCache(cacheEntry: CacheEntry): HTMLAudioElement {
    const audio = new Audio();
    audio.src = cacheEntry.url;
    return audio;
  }

  speak(text: string): SpeechSynthesisAdapter.Utterance {
    const subscribers = new Set<() => void>();
    let currentAudio = new Audio();

    const handleEnd = (
      reason: "finished" | "error" | "cancelled",
      error?: unknown
    ) => {
      if (res.status.type === "ended") return;

      res.status = { type: "ended", reason, error };
      subscribers.forEach((handler) => handler());
    };

    // Set up audio element event listeners
    const setupAudioElement = (audio: HTMLAudioElement) => {
      audio.addEventListener("ended", () => handleEnd("finished"));
      audio.addEventListener("error", (e) => handleEnd("error", e));
    };

    const res: SpeechSynthesisAdapter.Utterance = {
      status: { type: "running" },
      cancel: () => {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        handleEnd("cancelled");
      },
      subscribe: (callback) => {
        if (res.status.type === "ended") {
          let cancelled = false;
          queueMicrotask(() => {
            if (!cancelled) callback();
          });
          return () => {
            cancelled = true;
          };
        } else {
          subscribers.add(callback);
          return () => {
            subscribers.delete(callback);
          };
        }
      },
    };

    // Handle the audio loading asynchronously
    if (this.cache.has(text)) {
      // Use cached audio
      const cacheEntry = this.cache.get(text)!;
      currentAudio = this.createAudioFromCache(cacheEntry);
      setupAudioElement(currentAudio);
      currentAudio.play().catch((error) => handleEnd("error", error));
    } else {
      // Fetch new audio
      const requestBody: TTSRequest = {
        input: text,
        language: Settings.LANGUAGE,
        voice: "em_santa",
        response_format: "mp3",
        stream: true,
        speed: 1,
      };

      fetch(`${this.baseUrl}/tts/synthesize`, {
        method: "POST",
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json",
          Origin: this.baseUrl,
        },
        body: JSON.stringify(requestBody),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.blob();
        })
        .then((audioBlob) => {
          const audioUrl = URL.createObjectURL(audioBlob);

          // Cache the audio
          this.cache.set(text, { blob: audioBlob, url: audioUrl });

          currentAudio.src = audioUrl;
          setupAudioElement(currentAudio);
          return currentAudio.play();
        })
        .catch((error) => {
          handleEnd("error", error);
        });
    }

    return res;
  }

  // Optional: Method to clear the cache
  clearCache(): void {
    // Revoke all object URLs before clearing
    for (const entry of this.cache.values()) {
      URL.revokeObjectURL(entry.url);
    }
    this.cache.clear();
  }

  // Optional: Method to remove specific entries from cache
  removeFromCache(text: string): void {
    const entry = this.cache.get(text);
    if (entry) {
      URL.revokeObjectURL(entry.url);
      this.cache.delete(text);
    }
  }
}
