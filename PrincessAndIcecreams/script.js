const storyText = [
    { text: "Once upon a time, an Indian Princess attended the wedding of her older sister.", emotion: "neutral" }
  ];
  
  const storyTextContainer = document.getElementById("story-text");
  const synth = window.speechSynthesis;
  
  function speakWithEmotion(sentence, emotion) {
    let utterance = new SpeechSynthesisUtterance(sentence);
  
    switch (emotion) {
      case "neutral":
        utterance.pitch = 1;
        utterance.rate = 0.95;
        break;
      case "serious":
        utterance.pitch = 0.8;
        utterance.rate = 0.85;
        break;
      case "father":
        utterance.pitch = 0.9;
        utterance.rate = 0.9;
        break;
      case "curious":
        utterance.pitch = 1.4;  
        utterance.rate = 1.05;
        break;
      case "confident":
        utterance.pitch = 1.2;
        utterance.rate = 1;
        break;
      default:
        utterance.pitch = 1;
        utterance.rate = 1;
    }
  
    utterance.lang = 'en-IN';
    utterance.volume = 1;
    synth.speak(utterance);
    return utterance;
  }
  
  function typeAndNarrateSentenceBySentence(story) {
    let currentSentenceIndex = 0;
    storyTextContainer.innerHTML = "";  
  
    function typeSentence() {
      if (currentSentenceIndex < story.length) {
        const { text, emotion } = story[currentSentenceIndex];
        storyTextContainer.innerHTML += text + " ";
  
        let utterance = speakWithEmotion(text, emotion);
  
        storyTextContainer.scrollTop = storyTextContainer.scrollHeight;
  
        utterance.onend = () => {
          currentSentenceIndex++;
          setTimeout(typeSentence, 1000); 
        };
      } else {
        document.getElementById("nextPageBtn").style.display = 'block';
      }
    }
    typeSentence();
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
  