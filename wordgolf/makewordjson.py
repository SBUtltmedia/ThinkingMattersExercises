import re
import json

with open('word.txt') as x: f = x.readlines()
problems = []
for line in f:
    first_word, second_word = map(lambda x: x.lower(), re.findall(r'[A-Z]{2,99}', line))
    problems.append({"from": first_word, "to": second_word, "title": line.split('\n')[0].strip(), "par": 5})
print(json.dumps(problems))