import json 
from bark import SAMPLE_RATE, generate_audio, preload_models

save_path = "../audio"


with open("dialogue.json", "r") as file:
    data = json.load(file)

charMap = "de_speaker_0"
bias = "[MAN]"

for row in data:
    audio_array = generate_audio(f'{bias}{row["text"]}', history_prompt=f'v2/{charMap[row["Character"]]}')
    write_wav(filename+'.wav', SAMPLE_RATE, audio_array)
    os.system(f'ffmpeg -y {starttime} -i {filename}.wav -filter:a "volume=2" {filename}.ogg')
    os.remove(filename+'.wav')