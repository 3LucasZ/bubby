from soulread import soul_read
from story import *
from speecher import speak
from utils import run_text_inference, run_vision_inference

class Game:
    def __init__(self):
        self.story_image_str = None
        self.game_started = False
        self.emotion = None
        self.story = None
        self.task_index = 0

    def start_game(self, image_str):
        self.story_image_str = image_str
        self.game_started = True
        self.task_index = 0
    
        agent = 'teddy bear named Bubby'
        theme = 'dragon'
        self.soul_read_long, self.soul_read_short  = soul_read(self.story_image_str)
        self.emotion = run_text_inference(f"YOU MUST ONLY OUTPUT 1 WORD WITH NO PUNCUATION. Output a 1 word descriptive emotion summarizing the following: {self.soul_read_short}")
        self.story = generate_story(self.story_image_str, agent=agent, theme=theme, emotion=self.emotion)
        print(self.story)
        # await speak(self.story[0]['story'] + ". " + self.story[0]['task'])
        # return self.story

    def game_loop(self, image_str):
        criteria = self.story[self.task_index]['criteria']
        output = run_vision_inference( # check if task is done
            image_str=image_str,
            text_prompt=f'You MUST answer with only "yes" or "no" and no punctuation. Is the the following criteria met based on the image: {criteria}'
        )      
    
        if output == 'yes':
            self.task_index += 1
            if self.task_index == 3: # done with all tasks
                print("Game finished!")
                # speak(self.story[3]['conclusion'])
            # speak(self.story[self.task_index]['story']) # say the next thing
