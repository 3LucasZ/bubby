import { useEffect, useRef, useState } from "react";
import { Button } from "./components/ui/button";
import { Card, CardContent } from "./components/ui/card";
import FloatingHomeButton from "./components/homefab";
import React from "react";

function SoulReader() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [response, setResponse] = useState();
  const [streaming, setStreaming] = useState(false);
  const [captured, setCaptured] = useState(false);

  useEffect(() => {
    // Request access to user's webcam
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setStreaming(true);
        }
      } catch (error) {
        console.error("Error accessing camera:", error);
      }
    };

    startCamera();

    // Cleanup: stop all video tracks when component unmounts
    return () => {
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const getBase64 = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    // Set canvas size to video frame size
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Draw the current video frame onto the canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert canvas to base64 image
    const imageData = canvas.toDataURL("image/png");
    const base64 = imageData.split(",")[1];
    return base64;
  };

  const read = async () => {
    const base64 = getBase64();
    // Send to API
    try {
      setCaptured(true);
      const response = await fetch("http://localhost:8000/soul_read", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image_str: base64 }),
      });
      const result = await response.json();
      console.log("API response:", result);
    } catch (err) {
      console.error("Failed to send image:", err);
    }
  };

  return (
    <div className="">
      <div className="p-4"></div>
      <h1 className="text-3xl font-bold mb-6 text-center">Soul Reader</h1>
      <Card className="w-full max-w-md mx-auto mt-10 shadow-2xl rounded-2xl overflow-hidden p-0 bg-black">
        <div className="relative">
          {!streaming && (
            <div className="absolute inset-0 flex items-center justify-center text-white text-sm">
              Loading camera...
            </div>
          )}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full"
          />
        </div>
      </Card>
      <Card className="w-full max-w-md mx-auto mt-10 shadow-2xl rounded-2xl overflow-hidden p-0 bg-black">
        <div className="relative">
          {!captured && (
            <div className="h-full absolute inset-0 flex items-center justify-center text-white text-sm">
              Waiting for capture...
            </div>
          )}
          <canvas ref={canvasRef} className="w-full h-full" />
        </div>
      </Card>
      <div className="flex w-full pt-8">
        <Button onClick={read} className="mx-auto">
          Capture
        </Button>
      </div>
      <FloatingHomeButton />
    </div>
  );
}

export default SoulReader;
