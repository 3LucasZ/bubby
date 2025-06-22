import { useEffect, useRef, useState } from "react";
import { Button } from "./components/ui/button";
import video from "@/assets/bear.mp4";
import music from "@/assets/music.mp3";
import React from "react";
import FloatingHomeButton from "./components/homefab";
import { start } from "repl";
import TodoList from "./components/game/todo";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./components/ui/accordion";
import { text } from "stream/consumers";
import ReactMarkdown from "react-markdown";

function Game() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ttsAbortController = useRef<AbortController | null>(null);
  const [words, setWords] = useState("");
  const [story, setStory] = useState([]);
  const [index, setIndex] = useState(0);
  const [soulReadShort, setSoulReadShort] = useState("No soul read yet...");
  const [soulReadLong, setSoulReadLong] = useState("No soul read yet...");

  useEffect(() => {
    const initText = "Hello there! I'm Bubby the bear! Tap me to get started.";
    setWords(initText);
    handleSynthesize(initText);
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
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
  const startGame = async () => {
    const base64 = getBase64();

    // Send to API
    const response = await fetch("http://localhost:8000/start_game", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ image_str: base64 }),
    });
    const { newStory, newSoulReadShort, newSoulReadLong } =
      await response.json();
    setSoulReadShort(newSoulReadShort);
    setSoulReadLong(newSoulReadLong);
    console.log("API response:", newStory);
    setStory(newStory);
    setWords(newStory[0]["story"]);
    handleSynthesize(newStory[0]["story"] + ". " + newStory[0]["task"]);

    // send an image to backend
    let prevIndex = 0;
    const interval = setInterval(() => {
      const base64 = getBase64();
      fetch("http://localhost:8000/game_loop", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image_str: base64 }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (Number.isInteger(data)) {
            const newIndex = parseInt(data);
            console.log("Received:", newIndex);
            if (newIndex == 3) {
              setWords(newStory[newIndex]["conclusion"]);
              handleSynthesize(newStory[newIndex]["conclusion"]);
              clearInterval(interval);
            } else if (newIndex > prevIndex) {
              setWords(newStory[newIndex]["story"]);
              handleSynthesize(
                newStory[newIndex]["story"] + ". " + newStory[newIndex]["task"]
              );
              prevIndex = newIndex;
            }
            setIndex(newIndex);
          }
        });
    }, 1000);
  };

  const handleSynthesize = async (text: string) => {
    // Abort any previous request
    if (ttsAbortController.current) {
      ttsAbortController.current.abort();
    }
    // Stop previous audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    // Create new AbortController
    const controller = new AbortController();
    ttsAbortController.current = controller;
    // TTS
    const response = await fetch("http://localhost:8000/tts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    audioRef.current = audio;
    audio.play();
    audio.onended = () => {
      if (ttsAbortController.current === controller) {
        ttsAbortController.current = null;
      }
    };
  };

  const dbg = true;
  return (
    <div className="px-2">
      <h1 className="text-4xl font-bold text-center text-amber-900 py-4">
        Bubby the Bear 🐾
      </h1>
      <div className="flex flex-row gap-4">
        <div className="w-1/2">
          <div className="flex flex-col items-center">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-3/4"
              onClick={startGame}
            >
              <source src={video} type="video/mp4" />
            </video>

            <AnimatedSpeechBubble text={words} />
            <div className="p-4" />
            <TodoList
              items={story.slice(0, 3).map((event) => event["task"])}
              index={index}
            />
          </div>
        </div>
        <div className="w-1/2">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className={
              (dbg ? "w-3/4" : "hidden") + " rounded-lg overflow-hidden"
            }
          />
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-lg">
                🔮 Soul Read
              </AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 text-balance text-lg">
                <ReactMarkdown>{soulReadShort}</ReactMarkdown>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger className="text-lg">
                      More Details
                    </AccordionTrigger>
                    <AccordionContent className="flex flex-col gap-4 text-balance text-lg">
                      <ReactMarkdown>{soulReadLong}</ReactMarkdown>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>

      <canvas ref={canvasRef} className={dbg ? "hidden" : "hidden"} />
      <FloatingHomeButton />
      {/* <audio autoPlay loop>
        <source src={music} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio> */}
    </div>
  );
}

export default Game;

const AnimatedSpeechBubble = ({ text }: { text: string }) => {
  const typingSpeed = 50;
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let index = 0;
    let timeout;

    const typeCharacter = () => {
      if (index < text.length) {
        const nextChar = text[index];
        setDisplayedText((prev) => prev + nextChar);
        index++;
        timeout = setTimeout(typeCharacter, typingSpeed);
      }
    };

    setDisplayedText(""); // Reset before typing
    typeCharacter();

    return () => clearTimeout(timeout); // Clean up on unmount
  }, [text]);

  return (
    <div className="max-w-128 bg-white border border-gray-300 rounded-2xl p-4 text-gray-900">
      {displayedText}
    </div>
  );
};
