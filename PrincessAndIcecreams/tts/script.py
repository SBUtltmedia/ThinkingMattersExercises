import torch
from TTS.api import TTS
import json
import os
import argparse, sys
parser=argparse.ArgumentParser()
print(sys.argv)

arglist = [{
    "arg": "text",
    "help": ""
    },
    {
    "arg": "speaker_wav",
    "help": ""
    },
    {
    "arg": "file_path",
    "help": ""
    }
    ]

for arg in arglist:
    dash_arg = f"--{arg['arg']}"
    help_arg = f'"{arg["help"]}"'
    # print(dash_arg)
    # print(help_arg)
    parser.add_argument(dash_arg, type=str, help=help_arg)

args=parser.parse_args()
# print(args)
# print(f"Args: {args}\nCommand Line: {sys.argv}\nfoo: {args.foo}")
# print(f"Dict format: {vars(args)}")

# Get device
device = "cuda" if torch.cuda.is_available() else "cpu"

# # # List available 🐸TTS models
# # print(TTS().list_models())

# # Init TTS


tts = TTS("tts_models/multilingual/multi-dataset/xtts_v2").to(device)
tts.tts_to_file(text=args.text, speaker_wav=args.speaker_wav, language="en", file_path=args.file_path)