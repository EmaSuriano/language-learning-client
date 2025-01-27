"use client";

import { useState, useEffect, useRef } from "react";

import { formatAudioTimestamp } from "../lib/AudioUtils";
import { webmFixDuration } from "../lib/BlobFix";

function getMimeType() {
  const types = [
    "audio/webm",
    "audio/mp4",
    "audio/ogg",
    "audio/wav",
    "audio/aac",
  ];
  for (let i = 0; i < types.length; i++) {
    if (MediaRecorder.isTypeSupported(types[i])) {
      return types[i];
    }
  }
  return undefined;
}

export default function AudioRecorder(props: {
  onComplete: (blob: Blob) => void;
  disabled: boolean;
}) {
  const [recording, setRecording] = useState(false);
  const [duration, setDuration] = useState(0);

  const streamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      if (!streamRef.current) {
        streamRef.current = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
      }

      const startTime = Date.now();

      const mimeType = getMimeType();
      const mediaRecorder = new MediaRecorder(streamRef.current, {
        mimeType,
      });

      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.addEventListener("dataavailable", async (event) => {
        if (event.data.size === 0) {
          // Ignore empty data
          return;
        }
        chunksRef.current.push(event.data);
        const duration = Date.now() - startTime;

        // Received a stop event
        let blob = new Blob(chunksRef.current, { type: mimeType });

        if (mediaRecorder.state === "inactive") {
          if (mimeType === "audio/webm") {
            blob = await webmFixDuration(blob, duration, blob.type);
          }
          props.onComplete(blob);

          chunksRef.current = [];
        }
      });
      mediaRecorder.start();
      setRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop(); // set state to inactive
      setDuration(0);
      setRecording(false);
    }
  };

  useEffect(() => {
    if (recording) {
      const timer = setInterval(() => {
        setDuration((prevDuration) => prevDuration + 1);
      }, 1000);

      return () => {
        clearInterval(timer);
      };
    }
  }, [recording]);

  const handleToggleRecording = () => {
    if (recording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <button
      type="button"
      className={`m-2 inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 transition-all duration-200 ${
        recording
          ? "bg-red-500 hover:bg-red-600 disabled:bg-red-300"
          : "bg-green-500 hover:bg-green-600 disabled:bg-green-300"
      }`}
      onClick={handleToggleRecording}
      disabled={props.disabled}
    >
      {recording ? `Stop (${formatAudioTimestamp(duration)})` : "Record"}
    </button>
  );
}
