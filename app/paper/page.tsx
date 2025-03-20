"use client";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import { useSearchParams } from "next/navigation";

export default function Home() {
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  const searchParams = useSearchParams();
  const language = searchParams.get("lang") || "en"; // Default to 'en' if not specified

  const basePath =
    process.env.NODE_ENV === "development" ? "" : "/language-learning-client";
  const fileName = language === "es" ? "spanish" : "english";

  const fileUrl = `${basePath}/static/pdfs/${fileName}.pdf`;

  return (
    <main>
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
        <div>
          <Viewer fileUrl={fileUrl} plugins={[defaultLayoutPluginInstance]} />
        </div>
      </Worker>
    </main>
  );
}
