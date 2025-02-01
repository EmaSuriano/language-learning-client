"use client";

import { useState, useRef } from "react";
import { SpeakerLoudIcon, StopIcon, UpdateIcon } from "@radix-ui/react-icons";
import { Composer } from "@assistant-ui/react";

type TranscriptionResponse = {
  text: string;
};

export default function AudioRecord({
  onComplete,
}: {
  onComplete: (text: string) => void;
}) {
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: "audio/wav" });
        await sendAudioToServer(audioBlob);

        // Stop all tracks of the stream
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to access microphone"
      );
      console.error("Error accessing microphone:", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const sendAudioToServer = async (audioBlob: Blob) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", audioBlob, "recording.wav");

      const response = await fetch(
        "http://localhost:8000/v1/audio/transcriptions",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: TranscriptionResponse = await response.json();
      onComplete(data.text);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to transcribe audio"
      );
      console.error("Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Composer.Send
      disabled={isLoading}
      onClick={isRecording ? stopRecording : startRecording}
      tooltip={isRecording ? "Stop recording" : "Start recording"}
    >
      {isLoading ? (
        <UpdateIcon className="w-6 h-6 text-white animate-spin" />
      ) : isRecording ? (
        <StopIcon className="w-6 h-6 text-white" />
      ) : (
        <SpeakerLoudIcon className="w-6 h-6 text-white" />
      )}
    </Composer.Send>
  );
}
