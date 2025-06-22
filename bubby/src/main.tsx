import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SoulReader from "./SoulReader";
import Game from "./Game";

createRoot(document.getElementById("root")!).render(
  // <StrictMode>
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/soul-reader" element={<SoulReader />} />
      <Route path="/game" element={<Game />} />
    </Routes>
  </BrowserRouter>
  // </StrictMode>
);
