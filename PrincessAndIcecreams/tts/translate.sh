#!/bin/bash
# numberOfRooms=2

speaker="test_priya"
allowList=( 2 5 6 ) 
# allowList=( 7 )
inFile="assets/$speaker.wav"
outPath="out/"

# for ((numberOfRooms = 5; numberOfRooms<6 ; numberOfRooms++)); do removed
for ((numberOfRooms = 2; numberOfRooms <= 5; numberOfRooms++)); do
# echo $numberOfRooms
  numberOfIcecreams=$((2**numberOfRooms))
  # wrongGuess=$(expr $numberOfIcecreams / $numberOfRooms) removed
# echo $numberOfIcecreams
# echo $wrongGuess

messages=(
# "Once upon a time, an Indian Princess attended the wedding of her older sister."
# "Her father decided that it was time for her to be married as well. But he decided to give her a sporting chance for freedom."
# "I will choose one of $numberOfIcecreams flavors of ice cream. If you can guess the flavor of ice cream, you shall be free for four more years."
# "The princess replied,"
# "How do I know that you won’t change your guess?"
# "Divide the list among $numberOfRooms groups in $numberOfRooms separate rooms and announce to each group separately whether your choice is on their list."
# "Her father replied, 'Ah, my clever daughter, your chances have gone up from 1 in $numberOfIcecreams to about 1 in $wrongGuess since $numberOfIcecreams divided by $numberOfRooms equals $wrongGuess!'"
"The Princess said, 'You make up the lists of guests in the $numberOfRooms separate rooms, and I’ll give each room a color and a list of about half the flavors.'"
# "She added, 'You can lock me in a room, and if you tell me their answers, I’ll guess your flavor!'"
# "Now the Indian Princess was also a logician and so she devises a logical solution to her predicament...."
# "How did she win her freedom for four more years?"
)


# Loop through the array in groups of 3
for ((i = 0; i < ${#messages[@]}; i++)); do
  if [[ " ${allowList[*]} " == *" $i "* ]]; then
    usePath="$outPath$numberOfRooms/"
  else
    usePath=$outPath
  fi

#removed below
  # if [ ! -d $outPath ]; then
  #   mkdir $outPath
  # fi
  # if [ $i==1 ] || [ ! "$outPath" == "$usePath" ]; then
  #   if [ ! -d "$usePath" ]; then
  #       mkdir -p "$usePath"
  #   fi

    file_path="$usePath${speaker}_7.wav"

    # file_path="$usePath${speaker}_$i.wav" removed
    python3 script.py "--text=${messages[$i]}" --speaker_wav=$inFile --file_path=$file_path
    echo $file_path
  # fi
   # python3 script.py "--text=${messages[$i]}" --speaker_wav=assets/queen.wav --file_path=$/${speaker}_$i.wav
  done

done