document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("game").classList.add("hide");

  let numberOfRooms = window.gameConfig.numberOfRooms;
  let numberOfIceCreams = window.gameConfig.numberOfIceCreams;

  mirrorVTT();
});


// Define common and variable media files
const mediaFiles = [
    { audio: `tts/out/priya_0.ogg`, captionsFile: `story/priya_0.vtt` },  // Common
    { audio: `tts/out/priya_1.ogg`, captionsFile: `story/priya_1.vtt` },  // Common
    { audio: `tts/out/${window.gameConfig.numberOfRooms}/priya_2.ogg`, captionsFile: `story/${window.gameConfig.numberOfRooms}/priya_2.vtt` }, // Room dependent
    { audio: `tts/out/priya_3.ogg`, captionsFile: `story/priya_3.vtt` },  // Common
    { audio: `tts/out/priya_4.ogg`, captionsFile: `story/priya_4.vtt` },  // Common
    { audio: `tts/out/${window.gameConfig.numberOfRooms}/priya_5.ogg`, captionsFile: `story/${window.gameConfig.numberOfRooms}/priya_5.vtt` }, // Room dependent
    { audio: `tts/out/${window.gameConfig.numberOfRooms}/priya_6.ogg`, captionsFile: `story/${window.gameConfig.numberOfRooms}/priya_6.vtt` }, // Room dependent
    { audio: `tts/out/${window.gameConfig.numberOfRooms}/priya_7.ogg`, captionsFile: `story/${window.gameConfig.numberOfRooms}/priya_7.vtt` },  // Common
    { audio: `tts/out/priya_8.ogg`, captionsFile: `story/priya_8.vtt` },  // Common
    { audio: `tts/out/priya_9.ogg`, captionsFile: `story/priya_9.vtt` },  // Common
    { audio: `tts/out/priya_10.ogg`, captionsFile: `story/priya_10.vtt` } // Common
];
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
  document.body.style.backgroundImage = 'none';
  document.querySelector("#introduction").classList.add("hide");
  document.querySelector("#game").classList.remove("hide");
  resizeWindow();
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

        console.log(currentText);
        document.getElementById("story-text").innerHTML = currentText;

      }

    };

  }

}
}