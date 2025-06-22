import asyncio
import io
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from game import Game
from story import *
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from lmnt.api import Speech
import threading


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # <-- frontend dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
game = Game()

@app.get("/")
def root():
    return {"message": "Hello World"}

lock = threading.Lock()
class Payload(BaseModel):
    image_str: str
@app.post("/start_game")
def start_game(payload: Payload):
    acquired = lock.acquire(blocking=False)
    if (not acquired):
        raise HTTPException(status_code=498, detail="BLOCKED!")
    game.start_game(payload.image_str)
    lock.release()
    return {"newStory": game.story, "newSoulRead": game.soul_read}

@app.post("/game_loop")
def game_loop(payload: Payload):
  if game.game_started:
    acquired = lock.acquire(blocking=False)
    if (not acquired):
        raise HTTPException(status_code=498, detail="BLOCKED!")
    game.game_loop(payload.image_str)
    lock.release()
    return game.task_index
  else:
    raise HTTPException(status_code=499, detail="Game not started yet!")

class Payload2(BaseModel):
    text: str
@app.post("/tts")
def tts(payload: Payload2):
    acquired = lock.acquire(blocking=False)
    if (not acquired):
        raise HTTPException(status_code=498, detail="BLOCKED!")
    api_key = os.getenv("LMNT_API_KEY")
    print("lmnt_key", api_key)
    speech = Speech(api_key)
    result = asyncio.run(speech.synthesize(
        text=payload.text,
        voice="leah",
        format="wav",
        speed=0.5
    ))
    
    audio_stream = io.BytesIO(result["audio"])
    lock.release()
    return StreamingResponse(audio_stream, media_type="audio/wav")

@app.get("/soul_read")
def soul_read(payload:Payload):
    story = generate_story(payload.image_str)