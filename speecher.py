import asyncio
import os
from dotenv import load_dotenv
from lmnt.api import Speech
from pydub import AudioSegment
from pydub.playback import play
load_dotenv() 

async def speak(text):
    api_key = os.getenv("LMNT_API_KEY")
    print("lmnt_key", api_key)
    speech = Speech(api_key)
    result = await speech.synthesize(
        text=text,
        voice="leah",
        format="wav",  # optional: could also be "mp3"
        speed=0.5
    )
    with open("output.wav", "wb") as f:
        f.write(result["audio"])
    print("Audio saved to output.wav")

    audio = AudioSegment.from_wav("output.wav")
    play(audio)