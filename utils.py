import base64
import os
from PIL import Image
from dotenv import load_dotenv
from groq import Groq
load_dotenv() 

def decode_image(image_str):
    # TODO: Decode base64 image string to open cv frame image
    imgdata = base64.b64decode(image_str)
    pil = Image.open(io.BytesIO(imgdata))
    return cv2.cvtColor(np.array(pil), cv2.COLOR_BGR2RGB)

def encode_image(image_path):
  with open(image_path, "rb") as image_file:
    return base64.b64encode(image_file.read()).decode('utf-8')
  


def run_vision_inference(image_str, text_prompt):
  groq_key = os.environ.get("GROQ_API_KEY")
  print("groq_key", groq_key)
  client = Groq(api_key=groq_key)
  chat_completion = client.chat.completions.create(
      messages=[
          {
              "role": "user",
              "content": [
                  {"type": "text", "text": text_prompt},
                  {
                      "type": "image_url",
                      "image_url": {
                          "url": f"data:image/jpeg;base64,{image_str}",
                      },
                  },
              ],
          }
      ],
      model="meta-llama/llama-4-scout-17b-16e-instruct",
  )

  return chat_completion.choices[0].message.content

def run_text_inference(text_prompt):
    client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "system",
                "content": (
                    "You are a friendly and gentle person who talks to children. "
                    "Always be encouraging, warm, and calm. Avoid complex vocabulary. "
                    "Use short sentences and a nurturing tone."
                ),
            },
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": text_prompt},
                ],
            }
        ],
        model="meta-llama/llama-4-scout-17b-16e-instruct",
    )

    return chat_completion.choices[0].message.content