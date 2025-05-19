document.addEventListener("DOMContentLoaded", () => {
  // document.getElementById("introduction").classList.add("hide");

  document.getElementById("game").classList.add("hide");

  let numberOfRooms = window.gameConfig.numberOfRooms;
  let numberOfIceCreams = window.gameConfig.numberOfIceCreams;

  mirrorVTT();
});

// narrate the story
function generateMediaFiles() {
  const baseAudioPath = "tts/out/";
  const baseCaptionsPath = "story/";
  const numberOfRooms = window.gameConfig.numberOfRooms;
  let mediaFiles = [];

  for (let i = 0; i <= 10; i++) {
    const isRoomDependent = [2, 5, 6, 7].includes(i);
    const roomPath = isRoomDependent ? `${numberOfRooms}/` : "";
    
    mediaFiles.push({
      audio: `${baseAudioPath}${roomPath}priya_${i}.ogg`,
      captionsFile: `${baseCaptionsPath}${roomPath}priya_${i}.vtt`
    });
  }

  return mediaFiles;
}

const mediaFiles = generateMediaFiles();
let currentIndex = 0;


function playSequence() {
  const videoElement = document.getElementById("myAudio");
  const sourceElement = videoElement.querySelector("source");
  const trackElement = videoElement.querySelector("track");

  // document.getElementById("game").classList.add("hide")

  const playNext = () => {
    if (currentIndex < mediaFiles.length) {
      sourceElement.src = mediaFiles[currentIndex].audio;
      trackElement.src = mediaFiles[currentIndex].captionsFile;

      videoElement.load();
      videoElement.play();

      currentIndex++;
    } else {
    }
  };

  videoElement.onended = playNext;

  playNext();
}

function goToNextPage() {

    // Stop the currently playing audio
  const audioElement = document.getElementById("myAudio");
    if (audioElement) {
      audioElement.pause();
      audioElement.currentTime = 0;
  }

  document.body.style.backgroundImage = 'none';
  document.querySelector("#introduction").classList.add("hide");
  document.querySelector("#game").classList.remove("hide");
 // resizeWindow();
}


function mirrorVTT(){
const video = document.querySelector("video");
const tracks = video.textTracks;
for (let i = 0; i < tracks.length; i++) {
  const track = tracks[i];
  if (track.kind === "captions" || track.kind === "subtitles") {
//this is the track we want
    track.mode = "showing"; 

    track.oncuechange = () => {

      const activeCues = track.activeCues;

      if (activeCues.length > 0) {

        const currentText = activeCues[0].text;

        // console.log(currentText);
        document.getElementById("story-text").innerHTML = currentText;

      }

    };

  }

}
}