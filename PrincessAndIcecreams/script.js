const storyText = [
  { text: "Once upon a time, an Indian Princess attended the wedding of her older sister.", emotion: "neutralMale" },
  { text: "Her father decided that it was time for her to be married as well. But he decided to give her a sporting chance for freedom.", emotion: "serious" },
  { text: "\"I will choose one of 31 flavors of ice cream. If you can guess the flavor of ice cream, you shall be free for four more years.\"", emotion: "father" },
  { text: "The princess replied,", emotion: "neutralFemale" },
  { text: "\"How do I know that you won’t change your guess?", emotion: "curiousFemale" },
  { text: "Divide the list among 5 groups in 5 separate rooms and announce to each group separately whether your choice is on their list.\"", emotion: "neutralFemale" },
  { text: "Her father replied, \"Ah, my clever daughter, your chances have gone up from 1 in 31 to about 1 in 6 since 30 divided by 5 equals 6!\"", emotion: "father" },
  { text: "The Princess said, \"You make up the lists of guests in the five separate rooms, and I’ll give each room a color and a list of about half the flavors.\"", emotion: "neutralFemale" },
  { text: "She added, \"You can lock me in a room, and if you tell me their answers, I’ll guess your flavor!\"", emotion: "neutralFemale" },
  { text: "Now the Indian Princess was also a logician and so she devises a logical solution to her predicament....", emotion: "neutralMale" },
  { text: "How did she win her freedom for four more years?", emotion: "neutralMale" }
];
  

  const storyTextContainer = document.getElementById("story-text");
  const synth = window.speechSynthesis;

  let voices = [];

  function loadVoices() {
    voices = synth.getVoices();
    if (voices.length === 0) {
      setTimeout(loadVoices, 100);
    }
  }
  

  synth.addEventListener('voiceschanged', loadVoices);
  loadVoices();
  

  function speakWithEmotion(sentence, emotion) {
    let utterance = new SpeechSynthesisUtterance(sentence);
  
    switch (emotion) {
      case "neutralFemale":
        utterance.pitch = 1.5;
        utterance.rate = 0.8;
        const neutralFemaleVoice = voices.find(voice => 
          (voice.lang === 'en-IN' || voice.name.includes("India")) && /female/i.test(voice.name)
        );
        utterance.voice = neutralFemaleVoice || voices[0];
        break;
      case "neutralMale":
        utterance.pitch = 1;
        utterance.rate = 0.8;
        break;
      case "serious":
        utterance.pitch = 0.8;
        utterance.rate = 0.8;
        break;
      case "father":
        utterance.pitch = 0.9;
        utterance.rate = 0.8;
        break;
      case "curious":
        utterance.pitch = 1.4;  
        utterance.rate = 0.8;
        break;
      case "curiousFemale":
        utterance.pitch = 1.4;
        utterance.rate = 0.8;
        const indianFemaleVoice = voices.find(voice => 
          (voice.lang === 'en-IN' || voice.name.includes("India")) && /female/i.test(voice.name)
        );
        utterance.voice = indianFemaleVoice || voices[0];
        break;
      case "confident":
        utterance.pitch = 1.2;
        utterance.rate = 0.8;
        break;
      default:
        utterance.pitch = 1;
        utterance.rate = 0.8;
    }
  
    utterance.lang = 'en-IN';
    utterance.volume = 1;
    synth.speak(utterance);
    return utterance;
  } 


  function displaySentence(story, index) {
    const { text, emotion } = story[index];
  
    const paragraph = document.createElement("p");
    paragraph.innerText = text;
    paragraph.classList.add("story-line");
    storyTextContainer.appendChild(paragraph);
  
    if (storyTextContainer.childNodes.length > 2) {
      storyTextContainer.removeChild(storyTextContainer.firstChild);
    }
  
    // speakWithEmotion(text, emotion);
    const utterance = speakWithEmotion(text, emotion);
  utterance.onend = () => {
    gradualScroll(paragraph.offsetHeight, () => {
      if (index + 1 < story.length) {
        displaySentence(story, index + 1);
      } else {
        document.getElementById("nextPageBtn").style.display = 'block';
      }
    });
  };
  }
  

  function typeAndNarrateSentenceBySentence(story) {
  //start with the first sentence
    if (story.length > 0) {
      displaySentence(story, 0); 
    }
  }


  function gradualScroll(scrollAmount, callback) {
    let scrolled = 0;
    const scrollStep = 1;
    const interval = 5;
  
    const scrollInterval = setInterval(() => {
      if (scrolled >= scrollAmount) {
        clearInterval(scrollInterval);
        //call this callback after scrolling is complete
        callback(); 
      } else {
        storyTextContainer.scrollBy(0, scrollStep);
        scrolled += scrollStep;
      }
    }, interval);
  }
  

  function goToNextPage() {
    document.body.style.backgroundImage = 'none';
    window.location.href = "flavors.html";
  }
  

  window.onload = () => {
    alert('Click anywhere on the page to start the story');
  
    document.body.addEventListener('click', () => {
      typeAndNarrateSentenceBySentence(storyText);
    }, { once: true }); 
  };