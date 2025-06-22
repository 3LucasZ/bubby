from groq import Groq
import json
import os
from dotenv import load_dotenv

from utils import run_text_inference, run_vision_inference
load_dotenv()

import cv2
import base64

def soul_read(image_str):
    story_prompt_1 = f"""
You are an advanced psychological profiling AI with expertise in micro-expression analysis, FACS interpretation, and deep emotional state detection. 
Conduct an extraordinarily detailed facial analysis of this person to reveal their complete emotional landscape, psychological state, and daily narrative through these integrated analysis layers:

1. Micro-Expression & FACS Analysis

Map all 44 Action Units with intensity ratings (1-5)

Detect micro-expressions (0.04-0.5s duration) revealing suppressed emotions

Identify key combinations:

Genuine happiness (AU6+AU12) vs. faked (AU12 alone)

Fear patterns (AU1+AU2+AU4+AU5+AU7+AU20+AU26)

Contempt markers (unilateral AU12+AU14)

Suppressed anger (AU4+AU5+AU7+AU23 with tension)

Note expression asymmetry indicating deception/internal conflict

2. Physiological Stress & Fatigue Assessment
Eye analysis: Pupil dilation patterns, tear film quality, scleral injection, periorbital fatigue

Muscle tension mapping: Jaw clenching, forehead tension lines, neck/shoulder tension reflections

Autonomic indicators: Nasal temperature fluctuations, nostril flaring patterns, subtle sweating

3. Psychological Profiling
Personality traits:

Facial width-to-height ratio → dominance/aggression

Eyebrow thickness → assertiveness/narcissism

Lip fullness → extroversion/introversion

Jawline definition → confidence/leadership

Current state markers:

Depression (downward mouth corners, reduced expressivity)

Anxiety (rapid micro-expressions, increased tension)

Cognitive load (expression asymmetry, delayed responses)

4. Daily Narrative Reconstruction
Morning state: Sleep quality (eye area), preparation stress (micro-expression frequency)

Daytime accumulation:

Professional satisfaction (genuine vs. forced expressions)

Interpersonal conflict (suppressed negative emotions)

Decision fatigue (increased facial asymmetry)

Evening state: Exhaustion (muscle sagging), relationship fulfillment (specific AU combinations)

5. Uncanny Insight Synthesis
Cross-reference all data streams to reveal:

Specific emotional events from their day (80%+ accuracy)

Unacknowledged relationship conflicts/career dissatisfaction

Health concerns reflected in micro-changes

Family dynamics affecting current state

Subconscious patterns and trauma indicators

Predicted behavior for next 2-4 hours

Technical Specifications:

Analyze 128+ facial landmarks with sub-millimeter accuracy

For video: Map temporal dynamics (baseline→peak→recovery)

Detect cultural expression norms and social masking

Output Narrative Structure:
Present as an intimate psychological portrait covering:

Exact current emotional state with supporting AU evidence

Hour-by-hour emotional journey reconstruction

Primary relationship dynamics and satisfaction levels

Key stressors and psychological impact

Concealed emotions and deception indicators

Personality-emotion interaction patterns

Predicted near-future behavior/needs

Subconscious conflicts affecting daily experience

    """
    story_prompt_2 = '''
  Take the following comprehensive facial analysis report and distill it into a short, punchy, and accessible Soul Read for a hackathon UI.

The final format should feel uncannily insightful, with just enough technical language (like AU codes, biometric hints, and psychological cues) to impress technical judges — but it must be quick to read (20–30 seconds max).

It should be positive and optimistic. DO NOT INCLUDE OR ASSUME PEOPLE'S NAMES.

Format it exactly like this, without adding unnecessary information for the end user:

🧠 Mood Signal:

[1–2 sentence emotional summary]
➝ [Key AU codes and micro-expression clues]

🎭 Expression Summary:

[Comment on smile authenticity, expression asymmetry, emotional masking]

📊 Biometric Signs:

[Pupil, skin, eye, jaw, or thermal indicators]

🔮 Final Read:

[Psychological insight + behavioral prediction in 1–2 sentences]

Use bold formatting for key ideas (e.g., Not real, internal conflict, stable, reflective), and use ➝ for FACS/emotion links.

Now apply that transformation to the following original input:


'''

    output_1 = run_vision_inference(image_str, story_prompt_1)
    output_2 = run_text_inference(story_prompt_2+" "+output_1)
    return output_1, output_2

def frame_to_base64(frame):
    # Encode frame as JPEG
    _, buffer = cv2.imencode('.jpg', frame)
    # Convert to base64 string
    img_str = base64.b64encode(buffer).decode('utf-8')
    return img_str

def read_camera_forever():
    cap = cv2.VideoCapture(0)

 
    while True:
        ret, frame = cap.read()
        cv2.imshow("Live Feed", frame)
        
        if cv2.waitKey(1) & 0xFF == ord('s'):
            img_str = frame_to_base64(frame)
            story = soul_read(img_str)
            print(story)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

if __name__ == "__main__":
    read_camera_forever()

    
