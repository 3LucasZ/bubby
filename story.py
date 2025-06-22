from groq import Groq
import json
import os
from dotenv import load_dotenv

from utils import run_vision_inference
load_dotenv() 

def generate_story(image_str, agent, theme, emotion):
    story_prompt = story_prompt = f"""YOUR OUTPUT MUST BE JSON FORMAT: Create a short interactive children's game where the child is guided through a story and the child has to complete the tasks physically in the room. The theme of the story is: {theme}. The language should be easy to understand for young children. The main character is a {agent} who guides the child through a fun adventure.
    
    The story should have exactly **3 sequential tasks** the child must physically perform in the room.
    
    THE MOOD OF THE STORY SHOULD GO ALONG WITH THE FOLLOWING EMOTION: {emotion}. If they are feeling negative emotions the goal can be to cheer them up, and if they are feeling positive emotions you maintain that.
    EACH TASK MUST HAVE SOME RELATION AND SIGNIFICANCE TO THE STORY. EACH STEP MUST LOGICALLY FLOW FROM THE PREVIOUS STEP TO GENERATE A COHERENT STORY.

    For the FIRST task, the child should playfully imitate an emotion. For example, if the user is sad, the action can be to be happy to cheer a character up. Acting out the emotion should relate to the story.
    For the SECOND task, The task MUST be to MOVE AN OBJECT CLOSE TO THE CAMERA and should relate to the story. The object that is moved MUST be in the following list [book, pencil, water bottle, snack]
    For the THIRD task, the child should imitate an animal. It should relate to the story.

    Each task should:
    - MUST be easy and reliable to check whether the task is completed by just a single camera frame
    - MUST not already be completed. The criteria MUST NOT be already met (ex. the criteria can't that the sleeping bag is visible in the image if it is already visible)
    - NONE of the tasks involve lighting or lamps or anything related to that 
    - MUST be very simple to perform (eg. move the bag, pretending to be a cat, make a happy face)
    - be simple, safe, and avoid any danger
    - Be described playfully and clearly

    Format it like this:
    - Start with a welcoming title and introduction
    - Present the **first story setup and task**
    - End the story after the third task with a cheerful reward or resolution

    Use a warm, magical tone. Try to keep responses not too long. Generate the entire story with all 3 steps.

    Write exactly 3 steps and a conclusion of an interactive story. Each step MUST:
    - Have a **story** line (1–2 sentences of narrative). The story line should playfully mention what the task is.
    - Include a **task** the child should complete. The task must be relevant to the story.
    - Include a **criteria** field that describes how a computer vision system could confirm the task is complete from a single camera frame.
    - Be formatted as a JSON object with keys `"step"`, `"story"`, `"task"`, and `"criteria"`.
    The **story** line should also include the task.

    **The first step (step 1)** MUST include:
    - THE FIRST THING YOU MUST DO IS DIRECTLY ACKNOWLEDGE the emotion before starting the story. (eg. "I sense you are feeling..."). Try to create a story that supports that emotion.
    - A welcoming title
    - A friendly short introduction to the adventure
    - The first task

    At the end, include a final fourth JSON entry:
    {{ "conclusion": "..." }}
    The conclusion should reward the child for completing the tasks with an ending line that feels cheerful and complete.


    YOU MUST FOLLOW THESE RULES: Return the output as a JSON list with 3 entries, like this:
    [
    {{
        "step": 1,
        "story": "...",
        "task": "..."
        "criteria": "..."
    }},
    ...
    {{
    "conclusion": "..."
    }}
    ]
    
    Respond with **only the JSON above**. Do not add any commentary or formatting outside the JSON. DO NOT include ANY text outside the JSON. YOUR OUTPUT MUST BE JSON FORMAT
    """


    output = run_vision_inference(image_str, story_prompt)

    try:
        data = json.loads(output)
    except json.JSONDecodeError:
        print("Model did not return valid JSON.")

    return data